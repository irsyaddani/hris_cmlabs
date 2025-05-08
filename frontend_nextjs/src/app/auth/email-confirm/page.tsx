"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthFormConfirm } from "@/components/ui/auth-form-confirm";
import router from "next/router";

export default function EmailConfirmPage() {
  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen">
        <AuthFormConfirm
          type="email-confirm" 
          title="Check your email"
          subtitle="We sent a password reset link to your email (uremail@gmail.com) which valid for 24 hours after receives the email. Please check your inbox!"
          onSubmit={() => router.push("auth/login")}
          onBack={() => router.back()}
        />
      </div>
    </AuthLayout> 
  );
}
