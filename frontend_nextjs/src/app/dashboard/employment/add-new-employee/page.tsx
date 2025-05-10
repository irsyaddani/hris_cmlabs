"use client";

import { DatePickerField } from "@/components/form/date-picker-field";
import { FormSection } from "@/components/form/form-section";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";

export default function AddNewEmployeePage() {
  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <form className="space-y-8">
        <FormSection title="Personal Information">
          <div className="grid grid-cols-2 gap-7">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-3">
                <TextField label="First Name" name="firstName" required />
                <TextField label="Last Name" name="lastName" required />
              </div>
              <div className="flex space-x-3">
                <TextField label="Birth Place" name="birthPlace" required />
                <DatePickerField label="Birth Date" name="birthDate" required />
              </div>
              <TextField label="NIK" name="nik" required />
              <SelectField
                label="Gender"
                name="gender"
                required
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            </div>
            <div className="space-y-4">
              <SelectField
                label="Last Education"
                name="lastEducation"
                required
                options={[
                  { label: "High School or Equivalent", value: "high_school" },
                  {
                    label: "Vocational High School or Equivalent",
                    value: "vocational_high_school",
                  },
                  { label: "Bachelor's Degree (S1/D4)", value: "bachelor" },
                  { label: "Master's Degree (S2)", value: "master" },
                  { label: "Doctorate (S3)", value: "doctorate" },
                ]}
              />
              <TextField label="Email" name="email" type="email" required />
              <TextField label="Mobile Number" name="mobileNumber" required />
            </div>
          </div>
        </FormSection>

        <FormSection title="Employee Information">
          <div className="grid grid-cols-2 gap-7">
            <div className="space-y-4">
              <SelectField
                label="Position"
                name="position"
                required
                options={[
                  { label: "Backend Developer", value: "backend_dev" },
                  { label: "Frontend Developer", value: "frontend_dev" },
                  { label: "Fullstack Developer", value: "fullstack_dev" },
                  { label: "HR Manager", value: "hr_manager" },
                  { label: "Mobile Developer", value: "mobile_dev" },
                  { label: "Project Manager", value: "project_manager" },
                  { label: "QA Engineer", value: "qa_engineer" },
                  { label: "Recruiter", value: "recruiter" },
                  { label: "UI/UX Designer", value: "ui_designer" },
                ]}
              />
              <SelectField
                label="Employee Type"
                name="employeeType"
                required
                options={[
                  { label: "Contract", value: "contract" },
                  { label: "Employee", value: "employee" },
                  { label: "Probation", value: "probation" },
                ]}
              />
              <SelectField
                label="Grade"
                name="grade"
                required
                options={[
                  { label: "Lead", value: "lead" },
                  { label: "Manager", value: "manager" },
                  { label: "Senior Staff", value: "senior_staff" },
                  { label: "Staff", value: "staff" },
                ]}
              />
            </div>
            <div className="space-y-4">
              <DatePickerField label="Join Date" name="joinDate" required />
              <SelectField
                label="Branch"
                name="branch"
                required
                options={[
                  { label: "Malang", value: "malang" },
                  { label: "Surabaya", value: "surabaya" },
                ]}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Bank Information">
          <div className="grid grid-cols-2 gap-7">
            <div className="space-y-4">
              <SelectField
                label="Bank"
                name="bank"
                required
                options={[
                  { label: "BCA", value: "bca" },
                  { label: "BRI", value: "bri" },
                  { label: "Mandiri", value: "mandiri" },
                ]}
              />
              <TextField label="Account Number" name="accountNumber" required />
            </div>
            <div className="space-y-4">
              <TextField
                label="Bank Account Name"
                name="bankAccountName"
                required
              />
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="gap-4 bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)]"
          >
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
