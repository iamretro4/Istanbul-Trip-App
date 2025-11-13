'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useGoogleMaps } from '@/lib/google-maps-loader';
import { Activity, RouteMode } from '@/lib/types';
import { calculateRoutesBetweenActivities, formatDistance, formatDuration } from '@/lib/maps';
import Button from '../UI/Button';
import { Navigation, MapPin } from 'lucide-react';

interface RoutePlannerProps {
  activities: Activity[];
  hotelLocation?: { lat: number; lng: number };
  routeMode: RouteMode;
  onRouteModeChange: (mode: RouteMode) => void;
  onRoutesCalculated: (routes: any[]) => void;
}

export default function RoutePlanner({
  activities,
  hotelLocation,
  routeMode,
  onRouteModeChange,
  onRoutesCalculated,
}: RoutePlannerProps) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const lastCalculationRef = useRef<string>('');
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined' && window.google && !directionsServiceRef.current) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
    }
  }, [isLoaded]);

  const calculateRoutes = useCallback(async () => {
    if (activities.length === 0 || !directionsServiceRef.current) {
      return;
    }

    setIsCalculating(true);

    try {
      // If hotel location is provided, add it as starting point
      let activitiesToRoute = activities;
      if (hotelLocation && activities.length > 0) {
        // Create a temporary activity for the hotel
        const hotelActivity: Activity = {
          id: 'hotel',
          name: 'Taks-inn Hotel',
          location: hotelLocation,
          category: 'other',
        };
        activitiesToRoute = [hotelActivity, ...activities];
      }

      const calculatedRoutes = await calculateRoutesBetweenActivities(
        activitiesToRoute,
        routeMode,
        directionsServiceRef.current
      );

      // Convert to directions results for rendering
      const directionsResults = await Promise.all(
        calculatedRoutes.map(async (route) => {
          return new Promise((resolve) => {
            if (!directionsServiceRef.current) {
              resolve(null);
              return;
            }

            const fromActivity = activitiesToRoute.find(a => a.id === route.fromActivityId);
            const toActivity = activitiesToRoute.find(a => a.id === route.toActivityId);

            if (!fromActivity || !toActivity) {
              resolve(null);
              return;
            }

            if (!window.google || !window.google.maps) {
              resolve(null);
              return;
            }

            directionsServiceRef.current.route(
              {
                origin: { lat: fromActivity.location.lat, lng: fromActivity.location.lng },
                destination: { lat: toActivity.location.lat, lng: toActivity.location.lng },
                travelMode:
                  routeMode === 'WALKING'
                    ? window.google.maps.TravelMode.WALKING
                    : routeMode === 'TRANSIT'
                    ? window.google.maps.TravelMode.TRANSIT
                    : window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                  resolve({
                    ...route,
                    directionsResult: result,
                  });
                } else {
                  resolve(null);
                }
              }
            );
          });
        })
      );

      const validRoutes = directionsResults.filter((r): r is any => r !== null);
      setRoutes(validRoutes);
      onRoutesCalculated(validRoutes);
    } catch (error) {
      console.error('Error calculating routes:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [activities, hotelLocation, routeMode, onRoutesCalculated]);

  // Create a stable key for activities to prevent unnecessary recalculations
  const activitiesKey = useMemo(() => {
    return JSON.stringify({
      ids: activities.map(a => a.id),
      count: activities.length,
      hotel: hotelLocation ? `${hotelLocation.lat},${hotelLocation.lng}` : '',
      mode: routeMode,
    });
  }, [activities, hotelLocation, routeMode]);

  useEffect(() => {
    // Prevent duplicate calculations
    if (lastCalculationRef.current === activitiesKey) {
      return;
    }

    if (activities.length > 0 && isLoaded && directionsServiceRef.current) {
      lastCalculationRef.current = activitiesKey;
      calculateRoutes();
    } else if (activities.length === 0) {
      lastCalculationRef.current = '';
      setRoutes([]);
      onRoutesCalculated([]);
    }
  }, [activitiesKey, isLoaded, calculateRoutes, activities.length, onRoutesCalculated]);

  if (!isLoaded) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading map services...</p>
      </div>
    );
  }

  const totalDistance = routes.reduce((sum, r) => sum + r.distance, 0);
  const totalDuration = routes.reduce((sum, r) => sum + r.duration, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
          <Navigation size={22} className="text-blue-600" />
          Routes
        </h3>
        <div className="flex gap-2">
          <Button
            variant={routeMode === 'WALKING' ? 'primary' : 'secondary'}
            onClick={() => onRouteModeChange('WALKING')}
            className="text-xs"
          >
            Walking
          </Button>
          <Button
            variant={routeMode === 'TRANSIT' ? 'primary' : 'secondary'}
            onClick={() => onRouteModeChange('TRANSIT')}
            className="text-xs"
          >
            Transit
          </Button>
          <Button
            variant={routeMode === 'DRIVING' ? 'primary' : 'secondary'}
            onClick={() => onRouteModeChange('DRIVING')}
            className="text-xs"
          >
            Taxi/Drive
          </Button>
        </div>
      </div>

      {isCalculating ? (
        <p className="text-gray-600">Calculating routes...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-600">Add activities to see routes</p>
      ) : activities.length === 1 ? (
        <p className="text-gray-600">Add at least 1 more activity to see routes</p>
      ) : routes.length === 0 ? (
        <p className="text-gray-600">No routes found</p>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-sm font-bold text-blue-900">
              Total: {formatDistance(totalDistance)} • {formatDuration(totalDuration)}
            </p>
          </div>

          {routes.map((route, index) => {
            // Handle hotel as starting point
            const fromName = route.fromActivityId === 'hotel' 
              ? 'Taks-inn Hotel' 
              : activities.find(a => a.id === route.fromActivityId)?.name || 'Unknown';
            const toActivity = activities.find(a => a.id === route.toActivityId);

            return (
              <div key={route.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-blue-600" />
                      <span className="text-sm font-medium">{fromName}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-green-600" />
                      <span className="text-sm font-medium">{toActivity?.name || 'Unknown'}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatDistance(route.distance)} • {formatDuration(route.duration)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

