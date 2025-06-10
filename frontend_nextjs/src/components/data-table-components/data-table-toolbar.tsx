"use client";

import { useState } from "react";
import Link from "next/link";
import { Table } from "@tanstack/react-table";
import { format, isSameDay } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SimpleDatePicker } from "@/components/simple-date-picker";

import {
  IconFileExport,
  IconFileImport,
  IconSettings,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { SettingSheet } from "../sheet/setting-sheet";
import router from "next/router";

// Tipe untuk variant
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  variant?:
    | "employment"
    | "checkclock"
    | "billing"
    | "clockin"
    | "clock-history";
}

export function DataTableToolbar<TData>({
  table,
  variant = "employment",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Handler untuk filter berdasarkan tanggal
  const handleDateFilter = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      // Filter data berdasarkan tanggal yang dipilih
      // Asumsi kolom tanggal bernama "date" atau "created_at"
      const dateColumn =
        table.getColumn("date") || table.getColumn("created_at");

      if (dateColumn) {
        dateColumn.setFilterValue((rows: any) => {
          return rows.filter((row: any) => {
            const rowDate = new Date(
              row.getValue("date") || row.getValue("created_at")
            );
            return isSameDay(rowDate, date);
          });
        });
      }
    } else {
      // Reset filter jika tidak ada tanggal yang dipilih
      const dateColumn =
        table.getColumn("date") || table.getColumn("created_at");
      dateColumn?.setFilterValue(undefined);
    }
  };

  // Handler untuk clear semua filter
  const handleClearFilters = () => {
    table.resetColumnFilters();
    setSelectedDate(undefined);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* 🔍 Search Field - Only for employment and checkclock variants */}
        {(variant === "employment" || variant === "checkclock") && (
          <div className="relative w-[150px] lg:w-[250px]">
            <Input
              placeholder="Search employee..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="h-9 w-full pr-10"
            />
            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 cursor-pointer"
              >
                <IconX className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* 📅 Date Picker - Only for checkclock and billing variants */}
        {(variant === "checkclock" ||
          variant === "billing" ||
          variant === "clock-history") &&
          (variant === "billing" || variant === "clock-history") && (
            <SimpleDatePicker
              onDateSelect={handleDateFilter}
              placeholder="Filter by date"
              className="h-9"
            />
          )}

        {/* ✨ Conditionally Render Buttons Based on Variant */}
        {variant === "employment" && (
          <>
            <Button
              size="default"
              className="gap-2 hover:bg-neutral-200 cursor-pointer"
              variant="outline"
            >
              <IconFileExport className="h-4 w-4" />
              Export
            </Button>
            <Button
              size="default"
              className="gap-2 hover:bg-neutral-200 cursor-pointer"
              variant="outline"
            >
              <IconFileImport className="h-4 w-4" />
              Import
            </Button>
            <Link href="/employment/add-new-employee">
              <Button
                size="default"
                className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
              >
                Add Data
              </Button>
            </Link>
          </>
        )}

        {variant === "checkclock" && (
          <>
            {/* <SettingSheet>
              <Button
                size="default"
                variant="outline"
                className="gap-2 hover:bg-neutral-200 cursor-pointer"
              >
                <IconSettings className="h-4 w-4" />
                Settings
              </Button>
            </SettingSheet> */}
            <Link href="/checkclock/clock-hours-setting">
              <Button
                size="default"
                variant="outline"
                className="gap-2 hover:bg-neutral-200 cursor-pointer"
              >
                <IconSettings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </>
        )}

        {/* Clear Filters Button - Show when there are active filters */}
        {(isFiltered || selectedDate) && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-8 px-2 lg:px-3 cursor-pointer"
          >
            Reset
            <IconX className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* Delete Button - Only for employment and checkclock variants */}
        {(variant === "employment" || variant === "checkclock") &&
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" size="default" className="cursor-pointer">
              <IconTrash className="mr-2 size-4" aria-hidden="true" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
      </div>
    </div>
  );
}
