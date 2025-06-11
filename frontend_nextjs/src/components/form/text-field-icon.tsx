"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ReactNode, useMemo } from "react";

interface TextFieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  conditionalField?: string;
  conditionalCheck?: (value: any) => boolean;
  disabledMessage?: string;
}

export function TextFieldIcon({
  label,
  name,
  required,
  type = "hidden",
  placeholder,
  icon,
  onIconClick,
  readOnly,
  conditionalField,
  conditionalCheck,
  disabledMessage,
}: TextFieldProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const conditionalValue = conditionalField ? watch(conditionalField) : null;

  const isEnabled = useMemo(() => {
    if (!conditionalField || !conditionalCheck) return true;
    return conditionalCheck(conditionalValue);
  }, [conditionalField, conditionalCheck, conditionalValue]);

  const registerOptions =
    type === "number" ? { valueAsNumber: true } : {};

  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name} className="flex items-center gap-2">
        <span className={!isEnabled ? "text-muted-foreground" : ""}>
          {label}
          {required && isEnabled && <span className="text-danger-main">*</span>}
        </span>
        {icon && (
          <span
            className={`inline-flex items-center ${
              onIconClick
                ? "cursor-pointer hover:opacity-70 transition-opacity"
                : ""
            }`}
            onClick={onIconClick}
          >
            {icon}
          </span>
        )}
      </Label>
      <Input
        id={name}
        type={type}
        readOnly={false}
        placeholder={placeholder || label}
        className=""
        {...register(name, registerOptions)}
      />
      {error && isEnabled && (
        <p className="text-sm text-danger-main">{error}</p>
      )}
    </div>
  );
}
