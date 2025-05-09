"use client";

import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import React from "react";

export const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ type = "password", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {showPassword ? <IconEye /> : <IconEyeClosed />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
