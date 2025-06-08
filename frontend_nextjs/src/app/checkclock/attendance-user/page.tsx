"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AttendanceTabs } from "@/components/attendance-components/attendance-tabs";

export default function AttendanceUserPage() {
  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Today's Clock in</h1>
        <p className="text-sm font-reguler text-muted-foreground">
          Friday, May 6, 2025 (Today)
        </p>
      </div>

      <AttendanceTabs />

      <div className="flex justify-end">
        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="lg">
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gap-4 bg-primary-900 hover:bg-primary-700 cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
