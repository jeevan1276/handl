import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/shared/glass-card'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ReviewListProps {
  userId?: string
  listingId?: string
}

export async function ReviewList({ userId, listingId }: ReviewListProps) {
  const supabase = await createClient()

  let query = supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      tags,
      created_at,
      reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('reviewee_id', userId)
  }
  
  if (listingId) {
    // If we only have listingId, we need to join bookings
    // For hackathon simplicity, we might fetch bookings then filter,
    // or rely on a DB function. Given our current schema:
    const { data: bookings } = await supabase.from('bookings').select('id').eq('listing_id', listingId)
    const bookingIds = bookings?.map(b => b.id) || []
    if (bookingIds.length > 0) {
      query = query.in('booking_id', bookingIds)
    } else {
      // Return empty early
      return <div className="text-muted-foreground italic">No reviews yet.</div>
    }
  }

  const { data: reviews, error } = await query

  if (error) {
    console.error('Error fetching reviews:', error)
    return <div className="text-red-500">Failed to load reviews.</div>
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-muted-foreground italic">No reviews yet.</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {reviews.map((review: any) => (
        <GlassCard key={review.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <UserAvatar url={review.reviewer?.avatar_url} name={review.reviewer?.name} size="sm" />
              <div>
                <p className="font-semibold text-sm">{review.reviewer?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span className="font-medium text-sm text-foreground">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          {review.comment && (
            <p className="text-sm mt-2">{review.comment}</p>
          )}
          {review.tags && review.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  )
}
