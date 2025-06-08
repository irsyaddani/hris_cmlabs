// First, install Turf.js in your project:
// npm install @turf/turf
// or
// yarn add @turf/turf

import {
  IconSearch,
  IconCurrentLocation,
  IconMapPinFilled,
} from "@tabler/icons-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Map, Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// Add this import for Turf.js
import * as turf from "@turf/turf";

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  text?: string;
  properties?: {
    address?: string;
    category?: string;
  };
  place_type: string[];
}

interface CheckclockLocation {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  radius: number;
}

interface CheckclockMapProps {
  onLocationChange?: (data: {
    location?: string;
    address?: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialRadius?: number;
}

export default function CheckclockMap({
  onLocationChange,
  initialRadius = 500,
}: CheckclockMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 112.6322144,
    latitude: -7.9546738,
    zoom: 17,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentLocation, setCurrentLocation] = useState<CheckclockLocation>({
    id: "current",
    name: "Current Location",
    longitude: 112.6322144,
    latitude: -7.9546738,
    radius: initialRadius,
  });

  // NEW: More accurate circle creation using Turf.js
  const createCircleWithTurf = (
    center: [number, number],
    radiusInMeters: number
  ) => {
    try {
      // Create a point from the center coordinates
      const centerPoint = turf.point(center);

      // Create a circle with the specified radius
      // Turf expects radius in kilometers, so convert from meters
      const circle = turf.circle(centerPoint, radiusInMeters / 1000, {
        steps: 64, // Number of points to create the circle (more = smoother)
        units: "kilometers",
      });

      // Return in the format expected by Mapbox
      return {
        type: "Feature" as const,
        properties: {
          radius: radiusInMeters,
          center: center,
        },
        geometry: circle.geometry,
      };
    } catch (error) {
      console.error("Error creating circle with Turf.js:", error);
      // Fallback to the original method if Turf fails
      return createCircleFallback(center, radiusInMeters);
    }
  };

  // Keep the original method as fallback
  const createCircleFallback = (
    center: [number, number],
    radiusInMeters: number
  ) => {
    const points = 64;
    const coords = [];
    const earthRadius = 6378137; // WGS84 Earth radius in meters
    const lat = center[1];
    const lng = center[0];

    const latRad = (lat * Math.PI) / 180;
    const metersPerDegreeLat =
      111132.954 -
      559.822 * Math.cos(2 * latRad) +
      1.175 * Math.cos(4 * latRad);
    const metersPerDegreeLng = (Math.PI / 180) * earthRadius * Math.cos(latRad);

    const deltaLat = radiusInMeters / metersPerDegreeLat;
    const deltaLng = radiusInMeters / metersPerDegreeLng;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = deltaLng * Math.cos(theta);
      const y = deltaLat * Math.sin(theta);

      coords.push([lng + x, lat + y]);
    }
    coords.push(coords[0]);

    return {
      type: "Feature" as const,
      properties: { radius: radiusInMeters },
      geometry: {
        type: "Polygon" as "Polygon",
        coordinates: [coords],
      },
    };
  };

