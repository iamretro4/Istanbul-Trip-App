# Google Maps API Setup Guide

## Do You Need Supabase?

**NO, you do NOT need Supabase!** 

This app uses **localStorage** (browser storage) to save all your trip data locally on your device. Supabase would only be needed if you wanted to:
- Share trips between multiple devices
- Sync data to the cloud
- Have a backend database

For a personal trip planner, localStorage is perfect and requires no setup!

---

## Getting Your Google Maps API Key (FREE)

### Step 1: Create a Google Cloud Account
1. Go to https://console.cloud.google.com/
2. Sign in with your Google account (or create one)
3. Accept the terms if prompted

### Step 2: Create a New Project
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click "New Project"
3. Name it: "Istanbul Trip Planner" (or any name)
4. Click "Create"
5. Wait a few seconds, then select your new project from the dropdown

### Step 3: Enable Required APIs
1. In the search bar at the top, type "Maps JavaScript API"
2. Click on "Maps JavaScript API"
3. Click the blue "Enable" button
4. Wait for it to enable

5. Go back to the search bar and type "Directions API"
6. Click on "Directions API"
7. Click the blue "Enable" button
8. Wait for it to enable

### Step 4: Create API Key
1. In the left sidebar, click "APIs & Services" → "Credentials"
2. Click the blue "+ CREATE CREDENTIALS" button at the top
3. Select "API key"
4. Your API key will be created! Copy it immediately

### Step 5: Restrict Your API Key (IMPORTANT for Security)
1. Click on your newly created API key
2. Under "API restrictions", select "Restrict key"
3. Check these two boxes:
   - ✅ Maps JavaScript API
   - ✅ Directions API
4. Under "Application restrictions", select "HTTP referrers (web sites)"
5. Click "Add an item"
6. Add these referrers:
   - `http://localhost:3000/*` (for local development)
   - `https://your-vercel-url.vercel.app/*` (if deploying to Vercel)
   - `http://localhost/*` (optional, for any local port)
7. Click "Save"

### Step 6: Add API Key to Your App
1. In your project folder, create a file named `.env.local`
2. Add this line:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with the actual key you copied
4. Save the file

### Step 7: Test It
1. Run `npm run dev`
2. Open http://localhost:3000
3. The map should load! If you see an error, check:
   - API key is correct in `.env.local`
   - Both APIs are enabled
   - You restarted the dev server after adding the key

---

## Google Maps Pricing (FREE Tier)

**Good News:** Google Maps has a generous free tier!

- **$200 free credit per month** (enough for most personal use)
- Maps JavaScript API: Free for up to 28,000 map loads/month
- Directions API: Free for up to 40,000 requests/month

For a trip planner app, you'll likely stay well within the free tier unless you have thousands of users.

**To avoid charges:**
1. Set up billing alerts in Google Cloud Console
2. Set a budget limit (e.g., $5/month)
3. Monitor usage in the "APIs & Services" → "Dashboard" section

---

## Troubleshooting

### "This page can't load Google Maps correctly"
- Check your API key is correct in `.env.local`
- Make sure you restarted the dev server (`npm run dev`)
- Verify both APIs are enabled in Google Cloud Console
- Check browser console for specific error messages

### "RefererNotAllowedMapError"
- Your API key restrictions are too strict
- Add `http://localhost:3000/*` to HTTP referrers
- Or temporarily remove restrictions to test

### "API key not valid"
- Make sure the key starts with `AIza...`
- Check for extra spaces or characters
- Verify the key is active in Google Cloud Console

### Map loads but routes don't work
- Make sure "Directions API" is enabled (not just Maps JavaScript API)
- Check browser console for errors

---

## For Vercel Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add:
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your API key
4. Update your API key restrictions in Google Cloud to include your Vercel URL
5. Redeploy your app

---

## Summary

✅ **No Supabase needed** - localStorage is perfect for this app  
✅ **Google Maps API is FREE** for personal use (up to $200/month credit)  
✅ **5-minute setup** - Just enable APIs, create key, add to `.env.local`  
✅ **Secure** - Restrict your API key to prevent unauthorized use

You're all set! 🎉

