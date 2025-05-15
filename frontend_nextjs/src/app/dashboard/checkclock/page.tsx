"use client";

import { DataTable } from "../../../components/data-table-components/data-table";
import { columns } from "../../../components/data-table-components/columns-checkclock";

const dummyData = [
  {
    name: "Amanda Fadila",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "Frontend",
    clockIn: "2025-05-10T08:00:00+07:00",
    clockOut: "2025-05-10T17:00:00+07:00",
    workHours: 9,
    approval: "-",
    status: "on time",
  },
  // ✅ Late - clockIn lewat dari jam 08:00 WIB, clockOut ada
  {
    name: "Dennis Parulian",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "Backend",
    clockIn: "2025-05-10T08:45:00+07:00",
    clockOut: "2025-05-10T17:00:00+07:00",
    workHours: 8.25,
    approval: "-",
    status: "late",
  },
  // ✅ On time - clockOut masih awaiting
  {
    name: "Emir Abiyyu",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "Mobile",
    clockIn: "2025-05-12T08:00:00+07:00",
    clockOut: undefined, // dianggap awaiting
    workHours: 0,
    approval: "-",
    status: "on time",
  },
  // ✅ Permit - approved
  {
    name: "Irsyad Danisaputra",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "Designer",
    clockIn: undefined,
    clockOut: undefined,
    workHours: 0,
    approval: "approved",
    status: "permit",
  },
  // ✅ Permit - denied
  {
    name: "Putra Yuwana",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "QA",
    clockIn: undefined,
    clockOut: undefined,
    workHours: 0,
    approval: "rejected",
    status: "permit",
  },
  // ✅ Annual leave - pending
  {
    name: "Ahmad Taufiq",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "HR",
    clockIn: undefined,
    clockOut: undefined,
    workHours: 0,
    approval: "pending",
    status: "annual leave",
  },
  {
    name: "Fajar Bayu",
    avatarUrl: "https://yourcdn.com/avatars/putra.jpg",
    position: "Project Manager",
    clockIn: undefined,
    clockOut: undefined,
    workHours: 0,
    approval: "pending",
    status: "no-show",
  },
];

export default function CheckClockPage() {
  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 ">
      <DataTable
        data={dummyData}
        columns={columns}
        toolbarVariant="checkclock"
      />
    </div>
  );
}
