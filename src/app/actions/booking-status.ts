'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markBookingComplete(bookingId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // Verify the user is the provider for this booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('provider_id, status')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking not found')
  if (booking.provider_id !== user.id) throw new Error('Unauthorized')
  if (booking.status !== 'confirmed' && booking.status !== 'in_progress') {
    throw new Error('Booking cannot be marked complete from its current status')
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)

  if (updateError) throw new Error('Failed to update booking status')

  revalidatePath('/dashboard/bookings')
}

export async function releasePayment(bookingId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // Verify user is requester and booking is completed
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('requester_id, provider_id, status, agreed_price')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking not found')
  if (booking.requester_id !== user.id) throw new Error('Unauthorized')
  if (booking.status !== 'completed') throw new Error('Booking must be completed by provider first')

  // Update payment status to released
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status: 'released', released_at: new Date().toISOString() })
    .eq('booking_id', bookingId)
    .eq('status', 'captured')

  if (paymentError) throw new Error('Failed to update payment status')

  // Increment provider's wallet balance using a raw query or updating directly
  // Supabase rpc is safer for increments, but we don't have it defined right now.
  // We will fetch their current balance and increment it.
  
  const { data: provider, error: profileError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', booking.provider_id)
    .single()

  if (profileError) throw new Error('Failed to fetch provider profile')

  const currentBalance = provider.wallet_balance || 0
  const newBalance = currentBalance + booking.agreed_price

  const { error: walletError } = await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', booking.provider_id)

  if (walletError) throw new Error('Failed to update wallet balance')

  revalidatePath('/dashboard/bookings')
}
