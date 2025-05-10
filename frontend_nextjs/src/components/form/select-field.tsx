"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  label: string;
  name: string;
  required?: boolean;
  options: { label: string; value: string }[];
}

export function SelectField({
  label,
  name,
  required,
  options,
}: SelectFieldProps) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name}>
        <span>
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
