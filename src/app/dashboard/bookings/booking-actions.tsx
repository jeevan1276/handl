'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { markBookingComplete, releasePayment } from '@/app/actions/booking-status'
import { CheckCircle2, DollarSign } from 'lucide-react'

export function ProviderBookingActions({ bookingId, status }: { bookingId: string, status: string }) {
  const [isLoading, setIsLoading] = useState(false)

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

export function RequesterBookingActions({ bookingId, status }: { bookingId: string, status: string }) {
  const [isLoading, setIsLoading] = useState(false)

  if (status !== 'completed') {
    return null
  }

  const handleRelease = async () => {
    try {
      setIsLoading(true)
      await releasePayment(bookingId)
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
      onClick={handleRelease}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <DollarSign className="w-4 h-4 mr-2" />
      {isLoading ? 'Releasing...' : 'Confirm & Release Payment'}
    </Button>
  )
}
