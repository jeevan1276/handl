import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GlassCard } from '@/components/shared/glass-card'
import { UserAvatar } from '@/components/shared/user-avatar'

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
  const conversations = participations?.map(p => {
    const conv = p.conversations
    // Exclude current user to find the "other" participant(s)
    const otherParticipants = Array.isArray(conv?.conversation_participants)
      ? conv.conversation_participants.filter(cp => cp.user_id !== user.id)
      : []
    const otherProfile = otherParticipants.length > 0 ? otherParticipants[0].profiles : null
    
    // Sort messages locally to get the latest
    const sortedMessages = Array.isArray(conv?.messages) 
      ? [...conv.messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : []
    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null

    return {
      id: conv?.id,
      otherProfile,
      latestMessage
    }
  }).sort((a, b) => {
    // Sort conversations by latest message time
    const aTime = a.latestMessage ? new Date(a.latestMessage.created_at).getTime() : 0
    const bTime = b.latestMessage ? new Date(b.latestMessage.created_at).getTime() : 0
    return bTime - aTime
  }) || []

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow">Messages</h1>
        <p className="text-muted-foreground">Communicate with your service providers and requesters.</p>
      </div>

      <div className="flex flex-col gap-4">
        {conversations.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No conversations yet. Book a service to start chatting!
          </GlassCard>
        ) : (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/dashboard/messages/${conv.id}`}>
              <GlassCard className="p-4 hover:border-primary/50 transition-colors flex items-center gap-4 cursor-pointer">
                <UserAvatar 
                  url={conv.otherProfile?.avatar_url || ''} 
                  name={conv.otherProfile?.name || 'Unknown User'} 
                  size={48}
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-lg">{conv.otherProfile?.name || 'Unknown User'}</h3>
                  <p className="text-muted-foreground truncate text-sm">
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
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
