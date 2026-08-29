"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === "default" && "border border-border bg-secondary text-secondary-foreground",
      variant === "secondary" && "border border-border bg-secondary text-secondary-foreground",
      variant === "destructive" && "border border-destructive bg-destructive/10 text-destructive",
      variant === "outline" && "border border-border bg-transparent",
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
