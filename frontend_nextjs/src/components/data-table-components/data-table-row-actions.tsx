"use client";

import { useState } from "react";
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

  const data = row.original as any;
  const id = data.id;

  const detailsHref =
    variant === "employment"
      ? `/employment/employee-details?id=${id}`
      : `/checkclock?id=${id}`;

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  function handleSheetChange(open: boolean) {
    setOpenSheet(open);
    if (!open) {
      const url = new URL(window.location.href);
      url.searchParams.delete("id");
      window.history.replaceState(null, "", url.toString());
    }
  }

  function handleDetailsClick() {
    if (variant === "checkclock") {
      setOpenSheet(true);
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.replaceState(null, "", url.toString());
    } else {
      router.push(detailsHref);
    }
  }

  return (
    <>
      {/* <DropdownMenu>
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
          <DropdownMenuItem onClick={handleDetailsClick}>
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-danger-main hover:text-danger-hover cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* {variant === "checkclock" && (
        <DetailsSheet open={openSheet} onOpenChange={handleSheetChange} />
      )} */}

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
            <DetailsSheet
              open={openSheet}
              onOpenChange={handleSheetChange}
              attendanceStatus={data.status}
              reason={data.reason}
              proofFile={data.proofFile}
              name={data.name}
              position={data.position}
              clockIn={data.clockIn}
              clockOut={data.clockOut}
              workHours={data.workHours}
              startDate={data.startDate}
              endDate={data.endDate}
            >
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
            className="text-danger-main hover:text-danger-hover cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
