"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { ArrowRight, Search, Shield, Zap, Sparkles } from "lucide-react"

const CATEGORIES = [
  { name: "Tutoring", icon: "📚", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { name: "Design", icon: "🎨", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { name: "Coding", icon: "💻", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { name: "Moving", icon: "📦", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { name: "Cleaning", icon: "🧹", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { name: "Photography", icon: "📷", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
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
      {/* Navbar (Mock for Landing) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-primary" /> Quad
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground">Browse</Link>
            <Link href="/tasks" className="text-sm font-medium text-muted-foreground hover:text-foreground">Tasks</Link>
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
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            The Marketplace for <br />
            <span className="gradient-text">Campus Hustles</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Find a tutor, hire a mover, or get your code reviewed. Quad connects you with verified students on your campus.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/browse">
              <Button size="lg" className="h-14 px-8 text-base group">
                <Search className="mr-2 w-5 h-5" />
                Find a Service
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base glass-card border-white/10 hover:bg-white/5">
                Become a Provider <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-16 flex items-center justify-center gap-8 md:gap-16 opacity-70"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-foreground">500+</span>
              <span className="text-sm text-muted-foreground">Verified Students</span>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-foreground">1.2k</span>
              <span className="text-sm text-muted-foreground">Gigs Completed</span>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-foreground">4.9/5</span>
              <span className="text-sm text-muted-foreground">Average Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-surface relative z-10">
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
                <Link href={`/browse?category=${cat.name.toLowerCase()}`}>
                  <GlassCard animated className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center border-white/5 bg-white/[0.02]">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works</h2>
            <p className="text-muted-foreground">Safe, fast, and built exclusively for students.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto bg-accent-primary/10 text-accent-primary rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">1. .edu Verified</h3>
              <p className="text-muted-foreground leading-relaxed">Every user must verify their campus email address. No bots, no outsiders.</p>
            </div>
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto bg-pink-500/10 text-pink-500 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Book a Gig</h3>
              <p className="text-muted-foreground leading-relaxed">Browse listings or post a task request. Agree on a price and schedule it securely.</p>
            </div>
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto bg-success/10 text-success rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Get it Done</h3>
              <p className="text-muted-foreground leading-relaxed">The provider completes the job, you confirm it, and the payment is released automatically.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
