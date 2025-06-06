"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkclock } from "./schemas/checkclock-table-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconCheck, IconX, IconEye } from "@tabler/icons-react";
import { ConfirmDialog } from "../dialogs/confirm-dialog";
import { SettingSheet } from "../setting-sheet";
import React from "react";
import Link from "next/link";

// Interface untuk work configuration yang bisa di-set oleh admin
interface WorkConfig {
  workStartHour: number;
  workEndHour: number;
  breakStartHour: number; // Jam mulai break
  breakEndHour: number; // Jam selesai break
  lateThreshold: number;
}

// Interface untuk calendar API response
interface CalendarResponse {
  isHoliday: boolean;
  holidayName?: string;
}

// Default configuration
const DEFAULT_WORK_CONFIG: WorkConfig = {
  workStartHour: 8, // Jam mulai kerja (workStartTime)
  workEndHour: 23, // Jam selesai kerja (clockOutTime)
  breakStartHour: 12, // Jam mulai break
  breakEndHour: 13, // Jam selesai break
  lateThreshold: 15, // Toleransi telat dalam menit
};

// Helper function untuk mendapatkan waktu hari ini dalam format yang konsisten
const getTodayTime = (hour: number, minute: number = 0): Date => {
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return today;
};

// Helper function untuk mengecek apakah waktu sudah melewati batas
const isTimeAfter = (
  currentTime: Date,
  targetHour: number,
  targetMinute: number = 0
): boolean => {
  const target = getTodayTime(targetHour, targetMinute);
  return currentTime >= target;
};

// Helper function untuk mengecek apakah hari ini adalah hari libur
const checkHoliday = async (date: Date): Promise<CalendarResponse> => {
  try {
    const dateString = date.toISOString().split("T")[0];
    const response = await fetch(
      `/api/calendar/check-holiday?date=${dateString}`
    );
    if (!response.ok) throw new Error("Holiday API error");
    const data: CalendarResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking holiday:", error);
    return { isHoliday: false };
  }
};

// Helper function untuk mengecek apakah user bisa clock out
const canClockOut = (
  clockInTime: string,
  currentTime: Date,
  workConfig: WorkConfig
): boolean => {
  if (!clockInTime) return false;

  // User bisa clock out jika sudah melewati jam selesai break
  const hasPassedBreakEnd = isTimeAfter(currentTime, workConfig.breakEndHour);

  return hasPassedBreakEnd;
};

// Helper function untuk menghitung work hours dengan batas maksimal sampai 23:59 atau auto clock out
const calculateWorkHours = (
  clockIn: string,
  clockOut?: string,
  isAutoClockOut: boolean = false
): string => {
  if (!clockIn) return "0.00";

  const start = new Date(clockIn);
  let end: Date;

  if (isAutoClockOut) {
    // Set end to 00:00 of the next day
    end = new Date(start);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
  } else {
    end = clockOut ? new Date(clockOut) : new Date();
    // Batas maksimal sampai 23:59 di hari yang sama dengan clock in
    const maxEnd = new Date(start);
    maxEnd.setHours(23, 59, 59, 999);
    end = end > maxEnd ? maxEnd : end;
  }

  const diffMs = end.getTime() - start.getTime();
  const hours = Math.max(0, diffMs / 1000 / 60 / 60);

  return hours.toFixed(2);
};

// Helper function untuk mendapatkan waktu auto clock out (00:00 hari berikutnya)
const getAutoClockOutTime = (clockIn: string): Date => {
  const clockInDate = new Date(clockIn);
  const autoClockOut = new Date(clockInDate);
  autoClockOut.setDate(autoClockOut.getDate() + 1);
  autoClockOut.setHours(0, 0, 0, 0);
  return autoClockOut;
};

