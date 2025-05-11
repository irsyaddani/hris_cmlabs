"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

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
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

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
        type={type}
        placeholder={placeholder || label}
        {...register(name)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
