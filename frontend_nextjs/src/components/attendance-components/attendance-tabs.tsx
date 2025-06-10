"use client";

import { AppWindowIcon, CodeIcon } from "lucide-react";
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

export function AttendanceTabs() {
  const [selectedWorkType, setSelectedWorkType] = useState("wfo");
  const router = useRouter();

  const handleWorkTypeChange = (value: string) => {
    setSelectedWorkType(value);
    // Reset attendance data when work type changes
    setAttendanceData(null);
  };

  interface OfficeConfig {
    id: string;
    name: string;
    longitude: number;
    latitude: number;
    radius: number;
  }

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

  // This would typically come from your API/database (admin config)
  const [officeConfig, setOfficeConfig] = useState<OfficeConfig>({
    id: "office-1",
    name: "CMLABS HQ",
    longitude: 112.6322144,
    latitude: -7.9546738,
    radius: 250, // 250 meters radius set by admin
  });

  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [isClockIn, setIsClockIn] = useState(false);

  // Fetch office configuration from admin settings
  useEffect(() => {
    // Replace this with your actual API call to get office config
    const fetchOfficeConfig = async () => {
      try {
        // Example API call:
        // const response = await fetch('/api/office-config');
        // const config = await response.json();
        // setOfficeConfig(config);

        console.log("Office config loaded:", officeConfig);
      } catch (error) {
        console.error("Failed to load office configuration:", error);
      }
    };

    fetchOfficeConfig();
  }, []);

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
    // For WFO: check if within radius
    if (
      selectedWorkType === "wfo" &&
      (!attendanceData || !attendanceData.isWithinRadius)
    ) {
      alert("Please ensure you are within the office area before checking in.");
      return;
    }

    setIsClockIn(true);

    try {
      // Prepare attendance data
      const checkInData = {
        timestamp: new Date().toISOString(),
        workType: selectedWorkType,
        location:
          selectedWorkType === "wfo" && attendanceData
            ? {
                latitude: attendanceData.userLocation.latitude,
                longitude: attendanceData.userLocation.longitude,
                accuracy: attendanceData.userLocation.accuracy,
              }
            : null,
        office:
          selectedWorkType === "wfo" && attendanceData
            ? {
                id: officeConfig.id,
                name: officeConfig.name,
                distance: attendanceData.distance,
              }
            : null,
        isWithinRadius:
          selectedWorkType === "wfo" ? attendanceData?.isWithinRadius : true,
      };

      console.log("Submitting check-in data:", checkInData);

      // Replace with your actual API call
      // const response = await fetch('/api/attendance/check-in', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(checkInData),
      // });

      // if (response.ok) {
      //   alert('Check-in successful!');
      // } else {
      //   throw new Error('Check-in failed');
      // }

      // For demo purposes:
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Check-in successful for ${selectedWorkType.toUpperCase()}! ✅`);
    } catch (error) {
      console.error("Check-in error:", error);
      alert("Check-in failed. Please try again.");
    } finally {
      setIsClockIn(false);
    }
  };

  const handleAbsentSubmit = async () => {
    // Handle absent submission logic here
    console.log("Submitting absent request...");
    alert("Absent request submitted successfully!");
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
                  <div className="rounded-lg w-full">
                    <CheckclockMapUser
                      officeLocation={officeConfig}
                      onLocationValidation={handleLocationValidation}
                    />
                  </div>
                </div>

                <div className="grid gap-2 w-full">
                  <Label htmlFor="detailAddress">Detail Address</Label>
                  <Input
                    id="detailAddress"
                    type="text"
                    placeholder="Jl. Seruni No. 9, Lowokwaru"
                    value={attendanceData?.message || ""}
                    readOnly
                  />
                </div>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="text"
                      placeholder="Latitude"
                      value={
                        attendanceData?.userLocation.latitude.toString() || ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="text"
                      placeholder="Longitude"
                      value={
                        attendanceData?.userLocation.longitude.toString() || ""
                      }
                      readOnly
                    />
                  </div>
                </div>
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
              <RadioGroup defaultValue="sick" className="flex gap-5">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sick" id="r1" />
                  <Label htmlFor="r1">Sick</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annualLeave" id="r2" />
                  <Label htmlFor="r2">Annual Leave</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permission" id="r3" />
                  <Label htmlFor="r3">Permission</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2 w-full">
              <Label>Reason</Label>
              <Textarea placeholder="Enter a reason..." />
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
