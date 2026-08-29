import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance, completed_gigs, avg_rating')
    .eq('id', user.id)
    .single()

  const { count: activeBookingsCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`)
    .in('status', ['pending', 'confirmed', 'in_progress'])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-glow mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl border-primary/20">
            <h3 className="text-sm font-medium text-muted-foreground">Wallet Balance</h3>
            <div className="mt-2 text-4xl font-bold text-success">${profile?.wallet_balance || 0}</div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-sm font-medium text-muted-foreground">Active Bookings</h3>
            <div className="mt-2 text-4xl font-bold">{activeBookingsCount || 0}</div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
            <div className="mt-2 text-4xl font-bold text-yellow-400">{profile?.avg_rating?.toFixed(1) || '0.0'}</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a href="/dashboard/listings/new" className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-primary/50 transition-colors">
              <h3 className="font-medium">Create Listing</h3>
              <p className="text-sm text-muted-foreground mt-1">Offer your services</p>
            </a>
            <a href="/browse" className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-primary/50 transition-colors">
              <h3 className="font-medium">Browse Marketplace</h3>
              <p className="text-sm text-muted-foreground mt-1">Find services you need</p>
            </a>
            <a href="/dashboard/bookings" className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-primary/50 transition-colors">
              <h3 className="font-medium">My Bookings</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage your bookings</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}