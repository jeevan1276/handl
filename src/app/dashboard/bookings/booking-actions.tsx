'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { markBookingComplete, releasePayment } from '@/app/actions/booking-status'
import { CheckCircle2, DollarSign } from 'lucide-react'
import { ReviewDialog } from '@/components/reviews/review-dialog'

export function ProviderBookingActions({ bookingId, status, otherPartyId }: { bookingId: string, status: string, otherPartyId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  if (status === 'completed') {
    return <ReviewDialog bookingId={bookingId} revieweeId={otherPartyId} />
  }

  if (status !== 'confirmed' && status !== 'in_progress') {
    return null
  }

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      await markBookingComplete(bookingId)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      onClick={handleComplete}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700"
    >
      <CheckCircle2 className="w-4 h-4 mr-2" />
      {isLoading ? 'Updating...' : 'Mark Complete'}
    </Button>
  )
}

export function RequesterBookingActions({ bookingId, status, otherPartyId }: { bookingId: string, status: string, otherPartyId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  if (status === 'completed') {
    // Ideally we also check if payment is released, but for now we can show both or just the review dialog
    // We'll show the release button if payment not released, but status is 'completed'
    // For hackathon, let's just show ReviewDialog and Release Payment
    // Wait, the releasePayment action requires status === 'completed'.
    // We will show a group of buttons.
  }

  // To keep it simple, if completed, show release payment. If released, show review. 
  // Wait, there is no 'released' status for booking, only for payment.
  // We'll show both if completed.

  const handleRelease = async () => {
    try {
      setIsLoading(true)
      await releasePayment(bookingId)
      alert('Payment Released!')
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'completed') {
    return (
      <div className="flex flex-col gap-2 sm:items-end">
        <Button 
          size="sm" 
          onClick={handleRelease}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isLoading ? 'Releasing...' : 'Release Payment'}
        </Button>
        <ReviewDialog bookingId={bookingId} revieweeId={otherPartyId} />
      </div>
    )
  }

  return null
}
