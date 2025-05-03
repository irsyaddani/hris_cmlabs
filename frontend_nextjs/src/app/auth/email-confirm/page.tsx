"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthMessage } from "@/components/ui/auth-message";
import { useRouter } from "next/navigation";

export default function EmailConfirmPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <AuthMessage
        type="email-confirm"
        subtitle="We’ve sent a confirmation link to your email address. Please check your inbox and follow the instructions to verify your account."
        onBack={() => router.push("/auth/login")}
        onAction={() => window.open("https://mail.google.com", "_blank")}
      />
    </AuthLayout>
  );
}
