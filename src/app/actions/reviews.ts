'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(data: {
  bookingId: string
  revieweeId: string
  rating: number
  comment?: string
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // Verify booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, status, listing_id, provider_id, requester_id')
    .eq('id', data.bookingId)
    .single()

  if (bookingError || !booking) throw new Error('Booking not found')
  if (booking.status !== 'completed') throw new Error('Can only review completed bookings')

  // Verify user is part of the booking
  if (booking.provider_id !== user.id && booking.requester_id !== user.id) {
    throw new Error('Unauthorized to review this booking')
  }

  // Insert review
  const { error: insertError } = await supabase
    .from('reviews')
    .insert({
      booking_id: booking.id,
      reviewer_id: user.id,
      reviewee_id: data.revieweeId,
      rating: data.rating,
      comment: data.comment,
      tags: data.tags || []
    })

  if (insertError) {
    if (insertError.code === '23505') { // Unique violation
      throw new Error('You have already reviewed this booking')
    }
    throw new Error('Failed to submit review')
  }

  // Calculate new average rating for the user
  const { data: userReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', data.revieweeId)

  if (userReviews && userReviews.length > 0) {
    const avgRating = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length
    
    // Calculate completed gigs for the user
    const { count: completedGigs } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .eq('provider_id', data.revieweeId)

    // Update profile
    await supabase
      .from('profiles')
      .update({ 
        avg_rating: Number(avgRating.toFixed(2)),
        completed_gigs: completedGigs || 0
      })
      .eq('id', data.revieweeId)
  }

  // If this was a review for the provider, update the listing's average rating
  if (data.revieweeId === booking.provider_id && booking.listing_id) {
    const { data: listingReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', data.revieweeId)
      // Note: Ideally we'd join with bookings to filter by listing_id
      // but a simpler approximation for the hackathon is fine, or we can do the join:
    
    // Proper listing rating calculation
    const { data: listingBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('listing_id', booking.listing_id)
      
    if (listingBookings && listingBookings.length > 0) {
      const bookingIds = listingBookings.map(b => b.id)
      const { data: specificReviews } = await supabase
        .from('reviews')
        .select('rating')
        .in('booking_id', bookingIds)
        .eq('reviewee_id', data.revieweeId)
        
      if (specificReviews && specificReviews.length > 0) {
        const listingAvg = specificReviews.reduce((acc, r) => acc + r.rating, 0) / specificReviews.length
        await supabase
          .from('listings')
          .update({ avg_rating: Number(listingAvg.toFixed(2)) })
          .eq('id', booking.listing_id)
      }
    }
  }

  revalidatePath('/dashboard/bookings')
  revalidatePath(`/profile/${data.revieweeId}`)
  if (booking.listing_id) {
    revalidatePath(`/listing/${booking.listing_id}`)
  }
}
