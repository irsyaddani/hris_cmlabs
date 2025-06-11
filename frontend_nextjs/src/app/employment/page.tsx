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
  const [showErrorAlert, setShowErrorAlert] = useState(false); // State for error alert
  const [alertMessage, setAlertMessage] = useState(""); // Dynamic message for alert
  const [alertType, setAlertType] = useState<"success" | "error">("success"); // Dynamic type
  const searchParams = useSearchParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check for success/failure parameters in URL
    if (searchParams) {
      const success = searchParams.get("success");
      if (success) {
        switch (success) {
          case "employee-added":
            setAlertType("success");
            setAlertMessage("Employee added successfully");
            setShowSuccessAlert(true);
            break;
          case "delete-success":
            setAlertType("success");
            setAlertMessage("Employee deleted successfully");
            setShowSuccessAlert(true);
            break;
          case "delete-error":
            setAlertType("error");
            setAlertMessage("Failed to delete employee");
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

  // utility function to format snake_case to Title Case
  const formatDisplayText = (text: string): string => {
    if (!text) return text;

    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Special formatting function for positions with acronym handling
  const formatPositionText = (text: string): string => {
    if (!text) return text;

    const acronyms = ["UI", "UX", "QA", "HR"];

    return text
      .split("_")
      .map((word) => {
        const upperWord = word.toUpperCase();

        if (acronyms.includes(upperWord)) {
          return upperWord;
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ")
      .replace(/\bUi\b/g, "UI")
      .replace(/\bUx\b/g, "UX")
      .replace(/UI UX/g, "UI/UX");
  };

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
          branch: formatDisplayText(emp.branch), // Format branch
          position: formatPositionText(emp.position), // Format position with special handling
          grade: formatDisplayText(emp.grade), // Format grade
          status: formatDisplayText(emp.employeeType), // Format status
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch employee data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/employees", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       const formatted = res.data.data.map((emp: any) => ({
  //         id: emp.id,
  //         employee_code: emp.employee_code,
  //         name: `${emp.firstName} ${emp.lastName}`,
  //         phone: emp.mobileNumber,
  //         branch: emp.branch,
  //         position: emp.position,
  //         grade: emp.grade,
  //         status: emp.employeeType,
  //       }));
  //       setData(formatted);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch employee data:", err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

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
