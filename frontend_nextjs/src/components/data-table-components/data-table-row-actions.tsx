"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
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
import { DetailsSheet } from "@/components/details-sheet";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  variant: "employment" | "checkclock";
}

export function DataTableRowActions<TData>({
  row,
  variant,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);

  const id = (row.original as any).id;
  const detailsHref =
    variant === "employment"
      ? `/dashboard/employment/employee-details?id=${id}`
      : `/dashboard/checkclock?id=${id}`;

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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

  function handleDetailsClick() {
    if (variant === "employment") {
      router.push(detailsHref);
    } else if (variant === "checkclock") {
      setOpenSheet(true);
      // Update URL tanpa navigasi halaman
      window.history.pushState(null, "", detailsHref);
    }
  }

  function handleSheetChange(open: boolean) {
    setOpenSheet(open);
    if (!open) {
      const url = new URL(window.location.href);
      url.searchParams.delete("id"); // hapus param id
      window.history.replaceState(null, "", url.toString());
      // url.searchParams.delete("id");
      // // Kembali ke URL employment tanpa navigasi halaman
      // setTimeout(() => {
      //   window.history.pushState(null, "", "/dashboard/checkclock");
      // }, 100);
    }
  }

  return (
    <>
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
          {variant === "checkclock" ? (
            <DetailsSheet open={openSheet} onOpenChange={handleSheetChange}>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault(); // biar dropdown nggak auto close
                  handleDetailsClick();
                }}
              >
                Details
              </DropdownMenuItem>
            </DetailsSheet>
          ) : (
            <DropdownMenuItem onClick={handleDetailsClick}>
              Details
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-[var(--color-danger-main)] hover:text-[var(--color-danger-hover)] cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {variant === "checkclock" && (
        <DetailsSheet open={openSheet} onOpenChange={handleSheetChange} />
      )} */}
    </>
  );
}
