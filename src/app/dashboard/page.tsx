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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard</h1>
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
          <p className="text-muted-foreground">
            Your dashboard is ready. Start building your profile and exploring the marketplace!
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a href="/dashboard/listings/new" className="glass-card p-4 hover:border-primary/50 transition-colors">
              <h3 className="font-medium">Create Listing</h3>
              <p className="text-sm text-muted-foreground mt-1">Offer your services</p>
            </a>
            <a href="/browse" className="glass-card p-4 hover:border-primary/50 transition-colors">
              <h3 className="font-medium">Browse Marketplace</h3>
              <p className="text-sm text-muted-foreground mt-1">Find services you need</p>
            </a>
            <a href="/dashboard/bookings" className="glass-card p-4 hover:border-primary/50 transition-colors">
              <h3 className="font-medium">My Bookings</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage your bookings</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}