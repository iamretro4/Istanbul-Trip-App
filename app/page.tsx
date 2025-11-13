'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Trip, Activity, Suggestion, Expense, RouteMode } from '@/lib/types';
import { format } from 'date-fns';
import { saveTrip, getTrip, exportTrips, importTrips } from '@/lib/storage';
import { syncTripToSupabase, getTripFromSupabase, subscribeToTrip, getTripShareLink } from '@/lib/supabase-storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createDefaultItinerary } from '@/lib/default-itinerary';
import { useToast } from '@/lib/toast';
import TripHeader from '@/components/TripPlanner/TripHeader';
import DayView from '@/components/TripPlanner/DayView';
import ActivityEditor from '@/components/TripPlanner/ActivityEditor';
import SuggestionPanel from '@/components/Suggestions/SuggestionPanel';
import MapContainer from '@/components/Map/MapContainer';
import RoutePlanner from '@/components/Map/RoutePlanner';
import BudgetTracker from '@/components/Features/BudgetTracker';
import Button from '@/components/UI/Button';

export default function Home() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [routeMode, setRouteMode] = useState<RouteMode>('WALKING');
  const [routes, setRoutes] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseEnabled, setSupabaseEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  const handleRoutesCalculated = useCallback((calculatedRoutes: any[]) => {
    setRoutes(calculatedRoutes);
  }, []);

  // Ensure component is mounted before rendering client-only content
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!mounted || typeof window === 'undefined') return;

    // Check if Supabase is configured
    setSupabaseEnabled(isSupabaseConfigured());
    
    const urlParams = new URLSearchParams(window.location.search);
    const tripIdFromUrl = urlParams.get('trip');
    const tripId = tripIdFromUrl || 'istanbul-trip-2025';

    // Load trip from Supabase or localStorage
    const loadTrip = async () => {
      if (isSupabaseConfigured() && tripIdFromUrl) {
        // Load from Supabase if trip ID is in URL (shared trip)
        setIsSyncing(true);
        const loadedTrip = await getTripFromSupabase(tripId);
        if (loadedTrip) {
          setTrip(loadedTrip);
          if (Object.keys(loadedTrip.days).length > 0) {
            setSelectedDay(Object.keys(loadedTrip.days)[0]);
          }
          showToast('Trip loaded from cloud', 'success');
        }
        setIsSyncing(false);
        } else {
        // Load from localStorage
        let loadedTrip = getTrip(tripId);

        // Always create fresh itinerary from tomorrow to Tuesday
        loadedTrip = createDefaultItinerary();
        saveTrip(loadedTrip);

        setTrip(loadedTrip);
        if (Object.keys(loadedTrip.days).length > 0) {
          setSelectedDay(Object.keys(loadedTrip.days)[0]);
        }
      }

      // Set up real-time sync if Supabase is enabled
      if (isSupabaseConfigured()) {
        const unsubscribe = subscribeToTrip(tripId, (updatedTrip) => {
          if (updatedTrip) {
            setTrip(updatedTrip);
            showToast('Trip updated from another device', 'info');
          }
        });

        return () => unsubscribe();
      }
    };

    loadTrip();
  }, [mounted]);

  // Sync trip to Supabase whenever it changes (debounced)
  const tripSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedTripRef = useRef<string>('');
  
  useEffect(() => {
    if (!trip || !isSupabaseConfigured()) return;
    
    // Create a stable key for the trip to prevent duplicate syncs
    const tripKey = JSON.stringify({
      id: trip.id,
      name: trip.name,
      daysCount: Object.keys(trip.days).length,
      activitiesCount: Object.values(trip.days).reduce((sum, day) => sum + day.activities.length, 0),
      updatedAt: trip.updatedAt,
    });
    
    // Skip if already synced
    if (lastSyncedTripRef.current === tripKey) {
      return;
    }
    
    // Clear previous timeout
    if (tripSyncTimeoutRef.current) {
      clearTimeout(tripSyncTimeoutRef.current);
    }
    
    // Set new timeout for debounced sync
    tripSyncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      const result = await syncTripToSupabase(trip);
      if (result.success) {
        lastSyncedTripRef.current = tripKey;
        // Silent sync - don't show toast for every change
      } else {
        showToast('Sync failed, saved locally', 'error');
      }
      setIsSyncing(false);
    }, 2000); // Increased debounce to 2 seconds
    
    return () => {
      if (tripSyncTimeoutRef.current) {
        clearTimeout(tripSyncTimeoutRef.current);
      }
    };
  }, [trip, showToast]);

  // All hooks must be called before any conditional returns
  const allActivities = useMemo(() => {
    if (!trip) return [];
    return Object.values(trip.days).flatMap(day => day.activities);
  }, [trip]);

  // Show loading state until mounted and trip is loaded
  if (!mounted || !trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Loading trip...</p>
          {isSyncing && <p className="text-sm text-blue-600">Syncing with cloud...</p>}
        </div>
      </div>
    );
  }

  const currentDay = trip.days[selectedDay] || { date: selectedDay, activities: [] };

  const handleActivitySave = async (activity: Activity) => {
    const updatedTrip = { ...trip };
    const day = updatedTrip.days[selectedDay];
    
    if (editingActivity) {
      // Update existing activity
      const index = day.activities.findIndex(a => a.id === activity.id);
      if (index >= 0) {
        day.activities[index] = activity;
      }
    } else {
      // Add new activity
      day.activities.push(activity);
    }

    updatedTrip.days[selectedDay] = day;
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    
    // Sync to Supabase
    if (isSupabaseConfigured()) {
      await syncTripToSupabase(updatedTrip);
    }
    
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    showToast(editingActivity ? 'Activity updated' : 'Activity added', 'success');
  };

  const handleActivityDelete = async (activityId: string) => {
    const updatedTrip = { ...trip };
    const day = updatedTrip.days[selectedDay];
    day.activities = day.activities.filter(a => a.id !== activityId);
    updatedTrip.days[selectedDay] = day;
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    
    // Sync to Supabase
    if (isSupabaseConfigured()) {
      await syncTripToSupabase(updatedTrip);
    }
    
    showToast('Activity deleted', 'success');
  };

  const handleSuggestionAdd = (suggestion: Suggestion) => {
    if (!suggestion.location) {
      showToast('This suggestion does not have location information', 'error');
      return;
    }

    const activity: Activity = {
      id: `activity-${Date.now()}`,
      name: suggestion.title,
      description: suggestion.description,
      location: suggestion.location,
      category: suggestion.category,
      neighborhood: suggestion.neighborhood,
      website: suggestion.sourceUrl,
    };

    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleExport = () => {
    const json = exportTrips();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `istanbul-trip-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Trip exported successfully', 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          const result = importTrips(json);
          if (result.success) {
            showToast('Trip imported successfully!', 'success');
            if (typeof window !== 'undefined') {
              setTimeout(() => window.location.reload(), 1000);
            }
          } else {
            showToast(`Import failed: ${result.error}`, 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleBudgetChange = async (budget: number) => {
    const updatedTrip = { ...trip };
    updatedTrip.budget.total = budget;
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    if (isSupabaseConfigured()) {
      await syncTripToSupabase(updatedTrip);
    }
  };

  const handleExpenseAdd = async (expense: Expense) => {
    const updatedTrip = { ...trip };
    updatedTrip.budget.expenses.push(expense);
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    if (isSupabaseConfigured()) {
      await syncTripToSupabase(updatedTrip);
    }
  };

  const handleExpenseDelete = async (expenseId: string) => {
    const updatedTrip = { ...trip };
    updatedTrip.budget.expenses = updatedTrip.budget.expenses.filter(e => e.id !== expenseId);
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    if (isSupabaseConfigured()) {
      await syncTripToSupabase(updatedTrip);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-gray-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {isSyncing && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm flex items-center gap-3 backdrop-blur-sm">
            <div className="spinner"></div>
            <span className="text-sm font-medium text-blue-700">Syncing with cloud...</span>
          </div>
        )}
        {supabaseEnabled && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-green-700 flex items-center gap-2">
              <span className="text-lg">✓</span>
              Cloud sync enabled - Changes sync automatically between devices
            </p>
          </div>
        )}
        <TripHeader
          trip={trip}
          onNameChange={(name) => {
            const updated = { ...trip, name };
            setTrip(updated);
            saveTrip(updated);
          }}
          onExport={handleExport}
          onImport={handleImport}
          shareLink={supabaseEnabled ? getTripShareLink(trip.id) : undefined}
          isSupabaseEnabled={supabaseEnabled}
          onSave={async () => {
            saveTrip(trip);
            if (isSupabaseConfigured()) {
              setIsSyncing(true);
              const result = await syncTripToSupabase(trip);
              if (result.success) {
                showToast('Trip saved and synced', 'success');
              } else {
                showToast('Saved locally, sync failed', 'error');
              }
              setIsSyncing(false);
            } else {
              showToast('Trip saved', 'success');
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Selector */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Object.keys(trip.days)
                  .sort()
                  .map((dayKey) => {
                    const day = trip.days[dayKey];
                    const date = new Date(day.date);
                    const isSelected = selectedDay === dayKey;
                    return (
                      <Button
                        key={dayKey}
                        variant={isSelected ? 'primary' : 'secondary'}
                        onClick={() => setSelectedDay(dayKey)}
                        className="whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">{format(date, 'EEE, MMM d')}</span>
                        <span className="sm:hidden">{format(date, 'EEE d')}</span>
                      </Button>
                    );
                  })}
              </div>
            </div>

            {/* Day View */}
            <DayView
              day={currentDay}
              onActivityEdit={(activity) => {
                setEditingActivity(activity);
                setIsActivityModalOpen(true);
              }}
              onActivityDelete={handleActivityDelete}
              onActivityAdd={() => {
                setEditingActivity(null);
                setIsActivityModalOpen(true);
              }}
            />

            {/* Route Planner for Day */}
            {currentDay.activities.length > 0 && (
              <RoutePlanner
                activities={currentDay.activities}
                hotelLocation={trip.hotelLocation}
                routeMode={routeMode}
                onRouteModeChange={setRouteMode}
                onRoutesCalculated={handleRoutesCalculated}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Toggle Buttons */}
            <div className="flex gap-2">
              <Button
                variant={showSuggestions ? 'primary' : 'secondary'}
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex-1"
              >
                {showSuggestions ? 'Hide' : 'Show'} Suggestions
              </Button>
              <Button
                variant={showMap ? 'primary' : 'secondary'}
                onClick={() => setShowMap(!showMap)}
                className="flex-1"
              >
                {showMap ? 'Hide' : 'Show'} Map
              </Button>
            </div>

            {/* Suggestions Panel */}
            {showSuggestions && (
              <div className="h-[400px] sm:h-[500px] md:h-[600px]">
                <SuggestionPanel onAddSuggestion={handleSuggestionAdd} />
              </div>
            )}

            {/* Map */}
            {showMap && (
              <div className="h-[250px] sm:h-[300px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <MapContainer
                  activities={allActivities}
                  hotelLocation={trip.hotelLocation}
                  routes={routes}
                  routeMode={routeMode}
                />
              </div>
            )}

            {/* Budget Tracker */}
            <BudgetTracker
              expenses={trip.budget.expenses}
              activities={allActivities}
              totalBudget={trip.budget.total}
              onAddExpense={handleExpenseAdd}
              onDeleteExpense={handleExpenseDelete}
              onBudgetChange={handleBudgetChange}
            />
          </div>
        </div>
      </div>

      {/* Activity Editor Modal */}
      <ActivityEditor
        activity={editingActivity}
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleActivitySave}
      />
    </div>
  );
}

