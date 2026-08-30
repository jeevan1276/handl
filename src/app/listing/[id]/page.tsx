import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ReviewList } from '@/components/reviews/review-list'
import { CraftCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import { RatingStars } from '@/components/shared/rating-stars'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { BookingButton } from './booking-button'
import { MapPin, Clock, Shield, Star, CheckCircle } from 'lucide-react'

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

  const formatCategory = (cat: string) => {
    return cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            {listing.image_urls && listing.image_urls.length > 0 ? (
              <Image 
                src={listing.image_urls[0]} 
                alt={listing.title} 
                fill 
                className="object-cover aspect-video"
                priority
              />
            ) : (
              <div className="aspect-video w-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image Provided
              </div>
            )}
            <div className="absolute top-4 left-4">
              <CategoryBadge category={listing.category} size="md" variant="filled" />
            </div>
            {listing.image_urls && listing.image_urls.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {listing.image_urls.slice(0, 4).map((url: string, i: number) => (
                  <button
                    key={i}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === 0 ? 'border-primary' : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <Image src={url} alt={`${listing.title} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
                {listing.image_urls.length > 4 && (
                  <button className="w-12 h-12 rounded-lg border-2 border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center text-sm font-medium text-muted-foreground">
                    +{listing.image_urls.length - 4}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{listing.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <RatingStars rating={listing.avg_rating} size="sm" showScore />
                  </span>
                  <span>•</span>
                  <span>{listing.booking_count} bookings</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.campus || 'Campus'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrustBadge 
                  tier={listing.provider.verification_tier} 
                  completedGigs={listing.provider.completed_gigs} 
                  avgRating={listing.provider.avg_rating} 
                  size="md"
                />
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none text-foreground/90">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{listing.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/50 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="font-semibold text-foreground">${listing.price} <span className="font-normal text-muted-foreground">/{listing.pricing_type}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{listing.campus || 'On Campus'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold text-foreground">{formatCategory(listing.category)}</p>
                </div>
              </div>
            </div>

            {/* Provider Section */}
            <div className="border-t border-border/50 pt-8">
              <h2 className="text-2xl font-bold mb-6">Provider</h2>
              <Link href={`/profile/${listing.provider_id}`} className="block">
                <CraftCard variant="default" interactive className="p-4 flex items-center gap-4" padding="none">
                  <UserAvatar url={listing.provider.avatar_url} name={listing.provider.name} size="xl" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-foreground truncate">{listing.provider.name}</h3>
                      <TrustBadge 
                        tier={listing.provider.verification_tier} 
                        completedGigs={listing.provider.completed_gigs} 
                        avgRating={listing.provider.avg_rating} 
                        size="sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RatingStars rating={listing.provider.avg_rating} size="sm" showScore />
                      </span>
                      <span>•</span>
                      <span>{listing.provider.completed_gigs || 0} completed gigs</span>
                      <span>•</span>
                      <span>Member since {new Date(listing.provider.created_at).getFullYear()}</span>
                    </div>
                    {listing.provider.bio && (
                      <p className="text-muted-foreground mt-3 line-clamp-2">{listing.provider.bio}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">View Profile</Button>
                  </div>
                </CraftCard>
              </Link>
            </div>

            {/* Reviews */}
            <div className="border-t border-border/50 pt-8">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <ReviewList listingId={listing.id} />
            </div>
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="space-y-6">
          <CraftCard variant="elevated" className="sticky top-24 space-y-0 overflow-hidden" padding="none">
            {/* Price Header */}
            <div className="p-6 border-b border-border/50 text-center bg-muted/30">
              <div className="text-4xl font-bold text-foreground">${listing.price}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{listing.pricing_type}</div>
              <p className="text-xs text-muted-foreground mt-2">You won&apos;t be charged until the provider confirms</p>
            </div>

            {/* Booking Button */}
            <div className="p-6">
              <BookingButton listingId={listing.id} />
            </div>

            {/* What's Included */}
            <div className="border-t border-border/50 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                What's Included
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  Secure payment held in escrow
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  Direct messaging with provider
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  Verified student provider
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  24/7 support for issues
                </li>
              </ul>
            </div>

            {/* Provider Quick Info */}
            <div className="border-t border-border/50 p-6">
              <Link href={`/profile/${listing.provider_id}`} className="block">
                <div className="flex items-center gap-3">
                  <UserAvatar url={listing.provider.avatar_url} name={listing.provider.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{listing.provider.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{listing.provider.bio || "Campus Provider"}</p>
                  </div>
                </div>
              </Link>
              <div className="mt-4 pt-4 border-t border-border/50">
                <TrustBadge 
                  tier={listing.provider.verification_tier} 
                  completedGigs={listing.provider.completed_gigs} 
                  avgRating={listing.provider.avg_rating} 
                  className="w-full justify-center"
                />
              </div>
            </div>
          </CraftCard>
        </div>
      </div>
    </div>
  )
}
