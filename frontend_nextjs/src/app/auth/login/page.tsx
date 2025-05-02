"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";

export default function LoginPage() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log("Login data:", data);
    // Implement signup logic here
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          title="Admin Sign In"
          subtitle="Welcome back to HRIS CMLABS! Manage Everything with ease."
        />
      </div>
    </AuthLayout>
  );
}
