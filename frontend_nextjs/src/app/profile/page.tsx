"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";
import { useUser } from "@/lib/user-context";

// Admin Profile Page Component
function AdminProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Personal Information
        </h3>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
            <h2 className="text-2xl font-medium">Amanda Fadila Erros</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-md font-medium">amanda.fadila11@gmail.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-md font-medium">Admin</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="text-md font-medium">Human Resources</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="hover:bg-neutral-200 cursor-pointer"
            onClick={() => router.push("/profile/change-password")}
          >
            Change password
          </Button>
          <Button
            size="lg"
            className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
            onClick={() => router.push("/profile/edit-profile")}
          >
            Edit profile
          </Button>
        </div>
      </div>
    </div>
  );
}

// User Profile Page Component
function UserProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Personal Information
        </h3>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
            <h2 className="text-2xl font-medium">Amanda Fadila Erros</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-md font-medium">amanda.fadila11@gmail.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-md font-medium">Employee</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="text-md font-medium">Backend Developer</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
          onClick={() => router.push("/profile/change-password")}
        >
          Change password
        </Button>
      </div>
    </div>
  );
}

// Main Profile Page
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (searchParams) {
      const success = searchParams.get("success");
      if (success) {
        switch (success) {
          case "profile-updated":
            setAlertType("success");
            setAlertMessage("Profile updated successfully");
            setShowSuccessAlert(true);
            break;
          case "password-changed":
            setAlertType("success");
            setAlertMessage("Password updated successfully");
            setShowSuccessAlert(true);
            break;
          case "update-error":
            setAlertType("error");
            setAlertMessage("Failed to update profile");
            setShowErrorAlert(true);
            break;
        }
        // Remove the success parameter from URL after showing alert
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen p-6 space-y-5">
      {/* Success Alert */}
      {showSuccessAlert && (
        <AlertMessage
          type={alertType}
          title="Success!"
          message={alertMessage}
          onClose={() => setShowSuccessAlert(false)}
          className="fixed bottom-6 right-6"
        />
      )}
      {/* Error Alert */}
      {showErrorAlert && (
        <AlertMessage
          type={alertType}
          title="Error"
          message={alertMessage}
          onClose={() => setShowErrorAlert(false)}
          className="fixed bottom-6 right-6"
        />
      )}

      {user.level === "user" ? <UserProfilePage /> : <AdminProfilePage />}
    </div>
  );
}
