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

interface SettingsSheetProps {
  children?: React.ReactNode;
}

export default function SettingSheet({ children }: SettingsSheetProps) {
  // State untuk location information
  const [locationData, setLocationData] = useState<LocationData>({
    location: "CMLABS HQ",
    detailAddress: "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
    latitude: "-7.9546738",
    longitude: "112.6322144",
    radius: 500,
  });

  // State untuk working hours
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    clockIn: "",
    clockOut: "",
    startBreak: "",
    endBreak: "",
  });

  // Handler untuk update location data
  const handleLocationChange = (field: keyof LocationData, value: string) => {
    setLocationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler untuk update working hours
  const handleWorkingHoursChange = (
    field: keyof WorkingHours,
    value: string
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler untuk menerima data dari map component
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

  const handleSubmit = () => {
    // Handle form submission
    console.log("Location Data:", locationData);
    console.log("Working Hours:", workingHours);
  };

  const handleCancel = () => {
    // Reset form or close modal
    setLocationData({
      location: "CMLABS HQ",
      detailAddress:
        "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
      latitude: "-7.9546738",
      longitude: "112.6322144",
      radius: 500,
    });
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

      <div className="space-y-5">
        {/* Location Information Section */}
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
              onChange={(e) => handleLocationChange("latitude", e.target.value)}
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
          <Input
            id="radius"
            type="number"
            placeholder="100"
            min="10"
            max="1000"
            value={locationData.radius}
            onChange={(e) =>
              handleLocationChange("radius", parseInt(e.target.value) || "500")
            }
          />
          <p className="text-xs text-muted-foreground">
            Maximum distance employees can be from the office location to clock
            in/out
          </p>
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
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
