"use client";

import { ReactNode, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { TextareaField } from "./form/text-area";
import { FilePreviewDialog } from "./dialogs/file-preview-dialog";
import { IconEye, IconFile } from "@tabler/icons-react";
import DownloadButton from "./ui/download-button";

interface SettingsSheetProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Tambahkan prop untuk status attendance
  attendanceStatus?: string;
  // Tambahkan props untuk reason dan file (sudah ada dari user)
  reason?: string;
  proofFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  } | null;
}

export function DetailsSheet({
  children,
  open,
  onOpenChange,
  attendanceStatus = "Permit",
  reason = "",
  proofFile = null,
}: SettingsSheetProps) {
  // Fungsi untuk mengecek apakah status adalah Annual Leave
  const isAnnualLeave = attendanceStatus === "annual leave";

  // Fungsi untuk mengecek apakah perlu menampilkan section Proof of Absent
  const shouldShowProofSection =
    attendanceStatus === "annual leave" || attendanceStatus === "permit";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="px-0">
        <div className="sticky top-0 bg-background px-6 border-b">
          <SheetHeader>
            <SheetTitle>Attendance details</SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div className="border border-neutral-200 rounded-lg p-4 w-full">
            <div className="flex gap-x-3 mb-5 items-center">
              <div className="w-11 h-11 bg-gray-400 rounded-full shrink-0" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">Putra Yuwana</p>
                <p className="text-sm text-muted-foreground">
                  Backend Developer
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 w-full gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 hover:bg-[var(--color-neutral-200)]"
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="default"
                className="gap-2 bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-700)]"
              >
                Approve
              </Button>
            </div>
          </div>

          {/* Attendance Information Section */}
          <div className="border border-neutral-200 rounded-lg p-4 w-full">
            <h3 className="text-md text-muted-foreground mb-6">
              Attendance Information
            </h3>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-md font-medium">1 March 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clock In</p>
                <p className="text-md font-medium">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clock Out</p>
                <p className="text-md font-medium">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Work Hours</p>
                <p className="text-md font-medium">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-md font-medium">{attendanceStatus}</p>
              </div>

              {/* Conditional rendering untuk Start Date dan End Date */}
              {isAnnualLeave && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-md font-medium">29 Mei 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-md font-medium">12 Juni 2025</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Proof of Absent Section - hanya muncul untuk annual leave dan permit */}
          {shouldShowProofSection && (
            <div className="border border-neutral-200 rounded-lg p-4 w-full">
              <h3 className="text-md text-muted-foreground mb-6">
                Proof of Absent
              </h3>

              <div className="w-full flex flex-col gap-4">
                {/* Reason Display */}
                <div className="grid gap-2 w-full">
                  <Label>Reason</Label>
                  <div className="min-h-[100px] px-3 py-2 border border-input bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {reason || "No reason provided"}
                    </p>
                  </div>
                </div>

                {/* File Display */}
                <div className="grid gap-2 w-full">
                  <Label>Proof File</Label>
                  {proofFile ? (
                    <div className="flex items-center justify-between gap-1 h-auto min-h-[40px] px-4 py-2 border border-input bg-background rounded-md">
                      <div className="flex items-center gap-2 flex-1">
                        {proofFile.fileType.startsWith("image/") ? (
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center shrink-0">
                            <IconEye className="h-4 w-4 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center shrink-0">
                            <IconFile className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                        <span className="text-sm truncate">
                          {proofFile.fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {proofFile.fileType.startsWith("image/") && (
                          <FilePreviewDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <IconEye className="h-4 w-4" />
                              </Button>
                            }
                            fileName={proofFile.fileName}
                            fileUrl={proofFile.fileUrl}
                            previewImageUrl={proofFile.fileUrl}
                          />
                        )}
                        <DownloadButton
                          fileUrl={proofFile.fileUrl}
                          fileName={proofFile.fileName}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 px-4 py-2 border border-dashed border-gray-300 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">No file uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-background px-6 py-4 border-t">
          <SheetFooter className="flex justify-end">
            <SheetClose asChild>
              <Button
                size="default"
                variant="destructive"
                className="gap-2 bg-[var(--color-danger-main)] text-white hover:bg-[var(--color-danger-hover)]"
              >
                Delete
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
