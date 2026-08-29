import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, AlertCircle } from 'lucide-react'

export default async function TaskBoardPage() {
  const supabase = await createClient()
  
  const { data: tasks } = await supabase
    .from('task_requests')
    .select('*, requester:profiles(name, avatar_url)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground mt-2">Help out a peer and make some extra cash.</p>
          </div>
          <Link href="/dashboard/tasks/new">
            <Button size="lg">Post a Task</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task: { id: string, title: string, description: string, category: string, urgency: string, budget_min: number, budget_max: number | null, deadline: string | null, location: string | null, requester: { name: string, avatar_url: string | null } }) => (
              <GlassCard animated key={task.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-white/[0.02]">
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={task.category} />
                    {task.urgency === 'high' || task.urgency === 'urgent' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                        <AlertCircle className="w-3 h-3" /> {task.urgency.toUpperCase()}
                      </span>
                    ) : null}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-xl truncate">{task.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{task.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <UserAvatar url={task.requester.avatar_url} name={task.requester.name} className="w-5 h-5" />
                      {task.requester.name}
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Due {new Date(task.deadline).toLocaleDateString()}</div>
                    )}
                    {task.location && (
                      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {task.location}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  <div className="text-right">
                    <div className="font-bold text-xl text-foreground">
                      ${task.budget_min} {task.budget_max ? `- $${task.budget_max}` : ''}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">Budget</div>
                  </div>
                  <Button variant="secondary" className="w-full">Make Offer</Button>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="py-24 text-center space-y-4">
              <h3 className="text-xl font-semibold">No open tasks right now</h3>
              <p className="text-muted-foreground">Check back later or be the first to post a request!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
