"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns as checkclockColumns } from "../../components/data-table-components/columns-checkclock";
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
}: {
  data: CheckClock[];
  loading: boolean;
}) {
  return (
    <div className="space-y-6">
      <DataTable
        data={loading ? [] : data}
        columns={checkclockColumns}
        toolbarVariant="checkclock"
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
  const idParam = searchParams.get("id");
  const numericId = idParam ? parseInt(idParam, 10) : undefined;

  const [data, setData] = useState<CheckClock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    // Reset states when role changes
    if (user.role !== "admin") {
      setLoading(false);
      setData([]);
      return;
    }

    // Only fetch data for admin
    setLoading(true);
    async function fetchCheckClocks() {
      try {
        const response = await fetch("http://localhost:8000/api/checkclocks");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
  async function fetchCheckClocks() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/checkclock");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

        setData(result.data);
      } catch (error: any) {
        console.error("Gagal mengambil data check clock", error);
        // Keep data empty on error
      } finally {
        setLoading(false);
        
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

    fetchCheckClocks();
  }, [user.role]);

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6">
      {user.role === "admin" ? (
        <AdminCheckClock data={data} loading={loading} />
      ) : (
        <UserCheckClock userName={user.name} />
      )}

  async function updateApproval(id: string, status: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/checkclock/approval/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response error:", errorData);
        throw new Error("Failed to update approval");
      }

      const data = await response.json();
      console.log("Approval updated successfully:", data);
    } catch (error: any) {
      console.error("Fetch failed:", error.message);
      alert("Gagal mengupdate approval. Silakan coba lagi.");
    }
  }

  useEffect(() => {
    fetchCheckClocks();
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <DataTable
        data={data}
        columns={columns(updateApproval)}
        toolbarVariant="checkclock"
        loading={loading}
        error={error}
      />
    </div>
  );
}
