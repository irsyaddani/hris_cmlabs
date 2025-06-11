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
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  variant: "employment" | "checkclock";
}

export function DataTableRowActions<TData>({
  row,
  variant,
}: DataTableRowActionsProps<TData>) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const data = row.original as any;
  const id = data.id as string | number;

  const detailsHref =
    variant === "employment"
      ? `/employment/employee-details/${id}`
      : `/checkclock/attendance-detail?id=${id}`;

  async function handleDelete() {
    const token = localStorage.getItem("token");
    try {
      const endpoint =
        variant === "employment"
          ? `http://localhost:8000/api/employees/${id}`
          : `http://localhost:8000/api/checkclock/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setConfirmOpen(false);
      router.push(
        variant === "employment"
          ? "/employment?success=delete-success"
          : "/checkclock?success=delete-success"
      );
    } catch (error: any) {
      console.error(
        variant === "employment"
          ? "Failed to delete employee data:"
          : "Failed to delete attendance data:",
        error
      );
      setErrorMessage("An error occurred while deleting data.");
    }
  }

  function handleDetailsClick() {
    router.push(detailsHref);
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
          <DropdownMenuItem onClick={handleDetailsClick}>
            Details
          </DropdownMenuItem>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Are you sure?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            confirmClassName="bg-danger-main text-white hover:bg-danger-hover"
            cancelClassName="hover:bg-neutral-200"
            onConfirm={handleDelete}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="w-full text-danger-main hover:text-danger-hover cursor-pointer">
                  Delete
                </div>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}
