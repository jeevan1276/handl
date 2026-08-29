import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to check if onboarding is complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  // If the profile has no name, they haven't completed onboarding
  if (!profile?.name) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Dashboard shell / navigation can go here */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
