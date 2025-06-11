"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns as checkclockColumnsFunction } from "../../components/data-table-components/columns-checkclock";
import { columns as clockinColumns } from "../../components/data-table-components/columns-clockin";
import { columns as clockHistoryColumns } from "../../components/data-table-components/columns-clock-history";
import { AlertMessage } from "@/components/ui/alert-message";
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

// Admin CheckClock Component
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

// User CheckClock Component
function UserCheckClock({ userName }: { userName: string }) {
  const dummyData = [
    {
      id: "1",
      date: "2025-06-05",
      clockIn: undefined,
      clockOut: undefined,
      status: "awaiting",
      approval: undefined,
    },
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
      <DataTable
        data={dummyData}
        columns={clockinColumns}
        toolbarVariant="clockin"
      />
      <DataTable
        data={dummyData}
        columns={clockHistoryColumns}
        toolbarVariant="clock-history"
      />
    </div>
  );
}

// Main Page
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

  // Fetch data only for admin
  useEffect(() => {
    if (user.level === "admin") {
      fetchCheckClocks();
    } else {
      setLoading(false);
      setData([]);
    }
  }, [user.level]);

  async function fetchCheckClocks() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/checkclock");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

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
        throw new Error(errorData.message || "Failed to update approval");
      }

      const result = await response.json();
      console.log("Approval updated successfully:", result);

      setData((prev) =>
        prev.map((item) =>
          item.id === numericId ? { ...item, approval: status } : item
        )
      );

      setAlertType("success");
      setAlertMessage(`Request ${status} successfully`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      console.error("Update approval failed:", error.message);
      setAlertType("error");
      setAlertMessage(error.message || "Failed to update approval.");
      setShowErrorAlert(true);
    }
  }

  // Handle search params (success/error)
  useEffect(() => {
    if (searchParams) {
      const success = searchParams.get("success");

      switch (success) {
        case "attendance-added":
          setAlertType("success");
          setAlertMessage("Attendance added successfully");
          setShowSuccessAlert(true);
          break;
        case "delete-success":
          setAlertType("success");
          setAlertMessage("Attendance deleted successfully");
          setShowSuccessAlert(true);
          break;
        case "delete-error":
          setAlertType("error");
          setAlertMessage("Failed to delete attendance");
          setShowErrorAlert(true);
          break;
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
      }

      // Remove ?success=... from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Auto hide alerts
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => setShowErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorAlert]);

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      {/* Success Alert */}
      {showSuccessAlert && (
        <AlertMessage
          type={alertType}
          title="Success!"
          message={alertMessage}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      {/* Error Alert */}
      {showErrorAlert && (
        <AlertMessage
          type={alertType}
          title="Error"
          message={alertMessage}
          onClose={() => setShowErrorAlert(false)}
        />
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
