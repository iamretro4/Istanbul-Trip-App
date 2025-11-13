import { Trip, Suggestion, StorageSchema } from './types';

const STORAGE_KEY = 'istanbul-trip-planner';
const SUGGESTIONS_CACHE_KEY = 'suggestions-cache';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getStorage(): StorageSchema {
  if (typeof window === 'undefined') {
    return { trips: {}, suggestions: {}, lastSearchQueries: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  return { trips: {}, suggestions: {}, lastSearchQueries: [] };
}

export function saveStorage(data: StorageSchema): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getTrips(): Record<string, Trip> {
  const storage = getStorage();
  return storage.trips || {};
}

export function getTrip(tripId: string): Trip | null {
  const trips = getTrips();
  return trips[tripId] || null;
}

export function saveTrip(trip: Trip): void {
  const storage = getStorage();
  storage.trips = storage.trips || {};
  storage.trips[trip.id] = {
    ...trip,
    updatedAt: new Date().toISOString(),
  };
  saveStorage(storage);
}

export function deleteTrip(tripId: string): void {
  const storage = getStorage();
  if (storage.trips) {
    delete storage.trips[tripId];
    saveStorage(storage);
  }
}

export function getCachedSuggestions(query: string): Suggestion[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cache = localStorage.getItem(SUGGESTIONS_CACHE_KEY);
    if (!cache) return null;

    const cacheData = JSON.parse(cache);
    const cached = cacheData[query.toLowerCase()];

    if (cached && cached.timestamp) {
      const age = Date.now() - cached.timestamp;
      if (age < MAX_CACHE_AGE) {
        return cached.suggestions;
      } else {
        // Remove expired cache
        delete cacheData[query.toLowerCase()];
        localStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify(cacheData));
      }
    }
  } catch (error) {
    console.error('Error reading suggestions cache:', error);
  }

  return null;
}

export function cacheSuggestions(query: string, suggestions: Suggestion[]): void {
  if (typeof window === 'undefined') return;

  try {
    const cache = localStorage.getItem(SUGGESTIONS_CACHE_KEY);
    const cacheData = cache ? JSON.parse(cache) : {};
    
    cacheData[query.toLowerCase()] = {
      suggestions,
      timestamp: Date.now(),
    };

    localStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching suggestions:', error);
  }
}

export function getLastSearchQueries(): string[] {
  const storage = getStorage();
  return storage.lastSearchQueries || [];
}

export function addSearchQuery(query: string): void {
  const storage = getStorage();
  storage.lastSearchQueries = storage.lastSearchQueries || [];
  
  // Remove if already exists and add to front
  const index = storage.lastSearchQueries.indexOf(query);
  if (index > -1) {
    storage.lastSearchQueries.splice(index, 1);
  }
  storage.lastSearchQueries.unshift(query);
  
  // Keep only last 10
  storage.lastSearchQueries = storage.lastSearchQueries.slice(0, 10);
  
  saveStorage(storage);
}

export function exportTrips(): string {
  const trips = getTrips();
  return JSON.stringify(trips, null, 2);
}

export function importTrips(jsonString: string): { success: boolean; error?: string } {
  try {
    const imported = JSON.parse(jsonString);
    
    if (typeof imported !== 'object' || Array.isArray(imported)) {
      return { success: false, error: 'Invalid format. Expected an object with trips.' };
    }

    const storage = getStorage();
    storage.trips = { ...storage.trips, ...imported };
    saveStorage(storage);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Invalid JSON format.' };
  }
}

