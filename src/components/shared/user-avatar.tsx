import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  url?: string | null
  name: string | null
  className?: string
}

export function UserAvatar({ url, name, className }: UserAvatarProps) {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Avatar className={cn("h-10 w-10 border border-border/50", className)}>
      <AvatarImage src={url || ""} alt={name || "User"} />
      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  )
}
