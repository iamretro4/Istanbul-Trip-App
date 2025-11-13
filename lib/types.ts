export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  location: Location;
  category: ActivityCategory;
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
  notes?: string;
  cost?: number;
  photo?: string; // base64 encoded
  website?: string;
  neighborhood?: string;
}

export type ActivityCategory = 
  | 'sightseeing'
  | 'food'
  | 'nightlife'
  | 'shopping'
  | 'bazaar'
  | 'landmark'
  | 'museum'
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'transport'
  | 'other';

export interface Day {
  date: string;
  activities: Activity[];
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: Record<string, Day>;
  budget: {
    total: number;
    expenses: Expense[];
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
  hotelLocation?: Location;
}

export interface Expense {
  id: string;
  activityId?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  location?: Location;
  category: ActivityCategory;
  neighborhood?: string;
  source: 'reddit' | 'web' | 'preloaded';
  sourceUrl?: string;
  upvotes?: number;
  comments?: number;
  rating?: number;
  tags?: string[];
}

export interface Route {
  id: string;
  fromActivityId: string;
  toActivityId: string;
  mode: RouteMode;
  distance: number; // in meters
  duration: number; // in seconds
  steps: RouteStep[];
  polyline?: string;
}

export type RouteMode = 'WALKING' | 'TRANSIT' | 'DRIVING';

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface StorageSchema {
  trips: Record<string, Trip>;
  suggestions: Record<string, Suggestion[]>;
  lastSearchQueries: string[];
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
}

