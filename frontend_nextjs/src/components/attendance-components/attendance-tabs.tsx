// Fixed version of your AttendanceTabs component

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import UploadFile from "../ui/upload-file";
import CheckclockMapUser from "../map/checkclock-map-user";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LocationData {
  location: string;
  detailAddress: string;
  latitude: string;
  longitude: string;
  radius: number;
}

const defaultLocation: LocationData = {
  location: "CMLABS HQ",
  detailAddress: "Jl. Seruni No. 9, Lowokwaru, Kota Malang, Jawa Timur 65141",
  latitude: "-7.9546738",
  longitude: "112.6322144",
  radius: 250,
};

export function AttendanceTabs() {
  const [locationData, setLocationData] =
    useState<LocationData>(defaultLocation);
  const [setRadiusInput] = useState<string>("250");
  const [selectedWorkType, setSelectedWorkType] = useState("wfo");
  const [companyId, setCompanyId] = useState<number | null>(1); // FIX: Set actual company ID
  const [setIsLoading] = useState(true);
  const [setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleWorkTypeChange = (value: string) => {
    setSelectedWorkType(value);
    // Reset attendance data when work type changes
    setAttendanceData(null);
  };

  interface AttendanceData {
    isWithinRadius: boolean;
    distance: number;
    userLocation: {
      longitude: number;
      latitude: number;
      accuracy: number;
    };
    message: string;
  }

  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [isClockIn, setIsClockIn] = useState(false);

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
        const newLocationData = {
          location: data?.locationName ?? defaultLocation.location,
          detailAddress: data?.detailAddress ?? defaultLocation.detailAddress,
          latitude: data?.latitude?.toString() ?? defaultLocation.latitude,
          longitude: data?.longitude?.toString() ?? defaultLocation.longitude,
          radius: data?.radius ?? defaultLocation.radius,
        };

        setLocationData(newLocationData);
        setRadiusInput(String(data?.radius ?? defaultLocation.radius));
      } catch (error: unknown) {
        console.error(
          "Error fetching settings:",
          error instanceof Error ? error.message : "Unknown error",
          error instanceof Error && "response" in error
            ? (error as any).response?.data
            : undefined
        );
        setError("Failed to load clock settings.");
        setLocationData(defaultLocation);
        setRadiusInput("250");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [companyId]);

  // Handle location validation from the map component
  const handleLocationValidation = (data: AttendanceData) => {
    console.log("Location validation result:", data);
    setAttendanceData(data);
  };

  // Check if submit should be enabled for Present tab
  const isPresentSubmitEnabled = () => {
    if (selectedWorkType === "wfh") {
      return true; // WFH is always enabled
    }
    if (selectedWorkType === "wfo") {
      return attendanceData?.isWithinRadius || false; // WFO only if within radius
    }
    return false;
  };

  // Handle check-in submission
  const handlePresentSubmit = async () => {
    if (
      selectedWorkType === "wfo" &&
      (!attendanceData || !attendanceData.isWithinRadius)
    ) {
      alert("Please ensure you are within the office area before checking in.");
      return;
    }

    setIsClockIn(true);

    try {
      const now = new Date();
      const jakartaOffset = 7 * 60;
      const localOffset = now.getTimezoneOffset();
      const jakartaTime = new Date(
        now.getTime() + (jakartaOffset + localOffset) * 60 * 1000
      );

      console.log(jakartaTime.toISOString());
      const jakartaDateOnly = jakartaTime.toISOString().split("T")[0];

      const payload = {
        type: selectedWorkType,
        clock_in: jakartaDateOnly,
        latitude:
          selectedWorkType === "wfo" && attendanceData
            ? attendanceData.userLocation.latitude
            : null,
        longitude:
          selectedWorkType === "wfo" && attendanceData
            ? attendanceData.userLocation.longitude
            : null,
      };

      const response = await axios.post(
        "http://localhost:8000/api/checkclock",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(`Check-in successful for ${selectedWorkType.toUpperCase()}! ✅`);
      } else {
        throw new Error("Check-in failed");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert("Check-in failed. Please try again.");
    } finally {
      setIsClockIn(false);
    }
  };

  const handleAbsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const jakartaOffset = 7 * 60;
    const localOffset = now.getTimezoneOffset();
    const jakartaTime = new Date(
      now.getTime() + (jakartaOffset + localOffset) * 60 * 1000
    );

    const jakartaDateOnly = jakartaTime.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        "http://localhost:8000/api/checkclock",
        {
          type: selectedWorkType,
          reason: reason,
          start_date: jakartaDateOnly,
          end_date: jakartaDateOnly,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Absent request submitted successfully!");
      console.log("Submitted:", response.data);
      setReason("");
    } catch (error: any) {
      console.error("Error submitting absent:", error);
      alert(
        error?.response?.data?.message || "Failed to submit absent request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="present">
        <TabsList>
          <TabsTrigger value="present">Present</TabsTrigger>
          <TabsTrigger value="absent">Absent</TabsTrigger>
        </TabsList>
        <TabsContent value="present">
          <div className="flex flex-col gap-5">
            <div className="grid gap-3 w-full">
              <Label htmlFor="Work Type">Work Type</Label>
              <RadioGroup
                value={selectedWorkType}
                className="flex gap-5"
                onValueChange={handleWorkTypeChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wfo" id="r1" />
                  <Label htmlFor="r1">WFO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wfh" id="r2" />
                  <Label htmlFor="r2">WFH</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Only show map and location fields for WFO */}
            {selectedWorkType === "wfo" && (
              <>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="location">Location</Label>
                  <div className="rounded-lg w-full h-fit">
                    {/* FIX: Always use office coordinates, not user coordinates */}
                    <CheckclockMapUser
                      officeLocation={{
                        id: "office-main",
                        name: locationData.location,
                        latitude: parseFloat(locationData.latitude), // Always office coordinates
                        longitude: parseFloat(locationData.longitude), // Always office coordinates
                        radius: locationData.radius,
                      }}
                      onLocationValidation={handleLocationValidation}
                    />
                  </div>
                </div>

                <div className="grid gap-2 w-full">
                  <Label htmlFor="detailAddress">Detail Address</Label>
                  {/* FIX: Show office address, not validation message */}
                  <Input
                    id="detailAddress"
                    type="text"
                    placeholder="Office address"
                    value={locationData.detailAddress}
                    readOnly
                  />
                </div>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="latitude">User Latitude</Label>
                    {/* FIX: Show user coordinates when available */}
                    <Input
                      id="latitude"
                      type="text"
                      placeholder="User Latitude"
                      value={
                        attendanceData?.userLocation.latitude.toString() ||
                        "Not detected"
                      }
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="longitude">User Longitude</Label>
                    {/* FIX: Show user coordinates when available */}
                    <Input
                      id="longitude"
                      type="text"
                      placeholder="User Longitude"
                      value={
                        attendanceData?.userLocation.longitude.toString() ||
                        "Not detected"
                      }
                      readOnly
                    />
                  </div>
                </div>

                {/* Show validation status */}
                {attendanceData && (
                  <div className="grid gap-2 w-full">
                    <Label>Location Status</Label>
                    <div
                      className={`p-3 rounded-lg border ${
                        attendanceData.isWithinRadius
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {attendanceData.message}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* WFH message */}
            {selectedWorkType === "wfh" && (
              <div className="grid gap-2 w-full">
                <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800">
                  <p className="text-sm font-medium">
                    🏠 Working from Home - No location verification required
                  </p>
                </div>
              </div>
            )}

            {/* Cancel and Submit Buttons for Present */}
            <div className="flex justify-end">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="hover:bg-neutral-200 cursor-pointer"
                  onClick={() => router.push(`/checkclock/`)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handlePresentSubmit}
                  size="lg"
                  disabled={!isPresentSubmitEnabled() || isClockIn}
                  className="bg-primary-900 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {isClockIn ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="absent">
          <div className="flex flex-col gap-5">
            <div className="grid gap-3 w-full">
              <Label htmlFor="Work Type">Absent Type</Label>
              <RadioGroup
                value={selectedWorkType}
                onValueChange={(value) => setSelectedWorkType(value)}
                className="flex gap-5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sick" id="r1" />
                  <Label htmlFor="r1">Sick</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual leave" id="r2" />
                  <Label htmlFor="r2">Annual Leave</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permit" id="r3" />
                  <Label htmlFor="r3">Permission</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2 w-full">
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter a reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="grid gap-2 w-full">
              <Label>Proof of Absent</Label>
              <UploadFile />
            </div>

            {/* Cancel and Submit Buttons for Absent */}
            <div className="flex justify-end">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="hover:bg-neutral-200 cursor-pointer"
                  onClick={() => router.push(`/checkclock`)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleAbsentSubmit}
                  size="lg"
                  className="bg-primary-900 hover:bg-primary-700"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
