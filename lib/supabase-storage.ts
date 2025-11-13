import { supabase, isSupabaseConfigured } from './supabase';
import { Trip, Activity, Expense } from './types';
import { saveTrip as saveLocalTrip, getTrip as getLocalTrip, getTrips as getLocalTrips } from './storage';

// Sync trip to Supabase
export async function syncTripToSupabase(trip: Trip): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage if Supabase not configured
    saveLocalTrip(trip);
    return { success: true };
  }

  try {
    // Upsert trip (insert or update)
    const { error } = await supabase!
      .from('trips')
      .upsert({
        id: trip.id,
        name: trip.name,
        start_date: trip.startDate,
        end_date: trip.endDate,
        days: trip.days,
        budget: trip.budget,
        notes: trip.notes,
        hotel_location: trip.hotelLocation,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error syncing trip to Supabase:', error);
      // Fallback to localStorage on error
      saveLocalTrip(trip);
      return { success: false, error: error.message };
    }

    // Also save locally as backup
    saveLocalTrip(trip);
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing trip:', error);
    saveLocalTrip(trip);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Get trip from Supabase
export async function getTripFromSupabase(tripId: string): Promise<Trip | null> {
  if (!isSupabaseConfigured()) {
    return getLocalTrip(tripId);
  }

  try {
    const { data, error } = await supabase!
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error) {
      console.error('Error fetching trip from Supabase:', error);
      // Fallback to localStorage
      return getLocalTrip(tripId);
    }

    if (!data) {
      return getLocalTrip(tripId);
    }

    // Convert Supabase format to Trip format
    const trip: Trip = {
      id: data.id,
      name: data.name,
      startDate: data.start_date,
      endDate: data.end_date,
      days: data.days || {},
      budget: data.budget || { total: 0, expenses: [] },
      notes: data.notes || '',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      hotelLocation: data.hotel_location,
    };

    // Also save locally for offline access
    saveLocalTrip(trip);
    return trip;
  } catch (error: any) {
    console.error('Error fetching trip:', error);
    return getLocalTrip(tripId);
  }
}

// Subscribe to trip changes (real-time sync)
export function subscribeToTrip(
  tripId: string,
  callback: (trip: Trip | null) => void
): () => void {
  if (!isSupabaseConfigured()) {
    // If Supabase not configured, just return local trip
    const trip = getLocalTrip(tripId);
    callback(trip);
    return () => {}; // No-op unsubscribe
  }

  // Set up real-time subscription
  const channel = supabase!
    .channel(`trip:${tripId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trips',
        filter: `id=eq.${tripId}`,
      },
      async (payload) => {
        console.log('Trip updated:', payload);
        // Fetch the updated trip
        const updatedTrip = await getTripFromSupabase(tripId);
        callback(updatedTrip);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase!.removeChannel(channel);
  };
}

// Delete trip from Supabase
export async function deleteTripFromSupabase(tripId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase!
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Get shareable link for trip
export function getTripShareLink(tripId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}?trip=${tripId}`;
}

