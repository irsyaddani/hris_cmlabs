"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthFormConfirm } from "@/components/ui/auth-form-confirm";
import router from "next/router";

export default function PasswordConfirmPage() {
  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthFormConfirm
          type="password-confirm" // Mengatur tipe sebagai password-confirm
          title="Password Confirmed"
          subtitle="Your password has been successfully updated. You can now log in with your new password."
          onSubmit={() => router.push("/login")} // Redirect ke halaman login
          onBack={() => router.back()} // Kembali ke halaman sebelumnya
        />
      </div>
    </AuthLayout>
  );
}
