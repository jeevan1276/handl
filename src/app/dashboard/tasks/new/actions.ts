"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const urgency = formData.get('urgency') as string
  const budget_min = parseFloat(formData.get('budget_min') as string)
  const budget_max_raw = formData.get('budget_max') as string
  const budget_max = budget_max_raw ? parseFloat(budget_max_raw) : null
  const location = formData.get('location') as string

  const { error } = await supabase
    .from('task_requests')
    .insert({
      requester_id: user.id,
      title,
      description,
      category,
      urgency,
      budget_min,
      budget_max,
      location,
      status: 'open'
    })

  if (error) {
    throw new Error('Failed to create task request: ' + error.message)
  }

  redirect('/tasks')
}
