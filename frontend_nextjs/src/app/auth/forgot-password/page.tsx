"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="forgot-password"
          subtitle="No worries! Enter your email address below, and we'll send you a link to reset your password."
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout>
  );
}
