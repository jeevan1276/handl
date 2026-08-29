import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const formatCategory = (cat: string) => {
    return cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  }

  const getColors = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "tutoring":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "design":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      case "photography":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "coding":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "moving":
      case "cleaning":
      case "errands":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", getColors(category), className)}>
      {formatCategory(category)}
    </div>
  )
}
