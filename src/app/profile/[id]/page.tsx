import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ReviewList } from '@/components/reviews/review-list'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import { RatingStars } from '@/components/shared/rating-stars'
import { CraftCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, GraduationCap, Briefcase, Star, Award, Shield, CheckCircle, Calendar } from 'lucide-react'

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Fetch listings by this provider
  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, category, price, pricing_type, avg_rating, booking_count, image_urls')
    .eq('provider_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent rounded-3xl" />
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <UserAvatar 
              url={profile.avatar_url} 
              name={profile.name} 
              size="2xl"
              className="border-4 border-background shadow-xl shrink-0"
            />
            
            <div className="flex-1 space-y-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-muted-foreground">
                    {profile.campus && (
                      <span className="flex items-center gap-1.5 text-sm"><MapPin className="h-4 w-4"/> {profile.campus}</span>
                    )}
                    {profile.major && (
                      <span className="flex items-center gap-1.5 text-sm"><Briefcase className="h-4 w-4"/> {profile.major}</span>
                    )}
                    {profile.class_year && (
                      <span className="flex items-center gap-1.5 text-sm"><GraduationCap className="h-4 w-4"/> Class of {profile.class_year}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <TrustBadge 
                    tier={profile.verification_tier} 
                    completedGigs={profile.completed_gigs} 
                    avgRating={profile.avg_rating} 
                    size="lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={profile.avg_rating} size="md" showScore />
                  <span className="text-sm text-muted-foreground">({profile.completed_gigs || 0} gigs completed)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-foreground/80 leading-relaxed max-w-2xl text-lg">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CraftCard variant="default" className="p-6 flex items-center gap-4" padding="none">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold text-foreground">{profile.avg_rating?.toFixed(1) || "0.0"}</p>
            </div>
          </CraftCard>
          <CraftCard variant="default" className="p-6 flex items-center gap-4" padding="none">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Gigs</p>
              <p className="text-2xl font-bold text-foreground">{profile.completed_gigs || 0}</p>
            </div>
          </CraftCard>
          <CraftCard variant="default" className="p-6 flex items-center gap-4" padding="none">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trust Score</p>
              <p className="text-2xl font-bold text-foreground">{profile.trust_score || 0}%</p>
            </div>
          </CraftCard>
          <CraftCard variant="default" className="p-6 flex items-center gap-4" padding="none">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
              <p className="text-2xl font-bold text-foreground">{listings?.length || 0}</p>
            </div>
          </CraftCard>
        </div>

        {/* Skills & Expertise */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Skills & Expertise</h2>
          <CraftCard variant="default" className="p-6" padding="none">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No skills listed yet.</p>
              </div>
            )}
          </CraftCard>
        </div>

        {/* Active Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Listings</h2>
            {listings && listings.length > 0 && (
              <a href={`/browse?provider=${id}`} className="text-sm text-primary hover:underline">View all</a>
            )}
          </div>
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing: any) => (
                <Link key={listing.id} href={`/listing/${listing.id}`} className="block">
                  <CraftCard variant="default" interactive className="p-0 overflow-hidden" padding="none">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {listing.image_urls && listing.image_urls[0] ? (
                        <Image src={listing.image_urls[0]} alt={listing.title} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <CategoryBadge category={listing.category} size="sm" variant="filled" />
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RatingStars rating={listing.avg_rating} size="sm" showScore />
                          <span className="text-xs text-muted-foreground">({listing.booking_count} bookings)</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">${listing.price}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{listing.pricing_type}</p>
                        </div>
                      </div>
                    </div>
                  </CraftCard>
                </Link>
              ))}
            </div>
          ) : (
            <CraftCard variant="outlined" className="p-12 text-center" padding="none">
              <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active listings</h3>
              <p className="text-muted-foreground">This provider hasn't created any listings yet.</p>
            </CraftCard>
          )}
        </div>

        {/* Reviews Section */}
        <div className="space-y-6 pt-4 border-t border-border/50">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <ReviewList userId={profile.id} />
        </div>
      </div>
    </div>
  )
}
