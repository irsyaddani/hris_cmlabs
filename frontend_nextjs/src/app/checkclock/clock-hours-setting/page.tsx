"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CheckclockMap from "@/components/map/checkclock-map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";

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

interface ApiErrorResponse {
  message?: string;
  data?: unknown;
}

interface UserProfileResponse {
  data?: {
    company_id?: number;
  };
  company_id?: number;
}

interface ClockSettingsResponse {
  data?: {
    locationName?: string;
    detailAddress?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    clockIn?: string;
    clockOut?: string;
    breakStart?: string;
    breakEnd?: string;
  };
}

const defaultLocation: LocationData = {
  location: "CMLABS HQ",
  detailAddress: "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
  latitude: "-7.9546738",
  longitude: "112.6322144",
  radius: 250,
};

export default function ClockHoursSettingPage() {
  const [locationData, setLocationData] =
    useState<LocationData>(defaultLocation);
  const [radiusInput, setRadiusInput] = useState<string>("250");
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    clockIn: "",
    clockOut: "",
    startBreak: "",
    endBreak: "",
  });
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch company_id from /api/user
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
        const response = await axios.get<UserProfileResponse>(
          "http://localhost:8000/api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ API response:", response.data);

        // Handle possible nested data structure
        const userData = response.data.data || response.data;
        if (!userData.company_id) {
          throw new Error("Company ID not found in user profile.");
        }
        setCompanyId(userData.company_id);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ApiErrorResponse>;
          console.error(
            "Axios error:",
            axiosError.message,
            axiosError.response?.data
          );
          setError("Failed to load user profile. Please log in again.");
        } else {
          console.error("Unknown error:", err);
          setError("An unexpected error occurred.");
        }
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
        const response = await axios.get<ClockSettingsResponse>(
          `http://localhost:8000/api/clock-settings/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("✅ Clock settings response:", response.data);
        const data = response.data.data;

        const newLocationData = {
          location: data?.locationName ?? defaultLocation.location,
          detailAddress: data?.detailAddress ?? defaultLocation.detailAddress,
          latitude: data?.latitude?.toString() ?? defaultLocation.latitude,
          longitude: data?.longitude?.toString() ?? defaultLocation.longitude,
          radius: data?.radius ?? defaultLocation.radius,
        };

        setLocationData(newLocationData);
        setRadiusInput(String(data?.radius ?? defaultLocation.radius));
        setWorkingHours({
          clockIn: data?.clockIn?.slice(0, 5) ?? "",
          clockOut: data?.clockOut?.slice(0, 5) ?? "",
          startBreak: data?.breakStart?.slice(0, 5) ?? "",
          endBreak: data?.breakEnd?.slice(0, 5) ?? "",
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          console.error(
            "Error fetching settings:",
            axiosError.message,
            axiosError.response?.data
          );
        } else {
          console.error("Unknown error:", error);
        }
        setError("Failed to load clock settings.");
        setLocationData(defaultLocation);
        setRadiusInput("250");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [companyId]);

  const handleLocationChange = (field: keyof LocationData, value: string) => {
    if (field !== "radius") {
      setLocationData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleRadiusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadiusInput(e.target.value);
  };

  const handleWorkingHoursChange = (
    field: keyof WorkingHours,
    value: string
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleSetRadius = () => {
    const newRadius = parseInt(radiusInput, 10);
    if (isNaN(newRadius) || newRadius < 50 || newRadius > 1000) {
      alert("Please enter a valid radius between 50 and 1000 meters.");
      setRadiusInput(locationData.radius.toString());
      return;
    }
    setLocationData((prev) => ({
      ...prev,
      radius: newRadius,
    }));
    setRadiusInput(String(newRadius));
    console.log(`✅ Radius set to ${newRadius}m`);
  };

  const handleSubmit = async () => {
    if (!companyId) {
      alert("Company ID not available. Please log in again.");
      return;
    }

    try {
      console.log("📡 Saving clock settings...");
      await axios.post(
        `http://localhost:8000/api/clock-settings`,
        {
          company_id: companyId,
          locationName: locationData.location,
          detailAddress: locationData.detailAddress,
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
          radius: locationData.radius,
          clockIn: workingHours.clockIn,
          clockOut: workingHours.clockOut,
          breakStart: workingHours.startBreak,
          breakEnd: workingHours.endBreak,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Settings saved successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        console.error(
          "Error saving settings:",
          axiosError.message,
          axiosError.response?.data
        );
      } else {
        console.error("Unknown error:", error);
      }
      alert("Failed to save settings. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <h1 className="font-bold text-2xl">Clock Hours Setting</h1>

      <div className="space-y-10">
        <div className="space-y-5">
          <div className="space-y-4">
            <h3 className="text-md text-muted-foreground mb-6">
              Location Information
            </h3>
            <hr className="border-neutral-200 my-4" />
          </div>

          <div className="grid gap-2 w-full">
            <Label htmlFor="locationName">Location Name</Label>
            <Input
              id="locationName"
              type="text"
              placeholder="CMLABS HQ"
              value={locationData.location}
              onChange={(e) => handleLocationChange("location", e.target.value)}
            />
          </div>

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
                className="hover:bg-neutral-200 cursor-pointer"
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
          <div className="space-y-4">
            <h3 className="text-md text-muted-foreground mb-6">
              Working Hours
            </h3>
            <hr className="border-neutral-200 my-4" />
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="grid gap-2 w-full">
              <Label htmlFor="clockIn">Clock In</Label>
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
              <Label htmlFor="clockOut">Clock Out</Label>
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
            className="hover:bg-neutral-200 cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gap-4 bg-primary-900 hover:bg-primary-700 cursor-pointer"
            onClick={handleSubmit}
            disabled={!companyId}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