// Function untuk membuat columns dengan konfigurasi yang bisa diubah
const createAttendanceColumns = (
  workConfig: WorkConfig
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date") as string}</div>,
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

      // If past date, clock-in exists, and no clock-out, show auto clock-out at 00:00
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

      // Jika permit atau annual leave
      if (status === "annual leave" || status === "permit") {
        return <div>-</div>;
      }

      if (!clockIn) return <div>Awaiting</div>;

      // If past date and no clock-out, use auto clock-out time
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

      // Jika sudah ada status khusus (permit, annual leave)
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

      // Logic untuk no-show
      if (!clockIn && isTimeAfter(currentTime, workConfig.workEndHour)) {
        return (
          <span className="px-2 py-1 rounded-full text-sm font-medium capitalize text-red-600 bg-red-100">
            no-show
          </span>
        );
      }

      // Jika belum clock in
      if (!clockIn) {
        return (
          <span className="px-2 py-1 rounded-full text-sm font-medium capitalize bg-gray-100 text-gray-600">
            awaiting
          </span>
        );
      }

      // Logic untuk on time vs late
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
      const status = row.getValue("status") as string;
      const currentTime = new Date();
      const rowDate = new Date(row.getValue("date"));
      const [holidayStatus, setHolidayStatus] = React.useState<{
        isHoliday: boolean;
        holidayName?: string;
      } | null>(null);

      React.useEffect(() => {
        const checkRowDateHoliday = async () => {
          const status = await checkHoliday(rowDate);
          setHolidayStatus(status);
        };
        checkRowDateHoliday();
      }, [rowDate]);

      const clockInStatus = !!clockIn;
      const clockOutStatus = !!clockOut;

      const isPastDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const rowDateStart = new Date(rowDate);
        rowDateStart.setHours(0, 0, 0, 0);
        return rowDateStart < today;
      };

      const isNotFuture = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const rowDateStart = new Date(rowDate);
        rowDateStart.setHours(0, 0, 0, 0);
        return rowDateStart <= today;
      };

      if (holidayStatus === null) return null;

      if (status === "annual leave" || status === "permit") {
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

      const isNewDay = () => {
        const today = new Date();
        const isDifferentDay = today.toDateString() !== rowDate.toDateString();
        const isNotFutureResult = isNotFuture();
        return isDifferentDay && isNotFutureResult;
      };

      if (!clockInStatus && isNewDay()) {
        if (holidayStatus.isHoliday) {
          const title = holidayStatus.holidayName
            ? `Holiday (${holidayStatus.holidayName}) - Clock in disabled`
            : "Holiday - Clock in disabled";
          return (
            <Button disabled variant="secondary" title={title}>
              Clock In
            </Button>
          );
        }
        return (
          <Link href="/checkclock/attendance-user">
            <Button
              className="bg-primary-900 hover:bg-primary-700"
              variant="default"
              size="default"
            >
              Clock In
            </Button>
          </Link>
        );
      }

      if (!clockInStatus) {
        if (!isNotFuture()) {
          return (
            <Button
              disabled
              variant="secondary"
              title="Future date - Clock in disabled"
            >
              Clock In
            </Button>
          );
        }
        if (isTimeAfter(currentTime, workConfig.workEndHour)) {
          return (
            <Button
              disabled
              variant="secondary"
              title="Past work hours - Clock in disabled"
            >
              Clock In
            </Button>
          );
        }
        return (
          <Link href="/checkclock/attendance-user">
            <Button
              className="bg-primary-900 hover:bg-primary-700"
              variant="default"
              size="default"
            >
              Clock In
            </Button>
          </Link>
        );
      }

      if (clockInStatus && !clockOutStatus && !isPastDate()) {
        if (canClockOut(clockIn!, currentTime, workConfig)) {
          return (
            <Link href="/checkclock/attendance-user">
              <Button
                className="bg-primary-900 hover:bg-primary-700"
                variant="default"
                size="default"
              >
                Clock Out
              </Button>
            </Link>
          );
        }
        return (
          <Button
            disabled
            variant="secondary"
            title={`Clock Out available after ${workConfig.breakEndHour}:00`}
          >
            Clock In
          </Button>
        );
      }

      if (clockInStatus && (clockOutStatus || isPastDate())) {
        return (
          <Link href="/checkclock/attendance-user">
            <Button variant="outline" size="default">
              Details
            </Button>
          </Link>
        );
      }

      return null;
    },
  },
];

// Export function untuk membuat columns dengan konfigurasi custom
export { createAttendanceColumns };

// Export default columns dengan konfigurasi default
export const columns = createAttendanceColumns(DEFAULT_WORK_CONFIG);
