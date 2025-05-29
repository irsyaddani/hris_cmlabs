"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns } from "../../components/data-table-components/columns-checkclock";

interface CheckClock {
  name: string;
  avatarUrl: string;
  position: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number;
  approval: string;
  status: string;
}

export default function CheckClockPage() {
  const [data, setData] = useState<CheckClock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCheckClocks() {
      try {
        const response = await fetch("http://localhost:8000/api/checkclocks");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Format data API tidak sesuai");
        }

        setData(result.data);
      } catch (error: any) {
        console.error("Gagal mengambil data check clock", error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    }

    fetchCheckClocks();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="p-6">Tidak ada data check clock.</div>;
  }

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <DataTable data={data} columns={columns} toolbarVariant="checkclock" />
    </div>
  );
}
