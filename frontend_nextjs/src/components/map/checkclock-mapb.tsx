import {
  IconSearch,
  IconCurrentLocation,
  IconMapPinFilled,
} from "@tabler/icons-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Map, Marker, Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import axios from "axios";

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
  matching_text?: string;
  matching_place_name?: string;
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
  companyId?: number; // Prop untuk companyId
}

export default function CheckclockMap({
  onLocationChange,
  initialRadius = 250, // Default 250m
}: CheckclockMapProps) {
  const DEFAULT_LONGITUDE = 112.6322144;
  const DEFAULT_LATITUDE = -7.9546738;

  const [viewState, setViewState] = useState({
    longitude: DEFAULT_LONGITUDE,
    latitude: DEFAULT_LATITUDE,
    zoom: 17,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading data dari API
  const [error, setError] = useState<string | null>(null); // State untuk error API
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const [currentLocation, setCurrentLocation] = useState<CheckclockLocation>({
    id: "current",
    name: "CMLABS HQ",
    longitude: DEFAULT_LONGITUDE,
    latitude: DEFAULT_LATITUDE,
    radius: initialRadius,
  });

  const [companyId, setCompanyId] = useState<number | null>(null);
  const router = useRouter();

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g";

  useEffect(() => {
    const fetchCompanyId = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to access this page.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      try {
        console.log("📡 Fetching user profile from /api/user...");
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ API response:", response.data);

        // Handle possible nested data structure
        const userData = response.data.data || response.data;
        if (!userData.company_id) {
          throw new Error("Company ID not found in user profile.");
        }
        setCompanyId(userData.company_id);
      } catch (err: any) {
        console.error(
          "❌ Error fetching company ID:",
          err.message,
          err.response?.data
        );
        setError("Failed to load user profile. Please log in again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyId();
  }, [router]);

  // Fetch clock settings once companyId is available
  useEffect(() => {
    if (!companyId) return;
    console.log(companyId);
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        console.log(`📡 Fetching clock settings for company ID: ${companyId}`);
        const response = await axios.get(
          `http://localhost:8000/api/clock-settings/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("✅ Clock settings response:", response.data);
        const data = response.data.data;
        const name = data.locationName || "CMLabs";
        const longitude = parseFloat(data.longitude) || DEFAULT_LONGITUDE;
        const latitude = parseFloat(data.latitude) || DEFAULT_LATITUDE;
        const radius = data.radius || 250;
        setCurrentLocation({
          id: "current",
          name,
          longitude,
          latitude,
          radius,
        });
        setViewState({
          longitude,
          latitude,
          zoom: 17,
        });
      } catch (error: any) {
        console.error(
          "❌ Error fetching settings:",
          error.message,
          error.response?.data
        );
        setError("Failed to load clock settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [companyId]);

  const createCircleWithTurf = (
    center: [number, number],
    radiusInMeters: number
  ) => {
    try {
      const centerPoint = turf.point(center);
      const circle = turf.circle(centerPoint, radiusInMeters / 1000, {
        steps: 64,
        units: "kilometers",
      });
      return {
        type: "Feature" as const,
        properties: {
          radius: radiusInMeters,
          center: center,
        },
        geometry: circle.geometry,
      };
    } catch (error: unknown) {
      console.error("Error creating circle with Turf.js:", error);
      return createCircleFallback(center, radiusInMeters);
    }
  };

  const createCircleFallback = (
    center: [number, number],
    radiusInMeters: number
  ) => {
    const points = 64;
    const coords = [];
    const earthRadius = 6378137;
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

  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        console.log("🔍 Search cancelled: query too short or empty");
        setSuggestions([]);
        return;
      }

      console.log(`🔍 Starting search for: "${query}"`);

      if (abortControllerRef.current) {
        console.log("❌ Cancelling previous search request");
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setIsSearching(true);
      try {
        console.log("📡 Calling Mapbox Suggest API...");
        const suggestResponse = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?` +
            new URLSearchParams({
              q: query,
              access_token: MAPBOX_TOKEN,
              session_token: Date.now().toString(),
              country: "ID",
              language: "id",
              limit: "8",
              proximity: `${currentLocation.longitude},${currentLocation.latitude}`,
              types: "place,poi,address,street",
            }),
          { signal: abortControllerRef.current.signal }
        );

        if (!suggestResponse.ok) {
          throw new Error(`Suggest API error: ${suggestResponse.status}`);
        }

        const suggestData = await suggestResponse.json();
        console.log("✅ Suggest API response:", suggestData);

        if (suggestData.suggestions && suggestData.suggestions.length > 0) {
          console.log(
            `📍 Found ${suggestData.suggestions.length} suggestions, retrieving details...`
          );

          const retrievePromises = suggestData.suggestions.map(
            async (suggestion: any, index: number) => {
              try {
                console.log(
                  `📡 Retrieving details for suggestion ${index + 1}: ${
                    suggestion.name
                  }`
                );
                const retrieveResponse = await fetch(
                  `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?` +
                    new URLSearchParams({
                      access_token: MAPBOX_TOKEN,
                      session_token: Date.now().toString(),
                    }),
                  { signal: abortControllerRef.current!.signal }
                );

                if (retrieveResponse.ok) {
                  const retrieveData = await retrieveResponse.json();
                  const feature = retrieveData.features[0];
                  console.log(
                    `✅ Retrieved data for ${suggestion.name}:`,
                    feature
                  );

                  if (
                    feature &&
                    feature.geometry &&
                    feature.geometry.coordinates
                  ) {
                    return {
                      id: suggestion.mapbox_id,
                      place_name:
                        suggestion.full_address ||
                        suggestion.name ||
                        suggestion.place_formatted,
                      text: suggestion.name,
                      center: [
                        feature.geometry.coordinates[0],
                        feature.geometry.coordinates[1],
                      ] as [number, number],
                      place_type: [suggestion.feature_type || "place"],
                      properties: {
                        category:
                          suggestion.poi_category_ids?.join(", ") ||
                          suggestion.feature_type,
                        address: suggestion.full_address,
                      },
                      matching_text: suggestion.name,
                      matching_place_name:
                        suggestion.full_address || suggestion.place_formatted,
                    };
                  }
                } else {
                  console.warn(
                    `⚠️ Retrieve API failed for ${suggestion.name}: ${retrieveResponse.status}`
                  );
                }
              } catch (error: unknown) {
                console.warn(
                  `❌ Error retrieving suggestion ${suggestion.name}:`,
                  error instanceof Error ? error.message : String(error)
                );
                return null;
              }
              return null;
            }
          );

          const retrievedSuggestions = await Promise.all(retrievePromises);
          const validSuggestions = retrievedSuggestions.filter(
            Boolean
          ) as LocationSuggestion[];

          console.log(
            `✅ Successfully retrieved ${validSuggestions.length} valid suggestions:`,
            validSuggestions
          );
          setSuggestions(validSuggestions);
        } else {
          console.log(
            "⚠️ No suggestions found, falling back to legacy geocoding"
          );
          await fallbackGeocoding(query);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("❌ Search error:", error.message);
          console.log("🔄 Falling back to legacy geocoding API");
          await fallbackGeocoding(query);
        } else {
          console.log("⏹️ Search aborted by user");
        }
      } finally {
        setIsSearching(false);
        console.log("🏁 Search completed");
      }
    },
    [currentLocation.longitude, currentLocation.latitude]
  );

  const fallbackGeocoding = async (query: string) => {
    try {
      console.log("📡 Calling fallback Geocoding API...");
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?` +
          new URLSearchParams({
            access_token: MAPBOX_TOKEN,
            country: "ID",
            limit: "8",
            language: "id,en",
            proximity: `${currentLocation.longitude},${currentLocation.latitude}`,
            types: "poi,address,place,locality,region",
          })
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Fallback geocoding results:", data.features);

        const formattedSuggestions: LocationSuggestion[] = data.features.map(
          (feature: any) => ({
            id: feature.id,
            place_name: feature.place_name,
            text: feature.text,
            center: feature.center,
            place_type: feature.place_type,
            properties: {
              category: feature.properties?.category,
              address: feature.place_name,
            },
          })
        );

        console.log(
          `✅ Formatted ${formattedSuggestions.length} fallback suggestions`
        );
        setSuggestions(formattedSuggestions);
      } else {
        console.error(`❌ Fallback geocoding API failed: ${response.status}`);
        setSuggestions([]);
      }
    } catch (error: unknown) {
      console.error("❌ Fallback geocoding error:", error);
      setSuggestions([]);
    }
  };

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
      console.log(`📡 Reverse geocoding coordinates: [${lng}, ${lat}]`);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
          new URLSearchParams({
            access_token: MAPBOX_TOKEN,
            language: "id,en",
            types: "place,locality,neighborhood,address,poi",
          })
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Reverse geocoding response:", data);

        if (data.features && data.features[0]) {
          const feature = data.features[0];
          const result = {
            location: feature.text || feature.place_name.split(",")[0],
            address: feature.place_name,
          };
          console.log("✅ Reverse geocoding result:", result);
          return result;
        } else {
          console.warn("⚠️ No features found in reverse geocoding response");
        }
      } else {
        console.error(`❌ Reverse geocoding API failed: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error("❌ Reverse geocoding error:", error);
    }
    console.log("❌ Reverse geocoding returned null");
    return null;
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: LocationSuggestion) => {
      console.log("🎯 User clicked suggestion:", suggestion);

      const newLng = suggestion.center[0];
      const newLat = suggestion.center[1];

      console.log(`📍 Moving map to coordinates: [${newLng}, ${newLat}]`);

      setCurrentLocation((prev) => ({
        ...prev,
        longitude: newLng,
        latitude: newLat,
        name: suggestion.text || suggestion.place_name.split(",")[0],
      }));
      setViewState({
        longitude: newLng,
        latitude: newLat,
        zoom: 16,
      });
      setSearchQuery(suggestion.place_name);
      setShowSuggestions(false);

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newLng, newLat],
          zoom: 16,
          duration: 1000,
        });
      }

      console.log("📡 Calling onLocationChange callback...");
      if (onLocationChange) {
        onLocationChange({
          location: suggestion.text || suggestion.place_name.split(",")[0],
          address: suggestion.place_name,
          latitude: newLat,
          longitude: newLng,
        });
        console.log("✅ onLocationChange callback completed");
      } else {
        console.log("⚠️ No onLocationChange callback provided");
      }

      console.log("🏁 Suggestion click handling completed");
    },
    [onLocationChange]
  );

  const handleMarkerDrag = useCallback(
    async (event: any) => {
      const newLng = event.lngLat.lng;
      const newLat = event.lngLat.lat;

      console.log(`🖱️ Marker dragged to: [${newLng}, ${newLat}]`);

      const newLocation = {
        ...currentLocation,
        longitude: newLng,
        latitude: newLat,
      };
      setCurrentLocation(newLocation);

      console.log("📡 Starting reverse geocoding...");
      const geocodeResult = await reverseGeocode(newLng, newLat);

      if (geocodeResult) {
        console.log("✅ Reverse geocoding successful:", geocodeResult);
        newLocation.name = geocodeResult.location;
        setCurrentLocation(newLocation);
        setSearchQuery(geocodeResult.address);

        console.log("📡 Calling onLocationChange from marker drag...");
        if (onLocationChange) {
          onLocationChange({
            location: geocodeResult.location,
            address: geocodeResult.address,
            latitude: newLat,
            longitude: newLng,
          });
          console.log(
            "✅ onLocationChange callback completed from marker drag"
          );
        }
      } else {
        console.warn("⚠️ Reverse geocoding returned no results");
      }

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newLng, newLat],
          zoom: 16,
          duration: 1000,
        });
      }

      console.log("🏁 Marker drag handling completed");
    },
    [currentLocation, onLocationChange, reverseGeocode]
  );

  const getCurrentLocation = () => {
    console.log("📍 Getting current location from GPS...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          handlePositionUpdate(position);
        },
        (error: GeolocationPositionError) => {
          handleGeolocationError(error);
          startWatchingPosition();
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("❌ Geolocation not supported");
      alert(
        "Geolocation is not supported by this browser. Please enter a location manually."
      );
    }
  };

  const startWatchingPosition = () => {
    console.log("🔄 Starting watchPosition for better accuracy...");
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        handlePositionUpdate(position);
        if (position.coords.accuracy <= 30) {
          navigator.geolocation.clearWatch(watchId);
          console.log("✅ Stopped watchPosition: accurate location obtained");
        }
      },
      (error: GeolocationPositionError) => {
        handleGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  const handlePositionUpdate = async (position: GeolocationPosition) => {
    const newLng = position.coords.longitude;
    const newLat = position.coords.latitude;
    const accuracy = position.coords.accuracy;
    const timestamp = new Date(position.timestamp).toISOString();
    const altitude = position.coords.altitude;
    const heading = position.coords.heading;

    console.log(
      `✅ GPS location obtained: [${newLng}, ${newLat}], accuracy: ${accuracy}m, timestamp: ${timestamp}, altitude: ${altitude}m, heading: ${heading}°`
    );

    if (accuracy > 30) {
      console.warn(`⚠️ Low GPS accuracy: ${accuracy}m`);
      alert(
        "Location accuracy is low (<30m required). Please ensure GPS is enabled, move to an open area, or try on a mobile device."
      );
      return;
    }

    console.log("📍 Moving map to GPS location");
    setViewState({
      longitude: newLng,
      latitude: newLat,
      zoom: 16,
    });

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [newLng, newLat],
        zoom: 16,
        duration: 1000,
      });
    }

    console.log("📡 Starting reverse geocoding for GPS location...");
    const geocodeResult = await reverseGeocode(newLng, newLat);
    const newLocation = {
      ...currentLocation,
      longitude: newLng,
      latitude: newLat,
      name: geocodeResult?.location || "Current Location",
    };

    console.log("📍 Setting GPS location:", newLocation);
    setCurrentLocation(newLocation);

    if (geocodeResult) {
      setSearchQuery(geocodeResult.address);
      console.log("📡 Calling onLocationChange from GPS...");
      if (onLocationChange) {
        onLocationChange({
          location: geocodeResult.location,
          address: geocodeResult.address,
          latitude: newLat,
          longitude: newLng,
        });
        console.log("✅ onLocationChange callback completed from GPS");
      }
    }

    console.log("🏁 GPS location handling completed");
  };

  const handleGeolocationError = (error: GeolocationPositionError) => {
    console.error("❌ GPS error:", error.message);
    let errorMessage = "Could not get your current location. ";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage +=
          "Please enable location permissions in your browser and try again.";
        console.error("❌ GPS permission denied");
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage +=
          "Location data is unavailable. Please check your GPS, network, or try on a mobile device.";
        console.error("❌ GPS position unavailable");
        break;
      case error.TIMEOUT:
        errorMessage +=
          "Location request timed out. Please move to an open area or try again.";
        console.error("❌ GPS timeout");
        break;
      default:
        errorMessage += "An unknown error occurred.";
        console.error("❌ Unknown GPS error");
    }
    alert(errorMessage);
  };

  useEffect(() => {
    setCurrentLocation((prev) => ({
      ...prev,
      radius: initialRadius,
    }));
  }, [initialRadius]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  const circleGeoJSON = createCircleWithTurf(
    [currentLocation.longitude, currentLocation.latitude],
    currentLocation.radius
  );

  return (
    <div className="w-full h-96 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Memuat lokasi...</span>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-20">
          {error}
        </div>
      )}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari gedung, alamat, atau lokasi di Indonesia..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setShowSuggestions(true);
                  if (searchQuery && suggestions.length === 0) {
                    searchLocations(searchQuery);
                  }
                }}
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
              className="px-3 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-700 shadow-lg transition-colors"
              title="Dapatkan lokasi saat ini"
            >
              <IconCurrentLocation className="h-5 w-5" />
            </button>
          </div>

          {showSuggestions && (suggestions.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
              {isSearching && suggestions.length === 0 && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Mencari lokasi...
                </div>
              )}
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
                      {suggestion.properties?.category && (
                        <div className="text-xs text-blue-500 truncate">
                          {suggestion.properties.category}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {!isSearching &&
                suggestions.length === 0 &&
                searchQuery.trim() && (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    Tidak ada lokasi ditemukan. Coba istilah pencarian lain.
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <Map
        {...viewState}
        ref={mapRef}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
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
                {currentLocation.radius}m radius • Geser untuk memindahkan
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

      <div className="relative">
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-lg border z-10">
          <div className="text-sm font-medium text-gray-800 mb-2">Petunjuk</div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded mr-2"></div>
            <span className="text-xs text-gray-600">Area izin clock-in</span>
          </div>
          <div className="flex items-center mb-1">
            <IconMapPinFilled className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-xs text-gray-600">
              Lokasi kantor (dapat digeser)
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            💡 Geser pin atau cari untuk mengatur lokasi
          </div>
        </div>
      </div>
    </div>
  );
}
