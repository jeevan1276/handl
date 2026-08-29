import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { GlassCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import { RatingStars } from '@/components/shared/rating-stars'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default async function ListingPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, provider:profiles(*)')
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/50 bg-black">
            {listing.image_urls && listing.image_urls.length > 0 ? (
              <Image src={listing.image_urls[0]} alt={listing.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">No Image Provided</div>
            )}
            <div className="absolute top-4 left-4">
              <CategoryBadge category={listing.category} className="bg-background/80 backdrop-blur-md" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
              <div className="flex items-center gap-1">
                <RatingStars rating={listing.avg_rating} max={1} />
                <span>{listing.avg_rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{listing.booking_count} bookings</span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none text-foreground/90">
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassCard className="sticky top-24 space-y-6 border-white/10 bg-white/[0.02]">
            <div className="text-center pb-4 border-b border-border/50">
              <div className="text-3xl font-bold text-foreground">${listing.price}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{listing.pricing_type}</div>
            </div>
            
            <Link href={`/profile/${listing.provider_id}`}>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <UserAvatar url={listing.provider.avatar_url} name={listing.provider.name} className="h-12 w-12" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{listing.provider.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{listing.provider.bio || "Campus Provider"}</div>
                </div>
              </div>
            </Link>

            <div className="space-y-3 pt-2">
              <TrustBadge tier={listing.provider.verification_tier} className="w-full justify-center py-1.5" />
            </div>

            <Button size="lg" className="w-full font-semibold text-base h-12">
              Book Now
            </Button>
            <p className="text-xs text-center text-muted-foreground">You won&apos;t be charged yet</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
