# Quad — Hackathon Task Tracker

> Sequential critical path. No parallel phases — one person or a small team works through this top-to-bottom. Each phase has an hour estimate. If you're behind, cut from the bottom, never from the top.

---

## Sprint 0: Scaffold & Schema (~2 hrs) — ✅ COMPLETE
- `[x]` `npx create-next-app@latest ./ --ts --app --tailwind --eslint --src-dir`
- `[x]` Install deps: `@supabase/supabase-js`, `@supabase/ssr`, `framer-motion`, `shadcn/ui` (init + add button, card, input, dialog, badge, avatar, select, tabs, textarea, dropdown-menu, separator)
- `[x]` Create Supabase project → grab `SUPABASE_URL` + `SUPABASE_ANON_KEY` → `.env.local`
- `[x]` Run full SQL schema in Supabase SQL Editor (copy from scripts/schema.sql)
- `[x]` Generate TypeScript types: `supabase gen types typescript --project-id <id> > src/lib/database.types.ts`
- `[x]` Create Supabase client helpers (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- `[x]` Setup `src/app/globals.css` with Dark Glass design tokens
- `[ ]` Deploy to Vercel with env vars → confirm blank site loads at production URL

## Sprint 1: Auth + Profile (~2.5 hrs) — 🚀 IN PROGRESS
- `[x]` **Auth pages**: `/login` and `/register` with Supabase email/password auth
- `[x]` **`.edu` gate**: Validate email ends in `.edu` on the register Server Action (reject others)
- `[x]` **Auth middleware**: Protect `/dashboard/*` routes, redirect unauthenticated users
- `[x]` **Profile setup**: On first login, redirect to `/onboarding` → collect name, major, class year, avatar (Supabase Storage upload), bio, skills
- `[x]` **Profile page**: `/profile/[id]` — public view with avatar, bio, skills, stats, reviews, portfolio
- `[x]` **Shared components**: `<GlassCard>`, `<TrustBadge>`, `<RatingStars>`, `<UserAvatar>`, `<CategoryBadge>`

## Sprint 2: Marketplace & Browse (~3 hrs) — ✅ COMPLETE
- `[x]` **Landing page** (`/`): Hero section with gradient text + CTA, animated category grid (staggered load), trust stats counter, "How it Works" section
- `[x]` **Create listing**: `/dashboard/listings/new` — form with title, description, category, price, pricing type, image upload
- `[x]` **Browse page**: `/browse` — grid of active listings with `<GlassCard>`, category filter, search bar (Supabase `tsvector`), sort by rating/price/newest
- `[x]` **Listing detail**: `/listing/[id]` — full description, provider mini-profile, "Book Now" button, reviews section
- `[x]` **Task board**: `/tasks` — list of open task requests, post new task form at `/dashboard/tasks/new`
- `[x]` **Card hover animation**: Apply `translateY(-4px)` lift + accent border glow on all listing cards

## Sprint 3: Booking + Payments (~2.5 hrs) — ✅ COMPLETE
- `[x]` **Stripe setup**: Create Stripe account, get test keys → `.env.local`
- `[x]` **Booking Server Action**: Create booking record (status: `pending`) → create Stripe Checkout Session → redirect requester to Stripe
- `[x]` **Success page**: `/booking/success?session_id=...` — confirm payment, update booking status to `confirmed`
- `[x]` **Webhook handler**: `/api/webhooks/stripe` — listen for `checkout.session.completed`, update `payments` table
- `[x]` **Provider view**: `/dashboard/bookings` — see incoming bookings, "Mark Complete" button
- `[x]` **Requester confirm**: Once provider marks complete → requester gets "Confirm & Release Payment" button → updates `wallet_balance` on provider's profile
- `[x]` **Booking status flow**: `pending → confirmed → in_progress → completed`

## Sprint 4: Real-Time Chat (~2 hrs) — ✅ COMPLETE
- `[x]` **Conversation creation**: Auto-create conversation when booking is confirmed
- `[x]` **Chat UI**: `/dashboard/messages/[conversationId]` — message list + input, scrolls to bottom
- `[x]` **Supabase Realtime**: Subscribe to `INSERT` on `messages` table filtered by `conversation_id`
- `[x]` **Send message**: Server Action inserts into `messages` → Realtime pushes to other participant
- `[x]` **Chat list**: `/dashboard/messages` — list of all conversations with last message preview
- `[x]` **Two-tab test**: Open two browser windows, send messages, confirm instant delivery

## Sprint 5: Reviews + Trust + Dashboard (~2 hrs) — ✅ COMPLETE
- `[x]` **Review form**: After booking is `completed`, show review form (1-5 stars, comment, structured tags)
- `[x]` **Review display**: Show reviews on provider's profile page and listing detail page
- `[x]` **Trust score recalc**: After review submission, update `avg_rating` and `completed_gigs` on `profiles`
- `[x]` **Dashboard**: `/dashboard` — earnings summary (total, this month), active bookings list, recent reviews, wallet balance
- `[x]` **Trust badges**: Display tier badge (New / Rising / Trusted / Top Rated) based on `completed_gigs` + `avg_rating` thresholds

## Sprint 6: Seed Data + Demo Polish (~2 hrs) — ✅ COMPLETE
- `[x]` **Write seed script** (`scripts/seed.ts`): 15 users, 25 listings across all categories, 10 task requests, 20 bookings, 30 reviews, 5 conversations with messages
- `[x]` **Hero demo accounts**: Pre-configure "Maya Chen" (provider, 4.8★, 12 gigs) and "Jordan Rivera" (requester, freshman)
- `[x]` **Page transitions**: Add Framer Motion `AnimatePresence` with fade + slide on route changes
- `[x]` **Mobile responsive**: Test and fix all pages at 375px viewport width
- `[x]` **Loading states**: Add skeleton loaders on browse page and profile page
- `[x]` **Final deploy**: Push to Vercel, run seed against production Supabase, test full demo flow end-to-end

---

## Total Estimated: ~16 hours

---

## Post-Hackathon: Hardening (Week 1)
- `[ ]` Add Row Level Security (RLS) policies to all Supabase tables
- `[ ]` Replace simulated wallet with real Stripe Connect Express
- `[ ]` Implement double-blind review logic (reveal only when both submitted or after 14 days)
- `[ ]` Add OpenAI moderation on listing/profile text
- `[ ]` Error boundaries, proper 404/500 pages, Sentry integration
- `[ ]` Implement `.edu` email verification link (not just domain check)

## Post-Hackathon: Growth (Weeks 2-4)
- `[ ]` Stripe Identity for ID verification (Tier 2)
- `[ ]` Dispute resolution workflow with evidence submission
- `[ ]` Personal analytics dashboard (earnings charts, rating trends)
- `[ ]` Referral system (credit on first completed gig, not signup)
- `[ ]` Campus-wide trending categories dashboard
- `[ ]` Notification system (in-app + email via Resend)
- `[ ]` React Native (Expo) mobile app sharing the same Supabase backend
