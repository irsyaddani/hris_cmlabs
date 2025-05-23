"use client";

import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const id = (row.original as any).id;
  const detailsHref =
    variant === "employment"
      ? `/dashboard/employment/employee-details/${id}`
      : `/dashboard/employment/checkclock-details/${id}`;

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Gagal menghapus: " + errorText);
        return;
      }

      alert("Data berhasil dihapus");
      router.refresh();
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus data");
      console.error("Delete error:", error);
    }
  }


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
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-[var(--color-danger-main)] hover:text-[var(--color-danger-hover)] cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
