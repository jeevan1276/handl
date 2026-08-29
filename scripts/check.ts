import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function check() {
  const { data: users, error: authError } = await supabase.auth.admin.listUsers()
  if (authError) console.error('auth list error:', authError)
  
  const jordan = users?.users.find(u => u.email === 'jordan@university.edu')
  console.log('Jordan auth user:', jordan?.id)
  
  if (jordan) {
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', jordan.id)
      
    console.log('Jordan profile:', profile)
    console.log('Error:', profError)
  }
}

check()
