'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

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
}

const bankLabels: Record<string, string> = {
  bca: 'BCA',
  bri: 'BRI',
  mandiri: 'Mandiri',
};

const genderLabels: Record<string, string> = {
  male: 'Male',
  female: 'Female',
};

const educationLabels: Record<string, string> = {
  high_school: 'High School',
  vocational_high_school: 'Vocational High School',
  bachelor: "Bachelor's Degree (S1/D4)",
  master: "Master's Degree (S2)",
  doctorate: 'Doctorate (S3)',
};

const positionLabels: Record<string, string> = {
  backend_dev: 'Backend Developer',
  frontend_dev: 'Frontend Developer',
  fullstack_dev: 'Fullstack Developer',
  hr_manager: 'HR Manager',
  mobile_dev: 'Mobile Developer',
  project_manager: 'Project Manager',
  qa_engineer: 'QA Engineer',
  recruiter: 'Recruiter',
  ui_designer: 'UI/UX Designer',
};

const employeeLabels: Record<string, string> = {
  contract: 'Contract',
  employee: 'Employee',
  probation: 'Probation',
};

const gradeLabels: Record<string, string> = {
  lead: 'Lead',
  manager: 'Manager',
  senior_staff: 'Senior Staff',
  staff: 'Staff',
};

const branchLabels: Record<string, string> = {
  malang: 'Malang',
  surabaya: 'Surabaya',
};

export default function EmployeeDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!id) return;

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
        console.error('Failed to fetch employee:', err);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Data karyawan berhasil dihapus.');
      router.push('/employment');
    } catch (error) {
      console.error('Gagal menghapus data karyawan:', error);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  if (!id) return <p className="p-6">Parameter ID tidak ditemukan di URL.</p>;
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
                {educationLabels[employee.lastEducation] || employee.lastEducation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">Employee Information</h3>
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
              {branchLabels[employee.branch] || employee.branch}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grade</p>
            <p className="text-md font-medium">
              {gradeLabels[employee.grade] || employee.grade}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <div className="text-md text-muted-foreground mb-6">Bank Information</div>
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="destructive"
          size="lg"
          className="gap-4 bg-danger-main text-white hover:bg-danger-hover"
          onClick={handleDelete}
        >
          Hapus
        </Button>
        <Button
          size="lg"
          className="gap-4 bg-primary-900 text-white hover:bg-primary-700"
          onClick={() =>
            router.push(`/employment/employee-edit?id=${id}`)
          }
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
