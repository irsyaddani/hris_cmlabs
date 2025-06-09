"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CheckclockMap from "@/components/map/checkclock-map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationData {
  location: string;
  detailAddress: string;
  latitude: string;
  longitude: string;
  radius: number;
}

interface WorkingHours {
  clockIn: string;
  clockOut: string;
  startBreak: string;
  endBreak: string;
}

export default function ClockHoursSettingPage() {
  // State for location information
  const [locationData, setLocationData] = useState<LocationData>({
    location: "CMLABS HQ",
    detailAddress: "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
    latitude: "-7.9546738",
    longitude: "112.6322144",
    radius: 250, // Default 250m
  });

  // State for radius input
  const [radiusInput, setRadiusInput] = useState<string>("250");

  // State for working hours
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    clockIn: "",
    clockOut: "",
    startBreak: "",
    endBreak: "",
  });

  // Handler for updating location data (excluding radius)
  const handleLocationChange = (field: keyof LocationData, value: string) => {
    if (field !== "radius") {
      setLocationData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handler for radius input change
  const handleRadiusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadiusInput(e.target.value);
  };

  // Handler for updating working hours
  const handleWorkingHoursChange = (
    field: keyof WorkingHours,
    value: string
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler for receiving data from map component
  const handleMapDataChange = (mapData: {
    location?: string;
    address?: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocationData((prev) => ({
      ...prev,
      ...(mapData.location && { location: mapData.location }),
      ...(mapData.address && { detailAddress: mapData.address }),
      latitude: mapData.latitude.toString(),
      longitude: mapData.longitude.toString(),
    }));
  };

  // Handler for setting radius from button
  const handleSetRadius = () => {
    const newRadius = parseInt(radiusInput, 10);
    if (isNaN(newRadius) || newRadius < 50 || newRadius > 1000) {
      alert("Please enter a valid radius between 50 and 1000 meters.");
      setRadiusInput(locationData.radius.toString()); // Reset to current radius
      return;
    }
    setLocationData((prev) => ({
      ...prev,
      radius: newRadius,
    }));
    console.log(`✅ Radius set to ${newRadius}m`);
  };

  const handleSubmit = () => {
    console.log("Location Data:", locationData);
    console.log("Working Hours:", workingHours);
  };

  const handleCancel = () => {
    setLocationData({
      location: "CMLABS HQ",
      detailAddress:
        "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
      latitude: "-7.9546738",
      longitude: "112.6322144",
      radius: 250, // Reset to 250m
    });
    setRadiusInput("250");
    setWorkingHours({
      clockIn: "",
      clockOut: "",
      startBreak: "",
      endBreak: "",
    });
  };

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <h1 className="font-bold text-2xl">Clock Hours Setting</h1>

      <div className="space-y-10">
        <div className="space-y-5">
          {/* Location Information Section */}
          <div className="space-y-4">
            <h3 className="text-md text-muted-foreground mb-6">
              Location Information
            </h3>
            <hr className="border-neutral-200 my-4" />
          </div>

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

          {/* Map Component */}
          <div className="border border-neutral-200 rounded-lg w-full">
            <CheckclockMap
              onLocationChange={handleMapDataChange}
              initialRadius={locationData.radius}
            />
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

          <div className="grid gap-2 w-full">
            <Label htmlFor="radius">Radius (meters)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="radius"
                type="number"
                placeholder="250"
                min="50"
                max="1000"
                value={radiusInput}
                onChange={handleRadiusInputChange}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className=" hover:bg-neutral-200 cursor-pointer"
                onClick={handleSetRadius}
              >
                Set
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum distance employees can be from the office location to
              clock in/out
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Working Hours Section */}
          <div className="space-y-4">
            <h3 className="text-md text-muted-foreground mb-6">
              Working Hours
            </h3>
            <hr className="border-neutral-200 my-4" />
          </div>

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
      </div>

      <div className="flex justify-end">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gap-4 bg-primary-900 hover:bg-primary-700 cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
