"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CraftCard } from "@/components/shared/glass-card"
import { createListing } from "./actions"
import { createClient } from "@/lib/supabase/client"
import { ImagePlus, X, Loader2, Camera } from "lucide-react"
import Image from "next/image"

const CATEGORIES = [
  "tutoring", "design", "photography", "coding",
  "moving", "cleaning", "errands", "beauty",
  "tech_support", "events", "other"
]

export function CreateListingForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError("")
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`

      const supabase = createClient()
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

      setImageUrls(prev => [...prev, publicUrl])
    } catch (err: unknown) {
      setError("Error uploading image: " + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    imageUrls.forEach(url => formData.append("imageUrls", url))

    try {
      await createListing(formData)
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <CraftCard variant="elevated" className="p-8" padding="none">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">Listing Title</label>
            <Input id="title" name="title" placeholder="e.g. Expert Math Tutoring" required disabled={loading} className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">Description</label>
            <Textarea id="description" name="description" placeholder="Describe what you offer in detail..." required disabled={loading} className="min-h-[120px] bg-background border-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-foreground">Category</label>
              <select id="category" name="category" required disabled={loading} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="tutoring">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="pricing_type" className="text-sm font-medium text-foreground">Pricing Type</label>
              <select id="pricing_type" name="pricing_type" required disabled={loading} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="fixed">
                <option value="hourly">Hourly Rate</option>
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-foreground">Price ($)</label>
            <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="25.00" required disabled={loading} className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Images</label>
            <div className="flex flex-wrap gap-4">
              {imageUrls.map((url, i) => (
                <div key={url} className="relative w-24 h-24 rounded-lg border border-border overflow-hidden group">
                  <Image src={url} alt={`Upload ${i}`} fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-background/80 text-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">{uploading ? "..." : "Add Image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || loading} />
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading || uploading} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Listing"
          )}
        </Button>
      </form>
    </CraftCard>
  )
}
