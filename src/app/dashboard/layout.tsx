import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Store, Calendar, MessageSquare, ClipboardList, CreditCard, User, LogOut, Menu, X } from 'lucide-react'
import { CraftCard } from '@/components/shared/glass-card'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Listings', href: '/dashboard/listings', icon: Store },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'Wallet', href: '/dashboard/wallet', icon: CreditCard },
]

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
    .select('name, avatar_url')
    .eq('id', user.id)
    .single()

  // If the profile has no name, they haven't completed onboarding
  if (!profile?.name) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-64 border-r border-border bg-muted/30">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-border/50">
            <Link href="/dashboard" className="font-bold text-xl tracking-tighter flex items-center gap-2 text-foreground">
              <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </span>
              handl
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  "hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border/50">
            <Link href={`/profile/${user.id}`} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
              <UserAvatar url={profile.avatar_url} name={profile.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile.name}</p>
                <p className="text-xs text-muted-foreground truncate">View profile</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="font-bold text-xl tracking-tighter flex items-center gap-2 text-foreground">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </span>
            handl
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
