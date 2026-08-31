import { Shield, ShieldAlert, ShieldCheck, Award, Sparkles, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
  tier?: number | null
  completedGigs?: number
  avgRating?: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TrustBadge({ tier, completedGigs, avgRating, className, size = "md" }: TrustBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1 [&>svg]:h-3 [&>svg]:w-3",
    md: "px-2.5 py-0.5 text-xs gap-1.5 [&>svg]:h-3.5 [&>svg]:w-3.5",
    lg: "px-3 py-1 text-sm gap-2 [&>svg]:h-4 [&>svg]:w-4",
  }

  const getBadgeContent = () => {
    if (completedGigs !== undefined && avgRating !== undefined) {
      if (completedGigs >= 20 && avgRating >= 4.8) {
        return {
          icon: Award,
          text: "Top Rated",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
        }
      }
      if (completedGigs >= 10 && avgRating >= 4.5) {
        return {
          icon: ShieldCheck,
          text: "Trusted Pro",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
        }
      }
      if (completedGigs > 0) {
        return {
          icon: Sparkles,
          text: "Rising",
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
        }
      }
      return {
        icon: Shield,
        text: "New Provider",
        color: "text-zinc-600 dark:text-zinc-400",
        bg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
      }
    }

    switch (tier) {
      case 3:
        return {
          icon: ShieldCheck,
          text: "Campus Verified",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
        }
      case 2:
        return {
          icon: GraduationCap,
          text: "ID Verified",
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
        }
      case 1:
        return {
          icon: Shield,
          text: ".edu Verified",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
        }
      default:
        return {
          icon: ShieldAlert,
          text: "Unverified",
          color: "text-zinc-600 dark:text-zinc-400",
          bg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
        }
    }
  }

  const { icon: Icon, text, color, bg } = getBadgeContent()

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border font-semibold tracking-wide transition-all duration-200",
      sizeClasses[size],
      color,
      bg,
      className
    )}>
      <Icon className="shrink-0" />
      {text}
    </div>
  )
}
