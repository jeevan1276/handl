# Supabase Setup Instructions for Sprint 0

## Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up (or login)
2. Click "New Project"
3. Enter project name: `handl` (or your preference)
4. Set a strong database password (save this somewhere secure)
5. Select your region (US recommended for lowest latency)
6. Click "Create new project" and wait ~1-2 minutes

## Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (under "Project API keys") → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Create .env.local
Create a `.env.local` file in the project root (d:\Github\handl\):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run the Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Paste the entire contents of `scripts/schema.sql`
4. Click "Run" (▶ button)
5. Wait for the schema to complete (you should see "Done" message)

## Step 5: Generate TypeScript Types
Once schema is created, run in terminal:
```bash
npm install -g supabase
supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
```

Replace `your-project-id` with the ID from your project URL (the part between `.co/` and `.supabase`).

## Step 6: Test the Connection
Start the dev server:
```bash
npm run dev
```
Visit http://localhost:3000 and check the console for any Supabase errors.
