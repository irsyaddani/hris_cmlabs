"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmClassName?: string;
  cancelClassName?: string;
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void; // Callback for open state changes
  error?: string | null; // Optional error message
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmClassName = "",
  cancelClassName = "",
  open,
  onOpenChange,
  error,
}: ConfirmDialogProps) {
  // Use internal state if open is not controlled, otherwise use the prop
  const [isOpen, setIsOpen] = useState(false);
  const controlledOpen = open !== undefined;

  return (
    <AlertDialog
      open={controlledOpen ? open : isOpen}
      onOpenChange={(newOpen) => {
        if (controlledOpen && onOpenChange) {
          onOpenChange(newOpen);
        } else {
          setIsOpen(newOpen);
        }
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p> // Display error if present
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              if (onCancel) onCancel();
            }}
            className={cancelClassName}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (onConfirm) onConfirm();
            }}
            className={confirmClassName}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
