"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const major = formData.get('major') as string
  const classYear = formData.get('classYear') as string
  const bio = formData.get('bio') as string
  const skillsStr = formData.get('skills') as string
  const avatarUrl = formData.get('avatarUrl') as string
  
  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : []

  const updateData: Record<string, string | string[]> = {
    name,
    major,
    class_year: classYear,
    bio,
    skills,
  }

  if (avatarUrl) {
    updateData.avatar_url = avatarUrl
  }

  const supabaseAdmin = (await import('@supabase/supabase-js')).createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      ...updateData
    })

  if (error) {
    throw new Error('Failed to update profile: ' + error.message)
  }

  redirect('/dashboard')
}

