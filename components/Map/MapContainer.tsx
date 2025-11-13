'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '@/lib/google-maps-loader';
import { Location, Activity } from '@/lib/types';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784,
};

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface MapContainerProps {
  activities: Activity[];
  selectedActivityId?: string;
  onActivityClick?: (activityId: string) => void;
  hotelLocation?: Location;
  routes?: any[];
  routeMode?: 'WALKING' | 'TRANSIT' | 'DRIVING';
}

export default function MapContainer({
  activities,
  selectedActivityId,
  onActivityClick,
  hotelLocation,
  routes = [],
  routeMode = 'WALKING',
}: MapContainerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const { isLoaded } = useGoogleMaps();

  // All hooks must be called before any early returns
  useEffect(() => {
    if (map && activities.length > 0 && typeof window !== 'undefined' && window.google && window.google.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      
      if (hotelLocation) {
        bounds.extend(new window.google.maps.LatLng(hotelLocation.lat, hotelLocation.lng));
      }

      activities.forEach(activity => {
        bounds.extend(new window.google.maps.LatLng(activity.location.lat, activity.location.lng));
      });

      map.fitBounds(bounds);
    }
  }, [map, activities, hotelLocation]);

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google || !window.google.maps) return;

    // Clear previous routes
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Render new routes
    if (routes.length > 0) {
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: routeMode === 'WALKING' ? '#3b82f6' : routeMode === 'TRANSIT' ? '#10b981' : '#ef4444',
          strokeWeight: 4,
          strokeOpacity: 0.7,
        },
      });

      directionsRendererRef.current = directionsRenderer;

      // Render each route
      routes.forEach((route: any) => {
        if (route.directionsResult) {
          directionsRenderer.setDirections(route.directionsResult);
        }
      });
    }

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [map, routes, routeMode]);

  // Early return AFTER all hooks
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      options={defaultOptions}
      onLoad={setMap}
    >
        {/* Hotel marker */}
        {hotelLocation && (
          <Marker
            position={{ lat: hotelLocation.lat, lng: hotelLocation.lng }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            title="Taks-inn Hotel"
          />
        )}

        {/* Activity markers */}
        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={{ lat: activity.location.lat, lng: activity.location.lng }}
            onClick={() => {
              setSelectedMarker(activity.id);
              onActivityClick?.(activity.id);
            }}
            icon={{
              url: selectedActivityId === activity.id
                ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
            title={activity.name}
          />
        ))}

        {/* Info window */}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: activities.find(a => a.id === selectedMarker)?.location.lat || 0,
              lng: activities.find(a => a.id === selectedMarker)?.location.lng || 0,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm">
                {activities.find(a => a.id === selectedMarker)?.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {activities.find(a => a.id === selectedMarker)?.description}
              </p>
            </div>
          </InfoWindow>
        )}
    </GoogleMap>
  );
}

