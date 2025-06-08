"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="reset-password"
          email={email}
          token={token}
          title="Set New Password"
          subtitle="Enter your new password below to complete the reset process. Ensure it’s strong and secure."
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout>
  );
}
