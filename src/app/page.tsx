"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CraftCard } from "@/components/shared/glass-card"
import { ArrowRight, Search, Shield, Zap, Sparkles, GraduationCap, CheckCircle, Users, Star } from "lucide-react"
import { RatingStars } from "@/components/shared/rating-stars"

const CATEGORIES = [
  { name: "Tutoring", icon: GraduationCap, color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", href: "tutoring" },
  { name: "Design", icon: Sparkles, color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", href: "design" },
  { name: "Coding", icon: CheckCircle, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", href: "coding" },
  { name: "Moving", icon: Users, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", href: "moving" },
  { name: "Cleaning", icon: Zap, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", href: "cleaning" },
  { name: "Photography", icon: Star, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", href: "photography" },
]

const STATS = [
  { value: "500+", label: "Verified Students" },
  { value: "1.2k+", label: "Gigs Completed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "50+", label: "Campuses" },
]

const STEPS = [
  {
    number: "01",
    icon: Shield,
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    title: ".edu Verified",
    description: "Every user verifies their campus email. No bots, no outsiders — just real students.",
  },
  {
    number: "02",
    icon: Search,
    iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    title: "Find & Book",
    description: "Browse listings or post a task. Agree on price and schedule securely in-app.",
  },
  {
    number: "03",
    icon: Zap,
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    title: "Get It Done",
    description: "Provider completes the job, you confirm, and payment releases automatically.",
  },
]

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> handl
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
            <Link href="/tasks" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tasks</Link>
            <div className="h-4 w-px bg-border"></div>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now serving 50+ campuses nationwide
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            The Marketplace for <br />
            <span className="gradient-text">Campus Hustles</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Find a tutor, hire a mover, or get your code reviewed. handl connects you with verified students on your campus — safe, fast, and built for student life.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/browse">
              <Button size="lg" className="h-14 px-8 text-base group">
                <Search className="mr-2 w-5 h-5" />
                Find a Service
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base">
                Become a Provider <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Categories</h2>
            <p className="text-muted-foreground">Whatever you need, a student on campus can handle it.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={item}>
                <Link href={`/browse?category=${cat.href}`}>
                  <CraftCard 
                    variant="default" 
                    interactive 
                    className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center"
                    padding="lg"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${cat.color}`}>
                      <cat.icon className="w-7 h-7" />
                    </div>
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </CraftCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 relative z-10 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works</h2>
            <p className="text-muted-foreground">Safe, fast, and built exclusively for students.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4 p-6"
              >
                <div className="relative">
                  <span className="absolute -top-4 -right-4 text-6xl font-bold text-primary/10">{step.number}</span>
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${step.iconBg}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Preview */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Popular Services</h2>
              <p className="text-muted-foreground">Trending listings from top-rated providers on campus.</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" size="default">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Calculus & Physics Tutoring", category: "Tutoring", price: 35, pricing: "hourly", rating: 4.9, reviews: 47, provider: "Alex Chen", verified: true },
              { title: "Dorm Move-In Assistance", category: "Moving", price: 80, pricing: "fixed", rating: 4.8, reviews: 23, provider: "Jordan Kim", verified: true },
              { title: "React Code Review Session", category: "Coding", price: 50, pricing: "hourly", rating: 5.0, reviews: 12, provider: "Sam Rivera", verified: true },
            ].map((listing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/browse" className="block">
                  <CraftCard variant="default" interactive className="h-full flex flex-col overflow-hidden" padding="none">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-amber-100 dark:from-primary/20 dark:to-amber-900/20" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/90 dark:bg-zinc-900/90 text-muted-foreground border border-border backdrop-blur-sm">
                          {listing.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">{listing.provider.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium text-white">{listing.provider}</span>
                          {listing.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                              <Star className="w-3 h-3 fill-current" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{listing.title}</h3>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={listing.rating} size="sm" showScore />
                        <span className="text-xs text-muted-foreground">({listing.reviews} reviews)</span>
                      </div>
                      <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/50">
                        <div className="font-bold text-lg text-foreground">${listing.price}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{listing.pricing}</div>
                      </div>
                    </div>
                  </CraftCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <CraftCard variant="elevated" className="p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-amber-50 dark:from-primary/10 dark:to-amber-900/10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Start Hustling?</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Join thousands of students earning money and getting things done on campus. Free to join, no commitments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto">
                    Browse Services
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">No credit card required · .edu email verification · Cancel anytime</p>
            </div>
          </CraftCard>
        </div>
      </section>

    </div>
  )
}
