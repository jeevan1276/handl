# handl — Campus Services Marketplace
**Product Requirements Document**

Version 1.0 (Draft) · August 29, 2026 · Status: For Review

*"handl" is a working name — a nod to the campus quad as the traditional center of student life and commerce. Rename freely.*

---

## Table of Contents
1. Executive Summary
2. Problem Statement
3. Goals & Success Metrics
4. Users & Personas
5. Five Core Questions — Strategic Answers
6. Product Requirements
7. Growth & Engagement Features
8. Business Model
9. Roadmap & MVP Scope
10. Risks & Mitigations
11. Open Questions

---

## 1. Executive Summary

handl is a campus-only marketplace where students turn skills into income and get everyday tasks done by someone they can actually trust — a verified, rated, accountable peer, not an anonymous name at the bottom of a 200-message group chat.

It replaces the current default (GroupMe, Discord, Facebook groups, paper flyers, word of mouth) with one structured layer for campus commerce: searchable profiles and listings, escrow-protected payments, and a reputation system that follows a student across their entire time on campus.

The wedge is **trust**: because every user is verified against a .edu email (with optional deeper ID verification), and every reputation is public, durable, and hard to fake, handl can support higher-value and higher-frequency transactions than any open group chat ever could. The moat, once a campus reaches critical mass, is **liquidity + data**: handl becomes the fastest way to find or offer almost anything on campus, and the resulting picture of the informal campus economy becomes something the university itself will pay to see.

---

## 2. Problem Statement

Two broken markets sit on every campus at once:

- **Supply side** — students with real, marketable skills (tutoring, design, code, photography, editing, moving, bike repair, hair braiding) have no reliable way to find paying customers beyond their own friend group.
- **Demand side** — students who need something done burn real time and take on real risk: scrolling old group-chat messages, posting into a Facebook group with forty replies and no way to tell who's actually reliable, or hoping a bulletin-board flyer is still current.

The channels that exist today were built for conversation, not commerce:

| Channel | Why it fails as a marketplace |
|---|---|
| GroupMe / Discord / class group chats | Unsearchable, no persistent identity, no reputation, messages scroll away |
| Facebook groups | No trust signal beyond mutual friends, no payment protection, spam-prone |
| Paper flyers / bulletin boards | No accountability, easily out of date, zero reach beyond foot traffic |
| Word of mouth | Doesn't scale past a friend group; great providers stay undiscovered |
| General platforms (TaskRabbit, Fiverr, Upwork) | Not campus-specific, no .edu trust layer, priced/designed for adults or global freelance competition, no portfolio tied to student life |

The result is a large informal campus economy that is inefficient, occasionally unsafe (unverified in-person meetups, no-shows, non-payment), and completely invisible — nobody, including the university, has a real picture of how big it is or where the gaps are.

---

## 3. Goals & Success Metrics

**Business goals**
- Become the default first move for both "I need this done" and "I want to earn money" moments on campus.
- Reach durable two-sided liquidity on one beachhead campus before expanding to a second.
- Build a reputation graph and activity dataset valuable enough that students *and* university administration are willing to pay for what it enables.

**North Star Metric:** *Weekly Completed Gigs* — counted only once payment has cleared escrow and both sides have rated each other. This ties growth directly to trust and follow-through, not just posting volume.

**Supporting metrics**

| Category | Metric |
|---|---|
| Supply health | Active providers, listings per provider, provider W1/W4 retention, median response time |
| Demand health | Active requesters, repeat-booking rate, time-to-first-match |
| Marketplace health | % of gigs filled within 48h ("liquidity"), GMV, take-rate revenue |
| Trust health | Verification rate, average rating, dispute rate, dispute resolution time |
| Growth | % of enrolled students registered ("campus penetration"), referral/viral coefficient, CAC vs. LTV |

**Non-goals for v1**
- Not a full-time recruiting platform — that's what Handshake and LinkedIn already do well.
- Not a general secondhand-goods marketplace — that's Facebook Marketplace's job.
- Not multi-campus at launch. One beachhead campus first; expand deliberately (see Section 8).

---

## 4. Users & Personas

