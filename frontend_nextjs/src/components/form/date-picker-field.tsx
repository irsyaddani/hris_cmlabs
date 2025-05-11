"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconCalendar } from "@tabler/icons-react";
import { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  label: string;
  name: string;
  required?: boolean;
}

export function DatePickerField({
  label,
  name,
  required,
}: DatePickerFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick }, ref) => (
      <div className="relative w-full">
        <Input
          onClick={onClick}
          ref={ref}
          value={value}
          readOnly
          placeholder="Select a Date"
          className="pr-10"
        />
        <IconCalendar
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          size={18}
        />
      </div>
    )
  );
  CustomInput.displayName = "CustomInput";

  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name}>
        <span>
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            customInput={<CustomInput />}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
            dateFormat="dd MMMM yyyy"
          />
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
