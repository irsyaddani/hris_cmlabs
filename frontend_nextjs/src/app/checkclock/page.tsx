"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns } from "../../components/data-table-components/columns-checkclock";

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

export default function CheckClockPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const numericId = idParam ? parseInt(idParam, 10) : undefined;

  const [data, setData] = useState<CheckClock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
