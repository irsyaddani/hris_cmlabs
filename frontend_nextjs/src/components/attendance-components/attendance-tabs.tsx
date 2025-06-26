"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import UploadFile from "../ui/upload-file";
import CheckclockMapUser from "../map/checkclock-map-user";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertMessage } from "@/components/ui/alert-message"; // Import AlertMessage

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
  const [companyId, setCompanyId] = useState<number | null>(1);
  const [setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state for alerts
  const [success, setSuccess] = useState<string | null>(null); // Success state for alerts
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for consistency
  const router = useRouter();

  const handleWorkTypeChange = (value: string) => {
    setSelectedWorkType(value);
    setAttendanceData(null);
    setError(null); // Clear error on work type change
    setSuccess(null); // Clear success on work type change
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

  const handleLocationValidation = (data: AttendanceData) => {
    console.log("Location validation result:", data);
    setAttendanceData(data);
  };

  const isPresentSubmitEnabled = () => {
    if (selectedWorkType === "wfh") {
      return true;
    }
    if (selectedWorkType === "wfo") {
      return attendanceData?.isWithinRadius || false;
    }
    return false;
  };

  const handlePresentSubmit = async () => {
    if (
      selectedWorkType === "wfo" &&
      (!attendanceData || !attendanceData.isWithinRadius)
    ) {
      setError(
        "Please ensure you are within the office area before checking in."
      );
      return;
    }

    setIsClockIn(true);
    setError(null);
    setSuccess(null);

    try {
      const now = new Date();
      const jakartaOffset = 7 * 60;
      const localOffset = now.getTimezoneOffset();
      const jakartaTime = new Date(
        now.getTime() + (jakartaOffset + localOffset) * 60 * 1000
      );

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
        setSuccess(
          `Check-in successful for ${selectedWorkType.toUpperCase()}! ✅`
        );
        // Redirect to /checkclock with success parameter
        router.push(`/checkclock?success=attendance-added`);
      } else {
        throw new Error("Check-in failed");
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      setError(
        error?.response?.data?.message || "Check-in failed. Please try again."
      );
    } finally {
      setIsClockIn(false);
    }
  };

  const handleAbsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

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

      setSuccess("Absent request submitted successfully!");
      router.push(`/checkclock?success=attendance-added`);
      setReason("");
    } catch (error: any) {
      console.error("Error submitting absent:", error);
      setError(
        error?.response?.data?.message || "Failed to submit absent request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Alerts */}
      {error && (
        <AlertMessage
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
          className="fixed bottom-6 right-6"
        />
      )}
      {success && (
        <AlertMessage
          type="success"
          title="Success!"
          message={success}
          onClose={() => setSuccess(null)}
          className="fixed bottom-6 right-6"
        />
      )}

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

            {selectedWorkType === "wfo" && (
              <>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="location">Location</Label>
                  <div className="rounded-lg w-full h-fit">
                    <CheckclockMapUser
                      officeLocation={{
                        id: "office-main",
                        name: locationData.location,
                        latitude: parseFloat(locationData.latitude),
                        longitude: parseFloat(locationData.longitude),
                        radius: locationData.radius,
                      }}
                      onLocationValidation={handleLocationValidation}
                    />
                  </div>
                </div>

                <div className="grid gap-2 w-full">
                  <Label htmlFor="detailAddress">Detail Address</Label>
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

            {selectedWorkType === "wfh" && (
              <div className="grid gap-2 w-full">
                <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800">
                  <p className="text-sm font-medium">
                    🏠 Working from Home - No location verification required
                  </p>
                </div>
              </div>
            )}

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
                  onClick={handlePresentSubmit}
                  size="lg"
                  disabled={!isPresentSubmitEnabled() || isClockIn}
                  className="bg-primary-900 hover:bg-primary-700 cursor-pointer disabled:bg-neutral-400 disabled:cursor-not-allowed"
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
                  clockin
                  onClick={handleAbsentSubmit}
                  size="lg"
                  className="bg-primary-900 hover:bg-primary-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
