"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

export function TextareaField({
  label,
  name,
  required,
  placeholder,
  description,
}: TextareaFieldProps) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder || label}
        className="w-full"
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
