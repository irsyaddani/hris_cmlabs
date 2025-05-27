"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";

export default function IdLoginPage() {
  const handleIdLogin = (data: {employee_code: string; password: string}) => {
    console.log("Login data:", data);
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="idlogin"
          subtitle="Welcome back to HRIS CMLABS! Manage Everything with ease."
          onSubmit={handleIdLogin}
        />
      </div>
    </AuthLayout>
  );
}