| | The Provider — "Maya" | The Requester — "Jordan" |
|---|---|---|
| Who they are | Junior, CS major, tutors Calc/intro CS and does freelance web design on the side | Freshman, constantly needs *something* and doesn't yet know who on campus to trust |
| What they want | Turn spare hours into real income, and build a portfolio she can point to for internships | Get something done fast and reliably, without DMing ten people in a group chat |
| What scares them off | Doing the work and not getting paid; being lowballed; unsafe first meetups with strangers | Getting scammed, no-showed, or receiving low-quality work with no recourse |
| They win when... | The right people discover her, she's paid on time every time, and her rating + portfolio become resume-worthy proof of real experience | She can find, vet, and book someone in minutes, and knows she's protected if something goes wrong |

A third, lighter-weight persona sits alongside these two: the **Campus Partner** — a student org needing an event photographer, or a local café wanting a few hours of flyering or social help. This segment doesn't drive the MVP but matters for the business model (Section 8) and for diversifying demand beyond pure peer-to-peer.

---

## 5. Five Core Questions — Strategic Answers

Short answers here; full specs are cross-referenced into Section 6-8.

### How can students easily discover opportunities on campus?
- Two-directional discovery: requesters browse a **service catalog** of provider listings, and providers browse an open **task board** of posted requests (Section 6.2).
- A personalized, AI-ranked "For You" feed based on major, dorm, class year, and past activity, plus real-time alerts for hyper-relevant matches ("Someone in your building needs Calc tutoring tonight").
- Meet students where they already are: a lightweight bot that surfaces top open gigs into class group chats, dorm Discords, and org Slacks, rather than fighting for a new app tab.
- Physical touchpoints (QR posters at dining halls, libraries, orientation) and a weekly digest push/email.
- Natural-language smart search (Section 7) — "who can fix my bike before Saturday" resolves straight to a ranked shortlist.

### How can trust be built between people who have never met?
- **Identity:** mandatory .edu verification for anyone transacting, with an optional ID + selfie tier for higher-value or in-person gigs (Section 6.3).
- **Reputation:** two-way, double-blind ratings with structured tags, unlockable only after payment has actually cleared — so reviews can't be faked by people who never transacted.
- **Money:** in-app escrow holds the requester's payment from booking to confirmed completion, so "will I get paid" and "will they deliver" both have a real backstop.
- **Social proof:** mutual-connection surfacing ("3 people from your dorm have booked Maya") and campus-role badges (RA, TA, club officer) that import real-world social trust into the app.
- **Safety mechanics:** public-meetup suggestions, opt-in location sharing for first-time in-person gigs, and a 24/7 report/safety flow.

### How can students showcase their skills and past work?
- A rich profile: skills, rate, availability calendar, portfolio uploads (images, PDFs, links to GitHub/Behance/personal sites), and an optional 30-second video intro.
- Objective performance stats displayed alongside the portfolio: completed-gig count, on-time rate, response time, repeat-client rate.
- Earned badges (Top Rated, Rising Talent, category mastery) layered on top of self-reported skills, so credibility is visible at a glance.
- A shareable public profile link students can drop into a resume or LinkedIn — which doubles as a quiet growth loop for handl itself.

### What incentives keep users active and engaged?
- The primary incentive is real, and the platform should never obscure that: **money**, paid reliably and quickly.
- Career capital: a portfolio and rating history that's genuinely useful outside handl, not just inside it.
- Light, opt-in gamification — milestone badges, category leaderboards, seasonal challenges (Section 7) — kept intentionally away from manipulative patterns like punishing streaks or pay-to-win visibility.
- Seasonal moments the platform can own: move-in/move-out week, finals-week tutoring surge, formal season styling and photography.
- For requesters specifically: speed and reliability are the reward, reinforced with light loyalty perks for repeat use.

### How could this platform become sustainable as a business?
- A marketplace take rate on completed transactions is the core revenue line, layered with an optional Pro subscription and clearly-labeled promoted listings (Section 8).
- Two additional, higher-margin lines diversify beyond peer-to-peer fees: local business partnerships, and a university/campus B2B relationship built on the Campus Insights data layer (Section 6.4, Section 8).
- Growth follows a deliberate single-campus "beachhead" strategy — concierge-seed supply, partner for early demand, hit a liquidity bar, *then* expand — rather than spreading thin across many campuses at once (Section 8).

---

## 6. Product Requirements

### 6.1 Student Profiles

