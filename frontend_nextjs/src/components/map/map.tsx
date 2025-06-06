"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

interface MapsProps {
  position?: { lat: number; lng: number };
  onPositionChange?: (position: { lat: number; lng: number }) => void;
  height?: string;
}

export default function Maps({
  position = { lat: -7.9546738, lng: 112.6322144 },
  onPositionChange,
  height = "320px",
}: MapsProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 text-red-500">
        Google Maps API key is not configured
      </div>
    );
  }

  // Handler untuk ketika marker di-drag
  const handleMarkerDrag = (event: google.maps.MapMouseEvent) => {
    if (event.latLng && onPositionChange) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      onPositionChange(newPosition);
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height, width: "100%" }}>
        <Map
          zoom={15}
          center={position}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_ID}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          scrollwheel={true}
          style={{ width: "100%", height: "100%" }}
        >
          <AdvancedMarker
            position={position}
            draggable={true}
            onDragEnd={handleMarkerDrag}
          />
        </Map>
      </div>
    </APIProvider>
  );
}
