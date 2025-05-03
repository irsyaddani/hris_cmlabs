"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/ui/auth-form";

export default function SignUpPage() {
  const handleSignUp = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("Sign up data:", data);
    // Implement signup logic here
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthForm
          type="signup"
          subtitle="Create your account and streamline your employee management."
          onSubmit={handleSignUp}
        />
      </div>
    </AuthLayout>
  );
}
