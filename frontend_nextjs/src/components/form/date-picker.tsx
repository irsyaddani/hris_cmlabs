"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DatePickerProps {
  label?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({
  label,
  name,
  required = false,
  placeholder = "Pick a date",
  className,
  description,
  disabled = false,
  fromYear = 1940,
  toYear = new Date().getFullYear() + 1,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const fieldValue = watch(name);
  const error = errors[name]?.message as string | undefined;

  // Register the field with react-hook-form
  const registration = register(name);

  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name}>
        <span>
          {label}
          {required && <span className="text-danger-main">*</span>}
        </span>
      </Label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={name}
              readOnly
              disabled={disabled}
              value={fieldValue ? format(fieldValue, "dd/MM/yyyy") : ""}
              placeholder={placeholder || label}
              className="cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={fieldValue}
            onSelect={(selectedDate) => {
              setValue(name, selectedDate, { shouldValidate: true });
              setIsOpen(false);
            }}
            fromYear={fromYear}
            toYear={toYear}
            defaultMonth={fieldValue}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-danger-main">{error}</p>}
    </div>
  );
}
