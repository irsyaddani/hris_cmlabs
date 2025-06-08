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
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  // Conditional props
  conditionalField?: string; // Name of the field to watch
  conditionalCheck?: (value: any) => boolean; // Function to check condition
  disabledMessage?: string; // Message to show when disabled
}

export function TextFieldIcon({
  label,
  name,
  required,
  type = "text",
  placeholder,
  icon,
  onIconClick,
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

  // Watch the conditional field if provided
  const conditionalValue = conditionalField ? watch(conditionalField) : null;

  // Check if field should be enabled
  const isEnabled = useMemo(() => {
    if (!conditionalField || !conditionalCheck) return true;
    return conditionalCheck(conditionalValue);
  }, [conditionalField, conditionalCheck, conditionalValue]);

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
        placeholder={
          isEnabled ? placeholder || label : disabledMessage || "Not available"
        }
        disabled={!isEnabled}
        className={
          !isEnabled ? "bg-muted text-muted-foreground cursor-not-allowed" : ""
        }
        {...register(name, { disabled: !isEnabled })}
      />
      {error && isEnabled && (
        <p className="text-sm text-danger-main">{error}</p>
      )}
      {/* {!isEnabled && disabledMessage && (
        <p className="text-sm text-muted-foreground">{disabledMessage}</p>
      )} */}
    </div>
  );
}
