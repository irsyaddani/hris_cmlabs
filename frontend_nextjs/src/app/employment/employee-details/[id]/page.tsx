"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { AlertMessage } from "@/components/ui/alert-message";
import { differenceInYears } from "date-fns"; // Import for eligibility check

interface Employee {
  id: string;
  employee_code: string;
  firstName: string;
  lastName: string;
  user: {
    email: string;
  };
  mobileNumber: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  nik: string;
  lastEducation: string;
  position: string;
  employeeType: string;
  joinDate: string;
  branch: string;
  grade: string;
  bank: string;
  bankAccountName: string;
  accountNumber: string;
  annualLeave?: number | null; // Optional field, can be null if not eligible
}

const bankLabels: Record<string, string> = {
  bca: "BCA",
  bri: "BRI",
  mandiri: "Mandiri",
};

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
};

const educationLabels: Record<string, string> = {
  high_school: "High School",
  vocational_high_school: "Vocational High School",
  bachelor: "Bachelor's Degree (S1/D4)",
  master: "Master's Degree (S2)",
  doctorate: "Doctorate (S3)",
};

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

const employeeLabels: Record<string, string> = {
  contract: "Contract",
  employee: "Employee",
  probation: "Probation",
};

const gradeLabels: Record<string, string> = {
  lead: "Lead",
  manager: "Manager",
  senior_staff: "Senior Staff",
  staff: "Staff",
};

const branchlabels: Record<string, string> = {
  malang: "Malang",
  surabaya: "Surabaya",
};

// Define the params type for the dynamic route
type Params = {
  id: string;
};

export default function EmployeeDetailsPage() {
  const params = useParams<Params>(); // Type the useParams hook with the Params type
  const id = params?.id || ""; // Provide a default value or handle null
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch employee:", err);
      });

    if (searchParams) {
      const success = searchParams.get("success");
      if (success === "edit-success") {
        setShowSuccessAlert(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [id, searchParams]);

  // Function to check eligibility for annual leave
  const isEligibleForAnnualLeave = (
    joinDate: string | null | undefined
  ): boolean => {
    if (!joinDate) return false;
    const today = new Date();
    const joinDateObj = new Date(joinDate);
    const yearsWorked = differenceInYears(today, joinDateObj);
    return yearsWorked >= 1;
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteDialog(false);
      router.push("/employment?success=delete-success"); // Redirect with success param
    } catch (error) {
      console.error("Failed to delete employee data:", error);
      setDeleteError("An error occurred while deleting data.");
    }
  };

  if (!employee) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6 space-y-5">
      {showSuccessAlert && (
        <AlertMessage
          type="success"
          title="Success!"
          message="Employee data has been updated"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Personal Information
        </h3>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-medium">
                {employee.firstName} {employee.lastName}
              </h2>
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0 hidden sm:block" />
              <h2 className="text-2xl font-medium">{employee.employee_code}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-md font-medium">{employee.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="text-md font-medium">{employee.mobileNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Birth</p>
              <p className="text-md font-medium">
                {employee.birthPlace}, {employee.birthDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-md font-medium">
                {genderLabels[employee.gender] || employee.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIK</p>
              <p className="text-md font-medium">{employee.nik}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Education</p>
              <p className="text-md font-medium">
                {educationLabels[employee.lastEducation] ||
                  employee.lastEducation}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Employee Information
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Position</p>
            <p className="text-md font-medium">
              {positionLabels[employee.position] || employee.position}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Employment Type</p>
            <p className="text-md font-medium">
              {employeeLabels[employee.employeeType] || employee.employeeType}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Join Date</p>
            <p className="text-md font-medium">{employee.joinDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Branch</p>
            <p className="text-md font-medium">
              {branchlabels[employee.branch] || employee.branch}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Leave</p>
            {isEligibleForAnnualLeave(employee.joinDate) ? (
              <p className="text-md font-medium">
                {employee.annualLeave !== null &&
                employee.annualLeave !== undefined
                  ? `${employee.annualLeave} days`
                  : "Not specified"}
              </p>
            ) : (
              <p className="text-md font-medium text-gray-500">
                Not eligible (requires 1 year of employment)
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grade</p>
            <p className="text-md font-medium">
              {gradeLabels[employee.grade] || employee.grade}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <div className="text-md text-muted-foreground mb-6">
          Bank Information
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Bank</p>
            <p className="text-md font-medium">
              {bankLabels[employee.bank] || employee.bank}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bank Account Name</p>
            <p className="text-md font-medium">{employee.bankAccountName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Number</p>
            <p className="text-md font-medium">{employee.accountNumber}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex gap-3">
          <Button
            size="lg"
            className="gap-4 bg-primary-900 text-white hover:bg-primary-700"
            onClick={() =>
              router.push(`/employment/employee-edit/${id}`)
            }
          >
            Edit data
          </Button>
          <ConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            trigger={
              <Button
                variant="destructive"
                size="lg"
                className="gap-4 bg-danger-main text-white hover:bg-danger-hover"
              >
                Delete
              </Button>
            }
            title="Are you sure want to delete this employee?"
            description={
              <>
                This action cannot be undone and will remove all related data
                permanently.
              </>
            }
            confirmText="Delete"
            cancelText="No, cancel"
            confirmClassName="bg-danger-main text-white hover:bg-danger-hover"
            cancelClassName="hover:bg-neutral-200"
            onConfirm={handleDelete}
            error={deleteError}
          />
        </div>
      </div>
    </div>
  );
}
