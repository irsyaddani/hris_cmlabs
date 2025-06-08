"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { DataTable } from "../../components/data-table-components/data-table";
import { columns } from "../../components/data-table-components/columns-employment";
import { MiniCard } from "@/components/ui/mini-card";
import { AlertMessage } from "@/components/ui/alert-message";
import { IconUsers } from "@tabler/icons-react";

export default function EmploymentPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const searchParams = useSearchParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check for success parameter in URL
    const success = searchParams?.get("success");
    if (success === "employee-added") {
      setShowSuccessAlert(true);
      // Remove the success parameter from URL after showing alert
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const formatted = res.data.data.map((emp: any) => ({
          id: emp.id,
          employee_code: emp.employee_code,
          name: `${emp.firstName} ${emp.lastName}`,
          phone: emp.mobileNumber,
          branch: emp.branch,
          position: emp.position,
          grade: emp.grade,
          status: emp.employeeType,
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Gagal fetch data karyawan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      {/* Success Alert */}
      {showSuccessAlert && (
        <AlertMessage
          type="success"
          title="Success!"
          message="Data saved successfully"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniCard
          icon={IconUsers}
          title="Total Employee"
          value={`${data.length} Orang`}
          description="Update: 20 March 2025"
        />
        <MiniCard
          icon={IconUsers}
          title="New Employee"
          value="20 Orang"
          description="Update: 20 March 2025"
        />
        <MiniCard
          icon={IconUsers}
          title="Active Employee"
          value="1000 Orang"
          description="Update: 20 March 2025"
        />
      </div>

      <DataTable
        data={loading ? [] : data}
        columns={columns}
        toolbarVariant="employment"
      />
    </div>
  );
}
