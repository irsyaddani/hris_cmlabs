"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkclock } from "./schemas/checkclock-table-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ConfirmDialog } from "../dialogs/confirm-dialog";
import { useRouter } from "next/navigation";
import axios from "axios";

export function useCheckclockColumns(): ColumnDef<Checkclock>[] {
  const router = useRouter();

  const updateApproval = async (id: string, status: string) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/checkclock/approval/${id}`, {
        status_approval: status,
      });
      console.log(`Approval updated: ${status}`, response.data);
      router.refresh();
      window.location.reload();
      
    } catch (err) {
      console.error("Error updating approval:", err);
    }
  };

  return [
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500" />
            <span className="capitalize">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => <div>{row.getValue("position") as string}</div>,
    },
    {
      accessorKey: "clockIn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clock In" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const value = row.getValue("clockIn") as string | undefined;
        const clockOut = row.getValue("clockOut") as string | undefined;

        if (status === "permit" || status === "annual leave" || !value) {
          if (!value && !clockOut) return <div>-</div>;
          return <div>-</div>;
        }

        const datetime = new Date(value);
        return (
          <div>
            {datetime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "clockOut",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clock Out" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const clockOut = row.getValue("clockOut") as string | undefined;
        const clockIn = row.getValue("clockIn") as string | undefined;

        if (
          status === "permit" ||
          status === "annual leave" ||
          (!clockOut && !clockIn)
        ) {
          return <div>-</div>;
        }

        if (!clockOut) return <div>Awaiting</div>;

        const clockOutDate = new Date(clockOut);
        const isAwaiting =
          clockOutDate.getUTCHours() === 0 &&
          clockOutDate.getUTCMinutes() === 0;

        return (
          <div>
            {isAwaiting
              ? "awaiting"
              : clockOutDate.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta",
                })}
          </div>
        );
      },
    },
    {
      accessorKey: "workHours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Work Hours" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const clockIn = row.getValue("clockIn") as string | undefined;
        const clockOut = row.getValue("clockOut") as string | undefined;

        if (
          status === "permit" ||
          status === "annual leave" ||
          (!clockIn && !clockOut)
        ) {
          return <div>-</div>;
        }

        const workHours = row.getValue("workHours") as {
          hours: number;
          minutes: number;
        };

        const { hours, minutes } = workHours;

        if (!clockOut && clockIn) {
          const start = new Date(clockIn);
          const now = new Date();
          const diffMs = now.getTime() - start.getTime();
          const totalMinutes = Math.floor(diffMs / 1000 / 60);
          const dynamicHours = Math.floor(totalMinutes / 60);
          const dynamicMinutes = totalMinutes % 60;

          return <div>{`${dynamicHours} hrs ${dynamicMinutes} mins`}</div>;
        }

        return <div>{`${hours}.${minutes} hrs`}</div>;
      },
    },
    {
      accessorKey: "approval",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Approval" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const approval = row.getValue("approval") as string;
        const id = row.original.id as string;

        if (status === "permit" || status === "annual leave") {
          if (approval === "pending") {
            return (
              <div className="flex gap-2">
                <ConfirmDialog
                  trigger={
                    <Button size="icon" variant="outline">
                      <IconCheck className="h-4 w-4" />
                    </Button>
                  }
                  title="Approve Request"
                  description="Are you sure you want to approve this request? This action cannot be undone."
                  confirmText="Approve"
                  cancelText="Cancel"
                  confirmClassName="bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)]"
                  onConfirm={async () => {
                    try {
                      await updateApproval(id, "approved");
                    } catch (error) {
                      console.error("Failed to approve:", error);
                    }
                  }}
                />
                <ConfirmDialog
                  trigger={
                    <Button size="icon" variant="outline">
                      <IconX className="h-4 w-4" />
                    </Button>
                  }
                  title="Reject Request"
                  description="Are you sure you want to reject this request? This action cannot be undone."
                  confirmText="Reject"
                  cancelText="Cancel"
                  confirmClassName="bg-[var(--color-danger-main)] text-white hover:bg-[var(--color-danger-hover)]"
                  onConfirm={async () => {
                    try {
                      await updateApproval(id, "rejected");
                    } catch (error) {
                      console.error("Failed to reject:", error);
                    }
                  }}
                />
              </div>
            );
          }

          return (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${
                approval === "approved"
                  ? "bg-green-100 text-green-800"
                  : approval === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div
                className={`flex items-center justify-center w-4 h-4 rounded-full ${
                  approval === "approved"
                    ? "bg-green-500"
                    : approval === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {approval === "approved" ? (
                  <IconCheck className="w-3 h-3 text-white" />
                ) : (
                  <IconX className="w-3 h-3 text-white" />
                )}
              </div>
              {approval}
            </div>
          );
        }

        return <div>-</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const absentType = row.original.status; // 'permit', 'annual leave', atau null
        const clockInRaw = row.original.clockIn; // bisa null/undefined
        const clockOutRaw = row.original.clockOut;

        // Hardcoded work start & late threshold
        const today = new Date(); // referensi tanggal hari ini
        const workStartTime = new Date(today);
        workStartTime.setHours(8, 0, 0, 0); // 08:00

        const lateThreshold = new Date(today);
        lateThreshold.setHours(8, 15, 0, 0); // 08:15

        const clockOutTime = clockOutRaw ? new Date(clockOutRaw) : null;
        const clockInTime = clockInRaw ? new Date(clockInRaw) : null;
        const currentTime = new Date();
        const clockInStatus = !!clockInRaw; // true jika ada jam clockIn

        let status = "no-show";

        if (absentType === "sick") {
          status = "permit";
        } else if (absentType === "annual leave") {
          status = "annual leave";
        } else if (
          !clockInStatus &&
          clockOutTime &&
          currentTime >= clockOutTime
        ) {
          status = "no-show";
        } else if (
          absentType === "wfo" || absentType === "wfh" &&
          clockInTime &&
          clockInTime <= lateThreshold
        ) {
          status = "on time";
        } else if (
          absentType === "wfo" || absentType === "wfh" &&
          clockInTime &&
          clockInTime > lateThreshold
        ) {
          status = "late";
        }

        const statusStyles: Record<string, string> = {
          "on time": "text-green-600 bg-green-100",
          late: "text-yellow-600 bg-yellow-100",
          permit: "text-purple-600 bg-purple-100",
          "annual leave": "text-blue-600 bg-blue-100",
          "no-show": "text-red-600 bg-red-100",
          unknown: "text-gray-600 bg-gray-100",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[status]}`}
          >
            {status}
          </span>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions row={row} variant="checkclock" />
      ),
    },
  ];
}
