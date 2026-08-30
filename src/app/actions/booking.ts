'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function createBookingSession(listingId: string) {
  const supabase = await createClient()

  // 1. Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to book a service.')
  }

  // 2. Fetch the listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, title, price, provider_id')
    .eq('id', listingId)
    .single()

  if (listingError || !listing) {
    throw new Error('Listing not found.')
  }

  // 3. Create a pending booking in the database
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      listing_id: listing.id,
      provider_id: listing.provider_id,
      requester_id: user.id,
      agreed_price: listing.price,
      status: 'pending',
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    throw new Error('Failed to create booking record.')
  }

  // 4. Create a Stripe Checkout Session
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: listing.title,
            description: `Booking for ${listing.title} on handl`,
          },
          unit_amount: Math.round(listing.price * 100), // Stripe expects amounts in paise for INR
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/listing/${listing.id}`,
    metadata: {
      booking_id: booking.id,
    },
  })

  if (!session.url) {
    throw new Error('Failed to create Stripe Checkout session.')
  }

  // 5. Redirect the user to Stripe Checkout
  redirect(session.url)
}
