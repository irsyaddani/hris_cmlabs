"use client";

import {
  IconCurrentLocation,
  IconMapPinFilled,
  IconBuildingOff,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Map, Marker, Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OfficeLocation {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  radius: number;
}

interface UserLocation {
  longitude: number;
  latitude: number;
  accuracy: number;
}

interface CheckclockMapUserProps {
  officeLocation: OfficeLocation; // This comes from admin config
  onLocationValidation?: (data: {
    isWithinRadius: boolean;
    distance: number;
    userLocation: UserLocation;
    message: string;
  }) => void;
}

export default function CheckclockMapUser({
  officeLocation,
  onLocationValidation,
}: CheckclockMapUserProps) {
  const [viewState, setViewState] = useState({
    longitude: officeLocation.longitude,
    latitude: officeLocation.latitude,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mapRef = useRef<MapRef | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g";

  // Create circle for office radius
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

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const from = turf.point([lon1, lat1]);
    const to = turf.point([lon2, lat2]);
    const distance = turf.distance(from, to, { units: "meters" });
    return Math.round(distance);
  };

  // Validate if user is within office radius
  const validateLocation = useCallback(
    (userLat: number, userLng: number, accuracy: number) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        officeLocation.latitude,
        officeLocation.longitude
      );

      const isWithinRadius = distance <= officeLocation.radius;
      const effectiveDistance = Math.max(distance - accuracy, 0);

      setDistance(distance);
      setIsWithinRadius(isWithinRadius);

      let message = "";
      if (isWithinRadius) {
        message = `Great! You are within the office area (${distance}m from office)`;
      } else {
        message = `You are ${distance}m from the office. Please move closer to the office area (within ${officeLocation.radius}m radius)`;
      }

      if (onLocationValidation) {
        onLocationValidation({
          isWithinRadius,
          distance: effectiveDistance,
          userLocation: { longitude: userLng, latitude: userLat, accuracy },
          message,
        });
      }

      return { isWithinRadius, distance, message };
    },
    [officeLocation, onLocationValidation]
  );

  // Handle position update from GPS
  const handlePositionUpdate = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log(
        `📍 Location: ${latitude}, ${longitude}, accuracy: ${accuracy}m`
      );

      // Removed strict accuracy > 50 check to allow pin rendering
      const newUserLocation = { longitude, latitude, accuracy };
      setUserLocation(newUserLocation);
      setLocationError(null);

      validateLocation(latitude, longitude, accuracy);

      const bounds = [
        [
          Math.min(officeLocation.longitude, longitude) - 0.001,
          Math.min(officeLocation.latitude, latitude) - 0.001,
        ],
        [
          Math.max(officeLocation.longitude, longitude) + 0.001,
          Math.max(officeLocation.latitude, latitude) + 0.001,
        ],
      ];

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds as any, {
          padding: 50,
          duration: 1000,
        });
      }
    },
    [officeLocation, validateLocation]
  );

  // Handle geolocation error
  const handleGeolocationError = useCallback(
    (error: GeolocationPositionError) => {
      console.error("❌ GPS error:", error.message);
      let errorMessage = "";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location access denied. Please enable location permissions and try again.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "Location data is unavailable. Please check your GPS or network connection.";
          break;
        case error.TIMEOUT:
          errorMessage =
            "Location request timed out. Please try again or move to an open area.";
          break;
        default:
          errorMessage =
            "An unknown error occurred while getting your location.";
      }

      setLocationError(errorMessage);
      setIsGettingLocation(false);
    },
    []
  );

  // Get current location
  const getCurrentLocation = useCallback(() => {
    console.log("📍 Getting user location for attendance check...");
    setIsGettingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      // Clear any existing watch
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords.accuracy > 50) {
            console.warn(
              "Initial accuracy poor, switching to watchPosition..."
            );
            watchIdRef.current = navigator.geolocation.watchPosition(
              handlePositionUpdate,
              handleGeolocationError,
              {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
              }
            );
            return;
          }
          handlePositionUpdate(position);
        },
        handleGeolocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      setIsGettingLocation(false);
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
    }
  }, [handlePositionUpdate, handleGeolocationError]);

  // Request location permission on component mount
  useEffect(() => {
    if (!locationRequested) {
      setLocationRequested(true);
      setIsDialogOpen(true); // Open the dialog on mount if not requested
    }
  }, [locationRequested]);

  const handleConfirmLocation = () => {
    setIsDialogOpen(false);
    getCurrentLocation();
  };

  const handleCancelLocation = () => {
    setIsDialogOpen(false);
    setLocationError("Location access is required for attendance check.");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const circleGeoJSON = createCircleWithTurf(
    [officeLocation.longitude, officeLocation.latitude],
    officeLocation.radius
  );

  const circleLayerStyle = {
    id: "office-radius-circle",
    type: "fill" as const,
    paint: {
      "fill-color": isWithinRadius === false ? "#ef4444" : "#10b981",
      "fill-opacity": 0.1,
    },
  };

  const circleBorderLayerStyle = {
    id: "office-radius-border",
    type: "line" as const,
    paint: {
      "line-color": isWithinRadius === false ? "#ef4444" : "#10b981",
      "line-width": 2,
      "line-dasharray": [2, 2],
    },
  };

  return (
    <div className="w-full h-180 relative rounded-md">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Location Permission Required</AlertDialogTitle>
            <AlertDialogDescription>
              To check your attendance, we need to access your location. Please
              allow location access when prompted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelLocation}
              className="bg-danger-main hover:bg-danger-hover text-white cursor-pointer"
            >
              Deny
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLocation}
              className="bg-primary-900 hover:bg-primary-700 cursor-pointer"
            >
              Allow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg border p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IconBuildingOff className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <div className="font-medium text-gray-900">
                  {officeLocation.name}
                </div>
                <div className="text-sm text-gray-500">
                  Attendance radius: {officeLocation.radius}m
                </div>
              </div>
            </div>
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="px-3 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center cursor-pointer"
            >
              <IconCurrentLocation className="h-4 w-4 mr-1" />
              {isGettingLocation ? "Getting..." : "Update Location"}
            </button>
          </div>

          {/* Location Status */}
          {locationError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <IconAlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{locationError}</div>
            </div>
          )}

          {userLocation && isWithinRadius !== null && (
            <div
              className={`mt-3 p-3 border rounded-md flex items-start ${
                isWithinRadius
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {isWithinRadius ? (
                <IconCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <IconAlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div
                  className={`text-sm font-medium ${
                    isWithinRadius ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isWithinRadius
                    ? "You can check in!"
                    : "Move closer to office"}
                </div>
                <div
                  className={`text-xs ${
                    isWithinRadius ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Distance from office: {distance}m
                  {userLocation.accuracy > 50 && (
                    <span className="ml-2">
                      (±{Math.round(userLocation.accuracy)}m accuracy)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <Map
        {...viewState}
        ref={mapRef}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Office radius circle */}
        <Source id="office-circle" type="geojson" data={circleGeoJSON}>
          <Layer {...circleLayerStyle} id="office-circle-fill" />
          <Layer {...circleBorderLayerStyle} id="office-circle-border" />
        </Source>

        {/* Office marker */}
        <Marker
          longitude={officeLocation.longitude}
          latitude={officeLocation.latitude}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <div className="bg-white px-2 py-1 rounded-md shadow-lg border mb-1 text-sm font-medium text-gray-800 whitespace-nowrap">
              {officeLocation.name}
              <div className="text-xs text-gray-500">Office Location</div>
            </div>
            <div style={{ color: "#1f2937", fontSize: "24px" }}>
              <IconBuildingOff size={32} />
            </div>
          </div>
        </Marker>

        {/* User location marker */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <div
                className={`px-2 py-1 rounded-md shadow-lg border mb-1 text-sm font-medium whitespace-nowrap ${
                  isWithinRadius
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                Your Location
                <div className="text-xs">{distance}m from office</div>
              </div>
              <div
                style={{
                  color: isWithinRadius ? "#10b981" : "#ef4444",
                  fontSize: "24px",
                }}
              >
                <IconMapPinFilled size={32} />
              </div>
            </div>
          </Marker>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-lg border z-10">
        <div className="text-sm font-medium text-gray-800 mb-2">Legend</div>
        <div className="flex items-center mb-1">
          <div
            className={`w-4 h-4 bg-opacity-20 border-2 border-dashed rounded mr-2 ${
              isWithinRadius === false
                ? "bg-red-500 border-red-500"
                : "bg-green-500 border-green-500"
            }`}
          ></div>
          <span className="text-xs text-gray-600">
            Attendance check area ({officeLocation.radius}m)
          </span>
        </div>
        <div className="flex items-center mb-1">
          <IconBuildingOff className="h-4 w-4 text-gray-700 mr-2" />
          <span className="text-xs text-gray-600">Office location</span>
        </div>
        <div className="flex items-center">
          <IconMapPinFilled
            className={`h-4 w-4 mr-2 ${
              isWithinRadius ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="text-xs text-gray-600">Your current location</span>
        </div>
      </div>
    </div>
  );
}
