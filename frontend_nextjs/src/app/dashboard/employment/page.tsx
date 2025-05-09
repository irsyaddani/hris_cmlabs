"use client";

import { DataTable } from "../../../components/data-table-components/data-table";
import { columns } from "../../../components/data-table-components/columns";
import { MiniCard } from "@/components/ui/mini-card";
import { IconUsers } from "@tabler/icons-react";

const dummyData = [
  {
    id: "EMP001",
    name: "Amanda Fadila",
    phone: "081234567890",
    branch: "Malang",
    position: "Frontend Dev",
    grade: "Lead",
    status: "Employee",
  },
  {
    id: "EMP002",
    name: "Dennis Parulian",
    phone: "082345678901",
    branch: "Surabaya",
    position: "UI",
    grade: "Manager",
    status: "Contract",
  },
  {
    id: "EMP003",
    name: "Emir Abiyyu",
    phone: "083456789012",
    branch: "Jakarta",
    position: "Backend",
    grade: "Lead",
    status: "Employee",
  },
  {
    id: "EMP004",
    name: "Irsyad Danisaputra",
    phone: "084567890123",
    branch: "Malang",
    position: "UI",
    grade: "Manager",
    status: "Prohibition",
  },
  {
    id: "EMP005",
    name: "Putra Yuwana",
    phone: "085678901234",
    branch: "Surabaya",
    position: "Backend",
    grade: "Lead",
    status: "Contract",
  },
];

export default function EmploymentPage() {
  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniCard
          icon={IconUsers}
          title="Total Employee"
          value="1200 Orang"
          description="Update: 20 March 2025"
        />
        <MiniCard
          icon={IconUsers}
          title="New Employee"
          value="1200 Orang"
          description="Update: 20 March 2025"
        />
        <MiniCard
          icon={IconUsers}
          title="Active Employee"
          value="1200 Orang"
          description="Update: 20 March 2025"
        />
      </div>

      <DataTable data={dummyData} columns={columns} />
    </div>
  );
}
