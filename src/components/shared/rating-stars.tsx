import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number | null
  max?: number
  className?: string
}

export function RatingStars({ rating, max = 5, className }: RatingStarsProps) {
  const r = rating || 0
  const fullStars = Math.floor(r)
  const hasHalfStar = r % 1 >= 0.5

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-warning text-warning" />
        }
        if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative h-4 w-4">
              <Star className="absolute left-0 top-0 h-4 w-4 text-muted-foreground" />
              <div className="absolute left-0 top-0 h-4 w-4 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-4 w-4 fill-warning text-warning" />
              </div>
            </div>
          )
        }
        return <Star key={i} className="h-4 w-4 text-muted-foreground" />
      })}
      {r > 0 && <span className="ml-1 text-sm font-medium">{r.toFixed(1)}</span>}
    </div>
  )
}
