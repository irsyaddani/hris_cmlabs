"use client";

import { ReactNode, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilePreviewDialog } from "../dialogs/file-preview-dialog";
import { IconEye, IconFile } from "@tabler/icons-react";
import DownloadButton from "../ui/download-button";
import { ConfirmDialog } from "../dialogs/confirm-dialog";

interface DetailsSheetProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  attendanceStatus?: string;
  reason?: string;
  proofFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  } | null;
  name?: string;
  position?: string;
  clockIn?: string | null;
  clockOut?: string | null;
  workHours?: { hours: number; minutes: number } | null;
  startDate?: string;
  endDate?: string;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  approvalStatus?: string; // pending, approved, rejected
  onApprovalStatusChange?: (newStatus: string) => void;
}

function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return "-";
  const start = new Date(startDate).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!endDate || startDate === endDate) return start;

  const end = new Date(endDate).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${start} - ${end}`;
}

export function DetailsSheet({
  children,
  open,
  onOpenChange,
  attendanceStatus = "-",
  reason = "",
  proofFile = null,
  name = "-",
  position = "-",
  clockIn = "-",
  clockOut = "-",
  workHours = null,
  startDate,
  endDate,
  onApprove,
  onReject,
  approvalStatus = "pending",
  onApprovalStatusChange,
}: DetailsSheetProps) {
  const [loading, setLoading] = useState(false);
  const [localApprovalStatus, setLocalApprovalStatus] =
    useState(approvalStatus);

  useEffect(() => {
    setLocalApprovalStatus(approvalStatus);
  }, [approvalStatus]);

  const isAnnualLeave = attendanceStatus === "annual leave";
  const shouldShowProofSection =
    attendanceStatus === "annual leave" || attendanceStatus === "permit";

  async function handleApprove() {
    if (!onApprove) return;
    setLoading(true);
    try {
      await onApprove();
      setLocalApprovalStatus("approved");
      onApprovalStatusChange?.("approved");
      alert("Attendance approved!");
    } catch {
      alert("Failed to approve attendance");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!onReject) return;
    setLoading(true);
    try {
      await onReject();
      setLocalApprovalStatus("rejected");
      onApprovalStatusChange?.("rejected");
      alert("Attendance rejected!");
    } catch {
      alert("Failed to reject attendance");
    } finally {
      setLoading(false);
    }
  }

  const isFinalized =
    localApprovalStatus === "approved" || localApprovalStatus === "rejected";

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
                <p className="text-sm font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{position}</p>
              </div>
            </div>

            {/* Tombol Approve & Reject dengan ConfirmDialog */}
            <div className="flex gap-2">
              <ConfirmDialog
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading || isFinalized}
                  >
                    Reject
                  </Button>
                }
                title="Are you sure want to proceed?"
                description="This action cannot be undone. This will permanently update to employee data."
                confirmText="Reject"
                cancelText="Cancel"
                confirmClassName="bg-[var(--color-danger-main)] text-white hover:bg-[var(--color-danger-hover)]"
                onConfirm={handleReject}
              />

              <ConfirmDialog
                trigger={
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-700)]"
                    disabled={loading || isFinalized}
                  >
                    Approve
                  </Button>
                }
                title="Are you sure want to proceed?"
                description="This action cannot be undone. This will permanently update to employee data."
                confirmText="Approve"
                cancelText="Cancel"
                confirmClassName="bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)]"
                onConfirm={handleApprove}
              />
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg p-4 w-full">
            <h3 className="text-md text-muted-foreground mb-6">
              Attendance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-md font-medium">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Clock In</p>
                <p className="text-md font-medium">
                  {clockIn && clockIn !== "-"
                    ? new Date(clockIn).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clock Out</p>
                <p className="text-md font-medium">
                  {clockOut && clockOut !== "-"
                    ? new Date(clockOut).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Work Hours</p>
                <p className="text-md font-medium">
                  {workHours
                    ? `${workHours.hours} hrs ${workHours.minutes} mins`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-md font-medium">{attendanceStatus}</p>
              </div>
              {isAnnualLeave && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-md font-medium">
                      {startDate
                        ? new Date(startDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-md font-medium">
                      {endDate
                        ? new Date(endDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {shouldShowProofSection && (
            <div className="border border-neutral-200 rounded-lg p-4 w-full">
              <h3 className="text-md text-muted-foreground mb-6">
                Proof of Absent
              </h3>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label>Reason</Label>
                  <div className="min-h-[100px] px-3 py-2 border border-input bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {reason || "No reason provided"}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Proof File</Label>
                  {proofFile ? (
                    <div className="flex justify-between items-center px-4 py-2 border rounded-md">
                      <div className="flex gap-2 items-center flex-1">
                        {proofFile.fileType.startsWith("image/") ? (
                          <IconEye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <IconFile className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="text-sm truncate">
                          {proofFile.fileName}
                        </span>
                      </div>
                      <div className="flex gap-2">
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
                    <div className="flex justify-center items-center h-20 border border-dashed rounded-md text-gray-500">
                      No file uploaded
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
              <Button variant="destructive">Delete</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
