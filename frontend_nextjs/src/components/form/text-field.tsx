"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TextFieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

export function TextField({
  label,
  name,
  required,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name}>
        <span>
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder || label}
      />
    </div>
  );
}
