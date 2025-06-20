"use client";

import { AttendanceTabs } from "@/components/attendance-components/attendance-tabs";

export default function AttendanceUserPage() {
  // Dynamic date for today
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Today's Clock in</h1>
        <p className="text-sm font-reguler text-muted-foreground">
          {today} (Today)
        </p>
      </div>

      <AttendanceTabs />
    </div>
  );
}
