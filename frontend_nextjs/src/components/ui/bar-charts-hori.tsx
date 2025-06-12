// "use client";

// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, XAxis, YAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig;

// export function BarChartsHori() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Horizontal</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             layout="vertical"
//             margin={{
//               left: -20,
//             }}
//           >
//             <XAxis type="number" dataKey="desktop" hide />
//             <YAxis
//               dataKey="month"
//               type="category"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  count: {
    label: "Total Employees",
    color: "var(--chart-1)",
  },
  contract: {
    label: "Contract",
    color: "#3b82f6",
  },
  employee: {
    label: "Employee",
    color: "#10b981",
  },
  probation: {
    label: "Probation",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

interface Employee {
  employeeType: "contract" | "employee" | "probation";
  // tambahkan properti lain sesuai kebutuhan
}

interface EmployeeTypeChartProps {
  employees: Employee[];
  loading?: boolean;
  error?: string | null;
}

export function BarChartsHori({
  employees = [],
  loading = false,
  error = null,
}: EmployeeTypeChartProps) {
  // Hitung data secara dinamis dari array employees
  const chartData = useMemo(() => {
    const counts = employees.reduce((acc, emp) => {
      const type = emp.employeeType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        type: "Contract",
        count: counts.contract || 0,
        label: "Contract",
        color: "#3b82f6",
      },
      {
        type: "Employee",
        count: counts.employee || 0,
        label: "Employee",
        color: "#10b981",
      },
      {
        type: "Probation",
        count: counts.probation || 0,
        label: "Probation",
        color: "#f59e0b",
      },
    ];
  }, [employees]);

  const totalEmployees = chartData.reduce((sum, item) => sum + item.count, 0);

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Type Distribution</CardTitle>
          <CardDescription>Loading employee data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Type Distribution</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data
  if (totalEmployees === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Type Distribution</CardTitle>
          <CardDescription>No employee data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">No employees found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Type Distribution</CardTitle>
        <CardDescription>Current employee breakdown by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `${label} Employees`}
                  formatter={(value, name) => [value, "Count"]}
                />
              }
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total {totalEmployees} employees <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution:{" "}
          {chartData.map((item) => `${item.type}: ${item.count}`).join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
}
