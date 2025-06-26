"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkclock } from "./schemas/checkclock-table-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

// Interface untuk work configuration yang bisa di-set oleh admin
interface WorkConfig {
  workStartHour: number;
  workEndHour: number;
  breakStartHour: number;
  breakEndHour: number;
  lateThreshold: number;
}

// Interface untuk holiday data
interface HolidayData {
  isHoliday: boolean;
  holidayName?: string;
}

// Default configuration
const DEFAULT_WORK_CONFIG: WorkConfig = {
  workStartHour: 8,
  workEndHour: 23,
  breakStartHour: 12,
  breakEndHour: 13,
  lateThreshold: 15,
};

// Helper functions (keep all your existing helper functions)
const getTodayTime = (hour: number, minute: number = 0): Date => {
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return today;
};

const isTimeAfter = (
  currentTime: Date,
  targetHour: number,
  targetMinute: number = 0
): boolean => {
  const target = getTodayTime(targetHour, targetMinute);
  return currentTime >= target;
};

const canClockOut = (
  clockInTime: string,
  currentTime: Date,
  workConfig: WorkConfig
): boolean => {
  if (!clockInTime) return false;
  const hasPassedBreakEnd = isTimeAfter(currentTime, workConfig.breakEndHour);
  return hasPassedBreakEnd;
};

const calculateWorkHours = (
  clockIn: string,
  clockOut?: string,
  isAutoClockOut: boolean = false
): string => {
  if (!clockIn) return "0.00";

  const start = new Date(clockIn);
  let end: Date;

  if (isAutoClockOut) {
    end = new Date(start);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
  } else {
    end = clockOut ? new Date(clockOut) : new Date();
    const maxEnd = new Date(start);
    maxEnd.setHours(23, 59, 59, 999);
    end = end > maxEnd ? maxEnd : end;
  }

  const diffMs = end.getTime() - start.getTime();
  const hours = Math.max(0, diffMs / 1000 / 60 / 60);

  return hours.toFixed(2);
};

const getAutoClockOutTime = (clockIn: string): Date => {
  const clockInDate = new Date(clockIn);
  const autoClockOut = new Date(clockInDate);
  autoClockOut.setDate(autoClockOut.getDate() + 1);
  autoClockOut.setHours(0, 0, 0, 0);
  return autoClockOut;
};

// Modified function to accept holiday data as parameter
const createAttendanceColumns = (
  workConfig: WorkConfig,
  holidayData: Record<string, HolidayData> = {}
): ColumnDef<Checkclock>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected()}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clockIn",
    header: "Clock In",
    cell: ({ row }) => {
      const value = row.getValue("clockIn") as string | undefined;
      return (
        <div>
          {value
            ? new Date(value).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              })
            : "Awaiting"}
        </div>
      );
    },
  },
  {
    accessorKey: "clockOut",
    header: "Clock Out",
    cell: ({ row }) => {
      const value = row.getValue("clockOut") as string | undefined;
      const clockIn = row.getValue("clockIn") as string | undefined;
      const rowDate = new Date(row.getValue("date"));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const rowDateStart = new Date(rowDate);
      rowDateStart.setHours(0, 0, 0, 0);
      const isPastDate = rowDateStart < today;

      if (clockIn && !value && isPastDate) {
        const autoClockOutTime = getAutoClockOutTime(clockIn);
        return (
          <div className="text-gray-600">
            {autoClockOutTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            })}{" "}
            - Auto
          </div>
        );
      }

      return (
        <div>
          {value
            ? new Date(value).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              })
            : "Awaiting"}
        </div>
      );
    },
  },
  {
    accessorKey: "workHours",
    header: "Work Hours",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | undefined;
      const clockOut = row.getValue("clockOut") as string | undefined;
      const status = row.getValue("status") as string;
      const rowDate = new Date(row.getValue("date"));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const rowDateStart = new Date(rowDate);
      rowDateStart.setHours(0, 0, 0, 0);
      const isPastDate = rowDateStart < today;

      if (status === "annual leave" || status === "permit") {
        return <div>-</div>;
      }

      if (!clockIn) return <div>Awaiting</div>;

      const hours = calculateWorkHours(
        clockIn,
        clockOut,
        !clockOut && isPastDate
      );
      return <div>{`${hours} hrs`}</div>;
    },
  },
  {
    accessorKey: "approval",
    header: "Approval",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const approval = row.getValue("approval") as string;

      if (status === "annual leave" || status === "permit") {
        return <div>{approval || "Pending"}</div>;
      }

      return <div>-</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const clockIn = row.getValue("clockIn") as string | undefined;
      const currentTime = new Date();

      if (status === "annual leave" || status === "permit") {
        const statusStyles: Record<string, string> = {
          permit: "text-purple-600 bg-purple-100",
          "annual leave": "text-blue-600 bg-blue-100",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${
              statusStyles[status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        );
      }

      if (!clockIn && isTimeAfter(currentTime, workConfig.workEndHour)) {
        return (
          <span className="px-2 py-1 rounded-full text-sm font-medium capitalize text-red-600 bg-red-100">
            no-show
          </span>
        );
      }

      if (!clockIn) {
        return (
          <span className="px-2 py-1 rounded-full text-sm font-medium capitalize bg-gray-100 text-gray-600">
            awaiting
          </span>
        );
      }

      const clockInTime = new Date(clockIn);
      const workStartTime = getTodayTime(workConfig.workStartHour);

      const isOnTime = clockInTime <= workStartTime;
      const finalStatus = isOnTime ? "on time" : "late";

      const statusStyles: Record<string, string> = {
        "on time": "text-green-600 bg-green-100",
        late: "text-yellow-600 bg-yellow-100",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${
            statusStyles[finalStatus] || "bg-gray-100 text-gray-600"
          }`}
        >
          {finalStatus}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | undefined;
      const clockOut = row.getValue("clockOut") as string | undefined;
      const statusType = row.getValue("status") as string;
      const rowDate = row.getValue("date") as string;

      // Get holiday status from pre-fetched data (no more API calls here!)
      const holidayStatus = holidayData[rowDate] || { isHoliday: false };

      const clockInStatus = !!clockIn;
      const clockOutStatus = !!clockOut;

      if (
        statusType === "annual leave" ||
        statusType === "permit" ||
        statusType === "sick"
      ) {
        return (
          <Button
            disabled
            variant="secondary"
            title="Clock In disabled due to permit or annual leave"
          >
            Clock In
          </Button>
        );
      }

      if (holidayStatus.isHoliday && !clockInStatus) {
        const title = holidayStatus.holidayName
          ? `Holiday (${holidayStatus.holidayName}) - Clock in disabled`
          : "Holiday - Clock in disabled";
        return (
          <Button disabled variant="secondary" title={title}>
            Clock In
          </Button>
        );
      }

      if (clockIn === null) {
        return (
          <Link href="/checkclock/attendance-user">
            <Button
              className="bg-primary-900 hover:bg-primary-700 cursor-pointer"
              variant="default"
              size="default"
            >
              Clock In
            </Button>
          </Link>
        );
      }

      return null;
    },
  },
];

// Export function for creating columns with holiday data
export { createAttendanceColumns };

// Export default columns (without holiday data for backward compatibility)
export const columns = createAttendanceColumns(DEFAULT_WORK_CONFIG);
