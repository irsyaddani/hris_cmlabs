"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CheckClock {
  id: number;
  name: string;
  avatarUrl?: string;
  position: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number;
  approval: string;
  status: string;
  reason?: string;
  proofFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  } | null;
  startDate?: string;
  endDate?: string;
}

interface PieChartsLabelProps {
  attendanceData?: CheckClock[];
  loading?: boolean;
  error?: string | null;
  filterByUser?: string; // Optional: filter data by specific user
  title?: string; // Optional: custom title
  description?: string; // Optional: custom description
}

const chartConfig = {
  count: {
    label: "Employees",
  },
  "on time": {
    label: "On Time",
    color: "#10b981", // green
  },
  late: {
    label: "Late",
    color: "#f59e0b", // amber
  },
  permit: {
    label: "Permit",
    color: "#3b82f6", // blue
  },
  sick: {
    label: "Sick",
    color: "#8b5cf6", // purple
  },
  absent: {
    label: "Absent",
    color: "#ef4444", // red
  },
  awaiting: {
    label: "Awaiting",
    color: "#6b7280", // gray
  },
} satisfies ChartConfig;

// Function untuk menghitung statistik attendance
function calculateAttendanceStats(data: CheckClock[], filterByUser?: string) {
  const today = new Date().toISOString().split("T")[0];

  // Filter data untuk hari ini saja
  let todayData = data.filter((item) => {
    if (!item.clockIn) return item.status === "awaiting";
    const clockInDate = new Date(item.clockIn).toISOString().split("T")[0];
    return clockInDate === today;
  });

  // Filter by user if specified (for user dashboard)
  if (filterByUser) {
    todayData = todayData.filter((item) => item.name === filterByUser);
  }

  const statusCount = todayData.reduce((acc, item) => {
    const status = item.status?.toLowerCase() || "awaiting";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert ke format yang dibutuhkan chart
  const chartData = Object.entries(statusCount).map(([status, count]) => ({
    status,
    count,
    // fill: chartConfig[status as keyof typeof chartConfig]?.color || "#6b7280",
  }));

  const total = todayData.length;
  const onTimePercentage =
    total > 0
      ? (((statusCount["on time"] || 0) / total) * 100).toFixed(1)
      : "0";

  return {
    chartData,
    total,
    onTimePercentage: parseFloat(onTimePercentage),
    statusCount,
  };
}

export function PieChartsLabel({
  attendanceData = [],
  loading = false,
  error = null,
  filterByUser,
  title = "Today's Attendance",
  description,
}: PieChartsLabelProps) {
  const stats = useMemo(
    () => calculateAttendanceStats(attendanceData, filterByUser),
    [attendanceData, filterByUser]
  );

  const cardTitle = filterByUser
    ? title || "Your Attendance"
    : title || "Today's Attendance";
  const cardDescription = description || new Date().toLocaleDateString();

  // Handle loading state
  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>Loading attendance data...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
          <div className="text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
          <div className="text-red-500 text-center">
            <p className="font-medium">Failed to load attendance data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data
  if (stats.total === 0) {
    const emptyMessage = filterByUser
      ? "No attendance record found for today"
      : "No attendance data";
    const emptyDescription = filterByUser
      ? "You haven't clocked in today"
      : "No records found for today";

    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
          <div className="text-muted-foreground text-center">
            <p className="font-medium">{emptyMessage}</p>
            <p className="text-sm mt-1">{emptyDescription}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const footerText = filterByUser
    ? `Your status today • ${Object.entries(stats.statusCount)
        .map(
          ([status, count]) =>
            `${
              chartConfig[status as keyof typeof chartConfig]?.label || status
            }: ${count}`
        )
        .join(", ")}`
    : `Total ${stats.total} employees • ${Object.entries(stats.statusCount)
        .map(
          ([status, count]) =>
            `${
              chartConfig[status as keyof typeof chartConfig]?.label || status
            }: ${count}`
        )
        .join(", ")}`;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="count"
                  hideLabel
                  formatter={(value, name, props) => [
                    `${value} ${filterByUser ? "record" : "employees"}`,
                    chartConfig[
                      props.payload.status as keyof typeof chartConfig
                    ]?.label || props.payload.status,
                  ]}
                />
              }
            />
            <Pie data={stats.chartData} dataKey="count">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {stats.onTimePercentage}% on time today{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
