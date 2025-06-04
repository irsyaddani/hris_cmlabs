"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employeeSchema } from "@/lib/schemas/EmployeeSchema";
import { TextField } from "@/components/form/text-field";
import { SelectField } from "@/components/form/select-field";
import { DatePicker } from "@/components/form/date-picker";
import { FormSection } from "@/components/form/form-section";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EditEmployeePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data.data;

        form.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          birthPlace: data.birthPlace,
          birthDate: new Date(data.birthDate),
          nik: data.nik,
          gender: data.gender,
          lastEducation: data.lastEducation,
          email: data.user?.email,
          mobileNumber: data.mobileNumber,
          position: data.position,
          employeeType: data.employeeType,
          grade: data.grade,
          joinDate: new Date(data.joinDate),
          branch: data.branch,
          bank: data.bank,
          accountNumber: data.accountNumber,
          bankAccountName: data.bankAccountName,
        });
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data karyawan.");
      }
    };

    fetchEmployee();
  }, [id, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            birthDate: data.birthDate?.toISOString().split("T")[0],
            joinDate: data.joinDate?.toISOString().split("T")[0],
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Gagal memperbarui data.");
        return;
      }

      setSuccess("Data karyawan berhasil diperbarui!");
      router.push("/dashboard/employment");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Terjadi kesalahan saat memperbarui data.");
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
                  <DatePicker label="Birth Date" name="birthDate" required />
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
                    {
                      label: "High School or Equivalent",
                      value: "high_school",
                    },
                    {
                      label: "Vocational High School",
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
                <DatePicker label="Join Date" name="joinDate" required />
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
            <p className="text-danger-main text-sm font-medium">{error}</p>
          )}
          {success && (
            <p className="text-success-main text-sm font-medium">{success}</p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="gap-4 bg-primary-900 text-white hover:bg-primary-700"
            >
              {loading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
