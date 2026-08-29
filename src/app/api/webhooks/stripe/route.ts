import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// We need a service role key to bypass RLS in the webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const signature = headerPayload.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      // 1. Create a payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string | undefined,
          amount: (session.amount_total || 0) / 100, // Convert back from cents
          status: 'captured',
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      }

      // 2. Update booking status to confirmed and fetch provider/requester
      const { data: updatedBooking, error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId)
        .select('id, provider_id, requester_id')
        .single()

      if (bookingError) {
        console.error('Error updating booking status:', bookingError)
      } else if (updatedBooking) {
        // 3. Create a conversation for the provider and requester
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({ booking_id: bookingId })
          .select('id')
          .single()

        if (convError) {
          console.error('Error creating conversation:', convError)
        } else if (convData) {
          const { error: partsError } = await supabase
            .from('conversation_participants')
            .insert([
              { conversation_id: convData.id, user_id: updatedBooking.provider_id },
              { conversation_id: convData.id, user_id: updatedBooking.requester_id }
            ])
            
          if (partsError) {
            console.error('Error creating conversation participants:', partsError)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
