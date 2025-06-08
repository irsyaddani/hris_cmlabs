import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
// import Maps from "@/components/map/map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import UploadFile from "../ui/upload-file";
import CheckclockMap from "../map/checkclock-map";

export function AttendanceTabs() {
  const [selectedWorkType, setselectedWorkType] = useState("wfo");

  const handleWorkTypeChange = (value: string) => {
    setselectedWorkType(value);
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
            {/* <RadioGroup
                value={selectedWorkType}
                onValueChange={handleWorkTypeChange}
                className="grid grid-cols-2 gap-2 w-full"
              >
                <div className="flex items-center gap-3 ">
                  <RadioGroupItem value="wfo" id="r1" />
                  <Label htmlFor="r1">WFO</Label>
                </div>
                <div className="flex items-center gap-3 ">
                  <RadioGroupItem value="wfa" id="r2" />
                  <Label htmlFor="r1">WFA</Label>
                </div>
              </RadioGroup> */}
            <div className="grid gap-3 w-full">
              <Label htmlFor="Work Type">Work Type</Label>
              <RadioGroup defaultValue="wfo" className="flex gap-5">
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

            <div className="grid gap-2 w-full">
              <Label htmlFor="location">Location</Label>

              <div className=" rounded-lg w-full">
                <CheckclockMap />
              </div>
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="detailAddress">Detail Address</Label>
              <Input
                id="detailAddress"
                type="text"
                placeholder="Jl. Seruni No. 9, Lowokwaru"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="grid gap-2 w-full">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="text" placeholder="Latitude" />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="text" placeholder="Longitude" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="absent">
          <div className="flex flex-col gap-5">
            {/* <RadioGroup
                value={selectedWorkType}
                onValueChange={handleWorkTypeChange}
                className="grid grid-cols-2 gap-2 w-full"
              >
                <div className="flex items-center gap-3 ">
                  <RadioGroupItem value="wfo" id="r1" />
                  <Label htmlFor="r1">WFO</Label>
                </div>
                <div className="flex items-center gap-3 ">
                  <RadioGroupItem value="wfa" id="r2" />
                  <Label htmlFor="r1">WFA</Label>
                </div>
              </RadioGroup> */}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
