import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CATEGORIES = [
  'tutoring', 'design', 'photography', 'coding',
  'moving', 'cleaning', 'errands', 'beauty',
  'tech_support', 'events', 'other'
]

async function seed() {
  console.log('🌱 Starting database seed...')

  console.log('🧹 Cleaning existing database (deleting old users and cascading)...')
  const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers()
  if (!listError && existingUsers) {
    for (const u of existingUsers) {
      await supabase.auth.admin.deleteUser(u.id)
    }
  }

  // 1. Create Users (15 users)
  console.log('👤 Creating 15 users...')
  const users = []
  
  const heroAccounts = [
    {
      firstName: 'Maya',
      lastName: 'Chen',
      email: 'maya@university.edu',
      class_year: '2025',
      avg_rating: 4.8,
      completed_gigs: 12,
      is_available: true
    },
    {
      firstName: 'Jordan',
      lastName: 'Rivera',
      email: 'jordan@university.edu',
      class_year: '2027', // Freshman
      avg_rating: 0,
      completed_gigs: 0,
      is_available: false
    }
  ]

  for (let i = 0; i < 15; i++) {
    const hero = i < heroAccounts.length ? heroAccounts[i] : null
    const firstName = hero ? hero.firstName : faker.person.firstName()
    const lastName = hero ? hero.lastName : faker.person.lastName()
    const email = hero ? hero.email : faker.internet.email({ firstName, lastName, provider: 'university.edu' })
    const password = 'Password123!'

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: `${firstName} ${lastName}` }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      continue
    }

    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          name: `${firstName} ${lastName}`,
          campus: 'Demo University',
          class_year: hero ? hero.class_year : faker.helpers.arrayElement(['2024', '2025', '2026', '2027', 'Graduate']),
          major: faker.person.jobArea(),
          bio: faker.lorem.paragraph(),
          skills: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
          hourly_rate: faker.number.int({ min: 200, max: 2000 }),
          is_available: hero ? hero.is_available : faker.datatype.boolean(),
          verification_tier: faker.number.int({ min: 1, max: 3 }),
          trust_score: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 2 }),
          avg_rating: hero ? hero.avg_rating : faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 2 }),
          completed_gigs: hero ? hero.completed_gigs : faker.number.int({ min: 0, max: 20 }),
        })
        .select()
        .single()

      if (profileError) {
        console.error('Error updating profile:', profileError)
      } else if (profile) {
        users.push(profile)
      }
    }
  }

  if (users.length < 2) {
    console.error('Not enough users created to continue seeding.')
    process.exit(1)
  }

  // 2. Create Listings (25 listings)
  console.log('📋 Creating 25 listings...')
  const listings = []
  for (let i = 0; i < 25; i++) {
    const provider = faker.helpers.arrayElement(users)
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        provider_id: provider.id,
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(CATEGORIES),
        tags: [faker.commerce.productAdjective(), faker.commerce.productAdjective()],
        pricing_type: faker.helpers.arrayElement(['hourly', 'fixed', 'negotiable']),
        price: faker.number.int({ min: 100, max: 15000 }),
        status: 'active',
        booking_count: faker.number.int({ min: 0, max: 10 }),
        avg_rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 2 }),
      })
      .select()
      .single()

    if (listingError) {
      console.error('Error creating listing:', listingError)
    } else {
      listings.push(listing)
    }
  }

  // 3. Create Task Requests (10 task requests)
  console.log('📝 Creating 10 task requests...')
  const taskRequests = []
  for (let i = 0; i < 10; i++) {
    const requester = faker.helpers.arrayElement(users)
    const { data: request, error: requestError } = await supabase
      .from('task_requests')
      .insert({
        requester_id: requester.id,
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(CATEGORIES),
        budget_min: faker.number.int({ min: 100, max: 500 }),
        budget_max: faker.number.int({ min: 1000, max: 10000 }),
        deadline: faker.date.soon({ days: 14 }).toISOString(),
        location: faker.location.streetAddress(),
        urgency: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
        status: faker.helpers.arrayElement(['open', 'assigned', 'in_progress', 'completed']),
      })
      .select()
      .single()

    if (requestError) {
      console.error('Error creating task request:', requestError)
    } else {
      taskRequests.push(request)
    }
  }

  // 4. Create Bookings (20 bookings)
  console.log('🤝 Creating 20 bookings...')
  const bookings = []
  for (let i = 0; i < 20; i++) {
    const isListingBooking = faker.datatype.boolean() && listings.length > 0
    let providerId: string, requesterId: string, listingId: string | null = null, taskRequestId: string | null = null, price: number

    if (isListingBooking) {
      const listing = faker.helpers.arrayElement(listings)
      providerId = listing.provider_id
      requesterId = faker.helpers.arrayElement(users.filter(u => u.id !== providerId)).id
      listingId = listing.id
      price = listing.price
    } else if (taskRequests.length > 0) {
      const request = faker.helpers.arrayElement(taskRequests)
      requesterId = request.requester_id
      providerId = faker.helpers.arrayElement(users.filter(u => u.id !== requesterId)).id
      taskRequestId = request.id
      price = request.budget_max || 50
    } else {
      continue
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        listing_id: listingId,
        task_request_id: taskRequestId,
        provider_id: providerId,
        requester_id: requesterId,
        agreed_price: price,
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'in_progress', 'completed']),
        scheduled_at: faker.date.soon({ days: 7 }).toISOString(),
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
    } else {
      bookings.push(booking)
    }
  }

  // 5. Create Reviews (30 reviews)
  console.log('⭐ Creating 30 reviews...')
  const completedBookings = bookings.filter(b => b.status === 'completed')
  let reviewCount = 0
  for (const booking of completedBookings) {
    if (reviewCount >= 30) break
    
    // Requester reviews Provider
    const { error: reviewError1 } = await supabase
      .from('reviews')
      .insert({
        booking_id: booking.id,
        reviewer_id: booking.requester_id,
        reviewee_id: booking.provider_id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentences(2),
        tags: [faker.helpers.arrayElement(['on_time', 'great_communicator', 'would_rebook'])],
      })
      
    if (!reviewError1) reviewCount++

    // Provider reviews Requester (maybe)
    if (faker.datatype.boolean() && reviewCount < 30) {
      const { error: reviewError2 } = await supabase
        .from('reviews')
        .insert({
          booking_id: booking.id,
          reviewer_id: booking.provider_id,
          reviewee_id: booking.requester_id,
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: faker.lorem.sentence(),
        })
      if (!reviewError2) reviewCount++
    }
  }

  // 6. Create Conversations (5 conversations)
  // We'll skip the actual messages since the conversations and participants are enough to test the UI for now,
  // or we can add messages if there's a messages table. Let's check schema.
  console.log('💬 Creating 5 conversations...')
  let convCount = 0
  for (const booking of bookings) {
    if (convCount >= 5) break
    
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({ booking_id: booking.id })
      .select()
      .single()
      
    if (convError) {
      console.error('Error creating conversation:', convError)
      continue
    }
    
    await supabase.from('conversation_participants').insert([
      { conversation_id: conv.id, user_id: booking.provider_id },
      { conversation_id: conv.id, user_id: booking.requester_id }
    ])
    
    convCount++
  }

  console.log('✅ Seeding completed successfully!')
}

seed().catch(console.error)
