import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, animated, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6 transition-all duration-300",
          animated && "hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(0,180,255,0.15)] cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"
