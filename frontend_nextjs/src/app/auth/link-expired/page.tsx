"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthFormConfirm } from "@/components/ui/auth-form-confirm";
import router from "next/router";

export default function LinkExpiredPage() {
  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthFormConfirm
          type="link-expired" // Mengatur tipe sebagai link-expired
          title="Link Expired"
          subtitle="The password reset link you clicked is no longer valid. Please request a new password reset link."
          onSubmit={() => router.push("/forgot-password")} // Redirect ke halaman forgot password
          onBack={() => router.back()} // Kembali ke halaman sebelumnya
        />
      </div>
    </AuthLayout>
  );
}
