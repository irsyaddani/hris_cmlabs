"use client";

import { useState } from "react";
import Link from "next/link";
import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/calendar-date-picker";

import {
  IconFileExport,
  IconFileImport,
  IconSettings,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { SettingsSheet } from "../dialog-sheet";

// Tipe untuk variant
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  variant?: "employment" | "checkclock";
}

export function DataTableToolbar<TData>({
  table,
  variant = "employment",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* 🔍 Search Field */}
        <div className="relative w-[150px] lg:w-[250px]">
          <Input
            placeholder="Search employee..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="h-9 w-full pr-10"
          />
          {isFiltered && (
            <button
              onClick={() => table.resetColumnFilters()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6"
            >
              <IconX className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* ✨ Conditionally Render Buttons Based on Variant */}
        {variant === "employment" && (
          <>
            <Button
              size="default"
              className="gap-2 hover:bg-[var(--color-neutral-200)]"
              variant="outline"
            >
              <IconFileExport className="h-4 w-4" />
              Export
            </Button>
            <Button
              size="default"
              className="gap-2 hover:bg-[var(--color-neutral-200)]"
              variant="outline"
            >
              <IconFileImport className="h-4 w-4" />
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
          </>
        )}

        {variant === "checkclock" && (
          <>
            {/* <CalendarDatePicker
              date={dateRange}
              onDateSelect={handleDateSelect}
              className="h-9 w-[250px]"
              variant="outline"
            /> */}
            <SettingsSheet>
              <Button 
                size="default"
                variant="outline"
                className="gap-2 hover:bg-[var(--color-neutral-200)]"
              >
                <IconSettings className="h-4 w-4" />
                Settings
              </Button>
            </SettingsSheet>
          </>
        )}

        {/* 🗑️ Delete Button (Global untuk keduanya) */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button variant="outline" size="default">
            <IconTrash className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
    </div>
  );
}
