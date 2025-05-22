"use client";

import { ReactNode } from "react";
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
import { IconEye } from "@tabler/icons-react";
import DownloadButton from "./ui/download-button";

interface SettingsSheetProps {
  children: ReactNode; // Trigger element (button, icon, text, etc.)
}

export function SettingsSheet({ children }: SettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
                <p className="text-md font-medium">Permit</p>
              </div>
            </div>
          </div>
          {/* Proof of Absent Section */}
          <div className="border border-neutral-200 rounded-lg p-4 w-full">
            <h3 className="text-md text-muted-foreground mb-6">
              Proof of Absent
            </h3>

            <div className="w-full flex flex-col gap-4">
              <TextareaField label={"Reason"} name={"Test"} />

              <div className="grid gap-2 w-full">
                <Label>File</Label>
                <div className="flex items-center justify-end gap-1 h-10 px-4 py-2 border border-input bg-background rounded-md">
                  <FilePreviewDialog
                    trigger={
                      <Button variant="ghost" size="icon">
                        <IconEye />
                      </Button>
                    }
                    fileName="leave-proof.jpg"
                    fileUrl="/files/leave-proof.jpg"
                    previewImageUrl="/images/leave-proof.jpg"
                  />
                  <DownloadButton
                    fileUrl="/files/leave-proof.jpg"
                    fileName="leave-proof.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
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
