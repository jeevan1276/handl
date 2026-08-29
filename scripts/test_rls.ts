import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'jordan@university.edu',
    password: 'Password123!'
  })
  
  if (authError) {
    console.error('Login error:', authError)
    return
  }
  
  console.log('Logged in as:', authData.user.id)
  
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', authData.user.id)
    .single()
    
  console.log('Profile fetch result:', profile)
  console.log('Profile fetch error:', profError)
}

test().catch(console.error)
