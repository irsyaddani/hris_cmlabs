"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";
import router, { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const handleResetPassword = (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    console.log("New Password:", data.password);
    // Implement reset password logic here (call API, etc.)
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="reset-password"
          onSubmit={handleResetPassword}
          title="Set New Password"
          subtitle="Enter your new password below to complete the reset process. Ensure it’s strong and secure."
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout>
  );
}
