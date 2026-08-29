'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  if (!content.trim()) return

  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim()
    })

  if (error) {
    console.error('Failed to send message:', error)
    throw new Error('Failed to send message')
  }

  // Optionally revalidate if we were relying on Server Components to render the list
  // However, we are using Realtime in a Client Component, so it's not strictly necessary.
  revalidatePath(`/dashboard/messages/${conversationId}`)
}
