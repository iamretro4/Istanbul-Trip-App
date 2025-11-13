# Istanbul Trip Planner

A modern web application for planning your trip to Istanbul with interactive maps, route planning, and local suggestions from Reddit and the web.

## Features

- 📍 **Interactive Maps** - View all activities on Google Maps with route planning
- 🗺️ **Route Planning** - Calculate walking, transit, or driving routes between activities
- 🔍 **Smart Suggestions** - Search r/istanbul and the web for local recommendations
- 📅 **Day-by-Day Planning** - Organize activities by day with times and durations
- 💰 **Budget Tracker** - Track expenses and manage your trip budget
- ☁️ **Cloud Sync** - Share your trip with others via Supabase (optional)
- 📱 **Mobile Optimized** - Fully responsive design for all devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Google Maps API** - Interactive maps and directions
- **Supabase** - Real-time database and sync (optional)
- **date-fns** - Date manipulation
- **lucide-react** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iamretro4/Istanbul-Trip-App.git
cd Istanbul-Trip-App
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key (optional)
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables (see below)
4. Deploy!

## Environment Variables for Vercel

Add these in your Vercel project settings:

### Required:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps JavaScript API key

### Optional (for cloud sync):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## License

MIT
