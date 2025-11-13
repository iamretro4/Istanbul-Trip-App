# Supabase Quick Start - 5 Minutes

## What You Get
✅ Real-time sync between your devices and your girlfriend's device  
✅ No authentication needed - just share a link  
✅ Automatic backup to cloud  
✅ Works offline, syncs when online  

---

## Setup Steps

### 1. Create Supabase Account (2 min)
- Go to https://app.supabase.com
- Sign up (free)
- Create new project → Wait 2 minutes

### 2. Get API Keys (1 min)
- Settings → API
- Copy **Project URL** and **anon public** key

### 3. Run Database Schema (1 min)
- SQL Editor → New Query
- Copy/paste contents of `supabase-schema.sql`
- Click Run

### 4. Enable Realtime (30 sec)
- Database → Replication
- Toggle ON for `trips` table

### 5. Add to App (30 sec)
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url_here
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
  ```
- Restart: `npm run dev`

---

## Share with Your Girlfriend

1. Click **"Share"** button (top right)
2. Link is copied automatically
3. Send it to her
4. She opens link → sees your trip
5. Changes sync automatically! ✨

---

## That's It!

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.

**Free tier is generous - perfect for personal use!** 🎉

