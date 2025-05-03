"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";
import router, { useRouter } from "next/router";

export default function LoginPage() {
  const handleLogin = (data: { password: string }) => {
    console.log("Forgot Password:", data);
    // Implement signup logic here
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="forgot-password"
          onSubmit={handleLogin}
          title="Forgot Password"
          subtitle="No worries! Enter your email address below, and we'll send you a link to reset your password."
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout>
  );
}
