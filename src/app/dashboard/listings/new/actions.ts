"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const pricing_type = formData.get('pricing_type') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrls = formData.getAll('imageUrls') as string[]

  const { data, error } = await supabase
    .from('listings')
    .insert({
      provider_id: user.id,
      title,
      description,
      category,
      pricing_type,
      price,
      image_urls: imageUrls,
      status: 'active'
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create listing: ' + error.message)
  }

  redirect(`/listing/${data.id}`)
}
