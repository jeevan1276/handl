import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CraftCard } from '@/components/shared/glass-card'
import { ProviderBookingActions, RequesterBookingActions } from './booking-actions'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, ArrowRight, Clock, CheckCircle, Loader2, XCircle, AlertTriangle, ShoppingBag } from 'lucide-react'

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const },
  confirmed: { label: "Confirmed", variant: "info" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  completed: { label: "Completed", variant: "success" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
  disputed: { label: "Disputed", variant: "destructive" as const },
}

function getStatusBadge(status: string) {
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "default" as const }
  return <Badge variant={config.variant} className="gap-1">{config.label}</Badge>
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
      listing:listings(title, image_urls),
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

  const renderBookingCard = (booking: any, isProvider: boolean) => {
    const otherParty = isProvider ? booking.requester : booking.provider
    const title = booking.listing?.title || booking.task_request?.title || 'Custom Service'
    const imageUrl = booking.listing?.image_urls?.[0]

    return (
      <CraftCard key={booking.id} variant="default" className="p-0 overflow-hidden" padding="none">
        <div className="flex flex-col md:flex-row gap-0 md:gap-4">
          {imageUrl && (
            <div className="w-full md:w-32 h-24 md:h-auto min-h-[120px] md:min-h-0 bg-muted relative overflow-hidden">
              <Image src={imageUrl} alt={title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <UserAvatar url={otherParty?.avatar_url} name={otherParty?.name} size="sm" />
                    <span className="text-sm font-medium text-muted-foreground truncate">{otherParty?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium text-foreground">${booking.agreed_price}</span>
                </div>
                {booking.scheduled_for && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Scheduled: {new Date(booking.scheduled_for).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              {isProvider ? (
                <ProviderBookingActions bookingId={booking.id} status={booking.status} otherPartyId={booking.requester_id} />
              ) : (
                <RequesterBookingActions bookingId={booking.id} status={booking.status} otherPartyId={booking.provider_id} />
              )}
            </div>
          </div>
        </div>
      </CraftCard>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your services and incoming requests.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Incoming Requests (You are providing)</h2>
        {asProvider.length === 0 ? (
          <CraftCard variant="outlined" className="p-12 text-center" padding="none">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No incoming bookings yet</h3>
            <p className="text-muted-foreground">When someone books your service, it will appear here.</p>
          </CraftCard>
        ) : (
          <div className="grid gap-4">
            {asProvider.map(booking => renderBookingCard(booking, true))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">My Services (You booked)</h2>
        {asRequester.length === 0 ? (
          <CraftCard variant="outlined" className="p-12 text-center" padding="none">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">You haven&apos;t booked any services yet</h3>
            <p className="text-muted-foreground mb-4">Browse the marketplace to find services you need.</p>
            <Link href="/browse">
              <Button>Browse Services</Button>
            </Link>
          </CraftCard>
        ) : (
          <div className="grid gap-4">
            {asRequester.map(booking => renderBookingCard(booking, false))}
          </div>
        )}
      </div>
    </div>
  )
}
