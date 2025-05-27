"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/lib/schemas/EmployeeSchema";
import { z } from "zod";
import { useState } from "react";

import { DatePickerField } from "@/components/form/date-picker-field";
import { FormSection } from "@/components/form/form-section";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function AddNewEmployeePage() {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthPlace: "",
      birthDate: undefined,
      nik: "",
      gender: "",
      lastEducation: "",
      email: "",
      mobileNumber: "",
      position: "",
      employeeType: "",
      grade: "",
      joinDate: undefined,
      branch: "",
      bank: "",
      accountNumber: "",
      bankAccountName: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

const onSubmit = async (data: EmployeeFormValues) => {
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const response = await fetch("http://localhost:8000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        birthDate: data.birthDate?.toISOString().split("T")[0], // pastikan format yyyy-mm-dd
        joinDate: data.joinDate?.toISOString().split("T")[0],
      }),
    });

    const text = await response.text();
    console.log("Raw response text:", text);

    try {
      const json = JSON.parse(text);

      if (!response.ok) {
        console.error("Backend validation error or other:", json);
        setError(json.message || "Gagal menyimpan data.");
        return;
      }

      setSuccess("Data karyawan berhasil disimpan!");
      form.reset();
    } catch (jsonError) {
      console.error("Response is not valid JSON:", jsonError);
      setError("Respons server tidak valid JSON.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Terjadi kesalahan saat mengirim data.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Personal Information">
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-3">
                  <TextField label="First Name" name="firstName" required />
                  <TextField label="Last Name" name="lastName" required />
                </div>
                <div className="flex space-x-3">
                  <TextField label="Birth Place" name="birthPlace" required />
                  <DatePickerField
                    label="Birth Date"
                    name="birthDate"
                    required
                  />
                </div>
                <TextField label="NIK" name="nik" required />
                <SelectField
                  label="Gender"
                  name="gender"
                  required
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />
              </div>
              <div className="space-y-4">
                <SelectField
                  label="Last Education"
                  name="lastEducation"
                  required
                  options={[
                    {
                      label: "High School or Equivalent",
                      value: "HighSchool",
                    },
                    {
                      label: "Vocational High School",
                      value: "Vocational High School",
                    },
                    { label: "Bachelor's Degree (S1/D4)", value: "Bachelor's Degree (S1/D4)" },
                    { label: "Master's Degree (S2)", value: "Master's Degree (S2)" },
                    { label: "Doctorate (S3)", value: "Doctorate (S3)" },
                  ]}
                />
                <TextField label="Email" name="email" type="email" required />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  required
                />
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
                    { label: "Backend Developer", value: "Backend Developer" },
                    { label: "Frontend Developer", value: "Frontend Developer" },
                    { label: "Fullstack Developer", value: "Fullstack" },
                    { label: "HR Manager", value: "HR Manager" },
                    { label: "Mobile Developer", value: "Mobile Developer" },
                    { label: "Project Manager", value: "Project Developer" },
                    { label: "QA Engineer", value: "QA Engineer" },
                    { label: "Recruiter", value: "Recruiter" },
                    { label: "UI/UX Designer", value: "UI/UX Designer" },
                  ]}
                />
                <SelectField
                  label="Employee Type"
                  name="employeeType"
                  required
                  options={[
                    { label: "Contract", value: "Contract" },
                    { label: "Employee", value: "Employee" },
                    { label: "Probation", value: "Probation" },
                  ]}
                />
                <SelectField
                  label="Grade"
                  name="grade"
                  required
                  options={[
                    { label: "Lead", value: "Lead" },
                    { label: "Manager", value: "Manager" },
                    { label: "Senior Staff", value: "Senior Staff" },
                    { label: "Staff", value: "Staff" },
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
                    { label: "Malang", value: "Malang" },
                    { label: "Surabaya", value: "Surabaya" },
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
                    { label: "BCA", value: "BCA" },
                    { label: "BRI", value: "BRI" },
                    { label: "Mandiri", value: "Mandiri" },
                  ]}
                />
                <TextField
                  label="Account Number"
                  name="accountNumber"
                  required
                />
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

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="gap-4 bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)]"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
