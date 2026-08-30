import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  url?: string | null
  name: string | null
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
}

export function UserAvatar({ url, name, className, size = "md" }: UserAvatarProps) {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Avatar className={cn(
      "border border-border ring-2 ring-background shadow-sm",
      sizeClasses[size],
      className
    )}>
      <AvatarImage src={url || ""} alt={name || "User"} className="object-cover" />
      <AvatarFallback className="bg-muted text-muted-foreground font-semibold border border-border">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  )
}
