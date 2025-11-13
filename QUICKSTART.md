# Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get Google Maps API Key:**
   - Go to https://console.cloud.google.com/
   - Create a project
   - Enable "Maps JavaScript API" and "Directions API"
   - Create an API key
   - Copy the key

3. **Create `.env.local` file:**
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Go to http://localhost:3000

## Using the App

### 1. Browse Suggestions
- The app comes with 40+ pre-loaded Istanbul attractions
- Use the search bar to find Reddit recommendations
- Filter by category or neighborhood

### 2. Add Activities
- Click "Add to Itinerary" on any suggestion
- Or manually add activities with the "Add Activity" button
- Edit activities by clicking the edit icon

### 3. Plan Routes
- Add at least 2 activities to a day
- Routes automatically calculate between activities
- Toggle between Walking, Transit, or Taxi/Driving routes

### 4. View on Map
- All activities appear as markers on the map
- Red marker = Taks-inn Hotel (your starting point)
- Green markers = Activities
- Routes are shown as colored lines

### 5. Track Budget
- Set your total budget
- Add expenses as you plan
- See remaining budget and spending breakdown

### 6. Save & Export
- All data saves automatically to your browser
- Export to JSON for backup or sharing
- Import previously exported trips

## Tips

- **Friday-Tuesday Structure**: The app is pre-configured for a 5-day trip
- **Hotel Location**: Taks-inn Hotel is set as the starting point for routes
- **Sultanahmet Group**: Hagia Sophia, Topkapi, Blue Mosque, and Yerebatan are all close together
- **Asian Side**: Requires a full day due to traffic
- **Princes' Islands**: Great day trip option if you have time

## Troubleshooting

**Map not showing?**
- Check that your Google Maps API key is set in `.env.local`
- Make sure "Maps JavaScript API" is enabled in Google Cloud Console

**Routes not calculating?**
- Ensure "Directions API" is enabled in Google Cloud Console
- Check browser console for errors

**Data not saving?**
- Check browser localStorage is enabled
- Try clearing browser cache and reloading

## Deploy to Vercel

1. Push code to GitHub
2. Import in Vercel
3. Add environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Deploy!

