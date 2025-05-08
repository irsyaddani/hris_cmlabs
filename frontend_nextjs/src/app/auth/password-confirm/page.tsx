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
          title="Your password has been successfully reset"
          subtitle={`The password reset link has expired.\nPlease request a new link to reset your password.`}
          onSubmit={() => router.push("/login")} // Redirect ke halaman login
          onBack={() => router.back()} // Kembali ke halaman sebelumnya
        />
      </div>
    </AuthLayout>
  );
}
