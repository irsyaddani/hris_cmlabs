"use client";

import { Button } from "@/components/ui/button";

export default function EmployeeDetailsPage() {
  return (
    <div className="min-h-screen p-6 space-y-5">
      {/* personal information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Personal Information
        </h3>

        <div className="flex flex-col gap-7">
          {/* UP SIDE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-medium">Irsyad Danisaputra</h2>
              <div className="w-2 h-2 bg-gray-200 rounded-full shrink-0 hidden sm:block" />
              <h2 className="text-2xl font-medium">ID012012</h2>
            </div>
          </div>

          {/* DOWN SIDE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 w-full">
            <div className="order-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-md font-medium">irsyad.sp@mail.com</p>
            </div>
            <div className="order-4 md:order-2">
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="text-md font-medium">09182018201892</p>
            </div>
            <div className="order-5 md:order-3">
              <p className="text-sm text-muted-foreground">Birth</p>
              <p className="text-md font-medium">Malang, January 23rd 1995</p>
            </div>
            <div className="order-2 md:order-4">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-md font-medium">Male</p>
            </div>
            <div className="order-3 md:order-5">
              <p className="text-sm text-muted-foreground">NIK</p>
              <p className="text-md font-medium">350182718221212</p>
            </div>
            <div className="order-6 md:order-6">
              <p className="text-sm text-muted-foreground">Last Education</p>
              <p className="text-md font-medium">High School or Equivalent</p>
            </div>
          </div>
        </div>
      </div>

      {/* employee information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">
          Employee Information
        </h3>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div className="order-1">
            <p className="text-sm text-muted-foreground">Position</p>
            <p className="text-md font-medium">Project Manager</p>
          </div>
          <div className="order-4 md:order-2">
            <p className="text-sm text-muted-foreground">Employment Type</p>
            <p className="text-md font-medium">Contract</p>
          </div>
          <div className="order-5 md:order-3">
            <p className="text-sm text-muted-foreground">Join Date</p>
            <p className="text-md font-medium">January 23rd, 2023</p>
          </div>
          <div className="order-2 md:order-4">
            <p className="text-sm text-muted-foreground">Branch</p>
            <p className="text-md font-medium">Malang</p>
          </div>
          <div className="order-3 md:order-5">
            <p className="text-sm text-muted-foreground">Grade</p>
            <p className="text-md font-medium">Lead</p>
          </div>
        </div>
      </div>
      {/* bank information */}
      <div className="border border-neutral-200 rounded-lg p-5 w-full">
        <h3 className="text-md text-muted-foreground mb-6">Bank Information</h3>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div className="order-1">
            <p className="text-sm text-muted-foreground">Bank</p>
            <p className="text-md font-medium">BCA</p>
          </div>
          <div className="order-2">
            <p className="text-sm text-muted-foreground">Bank Account Name</p>
            <p className="text-md font-medium">Irsyad Danisaputra</p>
          </div>
          <div className="order-3">
            <p className="text-sm text-muted-foreground">Account Number</p>
            <p className="text-md font-medium">6251721821</p>
          </div>
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
