import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatUI } from '@/components/chat/chat-ui'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: PageProps) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Await the params before using them in Next.js 15
  const resolvedParams = await params
  const { conversationId } = resolvedParams

  // Verify user is a participant
  const { data: participant, error: partError } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (partError || !participant) {
    redirect('/dashboard/messages')
  }

  // Fetch the other participant to show their name/avatar
  const { data: otherParticipantData } = await supabase
    .from('conversation_participants')
    .select('user_id, profiles(id, name, avatar_url)')
    .eq('conversation_id', conversationId)
    .neq('user_id', user.id)
    .single()

  const otherProfile = otherParticipantData?.profiles || { name: 'Unknown User', avatar_url: '' }

  // Fetch initial messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/messages" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-glow">{!Array.isArray(otherProfile) ? otherProfile.name : 'Unknown User'}</h1>
          <p className="text-sm text-muted-foreground">In a conversation with you</p>
        </div>
      </div>
      
      <div className="flex-1 bg-background/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl relative z-10">
        <ChatUI 
          initialMessages={messages || []} 
          conversationId={conversationId} 
          currentUserId={user.id} 
        />
      </div>
    </div>
  )
}
