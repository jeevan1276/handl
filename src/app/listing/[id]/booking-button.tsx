'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createBookingSession } from '@/app/actions/booking'

export function BookingButton({ listingId }: { listingId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBook = async () => {
    try {
      setIsLoading(true)
      await createBookingSession(listingId)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <Button 
      size="lg" 
      className="w-full font-semibold text-base h-12" 
      onClick={handleBook}
      disabled={isLoading}
    >
      {isLoading ? 'Redirecting to checkout...' : 'Book Now'}
    </Button>
  )
}
