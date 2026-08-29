-- Quad Campus Marketplace - Database Schema
-- Run this in Supabase SQL Editor

-- ══════════════════════════════════════
-- USERS (extends Supabase auth.users)
-- ══════════════════════════════════════
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  avatar_url text,
  campus text not null default 'Demo University',
  class_year text,
  major text,
  bio text,
  skills text[] default '{}',
  hourly_rate decimal(10,2),
  is_available boolean default false,
  verification_tier int default 1,  -- 0=unverified, 1=.edu, 2=ID, 3=campus
  trust_score decimal(3,2) default 0.00,
  avg_rating decimal(3,2) default 0.00,
  completed_gigs int default 0,
  wallet_balance decimal(10,2) default 0.00,  -- simulated for hackathon
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ══════════════════════════════════════
-- LISTINGS (provider-initiated services)
-- ══════════════════════════════════════
create type listing_category as enum (
  'tutoring', 'design', 'photography', 'coding',
  'moving', 'cleaning', 'errands', 'beauty',
  'tech_support', 'events', 'other'
);
create type listing_status as enum ('active', 'paused', 'archived');
create type pricing_type as enum ('hourly', 'fixed', 'negotiable');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category listing_category not null,
  tags text[] default '{}',
  pricing_type pricing_type not null default 'fixed',
  price decimal(10,2) not null,
  image_urls text[] default '{}',
  status listing_status default 'active',
  booking_count int default 0,
  avg_rating decimal(3,2) default 0.00,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ══════════════════════════════════════
-- TASK REQUESTS (requester-initiated asks)
-- ══════════════════════════════════════
create type task_status as enum ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
create type urgency_level as enum ('low', 'medium', 'high', 'urgent');

create table public.task_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category listing_category not null,
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  deadline timestamptz,
  location text,
  urgency urgency_level default 'medium',
  status task_status default 'open',
  created_at timestamptz default now()
);

-- ══════════════════════════════════════
-- BOOKINGS (the transaction unit)
-- ══════════════════════════════════════
create type booking_status as enum (
  'pending', 'confirmed', 'in_progress',
  'completed', 'cancelled', 'disputed'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id),
  task_request_id uuid references public.task_requests(id),
  provider_id uuid not null references public.profiles(id),
  requester_id uuid not null references public.profiles(id),
  agreed_price decimal(10,2) not null,
  platform_fee decimal(10,2) default 0.00,  -- calculated at booking time
  status booking_status default 'pending',
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  constraint booking_has_source check (
    listing_id is not null or task_request_id is not null
  )
);

-- ══════════════════════════════════════
-- PAYMENTS (Stripe Checkout tracking)
-- ══════════════════════════════════════
create type payment_status as enum (
  'pending', 'authorized', 'captured', 'released', 'refunded', 'failed'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  amount decimal(10,2) not null,
  platform_fee decimal(10,2) default 0.00,
  status payment_status default 'pending',
  created_at timestamptz default now(),
  captured_at timestamptz,
  released_at timestamptz
);

-- ══════════════════════════════════════
-- REVIEWS
-- ══════════════════════════════════════
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  reviewer_id uuid not null references public.profiles(id),
  reviewee_id uuid not null references public.profiles(id),
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  tags text[] default '{}',  -- 'on_time', 'great_communicator', 'would_rebook'
  created_at timestamptz default now(),
  unique(booking_id, reviewer_id)  -- one review per person per booking
);

-- ══════════════════════════════════════
-- CHAT (Supabase Realtime powered)
-- ══════════════════════════════════════
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  created_at timestamptz default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz default now()
);

-- ══════════════════════════════════════
-- INDEXES (performance-critical)
-- ══════════════════════════════════════
create index idx_listings_category on public.listings(category);
create index idx_listings_provider on public.listings(provider_id);
create index idx_listings_status on public.listings(status) where status = 'active';
create index idx_bookings_provider on public.bookings(provider_id);
create index idx_bookings_requester on public.bookings(requester_id);
create index idx_messages_conversation on public.messages(conversation_id, created_at);
create index idx_reviews_reviewee on public.reviews(reviewee_id);
create index idx_task_requests_status on public.task_requests(status) where status = 'open';

-- Full-text search on listings (no pgvector needed)
alter table public.listings add column fts tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) stored;
create index idx_listings_fts on public.listings using gin(fts);
