"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CraftCard } from "@/components/shared/glass-card"
import { submitOnboarding } from "./actions"
import { createClient } from "@/lib/supabase/client"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Camera, Loader2 } from "lucide-react"

export function OnboardingForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError("")
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`

      const supabase = createClient()
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setAvatarUrl(publicUrl)
    } catch (err: unknown) {
      setError("Error uploading avatar: " + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl)
    }

    try {
      await submitOnboarding(formData)
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <CraftCard variant="elevated" className="p-8" padding="none">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <UserAvatar url={avatarUrl} name="New User" size="2xl" />
            <label 
              htmlFor="avatar" 
              className="absolute bottom-0 right-0 cursor-pointer bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                id="avatar" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={uploading || loading}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">Click to upload a profile photo</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
            <Input id="name" name="name" placeholder="Alex Chen" required disabled={loading} className="bg-background border-border" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="major" className="text-sm font-medium text-foreground">Major</label>
              <Input id="major" name="major" placeholder="Computer Science" disabled={loading} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <label htmlFor="classYear" className="text-sm font-medium text-foreground">Class Year</label>
              <Input id="classYear" name="classYear" placeholder="2027" disabled={loading} className="bg-background border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="campus" className="text-sm font-medium text-foreground">Campus</label>
            <Input id="campus" name="campus" placeholder="Stanford University" disabled={loading} className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium text-foreground">Skills (comma separated)</label>
            <Input id="skills" name="skills" placeholder="React, Figma, Photography" disabled={loading} className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
            <Textarea id="bio" name="bio" placeholder="Tell the campus a bit about yourself..." disabled={loading} className="bg-background border-border min-h-[100px]" />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading || uploading} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </form>
    </CraftCard>
  )
}
