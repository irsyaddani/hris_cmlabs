"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";

interface UserProfile {
  id: number;
  company_id: number;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  level: string;
}

const positionLabels: Record<string, string> = {
  backend_dev: "Backend Developer",
  frontend_dev: "Frontend Developer",
  fullstack_dev: "Fullstack Developer",
  hr_manager: "HR Manager",
  mobile_dev: "Mobile Developer",
  project_manager: "Project Manager",
  qa_engineer: "QA Engineer",
  recruiter: "Recruiter",
  ui_designer: "UI/UX Designer",
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserProfile>(
          "http://localhost:8000/api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle query param alerts
  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      if (success === "profile-updated") {
        setAlertType("success");
        setAlertMessage("Profile updated successfully");
        setShowAlert(true);
      } else if (success === "password-changed") {
        setAlertType("success");
        setAlertMessage("Password updated successfully");
        setShowAlert(true);
      } else if (success === "update-error") {
        setAlertType("error");
        setAlertMessage("Failed to update profile");
        setShowAlert(true);
      }

      // Remove query from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return <p className="p-6">No user data found.</p>;
  }

  return (
    <div className="min-h-screen p-6 space-y-5">
      {/* Alert */}
      {showAlert && (
        <AlertMessage
          type={alertType}
          title={alertType === "success" ? "Success!" : "Error"}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          className="fixed bottom-6 right-6"
        />
      )}

      <div className="flex flex-col gap-5">
        <div className="border border-neutral-200 rounded-lg p-5 w-full">
          <h3 className="text-md text-muted-foreground mb-6">Personal Information</h3>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
              <h2 className="text-2xl font-medium">{user.firstName} {user.lastName}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-md font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-md font-medium">
                  {user.level === "admin" ? "Admin" : "Employee"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="text-md font-medium">{positionLabels[user.position] || user.position}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