  // IMPROVED: Better search logic
  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?` +
            new URLSearchParams({
              access_token:
                "pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g",
              country: "ID",
              limit: "10", // Increased limit for better results
              language: "id,en",
              proximity: `${currentLocation.longitude},${currentLocation.latitude}`,
              types: "poi,address,place", // Keep broad types for buildings
            })
        );

        if (response.ok) {
          const data = await response.json();

          // Debug: Log what we're getting
          console.log(
            "Search results:",
            data.features.map((f) => ({
              name: f.place_name,
              type: f.place_type,
              category: f.properties?.category,
              text: f.text,
            }))
          );

          // More inclusive sorting instead of filtering
          const sortedSuggestions = data.features.sort((a, b) => {
            // Prioritize POIs and addresses, but don't exclude others
            const aScore =
              (a.place_type.includes("poi") ? 3 : 0) +
              (a.place_type.includes("address") ? 2 : 0) +
              (a.properties?.category ? 1 : 0);
            const bScore =
              (b.place_type.includes("poi") ? 3 : 0) +
              (b.place_type.includes("address") ? 2 : 0) +
              (b.properties?.category ? 1 : 0);
            return bScore - aScore;
          });

          setSuggestions(sortedSuggestions);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [currentLocation.longitude, currentLocation.latitude]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const reverseGeocode = useCallback(async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
          new URLSearchParams({
            access_token:
              "pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g",
            language: "id,en",
            types: "place,locality,neighborhood,address,poi",
          })
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features[0]) {
          const feature = data.features[0];
          return {
            location: feature.text || feature.place_name.split(",")[0],
            address: feature.place_name,
          };
        }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return null;
  }, []);

  const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
    const newLng = suggestion.center[0];
    const newLat = suggestion.center[1];

    setViewState({
      longitude: newLng,
      latitude: newLat,
      zoom: 16,
    });

    const newLocation = {
      ...currentLocation,
      longitude: newLng,
      latitude: newLat,
      name: suggestion.text || suggestion.place_name.split(",")[0],
    };
    setCurrentLocation(newLocation);

    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);

    if (onLocationChange) {
      onLocationChange({
        location: newLocation.name,
        address: suggestion.place_name,
        latitude: newLat,
        longitude: newLng,
      });
    }
  };

  const handleMarkerDrag = useCallback(
    async (event: any) => {
      const newLng = event.lngLat.lng;
      const newLat = event.lngLat.lat;

      const newLocation = {
        ...currentLocation,
        longitude: newLng,
        latitude: newLat,
      };
      setCurrentLocation(newLocation);

      const geocodeResult = await reverseGeocode(newLng, newLat);
      if (geocodeResult) {
        newLocation.name = geocodeResult.location;
        setCurrentLocation(newLocation);
        setSearchQuery(geocodeResult.address);

        if (onLocationChange) {
          onLocationChange({
            location: geocodeResult.location,
            address: geocodeResult.address,
            latitude: newLat,
            longitude: newLng,
          });
        }
      }
    },
    [currentLocation, onLocationChange, reverseGeocode]
  );

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLng = position.coords.longitude;
          const newLat = position.coords.latitude;
          const accuracy = position.coords.accuracy;

          if (accuracy > 100) {
            alert(
              "Location accuracy is low. Please ensure GPS is enabled or try again."
            );
          }

          setViewState({
            longitude: newLng,
            latitude: newLat,
            zoom: 16,
          });

          const geocodeResult = await reverseGeocode(newLng, newLat);
          const newLocation = {
            ...currentLocation,
            longitude: newLng,
            latitude: newLat,
            name: geocodeResult?.location || "Current Location",
          };
          setCurrentLocation(newLocation);

          if (geocodeResult) {
            setSearchQuery(geocodeResult.address);
            if (onLocationChange) {
              onLocationChange({
                location: geocodeResult.location,
                address: geocodeResult.address,
                latitude: newLat,
                longitude: newLng,
              });
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Could not get your current location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage +=
                "Location data is unavailable. Please check your GPS or network.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Please enter a location manually."
      );
    }
  };

  useEffect(() => {
    setCurrentLocation((prev) => ({
      ...prev,
      radius: initialRadius,
    }));
  }, [initialRadius]);

  const circleLayerStyle = {
    id: "radius-circle",
    type: "fill" as const,
    paint: {
      "fill-color": "#3b82f6",
      "fill-opacity": 0.1,
    },
  };

  const circleBorderLayerStyle = {
    id: "radius-circle-border",
    type: "line" as const,
    paint: {
      "line-color": "#3b82f6",
      "line-width": 2,
      "line-dasharray": [2, 2],
    },
  };

  // Use Turf.js for circle creation
  const circleGeoJSON = createCircleWithTurf(
    [currentLocation.longitude, currentLocation.latitude],
    currentLocation.radius
  );

  return (
    <div className="w-full h-96 relative">
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a building, address, or location in Indonesia..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            <button
              onClick={getCurrentLocation}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-lg transition-colors"
              title="Get current location"
            >
              <IconCurrentLocation className="h-5 w-5" />
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <IconMapPinFilled className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 font-medium truncate">
                        {suggestion.text || suggestion.place_name.split(",")[0]}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.place_name}
                      </div>
                      {/* Debug info - remove in production */}
                      <div className="text-xs text-blue-500 truncate">
                        {suggestion.place_type.join(", ")}{" "}
                        {suggestion.properties?.category &&
                          `| ${suggestion.properties.category}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g"
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Source id="current-circle" type="geojson" data={circleGeoJSON}>
          <Layer {...circleLayerStyle} id="current-circle-fill" />
          <Layer {...circleBorderLayerStyle} id="current-circle-border" />
        </Source>

        <Marker
          longitude={currentLocation.longitude}
          latitude={currentLocation.latitude}
          anchor="bottom"
          draggable={true}
          onDrag={handleMarkerDrag}
        >
          <div className="flex flex-col items-center cursor-move">
            <div className="bg-white px-2 py-1 rounded-md shadow-lg border mb-1 text-sm font-medium text-gray-800 whitespace-nowrap">
              {currentLocation.name}
              <div className="text-xs text-gray-500">
                {currentLocation.radius}m radius • Drag to move
              </div>
            </div>
            <div style={{ color: "#ef4444", fontSize: "24px" }}>
              <IconMapPinFilled size={32} />
            </div>
          </div>
        </Marker>
        <Marker
          longitude={currentLocation.longitude + 0.0005}
          latitude={currentLocation.latitude}
          anchor="center"
        >
          <div className="text-xs bg-white px-1 py-0.5 rounded shadow border text-gray-600">
            {currentLocation.radius}m
          </div>
        </Marker>
      </Map>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-lg border z-10">
        <div className="text-sm font-medium text-gray-800 mb-2">Legend</div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded mr-2"></div>
          <span className="text-xs text-gray-600">
            Clock-in allowed area (Turf.js)
          </span>
        </div>
        <div className="flex items-center mb-1">
          <IconMapPinFilled className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-xs text-gray-600">
            Office location (draggable)
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          💡 Drag the pin or search to set location
        </div>
      </div>
    </div>
  );
}
