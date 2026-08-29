# handl

A campus-only services marketplace where students turn skills into income and get everyday tasks done by verified, rated peers. Built for a hackathon sprint with production-ready architecture.

## Overview

**handl** replaces the chaotic campus economy of GroupMe, Discord, Facebook groups, and paper flyers with a structured marketplace featuring:

- **Verified identities** — `.edu` email gatekeeping with trust badges
- **Two-way discovery** — Browse service listings OR post task requests
- **Escrow-protected payments** — Stripe Checkout holds funds until completion
- **Real-time chat** — Supabase Realtime for instant messaging between parties
- **Reputation system** — Reviews, ratings, and trust tiers that persist across campus

## Demo Flow

1. **Landing** — Dark glass aesthetic with animated hero and category grid
2. **Sign up** — `.edu` verification → instant trust badge
3. **Browse** — Filter listings by category, search, sort by rating/price
4. **Book** — Stripe Checkout (test mode) → funds held in escrow
5. **Chat** — Real-time messaging via Supabase Realtime
6. **Complete** — Provider marks done → Requester confirms → Wallet updates
7. **Review** — Double-blind reviews → Trust score recalculates
8. **Dashboard** — Earnings, active bookings, wallet balance, trust tier

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database/Auth/Storage/Realtime | Supabase |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion (targeted) |
| Payments | Stripe Checkout (simulated wallet for demo) |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone and install dependencies
git clone <repo-url>
cd handl
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Stripe keys to .env.local

# Run database schema (in Supabase SQL Editor)
# Copy contents of scripts/schema.sql

# Generate TypeScript types
supabase gen types typescript --project-id <your-project-id> > src/lib/database.types.ts

# Seed demo data (optional)
npx tsx scripts/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/webhooks/       # Stripe webhook handler
│   ├── auth/               # Login, register, callback
│   ├── booking/            # Booking success page
│   ├── browse/             # Marketplace browse page
│   ├── dashboard/          # User dashboard (bookings, listings, messages, tasks)
│   ├── listing/[id]/       # Listing detail + booking
│   ├── onboarding/         # Profile setup after first login
│   ├── profile/[id]/       # Public profile pages
│   └── tasks/              # Task board
├── components/
│   ├── chat/               # Real-time chat UI
│   ├── reviews/            # Review dialog & list
│   ├── shared/             # GlassCard, TrustBadge, RatingStars, etc.
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/           # Client, server, middleware helpers
│   ├── database.types.ts   # Generated Supabase types
│   ├── stripe.ts           # Stripe utilities
│   └── utils.ts            # Shared utilities
scripts/
├── schema.sql              # Complete database schema
├── seed.ts                 # Demo data seeding
└── check.ts                # Type checking utility
```

## Key Features Implemented

- ✅ **Authentication** — Supabase Auth with `.edu` email validation
- ✅ **Profiles** — Onboarding flow with avatar upload to Supabase Storage
- ✅ **Marketplace** — Listings with categories, pricing, images, search
- ✅ **Task Board** — Requester-initiated task posting
- ✅ **Bookings** — Full flow: create → Stripe Checkout → confirm → complete
- ✅ **Payments** — Stripe webhooks, simulated provider wallet
- ✅ **Real-time Chat** — Supabase Realtime subscriptions
- ✅ **Reviews** — 1-5 stars, comments, structured tags, trust score
- ✅ **Dashboard** — Earnings, bookings, messages, wallet, trust badges
- ✅ **Seed Data** — 15 users, 25 listings, 20 bookings, 30 reviews

## Demo Accounts (after seeding)

| Role | Email | Persona |
|------|-------|---------|
| Provider | maya@university.edu | "Maya Chen" — 4.8★, 12 completed gigs |
| Requester | jordan@university.edu | "Jordan Rivera" — Freshman, first-time user |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npx tsx scripts/seed.ts  # Seed demo data
```

## Post-Hackathon Roadmap

- [ ] Row Level Security (RLS) policies on all tables
- [ ] Real Stripe Connect Express for provider payouts
- [ ] Double-blind review reveal logic
- [ ] OpenAI content moderation
- [ ] Stripe Identity for ID verification (Tier 2)
- [ ] Dispute resolution workflow
- [ ] Notification system (in-app + email)
- [ ] React Native mobile app

## License

MIT — Built for a hackathon. Use freely.
