"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadProfile from "@/components/ui/upload-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert-message";

// Create a minimal schema for edit profile (only name field)
const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "Amanda Fadila", // Default value
    },
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onSubmit = async (data: EditProfileValues) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to update profile.");
        return;
      }

      // On success, redirect to profile page with success parameter
      router.push("/profile?success=profile-updated");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 relative">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">Edit Profile</h1>
            <p className="text-sm font-reguler text-muted-foreground">
              Make changes to your profile here. Click save when you're done.
            </p>
          </div>

          <UploadProfile />

          <div className="grid gap-4">
            <div className="grid gap-2 w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Amanda Fadila"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-danger-main">
                  {form.formState.errors.name.message}
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
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
