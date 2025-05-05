"use client";

import { BarChartsHori } from "@/components/ui/bar-charts-hori";
import { BarCharts } from "@/components/ui/bar-charts";
import { PieChartsLabel } from "@/components/ui/pie-charts-label";
import { MiniCard } from "@/components/ui/mini-card";
import { IconCategory, IconUsers } from "@tabler/icons-react"; // ini yang kurang

export default function AdminDashboardPage() {
  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-5">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BarCharts />
        <BarChartsHori />
        <PieChartsLabel />
      </div>
    </div>
  );
}
