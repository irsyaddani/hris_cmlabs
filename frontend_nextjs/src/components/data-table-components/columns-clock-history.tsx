"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkclock } from "./schemas/checkclock-table-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";

const createClockHistoryColumns = (): ColumnDef<Checkclock>[] => [
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
            : "No Clock-In"}
        </div>
      );
    },
  },
  {
    accessorKey: "clockOut",
    header: "Clock Out",
    cell: ({ row }) => {
      const value = row.getValue("clockOut") as string | undefined;
      return (
        <div>
          {value
            ? new Date(value).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              })
            : "No Clock-Out"}
        </div>
      );
    },
  },
  {
    accessorKey: "workHours",
    header: "Work Hours",
    cell: ({ row }) => {
      const workHours = row.getValue("workHours") as string | undefined;
      return <div>{workHours || "-"}</div>;
    },
  },
  {
    accessorKey: "approval",
    header: "Approval",
    cell: ({ row }) => {
      const approval = row.getValue("approval") as string | undefined;
      return <div>{approval || "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStyles: Record<string, string> = {
        "on time": "text-green-600 bg-green-100",
        late: "text-yellow-600 bg-yellow-100",
        "no-show": "text-red-600 bg-red-100",
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
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clockIn = row.getValue("clockIn") as string | undefined;
      const status = row.getValue("status") as string;

      // Show Details button for rows with clock-in or special status
      if (clockIn || status === "annual leave" || status === "permit") {
        return (
          <Button variant="outline" size="default">
            Details
          </Button>
        );
      }

      // No button for no-show rows with no clock-in
      return null;
    },
  },
];

export { createClockHistoryColumns };
export const columns = createClockHistoryColumns();
