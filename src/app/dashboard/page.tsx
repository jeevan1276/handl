import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CraftCard } from '@/components/shared/glass-card'
import { TrustBadge } from '@/components/shared/trust-badge'
import { RatingStars } from '@/components/shared/rating-stars'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, Calendar, Star, TrendingUp, ArrowRight, Search, MessageSquare, ClipboardList } from 'lucide-react'

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
    .select('wallet_balance, completed_gigs, avg_rating, name, avatar_url')
    .eq('id', user.id)
    .single()

  const { count: activeBookingsCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`)
    .in('status', ['pending', 'confirmed', 'in_progress'])

  const { count: myListingsCount } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', user.id)
    .eq('status', 'active')

  const { count: completedBookingsCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`)
    .eq('status', 'completed')

  const stats = [
    {
      label: "Wallet Balance",
      value: `$${profile?.wallet_balance || 0}`,
      icon: CreditCard,
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      trend: "+$47.50 this week",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      href: "/dashboard/wallet",
    },
    {
      label: "Active Bookings",
      value: activeBookingsCount?.toString() || "0",
      icon: Calendar,
      iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
      trend: `${completedBookingsCount || 0} completed total`,
      trendColor: "text-sky-600 dark:text-sky-400",
      href: "/dashboard/bookings",
    },
    {
      label: "Average Rating",
      value: profile?.avg_rating?.toFixed(1) || "0.0",
      icon: Star,
      iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      trend: `${profile?.completed_gigs || 0} gigs completed`,
      trendColor: "text-amber-600 dark:text-amber-400",
      href: `/profile/${user.id}`,
    },
    {
      label: "Active Listings",
      value: myListingsCount?.toString() || "0",
      icon: TrendingUp,
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      trend: "Create more to earn more",
      trendColor: "text-purple-600 dark:text-purple-400",
      href: "/dashboard/listings/new",
    },
  ]

  const quickActions = [
    {
      title: "Create Listing",
      description: "Offer your services to campus",
      icon: Plus,
      href: "/dashboard/listings/new",
      primary: true,
    },
    {
      title: "Browse Marketplace",
      description: "Find services you need",
      icon: Search,
      href: "/browse",
      primary: false,
    },
    {
      title: "My Bookings",
      description: "Manage your bookings",
      icon: Calendar,
      href: "/dashboard/bookings",
      primary: false,
    },
    {
      title: "Messages",
      description: "Chat with providers & requesters",
      icon: MessageSquare,
      href: "/dashboard/messages",
      primary: false,
    },
    {
      title: "Post a Task",
      description: "Request help from peers",
      icon: ClipboardList,
      href: "/dashboard/tasks/new",
      primary: false,
    },
    {
      title: "Wallet & Earnings",
      description: "View balance & withdraw",
      icon: CreditCard,
      href: "/dashboard/wallet",
      primary: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {profile?.name?.split(' ')[0] || 'there'}! Here's what's happening.</p>
          </div>
          <Link href="/dashboard/listings/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href} className="block">
              <CraftCard variant="default" interactive className="p-6 flex flex-col gap-4" padding="none">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className={`text-sm font-medium ${stat.trendColor}`}>{stat.trend}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CraftCard>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <CraftCard 
                  variant={action.primary ? "elevated" : "default"} 
                  interactive 
                  className={`p-6 flex flex-col gap-4 ${action.primary ? 'bg-primary/5 border-primary/20' : ''}`}
                  padding="none"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.primary ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    {action.primary && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground self-end" />
                </CraftCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <Link href="/dashboard/bookings" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <CraftCard variant="default" className="p-0 overflow-hidden" padding="none">
            <div className="border-b border-border/50">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-4">Booking</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {/* This would be populated with actual recent bookings */}
              <div className="px-6 py-4 text-center text-muted-foreground">
                No recent activity. <Link href="/browse" className="text-primary hover:underline ml-1">Browse services</Link> to get started!
              </div>
            </div>
          </CraftCard>
        </div>
      </div>
    </div>
  )
}