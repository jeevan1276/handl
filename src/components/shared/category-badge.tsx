import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "filled"
}

export function CategoryBadge({ category, className, size = "md", variant = "default" }: CategoryBadgeProps) {
  const formatCategory = (cat: string) => {
    return cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  }

  const getColors = (cat: string) => {
    const baseColors: Record<string, { light: string; dark: string }> = {
      tutoring: { light: "bg-sky-50 text-sky-700 border-sky-200", dark: "bg-sky-900/30 text-sky-300 border-sky-800" },
      design: { light: "bg-rose-50 text-rose-700 border-rose-200", dark: "bg-rose-900/30 text-rose-300 border-rose-800" },
      photography: { light: "bg-purple-50 text-purple-700 border-purple-200", dark: "bg-purple-900/30 text-purple-300 border-purple-800" },
      coding: { light: "bg-emerald-50 text-emerald-700 border-emerald-200", dark: "bg-emerald-900/30 text-emerald-300 border-emerald-800" },
      moving: { light: "bg-amber-50 text-amber-700 border-amber-200", dark: "bg-amber-900/30 text-amber-300 border-amber-800" },
      cleaning: { light: "bg-amber-50 text-amber-700 border-amber-200", dark: "bg-amber-900/30 text-amber-300 border-amber-800" },
      errands: { light: "bg-amber-50 text-amber-700 border-amber-200", dark: "bg-amber-900/30 text-amber-300 border-amber-800" },
      beauty: { light: "bg-pink-50 text-pink-700 border-pink-200", dark: "bg-pink-900/30 text-pink-300 border-pink-800" },
      tech_support: { light: "bg-indigo-50 text-indigo-700 border-indigo-200", dark: "bg-indigo-900/30 text-indigo-300 border-indigo-800" },
      events: { light: "bg-teal-50 text-teal-700 border-teal-200", dark: "bg-teal-900/30 text-teal-300 border-teal-800" },
      other: { light: "bg-zinc-100 text-zinc-700 border-zinc-200", dark: "bg-zinc-800 text-zinc-300 border-zinc-700" },
    }

    const colors = baseColors[cat.toLowerCase()] || baseColors.other
    return `dark:${colors.dark} ${colors.light}`
  }

  const variantClasses = {
    default: "inline-flex items-center rounded-full border font-semibold tracking-wide transition-all duration-200",
    outline: "inline-flex items-center rounded-full border-2 font-semibold tracking-wide transition-all duration-200 bg-transparent",
    filled: "inline-flex items-center rounded-full font-semibold tracking-wide transition-all duration-200 border-0",
  }

  const colors = getColors(category)
  const [lightMode, darkMode] = colors.split(" dark:")

  return (
    <span className={cn(
      variantClasses[variant],
      sizeClasses[size],
      variant === "filled" ? lightMode.replace("border-", "bg-").replace("text-", "text-") : `${lightMode} dark:${darkMode}`,
      className
    )}>
      {formatCategory(category)}
    </span>
  )
}
