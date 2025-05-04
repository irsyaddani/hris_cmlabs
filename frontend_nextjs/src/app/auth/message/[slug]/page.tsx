import { notFound } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthMessage } from "@/components/ui/auth-message";

const messageContent = {
  "email-confirm": {
    subtitle:
      "We sent a password reset link to your email (uremail@gmail.com) which is valid for 24 hours after receiving the email. Please check your inbox!",
  },
  "link-expired": {
    subtitle:
      "The password reset link has expired. Please request a new link to reset your password.",
  },
  "reset-password-success": {
    subtitle:
      "You can log in with your new password. If you encounter any issues, please contact support!",
  },
};

export default function MessagePage({ params }: { params: { slug: string } }) {
  const content = messageContent[params.slug as keyof typeof messageContent];
  if (!content) return notFound();

  return (
    <AuthLayout>
      <AuthMessage type={params.slug as any} subtitle={content.subtitle} />
    </AuthLayout>
  );
}
