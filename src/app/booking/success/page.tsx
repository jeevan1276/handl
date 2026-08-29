import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/shared/glass-card'
import { CheckCircle2 } from 'lucide-react'

export default async function BookingSuccessPage(props: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const searchParams = await props.searchParams
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect('/')
  }

  // Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const bookingId = session.metadata?.booking_id

  if (!bookingId) {
    notFound()
  }

  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, listing:listings(title), provider:profiles!bookings_provider_id_fkey(name)')
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-24">
      <GlassCard className="text-center p-12 space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-24 w-24 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your payment was successful and your booking for <strong className="text-foreground">{booking.listing?.title}</strong> with <strong className="text-foreground">{booking.provider?.name}</strong> is now confirmed.
        </p>
        
        <div className="pt-6">
          <Link href="/dashboard/bookings">
            <Button size="lg" className="font-semibold text-base px-8 h-12">
              View My Bookings
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
