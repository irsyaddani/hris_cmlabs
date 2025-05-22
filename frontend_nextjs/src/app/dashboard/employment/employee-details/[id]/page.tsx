"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  bankAccountNumber: string;
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/employees/${id}`)
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch employee:", err);
      });
  }, [id]);

  if (!employee) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6 space-y-5">
      {/* Personal Information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">Personal Information</h3>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-medium">
                {employee.firstName} {employee.lastName}
              </h2>
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0 hidden sm:block" />
              <h2 className="text-2xl font-medium">{employee.id}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
            <div><p className="text-sm text-muted-foreground">Email</p><p className="text-md font-medium">{employee.email}</p></div>
            <div><p className="text-sm text-muted-foreground">Mobile Number</p><p className="text-md font-medium">{employee.mobileNumber}</p></div>
            <div><p className="text-sm text-muted-foreground">Birth</p><p className="text-md font-medium">{employee.birthPlace}, {employee.birthDate}</p></div>
            <div><p className="text-sm text-muted-foreground">Gender</p><p className="text-md font-medium">{employee.gender}</p></div>
            <div><p className="text-sm text-muted-foreground">NIK</p><p className="text-md font-medium">{employee.nik}</p></div>
            <div><p className="text-sm text-muted-foreground">Last Education</p><p className="text-md font-medium">{employee.lastEducation}</p></div>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">Employee Information</h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div><p className="text-sm text-muted-foreground">Position</p><p className="text-md font-medium">{employee.position}</p></div>
          <div><p className="text-sm text-muted-foreground">Employment Type</p><p className="text-md font-medium">{employee.employeeType}</p></div>
          <div><p className="text-sm text-muted-foreground">Join Date</p><p className="text-md font-medium">{employee.joinDate}</p></div>
          <div><p className="text-sm text-muted-foreground">Branch</p><p className="text-md font-medium">{employee.branch}</p></div>
          <div><p className="text-sm text-muted-foreground">Grade</p><p className="text-md font-medium">{employee.grade}</p></div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">Bank Information</h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div><p className="text-sm text-muted-foreground">Bank</p><p className="text-md font-medium">{employee.bank}</p></div>
          <div><p className="text-sm text-muted-foreground">Bank Account Name</p><p className="text-md font-medium">{employee.bankAccountName}</p></div>
          <div><p className="text-sm text-muted-foreground">Account Number</p><p className="text-md font-medium">{employee.bankAccountNumber}</p></div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="destructive"
          size="lg"
          className="gap-4 bg-[var(--color-danger-main)] text-white hover:bg-[var(--color-danger-hover)]"
        >
          Hapus
        </Button>
        <Button
          size="lg"
          className="gap-4 bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)]"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
