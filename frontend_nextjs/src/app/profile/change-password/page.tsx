"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert-message";

// Create schema for change password
const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onSubmit = async (data: ChangePasswordValues) => {
    setLoading(true);
    setError(null);

    try {
      // API call to change password
      const response = await fetch(
        "http://localhost:8000/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword: data.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to change password.");
        return;
      }

      // On success, redirect to profile page with success parameter
      router.push("/profile?success=password-changed");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error occurred while changing password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 relative">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">Change Password</h1>
            <p className="text-sm font-reguler text-muted-foreground">
              Update your password here. Click save when you're done.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2 w-full">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Input new password"
                {...form.register("newPassword")}
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <AlertMessage
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
              className="fixed bottom-6 right-6"
            />
          )}

          <div className="flex justify-end">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="hover:bg-neutral-200 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
              >
                {loading ? "Updating..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
