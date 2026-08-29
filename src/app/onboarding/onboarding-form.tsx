"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/shared/glass-card"
import { submitOnboarding } from "./actions"
import { createClient } from "@/lib/supabase/client"
import { UserAvatar } from "@/components/shared/user-avatar"

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
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}
        
        <div className="flex flex-col items-center gap-4">
          <UserAvatar url={avatarUrl} name="New User" className="h-24 w-24" />
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-primary hover:underline">
              {uploading ? "Uploading..." : "Upload Avatar"}
            </label>
            <input 
              type="file" 
              id="avatar" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarUpload}
              disabled={uploading || loading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input id="name" name="name" placeholder="Alex Chen" required disabled={loading} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="major" className="text-sm font-medium">Major</label>
              <Input id="major" name="major" placeholder="Computer Science" disabled={loading} />
            </div>
            <div className="space-y-2">
              <label htmlFor="classYear" className="text-sm font-medium">Class Year</label>
              <Input id="classYear" name="classYear" placeholder="2027" disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium">Skills (comma separated)</label>
            <Input id="skills" name="skills" placeholder="React, Figma, Photography" disabled={loading} />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
            <Textarea id="bio" name="bio" placeholder="Tell the campus a bit about yourself..." disabled={loading} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading || uploading}>
          {loading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </GlassCard>
  )
}
