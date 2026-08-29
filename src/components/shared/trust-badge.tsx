import { Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
  tier?: number | null
  completedGigs?: number
  avgRating?: number
  className?: string
}

export function TrustBadge({ tier, completedGigs, avgRating, className }: TrustBadgeProps) {
  const getBadgeContent = () => {
    if (completedGigs !== undefined && avgRating !== undefined) {
      if (completedGigs >= 20 && avgRating >= 4.8) {
        return { icon: ShieldCheck, text: "Top Rated", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" }
      }
      if (completedGigs >= 10 && avgRating >= 4.5) {
        return { icon: ShieldCheck, text: "Trusted", color: "text-success", bg: "bg-success/10 border-success/20" }
      }
      if (completedGigs > 0) {
        return { icon: Shield, text: "Rising", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" }
      }
      return { icon: Shield, text: "New", color: "text-muted-foreground", bg: "bg-muted/10 border-muted/20" }
    }

    switch (tier) {
      case 3:
        return { icon: ShieldCheck, text: "Campus Verified", color: "text-success", bg: "bg-success/10 border-success/20" }
      case 2:
        return { icon: ShieldCheck, text: "ID Verified", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" }
      case 1:
        return { icon: Shield, text: ".edu Verified", color: "text-accent-primary", bg: "bg-accent-primary/10 border-accent-primary/20" }
      default:
        return { icon: ShieldAlert, text: "Unverified", color: "text-muted-foreground", bg: "bg-muted/10 border-muted/20" }
    }
  }

  const { icon: Icon, text, color, bg } = getBadgeContent()

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors", color, bg, className)}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  )
}
