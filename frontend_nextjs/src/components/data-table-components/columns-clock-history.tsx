"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkclock } from "./schemas/checkclock-table-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Helper function to format date
const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

// Helper function to format time
const formatTime = (timeStr?: string | null): string => {
  if (!timeStr) return "-";
  return new Date(timeStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
};

// Helper function to calculate work hours
const calculateWorkHours = (
  clockIn?: string | null,
  clockOut?: string | null
): string => {
  if (!clockIn) return "-";

  const start = new Date(clockIn);
  const end = clockOut ? new Date(clockOut) : new Date();

  const diffMs = end.getTime() - start.getTime();
  const hours = Math.max(0, diffMs / 1000 / 60 / 60);
  return `${hours.toFixed(1)} hrs`;
};

const createClockHistoryColumns = (): ColumnDef<Checkclock>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "startDate",
    header: "Date",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as string | null;
      const clockIn = row.getValue("clockIn") as string | null;
      // Use start_date for annual leave, or derive from clock_in
      const date =
        startDate ||
        (clockIn ? new Date(clockIn).toISOString().split("T")[0] : null);
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "clockIn",
    header: "Clock In",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | null;
      const type = row.getValue("status") as string;
      if (type === "annual leave" || type === "sick") {
        return <div>-</div>;
      }
      return <div>{formatTime(clockIn) || "No Clock-In"}</div>;
    },
  },
  {
    accessorKey: "clockOut",
    header: "Clock Out",
    cell: ({ row }) => {
      const clockOut = row.getValue("clockOut") as string | null;
      const clockIn = row.getValue("clockIn") as string | null;
      const type = row.getValue("status") as string;
      if (
        type === "annual leave" ||
        type === "sick" ||
        (!clockOut && !clockIn)
      ) {
        return <div>-</div>;
      }
      return <div>{formatTime(clockOut) || "No Clock-Out"}</div>;
    },
  },
  {
    accessorKey: "workHours",
    header: "Work Hours",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | null;
      const clockOut = row.getValue("clockOut") as string | null;
      const type = row.getValue("status") as string;
      if (type === "annual leave" || type === "sick" || !clockIn) {
        return <div>-</div>;
      }
      return <div>{calculateWorkHours(clockIn, clockOut)}</div>;
    },
  },
  {
    accessorKey: "statusApproval",
    header: "Approval",
    cell: ({ row }) => {
      const approval = row.getValue("statusApproval") as string | null;
      const type = row.getValue("status") as string;
      if (type !== "annual leave") {
        return <div>-</div>;
      }
      return <div>{approval || "Pending"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const type = row.getValue("status") as string;
      const clockIn = row.getValue("clockIn") as string | null;

      let status = type;
      let statusStyle = "bg-gray-100 text-gray-600";

      if (type === "wfo" || type === "wfh") {
        if (!clockIn) {
          status = "no-show";
          statusStyle = "text-red-600 bg-red-100";
        } else {
          status = type.toUpperCase();
          statusStyle =
            type === "wfo"
              ? "text-green-600 bg-green-100"
              : "text-blue-600 bg-blue-100";
        }
      } else if (type === "sick") {
        status = "permit";
        statusStyle = "text-purple-600 bg-purple-100";
      } else if (type === "annual leave") {
        status = "annual leave";
        statusStyle = "text-blue-600 bg-blue-100";
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${statusStyle}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | null;
      const type = row.getValue("status") as string;
      // Show Details button for rows with clock-in or special status
      if (clockIn || type === "annual leave" || type === "sick") {
        return (
          <Link href={`/checkclock/attendance-detail?id=${row.original.id}`}>
            <Button variant="outline" size="default">
              Details
            </Button>
          </Link>
        );
      }
      // No button for no-show rows with no clock-in
      return null;
    },
  },
];

export { createClockHistoryColumns };
export const columns = createClockHistoryColumns();
