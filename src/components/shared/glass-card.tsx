import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CraftCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined"
  interactive?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

export const CraftCard = forwardRef<HTMLDivElement, CraftCardProps>(
  ({ className, variant = "default", interactive = false, padding = "md", ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    const variantClasses = {
      default: "bg-card border-border shadow-sm",
      elevated: "bg-card border-border shadow-md",
      outlined: "bg-transparent border-2 border-border",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variantClasses[variant],
          paddingClasses[padding],
          interactive && "craft-card-interactive cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
CraftCard.displayName = "CraftCard"

// Legacy export for backward compatibility
export const GlassCard = CraftCard
