# Supabase Setup Guide - Cross-Device Sync

## Overview

Supabase enables **real-time sync** between your devices and your girlfriend's device. No authentication needed - just share the trip link!

## Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to https://app.supabase.com
2. Sign up with your email (free tier available)
3. Create a new project
   - Name: "Istanbul Trip Planner" (or any name)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose closest to you
   - Wait 2-3 minutes for project to be created

### Step 2: Get Your API Keys
1. In your Supabase project, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Run Database Schema
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` from your project
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Step 4: Enable Realtime
1. Go to **Database** → **Replication** (left sidebar)
2. Find the `trips` table
3. Toggle **Enable Realtime** to ON
4. Save

### Step 5: Configure Row Level Security
The SQL schema already sets up a policy that allows all operations (since no auth). Verify:
1. Go to **Authentication** → **Policies**
2. You should see "Allow all operations on trips" policy
3. If not, the SQL schema will create it

### Step 6: Add to Your App
1. Create or edit `.env.local` in your project root
2. Add these lines:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Replace with your actual values from Step 2
4. Restart your dev server: `npm run dev`

### Step 7: Test It
1. Open the app
2. You should see a green banner: "✓ Cloud sync enabled"
3. Make a change (add an activity)
4. Wait 1-2 seconds
5. Check Supabase dashboard → **Table Editor** → `trips` table
6. You should see your trip data!

---

## How to Share with Your Girlfriend

### Option 1: Share Link (Easiest)
1. Click the **"Share"** button in the trip header
2. The link is copied to your clipboard
3. Send it to your girlfriend via text/email
4. When she opens the link, she'll see the same trip
5. Changes sync automatically in real-time!

### Option 2: Manual Share
1. Your trip ID is: `istanbul-trip-2025` (or check the URL)
2. Share this link: `https://your-app-url.com?trip=istanbul-trip-2025`
3. Replace `your-app-url.com` with your actual URL

---

## How It Works

- **Automatic Sync**: Changes save to Supabase automatically (1 second delay)
- **Real-time Updates**: When one person makes a change, the other sees it instantly
- **Local Backup**: Everything also saves to localStorage as backup
- **No Conflicts**: Last write wins (simple conflict resolution)
- **Offline Support**: Works offline, syncs when back online

---

## Troubleshooting

### "Cloud sync enabled" banner not showing
- Check `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding keys
- Check browser console for errors

### Changes not syncing
- Check Supabase dashboard → **Table Editor** → `trips` table
- Verify the table exists and has data
- Check browser console for errors
- Verify Realtime is enabled (Database → Replication)

### "Error syncing trip" message
- Check your Supabase project is active (not paused)
- Verify API keys are correct
- Check Supabase dashboard for error logs
- Try refreshing the page

### Real-time updates not working
- Go to **Database** → **Replication** in Supabase
- Make sure `trips` table has Realtime enabled
- Check browser console for WebSocket errors
- Try refreshing both devices

### Can't see shared trip
- Verify the trip ID in the URL matches
- Check Supabase dashboard → `trips` table for the trip
- Make sure the person sharing clicked "Save" first

---

## Supabase Free Tier

**Generous free tier includes:**
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth/month
- ✅ Real-time subscriptions
- ✅ Unlimited API requests

**For a trip planner, this is more than enough!**

---

## Security Note

Since we're not using authentication, **anyone with the trip link can view/edit it**. This is perfect for sharing with your girlfriend, but:
- Don't share the link publicly
- The trip ID is in the URL, so keep URLs private
- For more security, you could add authentication later

---

## Database Schema

The `trips` table stores:
- `id`: Unique trip identifier
- `name`: Trip name
- `start_date`, `end_date`: Trip dates
- `days`: JSON object with all days and activities
- `budget`: JSON object with budget and expenses
- `notes`: Trip notes
- `hotel_location`: Hotel coordinates
- `created_at`, `updated_at`: Timestamps

Everything is stored as JSON for flexibility.

---

## Next Steps

1. ✅ Set up Supabase (follow steps above)
2. ✅ Add API keys to `.env.local`
3. ✅ Test sync locally
4. ✅ Share link with your girlfriend
5. ✅ Plan your trip together! 🎉

---

## Need Help?

- Check Supabase dashboard for errors
- Check browser console (F12) for client errors
- Verify SQL schema ran successfully
- Make sure Realtime is enabled
- Check `.env.local` has correct keys

**You're all set for collaborative trip planning!** 🗺️✈️