**Identity & basics** — name, photo, campus, class year, major, .edu verification checkmark, short bio (~150 words).

**Skills & services** — tag-based skills from a maintained taxonomy plus moderated custom tags; hourly and/or flat rate per service; a weekly availability calendar plus an "available now" toggle for urgent same-day gigs.

**Portfolio** — image/video/document uploads, external links (GitHub, Behance, personal site), before/after photos for physical services (room organizing, bike repair, styling).

**Performance stats** (auto-computed, not self-reported) — completed gigs, average rating, response time, on-time rate, repeat-client percentage.

**Reviews** — chronological, filterable, tag-based (see 6.3).

**Trust tier badge** — New / Trusted / Top Rated / handl Pro, plus any earned achievement or campus-role badges (see Section 7).

**Privacy controls** — students choose what's visible to the public web vs. logged-in students only, and can hide exact earnings while still showing rating and completion count.

### 6.2 Gig Marketplace

Two complementary flows, because supply and demand don't always initiate the same way:

- **Service catalog** (provider-initiated, Fiverr-style) — a defined, bookable listing: *"I'll tutor Calc 1 — $25/hr"* or *"I'll design a logo — $50 flat."* Requesters can book instantly or request a custom quote.
- **Task board** (requester-initiated, TaskRabbit-style) — an open request: *"Need help moving boxes Saturday 2pm — $30."* Providers apply or bid; the requester chooses.

**Category taxonomy** (expandable): Academic (tutoring, editing, research help), Creative & Digital (design, photo/video, coding, social media), Errands & Logistics (moving, rides, deliveries, line-sitting), Home & Personal (cleaning, laundry, cooking, pet-sitting), Events (staffing, photography, setup, bartending where 21+ legal), Beauty & Wellness (haircuts/braiding, workout partners), Tech Support (repair, troubleshooting).

**Search & filters** — category, price range, rating, distance/building, availability, "verified only," "available now."

**Messaging** — in-app chat only until a booking is made; no external contact info exchanged pre-booking, which keeps the transaction (and the trust/payment protections around it) on-platform.

**Booking & payment**
1. Requester posts a gig or books a listing; funds are authorized and held in escrow once a provider is confirmed.
2. The gig happens.
3. Provider marks it complete; requester confirms (or it auto-confirms after 48 hours if no dispute is raised); escrow releases to the provider's in-app wallet.
4. Provider withdraws to a bank account or debit card (standard 2–3 day payout free; instant payout for a small fee).

**Completion & disputes** — both sides rate each other to close out a gig. If something goes wrong, either side can flag it: funds stay frozen, both submit evidence, and support resolves it within a set number of business days (full release, partial release, or refund).

### 6.3 Trust & Safety System

**Verification tiers**

| Tier | Requirement | Unlocks |
|---|---|---|
| 0 — Unverified | Any email | Browse only; cannot post or transact |
| 1 — Student Verified | Confirmed .edu email | Post/apply to gigs, message, transact up to a starter value cap |
| 2 — ID Verified | Government ID + selfie liveness check | Uncapped gig value, in-person meetup gigs, "Verified" badge |
| 3 — Campus Verified | Confirmed campus role (RA, TA, club officer, varsity athlete) | Role badge, boosted trust-score weighting, handl Pro fast-track |

**Ratings & reviews**
- Double-blind: neither side sees the other's rating until both have submitted (or 14 days pass), which prevents retaliatory or reciprocal inflation.
- Structured tags ("On time," "Great communicator," "Would rebook," or their negative equivalents) sit alongside free text, making reviews scannable and harder to game with generic praise.
- Reviews only unlock after payment has actually cleared escrow — no reviews from people who never transacted.
- A composite trust score (rating average, recency-weighted volume, completion rate, cancellation rate) is shown as a tier, not a raw number, so it's harder to game and easier to read.

