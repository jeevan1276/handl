import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateListingForm } from './create-listing-form'

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create a Listing</h1>
          <p className="text-muted-foreground">Offer your services to the campus community.</p>
        </div>
        <CreateListingForm userId={user.id} />
      </div>
    </div>
  )
}
