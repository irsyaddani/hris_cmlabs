"use client";

import { Input } from "@/components/ui/input";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import React, { useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({ value, onChange, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        id="password"
        value={value}
        onChange={onChange}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        {/* {showPassword ? <IconEye /> : <IconEyeClosed />} */}
      </button>
    </div>
  );
}
