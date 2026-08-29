import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function cleanAll() {
  console.log('Cleaning dependent tables...')
  
  // Delete all messages and conversations (cascade should handle messages, but just in case)
  await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('conversations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  // Delete payments, reviews, and bookings
  await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: bookingError } = await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (bookingError) console.error('Booking delete error:', bookingError)
  
  await supabase.from('task_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('Cleaning all users...')
  let hasMore = true
  let page = 1

  while (hasMore) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) {
      console.error(error)
      break
    }
    
    if (users.length === 0) {
      hasMore = false
      break
    }
    
    console.log(`Deleting ${users.length} users on page ${page}...`)
    for (const u of users) {
      await supabase.auth.admin.deleteUser(u.id)
    }
    
    // Don't increment page because deleting users shifts the pages
  }
  
  console.log('Clean complete!')
}

cleanAll().catch(console.error)
