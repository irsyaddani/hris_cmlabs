// app/(dashboard)/page.tsx
"use client";

import { IconUsers } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SimpleDatePicker } from "@/components/simple-date-picker";
import Link from "next/link";
import { BarChartsHori } from "@/components/ui/bar-charts-hori";
import { BarCharts } from "@/components/ui/bar-charts";
import { PieChartsLabel } from "@/components/ui/pie-charts-label";
import { MiniCard } from "@/components/ui/mini-card";
import { ChartBarLabel } from "@/components/ui/bar-charts-label";
import { useUser } from "@/lib/user-context";

// Admin Dashboard Component
function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MiniCard
        icon={IconUsers}
        title="Total Employee"
        value="1200 Orang"
        description="Update: 20 March 2025"
      />
      <MiniCard
        icon={IconUsers}
        title="Total Employee"
        value="1200 Orang"
        description="Update: 20 March 2025"
      />
      <MiniCard
        icon={IconUsers}
        title="Total Employee"
        value="1200 Orang"
        description="Update: 20 March 2025"
      />
      <MiniCard
        icon={IconUsers}
        title="Total Employee"
        value="1200 Orang"
        description="Update: 20 March 2025"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-full">
        <BarCharts />
        <BarChartsHori />
        <PieChartsLabel />
      </div>
    </div>
  );
}

// User Dashboard Component
function UserDashboard({ userName }: { userName: string }) {
  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Welcome, {userName}</h1>
          <p className="text-sm font-regular text-muted-foreground">
            Saturday, January 22, 2025 (Today)
          </p>
        </div>
        <SimpleDatePicker placeholder="Filter by date" className="h-9" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="grid gap-4">
          <div
            className="flex items-center justify-between gap-15 p-5 border border-neutral-200 rounded-md"
            style={{
              boxShadow: "0px 16px 48px -5px #EEF0F4",
            }}
          >
            <p className="flex flex-col items-start gap-2">
              <span className="text-xl font-medium">
                Attendance is now open!
              </span>
              <span className="text-base font-regular text-muted-foreground">
                Don’t forget to check in today and make sure your attendance is
                recorded correctly.
              </span>
            </p>
            <Link href="/checkclock">
              <Button
                variant="default"
                size="sm"
                className="gap-4 bg-primary-900 hover:bg-primary-700 text-white hover:text-white"
              >
                Clock in
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MiniCard icon={IconUsers} title="Work Hours" value="120h 54m" />
            <MiniCard icon={IconUsers} title="On Time" value="20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MiniCard icon={IconUsers} title="Late" value="5" />
            <MiniCard icon={IconUsers} title="Absent" value="10" />
          </div>
        </div>
        <PieChartsLabel />
      </div>
      <ChartBarLabel />
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
  return (
    <div className="p-4 text-gray-500 text-sm">
      Loading...
    </div>
  );
}

  return (
    <div className="flex flex-col flex-1 p-6 gap-5">
      {user.level === "admin" ? (
        <AdminDashboard />
      ) : (
        <UserDashboard userName={user.name} />
      )}
    </div>
  );
}

