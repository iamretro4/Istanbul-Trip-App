import { Location, Route, RouteMode, Activity } from './types';

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function calculateRoute(
  from: Location,
  to: Location,
  mode: RouteMode,
  directionsService: google.maps.DirectionsService | null
): Promise<Route | null> {
  return new Promise((resolve) => {
    if (!directionsService || typeof window === 'undefined' || !window.google || !window.google.maps) {
      resolve(null);
      return;
    }

    const travelMode = mode === 'WALKING' 
      ? window.google.maps.TravelMode.WALKING
      : mode === 'TRANSIT'
      ? window.google.maps.TravelMode.TRANSIT
      : window.google.maps.TravelMode.DRIVING;

    directionsService.route(
      {
        origin: { lat: from.lat, lng: from.lng },
        destination: { lat: to.lat, lng: to.lng },
        travelMode,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
          const steps = leg.steps.map(step => ({
            instruction: step.instructions || '',
            distance: step.distance?.value || 0,
            duration: step.duration?.value || 0,
          }));

          resolve({
            id: `${from.lat}-${from.lng}-${to.lat}-${to.lng}-${mode}`,
            fromActivityId: '',
            toActivityId: '',
            mode,
            distance: leg.distance?.value || 0,
            duration: leg.duration?.value || 0,
            steps,
            polyline: (() => {
              const polyline = route.overview_polyline;
              if (typeof polyline === 'string') {
                return polyline;
              }
              if (polyline && typeof polyline === 'object' && 'points' in polyline) {
                return (polyline as { points: string }).points;
              }
              return '';
            })(),
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

export function calculateRoutesBetweenActivities(
  activities: Activity[],
  mode: RouteMode,
  directionsService: google.maps.DirectionsService | null
): Promise<Route[]> {
  const routes: Promise<Route | null>[] = [];

  for (let i = 0; i < activities.length - 1; i++) {
    const from = activities[i].location;
    const to = activities[i + 1].location;
    routes.push(
      calculateRoute(from, to, mode, directionsService).then(route => {
        if (route) {
          route.fromActivityId = activities[i].id;
          route.toActivityId = activities[i + 1].id;
        }
        return route;
      })
    );
  }

  return Promise.all(routes).then(results => 
    results.filter((r): r is Route => r !== null)
  );
}

export function getMapCenter(locations: Location[]): Location {
  if (locations.length === 0) {
    // Default to Istanbul center
    return { lat: 41.0082, lng: 28.9784 };
  }

  if (locations.length === 1) {
    return locations[0];
  }

  const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
  const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

  return { lat: avgLat, lng: avgLng };
}

export function getMapBounds(locations: Location[]): google.maps.LatLngBounds | null {
  if (locations.length === 0 || typeof window === 'undefined' || !window.google || !window.google.maps) return null;

  const bounds = new window.google.maps.LatLngBounds();
  locations.forEach(loc => {
    bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng));
  });

  return bounds;
}

