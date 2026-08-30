import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CraftCard } from '@/components/shared/glass-card'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, Clock } from 'lucide-react'

interface ConversationData {
  id: string
  otherProfile: { id: string; name: string; avatar_url: string | null } | null
  latestMessage: { id: string; content: string; created_at: string; sender_id: string } | null
}

export default async function MessagesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch conversations the user is part of
  // Including the latest message and the other participants
  const { data: participations, error } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      conversations (
        id,
        created_at,
        conversation_participants (
          user_id,
          profiles (
            id,
            name,
            avatar_url
          )
        ),
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { referencedTable: 'conversations.messages', ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return <div>Error loading messages.</div>
  }

  // Transform data for UI
  const conversations: ConversationData[] = (participations || []).map(p => {
    const conv = Array.isArray(p.conversations) ? p.conversations[0] : p.conversations
    if (!conv) return null
    
    // Exclude current user to find the "other" participant(s)
    const otherParticipants = Array.isArray(conv.conversation_participants)
      ? conv.conversation_participants.filter((cp: any) => cp.user_id !== user.id)
      : []
    const otherProfile = otherParticipants.length > 0 ? otherParticipants[0].profiles?.[0] : null
    
    // Sort messages locally to get the latest
    const sortedMessages = Array.isArray(conv.messages) 
      ? [...conv.messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : []
    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null

    return {
      id: conv.id,
      otherProfile,
      latestMessage
    }
  }).filter((c): c is ConversationData => c !== null).sort((a, b) => {
    // Sort conversations by latest message time
    const aTime = a.latestMessage ? new Date(a.latestMessage.created_at).getTime() : 0
    const bTime = b.latestMessage ? new Date(b.latestMessage.created_at).getTime() : 0
    return bTime - aTime
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your service providers and requesters.</p>
      </div>

      <div className="flex flex-col gap-4">
        {conversations.length === 0 ? (
          <CraftCard variant="outlined" className="p-12 text-center" padding="none">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">Book a service to start chatting with providers!</p>
            <Link href="/browse">
              <Button>Browse Services</Button>
            </Link>
          </CraftCard>
        ) : (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/dashboard/messages/${conv.id}`}>
              <CraftCard variant="default" interactive className="p-4 flex items-center gap-4" padding="none">
                <UserAvatar 
                  url={conv.otherProfile?.avatar_url || ''} 
                  name={conv.otherProfile?.name || 'Unknown User'} 
                  size="lg"
                />
                <div className="flex-1 overflow-hidden min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg truncate">{conv.otherProfile?.name || 'Unknown User'}</h3>
                    {conv.latestMessage && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {new Date(conv.latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground truncate text-sm mt-1">
                    {conv.latestMessage ? (
                      <>
                        {conv.latestMessage.sender_id === user.id ? 'You: ' : ''}
                        {conv.latestMessage.content}
                      </>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </CraftCard>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
