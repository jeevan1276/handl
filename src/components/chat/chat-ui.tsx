'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '@/app/actions/chat'
import { Button } from '@/components/ui/button'
import { SendHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

interface ChatUIProps {
  initialMessages: Message[]
  conversationId: string
  currentUserId: string
}

export function ChatUI({ initialMessages, conversationId, currentUserId }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message
          // Prevent duplicates if we already optimistically added it
          setMessages((prev) => {
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const content = inputValue
    setInputValue('')

    // Optimistic UI update could go here if we wanted, but we'll let the server action + realtime handle it for simplicity.
    // Actually, to make it feel instant, we can do an optimistic update.
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMessage])

    startTransition(async () => {
      try {
        await sendMessage(conversationId, content)
      } catch (err) {
        console.error('Failed to send message', err)
        // Rollback optimistic update
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
      }
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = message.sender_id === currentUserId
          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                isMine ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2 rounded-2xl",
                  isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-white/10 text-foreground rounded-bl-sm"
                )}
              >
                <p className="break-words text-sm">{message.content}</p>
                <span className="text-[10px] opacity-50 mt-1 block text-right">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <form 
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-white/30"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full shrink-0"
            disabled={isPending || !inputValue.trim()}
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
