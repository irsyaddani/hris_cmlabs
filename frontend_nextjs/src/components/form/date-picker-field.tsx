"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconCalendar } from "@tabler/icons-react";
import { useState, forwardRef } from "react";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Forward ref agar DatePicker bisa kontrol Input dari ShadCN
  const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick }, ref) => (
      <div className="relative w-full">
        <Input
          onClick={onClick}
          ref={ref}
          value={value}
          readOnly
          placeholder="Select a Date"
          className="pr-10" // space for icon
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
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        customInput={<CustomInput />}
        showMonthDropdown
        showYearDropdown
        dropdownMode="scroll"
        dateFormat="dd MMMM yyyy" // optional: tampilkan format yang lebih ramah
      />
      {selectedDate && (
        <p className="text-sm text-muted-foreground">
          Selected Date: {selectedDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
