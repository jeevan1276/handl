import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingForm } from './onboarding-form'
import { Sparkles } from 'lucide-react'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  if (profile?.name) {
    // Already onboarded
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Welcome to handl
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Complete Your Profile</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself to get started on handl.</p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  )
}
