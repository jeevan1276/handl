import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/shared/glass-card'
import { ProviderBookingActions, RequesterBookingActions } from './booking-actions'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/shared/user-avatar'

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
    case 'confirmed': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Confirmed</Badge>
    case 'completed': return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Action Required</Badge>
    default: return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{status}</Badge>
  }
}

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch bookings where user is either provider or requester
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      listing:listings(title),
      task_request:task_requests(title),
      provider:profiles!bookings_provider_id_fkey(name, avatar_url),
      requester:profiles!bookings_requester_id_fkey(name, avatar_url)
    `)
    .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
  }

  const asProvider = bookings?.filter(b => b.provider_id === user.id) || []
  const asRequester = bookings?.filter(b => b.requester_id === user.id) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your services and incoming requests.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Incoming Requests (You are providing)</h2>
        {asProvider.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No incoming bookings yet.
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {asProvider.map(booking => (
              <GlassCard key={booking.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{booking.listing?.title || booking.task_request?.title || 'Custom Service'}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Requested by</span>
                    <UserAvatar name={booking.requester?.name} url={booking.requester?.avatar_url} className="w-5 h-5" />
                    <span>{booking.requester?.name}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">${booking.agreed_price}</span>
                  </div>
                </div>
                <div>
                  <ProviderBookingActions bookingId={booking.id} status={booking.status} otherPartyId={booking.requester_id} />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">My Services (You booked)</h2>
        {asRequester.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            You haven&apos;t booked any services yet.
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {asRequester.map(booking => (
              <GlassCard key={booking.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{booking.listing?.title || booking.task_request?.title || 'Custom Service'}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Provided by</span>
                    <UserAvatar name={booking.provider?.name} url={booking.provider?.avatar_url} className="w-5 h-5" />
                    <span>{booking.provider?.name}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">${booking.agreed_price}</span>
                  </div>
                </div>
                <div>
                  <RequesterBookingActions bookingId={booking.id} status={booking.status} otherPartyId={booking.provider_id} />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
