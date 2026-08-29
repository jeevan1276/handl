import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ReviewList } from '@/components/reviews/review-list'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import { RatingStars } from '@/components/shared/rating-stars'
import { GlassCard } from '@/components/shared/glass-card'
import { MapPin, GraduationCap, Briefcase } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <UserAvatar 
            url={profile.avatar_url} 
            name={profile.name} 
            className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl"
          />
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
                {profile.campus && (
                  <span className="flex items-center gap-1 text-sm"><MapPin className="h-4 w-4"/> {profile.campus}</span>
                )}
                {profile.major && (
                  <span className="flex items-center gap-1 text-sm"><Briefcase className="h-4 w-4"/> {profile.major}</span>
                )}
                {profile.class_year && (
                  <span className="flex items-center gap-1 text-sm"><GraduationCap className="h-4 w-4"/> Class of {profile.class_year}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <TrustBadge tier={profile.verification_tier} completedGigs={profile.completed_gigs} avgRating={profile.avg_rating} />
              <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-muted/10">
                <RatingStars rating={profile.avg_rating} max={1} />
                <span>{profile.avg_rating?.toFixed(1) || "0.0"} ({profile.completed_gigs} gigs)</span>
              </div>
            </div>
            
            {profile.bio && (
              <p className="text-foreground/80 leading-relaxed max-w-2xl">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Skills & Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 border-border/50">Skills & Expertise</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No skills listed yet.</p>
            )}
          </GlassCard>

          <GlassCard className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 border-border/50">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Trust Score</span>
                <span className="font-medium text-success">{profile.trust_score}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Hourly Rate</span>
                <span className="font-medium">${profile.hourly_rate || 0}/hr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Joined</span>
                <span className="font-medium text-sm">
                  {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold border-b pb-4 border-border/50">Reviews</h2>
          <ReviewList userId={profile.id} />
        </div>
      </div>
    </div>
  )
}
