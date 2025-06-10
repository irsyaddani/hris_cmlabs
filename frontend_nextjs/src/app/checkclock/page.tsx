"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns as checkclockColumnsFunction } from "../../components/data-table-components/columns-checkclock";
import { columns as clockinColumns } from "../../components/data-table-components/columns-clockin";
import { columns as clockHistoryColumns } from "../../components/data-table-components/columns-clock-history";
import { useUser } from "@/lib/user-context";

interface CheckClock {
  id: number;
  name: string;
  avatarUrl?: string;
  position: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number;
  approval: string;
  status: string;
  reason?: string;
  proofFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  } | null;
  startDate?: string;
  endDate?: string;
}

// Admin CheckClock Component - Shows only checkclock data table
function AdminCheckClock({
  data,
  loading,
  error,
  updateApproval,
}: {
  data: CheckClock[];
  loading: boolean;
  error: string | null;
  updateApproval: (id: string, status: string) => Promise<void>;
}) {
  // Generate columns with the updateApproval function
  const checkclockColumns = checkclockColumnsFunction(updateApproval);

  return (
    <div className="space-y-6">
      <DataTable
        data={loading ? [] : data}
        columns={checkclockColumns}
        toolbarVariant="checkclock"
        loading={loading}
        error={error}
      />
    </div>
  );
}

// User CheckClock Component - Shows clockin and clock-history data tables
function UserCheckClock({ userName }: { userName: string }) {
  const dummyData = [
    // Current day, no clock-in, before workEndHour (awaiting, active Clock In)
    {
      id: "1",
      date: "2025-06-05",
      clockIn: undefined,
      clockOut: undefined,
      status: "awaiting",
      approval: undefined,
    },
    // Past day, clocked in, no clock-out (on time, auto clock-out at 00:00, Details)
    {
      id: "7",
      date: "2025-06-04",
      clockIn: "2025-06-04T07:55:00+07:00",
      clockOut: undefined,
      status: "on time",
      approval: undefined,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Clock In Data Table */}
      <DataTable
        data={false ? ([] as typeof dummyData) : dummyData}
        columns={clockinColumns}
        toolbarVariant="clockin"
      />

      {/* Clock History Data Table */}
      <DataTable
        data={dummyData}
        columns={clockHistoryColumns}
        toolbarVariant="clock-history"
      />
    </div>
  );
}

// Main CheckClock Page
export default function CheckClockPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CheckClock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Helper functions (kept from original)
  const createTodayTime = (hour: number, minute: number = 0): string => {
    const today = new Date();
    today.setHours(hour, minute, 0, 0);
    return today.toISOString();
  };

  const createYesterdayTime = (hour: number, minute: number = 0): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(hour, minute, 0, 0);
    return yesterday.toISOString();
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  async function fetchCheckClocks() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/checkclock");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Format data API tidak sesuai");
      }

      setData(result.data);
      setError(null);
    } catch (error: any) {
      console.error("Gagal mengambil data check clock", error);
      setError(error.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  }

  async function updateApproval(id: string, status: string) {
    try {
      // Konversi id ke number jika diperlukan karena interface menggunakan number
      const numericId = parseInt(id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/checkclock/approval/${numericId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approval: status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response error:", errorData);
        throw new Error(errorData.message || "Failed to update approval");
      }

      const result = await response.json();
      console.log("Approval updated successfully:", result);

      // Update local state secara optimistic (update langsung tanpa fetch ulang)
      setData((prevData) =>
        prevData.map((item) =>
          item.id === numericId ? { ...item, approval: status } : item
        )
      );

      // Show success message
      setAlertType("success");
      setAlertMessage(`Request ${status} successfully`);
      setShowSuccessAlert(true);

      // Auto hide alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error: any) {
      console.error("Update approval failed:", error.message);

      // Show error message
      setAlertType("error");
      setAlertMessage(
        error.message || "Failed to update approval. Please try again."
      );
      setShowErrorAlert(true);

      // Auto hide alert after 5 seconds
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  }

  // Handle search params safely
  useEffect(() => {
    // Check for success/failure parameters in URL
    if (searchParams) {
      const success = searchParams.get("success");
      if (success) {
        switch (success) {
          case "approval-updated":
            setAlertType("success");
            setAlertMessage("Approval updated successfully");
            setShowSuccessAlert(true);
            break;
          case "approval-error":
            setAlertType("error");
            setAlertMessage("Failed to update approval");
            setShowErrorAlert(true);
            break;
          case "checkclock-success":
            setAlertType("success");
            setAlertMessage("Check clock operation completed successfully");
            setShowSuccessAlert(true);
            break;
          case "checkclock-error":
            setAlertType("error");
            setAlertMessage("Failed to complete check clock operation");
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

  useEffect(() => {
    // Reset states when user level changes
    if (user.level !== "admin") {
      setLoading(false);
      setData([]);
      return;
    }

    // Only fetch data for admin
    fetchCheckClocks();
  }, [user.level]);

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex justify-between items-center">
            <div>
              <strong>Success!</strong> {alertMessage}
            </div>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <div className="mb-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex justify-between items-center">
            <div>
              <strong>Error!</strong> {alertMessage}
            </div>
            <button
              onClick={() => setShowErrorAlert(false)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {user.level === "admin" ? (
        <AdminCheckClock
          data={data}
          loading={loading}
          error={error}
          updateApproval={updateApproval}
        />
      ) : (
        <UserCheckClock userName={user.name} />
      )}
    </div>
  );
}
