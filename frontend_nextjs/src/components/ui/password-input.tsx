"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import React from "react";

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder="Enter password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        required
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