**Safety features** — public, well-known campus locations suggested for first-time in-person meetups; an opt-in "share this meetup" button (time-limited, sent to a friend or handl's safety line); a 24/7 in-app report/safety flow linked to campus security; automatic content moderation on profiles and messages.

**Financial protection** — escrow by default; a "Quad Guarantee" refund path if delivered work doesn't match what was described; fraud monitoring for unusual payment patterns.

**Accountability** — a strike system for no-shows, cancellations, and policy violations, with a transparent, publicly visible completion rate and a clear appeals process.

### 6.4 Campus Insights

**Personal dashboard (every student)** — earnings by week/month/semester, gigs completed, rating and response-time trends, category breakdown, and light comparative insight ("You're in the top 10% of Design providers this month," opt-in only).

**Campus-wide dashboard (public, drives discovery)** — trending categories this week ("Moving help +140% — move-out season"), an opt-in top-rated leaderboard by category (reset periodically so newcomers have a real shot), a live "gigs completed this week" counter, and a demand heatmap by dorm/building for logistics-heavy categories.

**University/admin dashboard (B2B, monetizable — Section 8)** — aggregated and anonymized: informal-economy size and growth, category demand trends useful to career services or student affairs, and safety metrics like dispute rate and resolution time. Individual student activity is never shared without consent; this layer is aggregate-only by design.

---

## 7. Growth & Engagement Features

**AI-powered recommendations** — a personalized discovery feed; a dynamic price-suggestion engine benchmarked against category and campus history; natural-language task parsing so a request like *"need someone to fix my bike before Saturday"* auto-resolves to category, urgency, and deadline; a concierge chatbot for requesters who aren't sure how to categorize their need.

**Smart search & matching** — results ranked on relevance, trust tier, availability, and proximity together, not relevance alone, with a "post it as a task" fallback when no listing is a strong match yet.

**Loyalty & rewards** — points earned per completed gig (both sides), redeemable for a reduced take rate, partner perks, or raffle entries during high-activity weeks; a tiered membership status that resets each semester so it stays attainable for newcomers.

**Campus ambassador program** — one or two paid or Pro-tier-compensated ambassadors per dorm, Greek chapter, or major club, responsible for onboarding events and tabling — and the natural pipeline for concierge-recruiting the first wave of providers (Section 8).

**Referral system** — credit to both referrer and referee, released only after the referee *completes* their first gig, so the reward tracks real activation rather than just sign-ups.

**Student communities** — category-based spaces (e.g. "handl Designers," "handl Tutors") for peer feedback and IRL meetups, plumbed into the Discord/Slack presences students already use rather than forcing a new community app.

**Local business partnerships** — a "handl Perks" discount layer at partner cafés, print shops, and gyms for verified students, plus a channel for local businesses to post their own gigs (flyering, social coverage, event staffing) — a second, non-peer-to-peer demand source.

**Gamification & achievement badges** — milestone badges (first gig, 10/50/100 completed), quality badges (5-star streak, "Would Rebook" above 90%), and seasonal badges ("Finals Week Hero," "Move-In MVP"), all opt-in to display. Kept deliberately light: no punitive streak resets, no pay-to-win trust score, and every promoted listing clearly labeled as such — engagement mechanics should never come at the cost of the trust system they sit next to.

---

## 8. Business Model

**Revenue streams**

| Stream | How it works | Who pays |
|---|---|---|
| Marketplace take rate | A percentage fee on each completed transaction — the core revenue line, in the same broad range peer-to-peer marketplaces have used for years | Provider, optionally split with requester |
| handl Pro subscription | Monthly plan: lower take rate, priority search placement, advanced analytics, instant payout | Provider (opt-in) |
| Promoted listings | Pay to surface at the top of a category, clearly labeled "Promoted" so it never masquerades as a trust signal | Provider (opt-in) |
| Local business partnerships | Sponsorship or per-post fees for gig posts and "handl Perks" discounts | Local business |
| University/campus partnership | Co-branded deployment, official staffing tool for campus events, access to the Campus Insights layer | University department (career services, student affairs, residential life) |
| Aggregated insights add-on | Deeper anonymized trend reporting bundled into the university license | University |

Payments run through established infrastructure (e.g. Stripe Connect) rather than a self-built wallet, which avoids Quad becoming a licensed money transmitter and keeps compliance overhead low in the early stages.

**Cost structure** — payment processing fees, engineering and hosting, trust-and-safety operations (support staff, moderation, dispute resolution — genuinely labor-intensive in the early days), and ambassador-program incentives.

**Go-to-market: the beachhead strategy**
1. Pick one campus — mid-size, dorm-dense, walkable, since geographic density is what makes in-person gigs logistically easy and speeds up liquidity.
2. Concierge-seed supply before public launch: personally recruit 50–100 founding providers across categories and hand-hold their first few gigs, the same cold-start tactic early on-demand marketplaces used.
3. Seed demand through campus-org partnerships — e.g. becoming the official staffing tool for a large student org's events.
4. Launch campus-wide around orientation week, the highest-intent moment on the calendar for new students who suddenly need everything at once.
5. Hold expansion until the campus hits a real liquidity bar (e.g., most posted gigs filled within 48 hours) — resist expanding on vanity sign-up numbers alone.
6. Expand campus-by-campus with a locally-tuned mix (an urban commuter campus leans errands/rides; a residential campus leans in-dorm services), while remote-friendly categories — tutoring, design, coding, editing — start connecting across campuses to add liquidity without needing added geographic density.
7. Long-run durability comes from two compounding layers: an **alumni tier** (graduates keep hiring current students, a segment that's higher-trust and higher-willingness-to-pay), and the **university B2B relationship**, which is sticky, high-margin, and hard for a new entrant to replicate.

---

## 9. Roadmap & MVP Scope

| Phase | Focus | Key features | Exit criteria |
|---|---|---|---|
| 0 — Pre-launch | Seed the market | Concierge-recruit founding providers, 2–3 campus-org demand partnerships, waitlist page | 100+ providers signed up before public launch |
| 1 — MVP | Prove the core loop | Profiles, service catalog + task board, in-app chat, escrow payments, ratings/reviews, .edu verification, search & filters | 70%+ of posted gigs filled within 48h |
| 2 — Growth | Deepen trust & retention | ID verification tier, dispute resolution flow, personal + campus dashboards, referral program, ambassador program, achievement badges | Positive month-over-month active users; repeat-booking rate above ~40% |
| 3 — Scale | Expand & monetize | AI smart-match & natural-language search, handl Pro subscription, promoted listings, local business partnerships, second and third campus launches | Positive contribution margin per campus |
| 4 — Maturity | Durable moat | University B2B insights product, alumni tier, cross-campus liquidity for remote-friendly gigs, loyalty program | Signed university partnership; multi-campus network effects live |

---

## 10. Risks & Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Cold start (no supply → no demand → no supply) | Classic marketplace death spiral | Concierge-seeded founding providers; campus-org demand partnerships; ambassador program |
| In-person meetup safety incident | Real physical risk, and a brand-defining trust risk | Verification tiers, safe-meetup suggestions, opt-in location sharing, 24/7 report flow, fast moderation response |
| Payments & regulatory exposure | Money-transmission and 1099 reporting obligations | Use licensed payment infrastructure (Stripe Connect or equivalent) rather than a self-built wallet; provide clean tax documentation; legal review pre-launch |
| University policy conflict | Solicitation rules or overlap with career services/work-study could get handl restricted on campus | Partner proactively with student affairs/career services rather than launching around them |
| Off-platform disintermediation | Users transact off-app to dodge fees, eroding revenue | Reasonable take rate; make on-platform payment clearly safer via the escrow guarantee; keep enough value (scheduling, portfolio, dispute protection) that going off-platform feels riskier, not cheaper |
| Low-quality or spam listings | Erodes trust across the whole marketplace, not just one listing | New-account rate limits, moderation queue, reputation-gated posting privileges |
| Gamification drifting into dark patterns | User burnout and ethical/brand risk | Opt-in streaks and leaderboards framed around consistency, not loss; clearly labeled promoted listings; no pay-to-win trust score |

---

## 11. Open Questions

- What's the right take rate — flat across categories, or tiered by gig value?
- Build vs. buy for ID verification (Stripe Identity, Persona, Veriff)?
- Which campus is the right beachhead, and what signals (dorm density, walkability, existing informal-economy chatter) should decide it?
- How strict should enforcement be against off-platform payment in the early, low-liquidity days, versus tolerating some of it while the value prop matures?
- Legal classification of high-volume providers — contractor status and tax treatment will need review as individual earnings scale.
- Should handl allow non-enrolled community members (e.g., staff, faculty) at all, or stay strictly scoped to verified enrolled students for v1? *(Recommendation: strictly enrolled students only for v1 — it keeps verification simple and keeps the trust model clean.)*
