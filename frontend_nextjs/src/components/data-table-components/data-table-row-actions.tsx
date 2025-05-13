"use client";

import { Row } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IconDots } from "@tabler/icons-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  variant: "employment" | "checkclock";
}

export function DataTableRowActions<TData>({
  row,
  variant,
}: DataTableRowActionsProps<TData>) {
  const detailsHref =
    variant === "employment"
      ? "/dashboard/employment/employee-details"
      : "/dashboard/employment/checkclock-details";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <IconDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <p className="text-sm font-semibold px-1.5 py-1.5">Action</p>
        <DropdownMenuSeparator />
        <Link href={detailsHref}>
          <DropdownMenuItem>Details</DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="text-[var(--color-danger-main)] hover:text-[var(--color-danger-hover)]">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
