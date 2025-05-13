"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "./schemas/employment-table-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Employee" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      //   avatar
      //   const avatarUrl = row.original.avatarUrl as string | undefined;

      return (
        <div className="flex items-center gap-2">
          {/* <img
            src={avatarUrl || "/default-avatar.png"}
            alt={name}
            className="w-7 h-7 rounded-full object-cover"
          /> */}
          <div className="w-6 h-6 rounded-full bg-blue-500" />
          <span className="capitalize">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => <div>{row.getValue("branch")}</div>,
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => <div>{row.getValue("position")}</div>,
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => <div>{row.getValue("grade")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  // {
  //   accessorKey: "date",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Date" />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("date"));
  //     const formattedDate = date.toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     });
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         <span className="capitalize">{formattedDate}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     const rowDate = new Date(row.getValue(id));
  //     const [startDate, endDate] = value;
  //     return rowDate >= startDate && rowDate <= endDate;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} variant="employment" />,
  },
];
