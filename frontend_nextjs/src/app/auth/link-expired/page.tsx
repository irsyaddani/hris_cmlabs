"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthFormConfirm } from "@/components/ui/auth-form-confirm";
import { useRouter } from "next/navigation";

export default function LinkExpiredPage() {
  const router = useRouter();
  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthFormConfirm
          type="link-expired" // Mengatur tipe sebagai link-expired
          title="Link Expired"
          subtitle="The password reset link has expired.
Please request a new link to reset your password."
          onSubmit={() => router.push("/forgot-password")} // Redirect ke halaman forgot password
          onBack={() => router.back()} // Kembali ke halaman sebelumnya
        />
      </div>
    </AuthLayout>
  );
}
