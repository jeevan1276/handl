import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number | null
  max?: number
  className?: string
  showScore?: boolean
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function RatingStars({ 
  rating, 
  max = 5, 
  className, 
  showScore = true, 
  size = "md",
  interactive = false,
  onChange 
}: RatingStarsProps) {
  const r = rating || 0
  const fullStars = Math.floor(r)
  const hasHalfStar = r % 1 >= 0.5

  const sizeClasses = {
    sm: "h-3 w-3 gap-0.5",
    md: "h-4 w-4 gap-0.5",
    lg: "h-5 w-5 gap-1",
  }

  const scoreSizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-0.5",
  }

  const handleStarClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center", sizeClasses[size])}>
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= fullStars
          const isHalf = starValue === fullStars + 1 && hasHalfStar

          if (interactive) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleStarClick(starValue)}
                className={cn(
                  "transition-transform duration-100 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded",
                  "p-0.5 -ml-0.5"
                )}
                aria-label={`Rate ${starValue} out of ${max}`}
              >
                {isFilled ? (
                  <Star className={cn("fill-amber-400 text-amber-400", sizeClasses[size])} />
                ) : isHalf ? (
                  <div className="relative" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }}>
                    <Star className="absolute left-0 top-0 text-zinc-300 dark:text-zinc-600" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px", height: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }} />
                    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: "50%" }}>
                      <Star className="fill-amber-400 text-amber-400" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px", height: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }} />
                    </div>
                  </div>
                ) : (
                  <Star className={cn("text-zinc-300 dark:text-zinc-600", sizeClasses[size])} />
                )}
              </button>
            )
          }

          if (isFilled) {
            return <Star key={i} className={cn("fill-amber-400 text-amber-400", sizeClasses[size])} />
          }
          if (isHalf) {
            return (
              <div key={i} className="relative" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }}>
                <Star className="absolute left-0 top-0 text-zinc-300 dark:text-zinc-600" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px", height: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }} />
                <div className="absolute left-0 top-0 overflow-hidden" style={{ width: "50%" }}>
                  <Star className="fill-amber-400 text-amber-400" style={{ width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px", height: size === "sm" ? "12px" : size === "md" ? "16px" : "20px" }} />
                </div>
              </div>
            )
          }
          return <Star key={i} className={cn("text-zinc-300 dark:text-zinc-600", sizeClasses[size])} />
        })}
      </div>
      {showScore && r > 0 && (
        <span className={cn(
          "font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full",
          "dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
          scoreSizeClasses[size]
        )}>
          {r.toFixed(1)}
        </span>
      )}
    </div>
  )
}
