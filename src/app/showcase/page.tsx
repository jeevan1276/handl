"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Search, 
  LayoutDashboard, 
  User, 
  LogIn, 
  UserPlus, 
  BookOpen, 
  MessageSquare,
  Calendar,
  Shield,
  Plus,
  ArrowRight,
  FileText,
  List,
  Mail,
  CreditCard,
  Unlock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Globe,
  Server,
  Zap,
} from "lucide-react"

const pages = [
  {
    category: "Public Pages",
    icon: Globe,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    pages: [
      { path: "/", title: "Landing Page", description: "Main marketing page with categories, stats, and how it works", icon: Home },
      { path: "/browse", title: "Browse Listings", description: "Search and filter all available gigs and services", icon: Search },
      { path: "/listing/[id]", title: "Listing Detail", description: "View individual listing with booking button", icon: FileText },
      { path: "/login", title: "Login", description: "User authentication page", icon: LogIn },
      { path: "/register", title: "Register", description: "New user registration", icon: UserPlus },
      { path: "/onboarding", title: "Onboarding", description: "New user setup flow", icon: BookOpen },
      { path: "/tasks", title: "Tasks Board", description: "Public task board view", icon: List },
      { path: "/profile/[id]", title: "Public Profile", description: "View other users' profiles", icon: User },
    ]
  },
  {
    category: "Authentication",
    icon: Shield,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    pages: [
      { path: "/auth/callback", title: "Auth Callback", description: "OAuth callback handler", icon: Unlock },
      { path: "/auth/auth-code-error", title: "Auth Error", description: "Authentication error page", icon: AlertCircle },
    ]
  },
  {
    category: "Dashboard (Protected)",
    icon: LayoutDashboard,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    pages: [
      { path: "/dashboard", title: "Dashboard Home", description: "Main dashboard overview", icon: LayoutDashboard },
      { path: "/dashboard/bookings", title: "My Bookings", description: "View and manage bookings", icon: Calendar },
      { path: "/dashboard/listings", title: "My Listings", description: "Manage your service listings", icon: List },
      { path: "/dashboard/listings/new", title: "Create Listing", description: "Create a new service listing", icon: Plus },
      { path: "/dashboard/messages", title: "Messages", description: "Conversation list", icon: MessageSquare },
      { path: "/dashboard/messages/[conversationId]", title: "Conversation", description: "Individual chat conversation", icon: Mail },
      { path: "/dashboard/tasks", title: "My Tasks", description: "Task management", icon: CheckCircle },
      { path: "/dashboard/tasks/new", title: "Create Task", description: "Post a new task request", icon: Plus },
    ]
  },
  {
    category: "Booking Flow",
    icon: Calendar,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    pages: [
      { path: "/booking/success", title: "Booking Success", description: "Post-booking confirmation page", icon: CheckCircle },
    ]
  },
  {
    category: "API Routes",
    icon: Server,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
    pages: [
      { path: "/api/webhooks/stripe", title: "Stripe Webhook", description: "Handle Stripe payment events", icon: CreditCard },
    ]
  }
]

const categoryIcons: Record<string, any> = {
  "Public Pages": Globe,
  "Authentication": Shield,
  "Dashboard (Protected)": LayoutDashboard,
  "Booking Flow": Calendar,
  "API Routes": Server,
}

export default function ShowcasePage() {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(
    pages.map(p => p.category)
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const totalPages = pages.reduce((acc, cat) => acc + cat.pages.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Frontend Showcase</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">All pages in the Handl marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {totalPages} Total Pages
              </Badge>
              <Badge variant="outline" className="text-sm">
                {pages.length} Categories
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Public Pages" 
            value={pages.find(p => p.category === "Public Pages")?.pages.length || 0}
            icon={Globe}
            color="bg-blue-500"
            description="Marketing & discovery"
          />
          <StatCard 
            title="Dashboard Pages" 
            value={pages.find(p => p.category === "Dashboard (Protected)")?.pages.length || 0}
            icon={LayoutDashboard}
            color="bg-purple-500"
            description="User workspace"
          />
          <StatCard 
            title="Auth Pages" 
            value={pages.find(p => p.category === "Authentication")?.pages.length || 0}
            icon={Shield}
            color="bg-green-500"
            description="Security & access"
          />
          <StatCard 
            title="Other Pages" 
            value={(pages.find(p => p.category === "Booking Flow")?.pages.length || 0) + (pages.find(p => p.category === "API Routes")?.pages.length || 0)}
            icon={FileText}
            color="bg-orange-500"
            description="Booking & API"
          />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {pages.map((category) => (
            <CategorySection
              key={category.category}
              category={category}
              isExpanded={expandedCategories.includes(category.category)}
              onToggle={() => toggleCategory(category.category)}
            />
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">View Live Site</Link>
              <Link href="/browse" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Browse Listings</Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Dashboard</Link>
              <Link href="/onboarding" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Onboarding</Link>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Handl Marketplace - Frontend Page Showcase
          </p>
        </div>      </footer>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, description }: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategorySection({ 
  category, 
  isExpanded, 
  onToggle 
}: { 
  category: typeof pages[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  const Icon = category.icon

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${category.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                {category.category}
                <Badge variant="secondary" className="text-xs ml-2">
                  {category.pages.length} pages
                </Badge>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click to {isExpanded ? 'collapse' : 'expand'}
              </p>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0 pt-4 pb-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.pages.map((page) => (
              <PageCard key={page.path} page={page} categoryColor={category.color} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface PageInfo {
  path: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

function PageCard({ page, categoryColor }: { page: PageInfo, categoryColor: string }) {
  const Icon = page.icon
  const isDynamic = page.path.includes('[')
  const isApi = page.path.startsWith('/api/')

  return (
    <Link 
      href={isDynamic || isApi ? '#' : page.path}
      className={`group block p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isDynamic || isApi ? 'opacity-60 cursor-default' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${categoryColor} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-sm font-mono font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {page.path}
            </code>
            {isDynamic && (
              <Badge variant="outline" className="text-xs h-4 px-1.5">
                Dynamic Route
              </Badge>
            )}
            {isApi && (
              <Badge variant="outline" className="text-xs h-4 px-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                API Route
              </Badge>
            )}
          </div>
          <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {page.title}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {page.description}
          </p>
        </div>
        {!isDynamic && !isApi && (
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 mt-1" />
        )}
      </div>
    </Link>
  )
}