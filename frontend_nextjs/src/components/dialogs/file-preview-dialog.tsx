"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DownloadButton from "@/components/ui/download-button";
import { ReactNode } from "react";

interface PreviewFileDialogProps {
  trigger: ReactNode;
  title?: string;
  fileName: string;
  fileUrl: string;
  previewImageUrl: string;
}

export function FilePreviewDialog({
  trigger,
  title = "Proof of Leave",
  fileName,
  fileUrl,
  previewImageUrl,
}: PreviewFileDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="max-h-96 overflow-auto">
            <img
              src={previewImageUrl}
              alt={fileName}
              className="w-full object-contain rounded"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
