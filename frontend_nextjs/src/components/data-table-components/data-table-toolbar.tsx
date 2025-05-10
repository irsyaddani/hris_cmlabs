"use client";

// import { Cross2Icon } from "@radix-ui/react-icons";
import { incomeType, categories } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
// import { DataTableViewOptions } from "./data-table-view-options";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { IconCross, IconFileExport, IconFileImport } from "@tabler/icons-react";
import Link from "next/link";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search employee..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button
          size="default"
          className="gap-2 hover:bg-[var(--color-neutral-200)]"
          variant="secondary"
        >
          <IconFileExport />
          Export
        </Button>
        <Button
          size="default"
          className="gap-2 hover:bg-[var(--color-neutral-200)]"
          variant="secondary"
        >
          <IconFileImport />
          Import
        </Button>
        <Link href="/dashboard/employment/add-new-employee">
          <Button
            size="default"
            className="gap-4 bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-700)]"
          >
            Add Data
          </Button>
        </Link>
        {/* {table.getColumn("id") && (
          <DataTableFacetedFilter
            column={table.getColumn("id")}
            title="ID Employee"
            options={categories}
          />
        )} */}
        {/* {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={incomeType}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            {/* <Cross2Icon className="ml-2 h-4 w-4" /> */}
            <IconCross className="ml-2 h-4 w-4" />
          </Button>
        )}
        {/* <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 w-[250px]"
          variant="outline"
        /> */}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
