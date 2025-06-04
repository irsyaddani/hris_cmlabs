"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
  const form = useFormContext();

  if (!form) {
    throw new Error("DatePicker must be used within a Form component");
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col w-full", className)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={field.value}
                onSelect={(selectedDate) => {
                  field.onChange(selectedDate);
                  setIsOpen(false);
                }}
                fromYear={fromYear}
                toYear={toYear}
                defaultMonth={field.value}
                initialFocus
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
