"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";
import router from "next/router";

export default function ForgotPasswordPage() {
  const handleForgotPassword = (data: { email: string }) => {
    console.log("Forgot Password Email:", data.email);
    // Implement forgot password logic here (call API to send reset link)
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="forgot-password"
          subtitle="No worries! Enter your email address below, and we'll send you a link to reset your password."
          onSubmit={handleForgotPassword}
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout>
  );
}
