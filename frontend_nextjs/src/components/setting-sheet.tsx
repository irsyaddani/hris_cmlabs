"use client";

import { ReactNode, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TextareaField } from "./form/text-area";
import { Input } from "./ui/input";
// import Maps from "./map/map";

interface SettingsSheetProps {
  children: ReactNode; // Trigger element (button, icon, text, etc.)
}

// Default position
const DEFAULT_POSITION = { lat: -7.9546738, lng: 112.6322144 };

export function SettingSheet({ children }: SettingsSheetProps) {
  // State untuk location information
  const [locationData, setLocationData] = useState({
    location: "",
    detailAddress: "",
    latitude: DEFAULT_POSITION.lat.toString(),
    longitude: DEFAULT_POSITION.lng.toString(),
  });

  // State untuk working hours
  const [workingHours, setWorkingHours] = useState({
    clockIn: "",
    clockOut: "",
    startBreak: "",
    endBreak: "",
  });

  // Function untuk reverse geocoding menggunakan Google Maps API
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key not found");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        // Extract location name (bisa dari establishment, premise, atau sublocality)
        const establishment = addressComponents.find(
          (comp: any) =>
            comp.types.includes("establishment") ||
            comp.types.includes("premise")
        );
        const sublocality = addressComponents.find(
          (comp: any) =>
            comp.types.includes("sublocality_level_1") ||
            comp.types.includes("sublocality")
        );

        const locationName =
          establishment?.long_name || sublocality?.long_name || "CMLABS HQ";

        // Set detail address (formatted address dari Google)
        const detailAddress = result.formatted_address;

        setLocationData((prev) => ({
          ...prev,
          location: locationName,
          detailAddress: detailAddress,
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      // Fallback ke default values jika gagal
      setLocationData((prev) => ({
        ...prev,
        location: "CMLABS HQ",
        detailAddress:
          "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa TImur 65141",
      }));
    }
  };

  // Load default data saat komponen mount
  useEffect(() => {
    // Set koordinat default
    setLocationData((prev) => ({
      ...prev,
      latitude: DEFAULT_POSITION.lat.toString(),
      longitude: DEFAULT_POSITION.lng.toString(),
    }));

    // Fetch address information dari koordinat
    reverseGeocode(DEFAULT_POSITION.lat, DEFAULT_POSITION.lng);
  }, []);

  // Handler untuk ketika posisi marker berubah dari map
  const handleMapPositionChange = (newPosition: {
    lat: number;
    lng: number;
  }) => {
    setLocationData((prev) => ({
      ...prev,
      latitude: newPosition.lat.toString(),
      longitude: newPosition.lng.toString(),
    }));

    // Update alamat berdasarkan koordinat baru
    reverseGeocode(newPosition.lat, newPosition.lng);
  };

  // Handler untuk update location data
  const handleLocationChange = (field: string, value: string) => {
    setLocationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler untuk update working hours
  const handleWorkingHoursChange = (field: string, value: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="px-0">
        <div className="sticky top-0 bg-background px-6 border-b">
          <SheetHeader>
            <SheetTitle>Clock Hours Setting</SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Attendance Information Section */}
          <h3 className="text-md text-muted-foreground mb-6">
            Location Information
          </h3>

          <div className="grid gap-2 w-full">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="CMLABS HQ"
              value={locationData.location}
              onChange={(e) => handleLocationChange("location", e.target.value)}
            />
          </div>

          <div className="border border-neutral-200 rounded-lg w-full">
            {/* <Maps
              position={{
                lat: parseFloat(locationData.latitude) || DEFAULT_POSITION.lat,
                lng: parseFloat(locationData.longitude) || DEFAULT_POSITION.lng,
              }}
              onPositionChange={handleMapPositionChange}
            /> */}
          </div>

          <div className="grid gap-2 w-full">
            <Label htmlFor="detailAddress">Detail Address</Label>
            <Input
              id="detailAddress"
              type="text"
              placeholder="Jl. Seruni No. 9, Lowokwaru"
              value={locationData.detailAddress}
              onChange={(e) =>
                handleLocationChange("detailAddress", e.target.value)
              }
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="grid gap-2 w-full">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                placeholder="Latitude"
                value={locationData.latitude}
                onChange={(e) =>
                  handleLocationChange("latitude", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                placeholder="Longitude"
                value={locationData.longitude}
                onChange={(e) =>
                  handleLocationChange("longitude", e.target.value)
                }
              />
            </div>
          </div>

          {/* Working Hours Section */}
          <h3 className="text-md text-muted-foreground mb-6">Working Hours</h3>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="grid gap-2 w-full">
              <Label htmlFor="clockIn">Clock in</Label>
              <Input
                type="time"
                id="clockIn"
                aria-label="Choose time"
                className="w-full"
                value={workingHours.clockIn}
                onChange={(e) =>
                  handleWorkingHoursChange("clockIn", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="clockOut">Clock out</Label>
              <Input
                type="time"
                id="clockOut"
                aria-label="Choose time"
                className="w-full"
                value={workingHours.clockOut}
                onChange={(e) =>
                  handleWorkingHoursChange("clockOut", e.target.value)
                }
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="grid gap-2 w-full">
              <Label htmlFor="startBreak">Start Break</Label>
              <Input
                type="time"
                id="startBreak"
                aria-label="Choose time"
                className="w-full"
                value={workingHours.startBreak}
                onChange={(e) =>
                  handleWorkingHoursChange("startBreak", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="endBreak">End Break</Label>
              <Input
                type="time"
                id="endBreak"
                aria-label="Choose time"
                className="w-full"
                value={workingHours.endBreak}
                onChange={(e) =>
                  handleWorkingHoursChange("endBreak", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-background px-6 py-4 border-t">
          <SheetFooter className="flex justify-end">
            <SheetClose asChild>
              <Button
                size="default"
                variant="default"
                className="gap-2 bg-color-primary-900 text-white hover:bg-color-primary-700"
              >
                Simpan
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
