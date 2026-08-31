import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GlassCard } from '@/components/shared/glass-card'
import { createTask } from './actions'

const CATEGORIES = [
  "tutoring", "design", "photography", "coding",
  "moving", "cleaning", "errands", "beauty",
  "tech_support", "events", "other"
]

export default async function NewTaskPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const selectClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post a Task</h1>
          <p className="text-muted-foreground">Need something done? Ask the campus.</p>
        </div>
        
        <GlassCard>
          <form action={createTask} className="space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Task Title</label>
                <Input id="title" name="title" placeholder="e.g. Need help moving a couch this Friday" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Details</label>
                <Textarea id="description" name="description" placeholder="Describe exactly what you need help with..." required className="min-h-[120px]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select id="category" name="category" required className={selectClasses} defaultValue="moving">
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="urgency" className="text-sm font-medium">Urgency</label>
                  <select id="urgency" name="urgency" required className={selectClasses} defaultValue="medium">
                    <option value="low">Low (Whenever)</option>
                    <option value="medium">Medium (Next few days)</option>
                    <option value="high">High (Tomorrow)</option>
                    <option value="urgent">Urgent (Today!)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="budget_min" className="text-sm font-medium">Min Budget (₹)</label>
                  <Input id="budget_min" name="budget_min" type="number" step="1" min="0" placeholder="15" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="budget_max" className="text-sm font-medium">Max Budget (Optional)</label>
                  <Input id="budget_max" name="budget_max" type="number" step="1" min="0" placeholder="30" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input id="location" name="location" placeholder="e.g. North Campus Dorms" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Post Task Request
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
