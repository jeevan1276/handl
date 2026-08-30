import { createClient } from '@/lib/supabase/server'
import { CraftCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, AlertCircle, DollarSign, ArrowRight, Plus, ClipboardList } from 'lucide-react'

export default async function TaskBoardPage() {
  const supabase = await createClient()
  
  const { data: tasks } = await supabase
    .from('task_requests')
    .select('*, requester:profiles(name, avatar_url, verification_tier, completed_gigs, avg_rating)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  const urgencyStyles = {
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    normal: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    low: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground mt-2">Help out a peer and make some extra cash.</p>
          </div>
          <Link href="/dashboard/tasks/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Post a Task
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task: { 
              id: string, 
              title: string, 
              description: string, 
              category: string, 
              urgency: string, 
              budget_min: number, 
              budget_max: number | null, 
              deadline: string | null, 
              location: string | null, 
              requester: { 
                name: string, 
                avatar_url: string | null,
                verification_tier: number | null,
                completed_gigs: number | null,
                avg_rating: number | null
              } 
            }) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                <CraftCard variant="default" interactive className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center" padding="none">
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={task.category} size="sm" variant="filled" />
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${urgencyStyles[task.urgency as keyof typeof urgencyStyles] || urgencyStyles.normal}`}>
                        {task.urgency === 'urgent' && <AlertCircle className="w-3 h-3" />}
                        {task.urgency.toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-xl truncate">{task.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{task.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <UserAvatar url={task.requester.avatar_url} name={task.requester.name} size="sm" />
                        <span className="font-medium text-foreground">{task.requester.name}</span>
                        {task.requester.verification_tier != null && task.requester.verification_tier > 0 && (
                          <TrustBadge tier={task.requester.verification_tier} size="sm" />
                        )}
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Due {new Date(task.deadline).toLocaleDateString()}</div>
                      )}
                      {task.location && (
                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {task.location}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold text-2xl text-foreground">${task.budget_min}</span>
                        {task.budget_max && <span className="text-muted-foreground"> - ${task.budget_max}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">Budget</div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Make Offer <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CraftCard>
              </Link>
            ))
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">No open tasks right now</h3>
              <p className="text-muted-foreground">Check back later or be the first to post a request!</p>
              <Link href="/dashboard/tasks/new">
                <Button className="mt-4">Post a Task</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
