"use client";

import axios from "axios";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/lib/schemas/EmployeeSchema";
import { TextFieldIcon } from "@/components/form/text-field-icon";
import { SelectField } from "@/components/form/select-field";
import { DatePicker } from "@/components/form/date-picker";
import { FormSection } from "@/components/form/form-section";
import { Button } from "@/components/ui/button";
import { differenceInYears } from "date-fns"; // For eligibility check
import { IconHelpCircle } from "@tabler/icons-react"; // Tooltip icon
import { TooltipHelper } from "@/components/ui/tooltip-helper"; // Assuming this is your tooltip component
import { AlertMessage } from "@/components/ui/alert-message"; // For success/error messages

// Define the params type for the dynamic route
type Params = {
  id: string;
};

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EditEmployeePage() {
  const params = useParams<Params>(); // Type the useParams hook with the Params type
  const id = params?.id || ""; // Provide a default value or handle null
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // For success alert

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  // Token diambil dari localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return; // Kalau tidak ada id, hentikan

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
          annualLeave: data.annualLeave || null, // Handle null/undefined
        });
      } catch (err) {
        console.error(err);
        setError("Failed to retrieve employee data.");
      }
    };

    fetchEmployee();
  }, [id, form, token]);

  // Function to check eligibility for annual leave
  const isEligibleForAnnualLeave = (
    joinDate: Date | null | undefined
  ): boolean => {
    if (!joinDate) return false;
    const today = new Date();
    const yearsWorked = differenceInYears(today, joinDate);
    return yearsWorked >= 1;
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!isEligibleForAnnualLeave(data.joinDate)) {
        data.annualLeave = 0;
      }
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
            annualLeave: isEligibleForAnnualLeave(data.joinDate)
              ? data.annualLeave
              : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to updating data.");
        return;
      }

      // On success, redirect to detail page with success parameter
      router.push(`/employment/employee-details/${id}?success=edit-success`);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error occurred while updating the data.");
    } finally {
      setLoading(false);
    }
  };

  // Get form values for eligibility check
  const { watch } = form;
  const joinDate = watch("joinDate");

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 relative">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Personal Information">
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-3">
                  <TextFieldIcon label="First Name" name="firstName" required />
                  <TextFieldIcon label="Last Name" name="lastName" required />
                </div>
                <div className="flex space-x-3">
                  <TextFieldIcon
                    label="Birth Place"
                    name="birthPlace"
                    required
                  />
                  <DatePicker label="Birth Date" name="birthDate" required />
                </div>
                <TextFieldIcon label="NIK" name="nik" required />
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
                <TextFieldIcon
                  label="Email"
                  name="email"
                  type="email"
                  required
                />
                <TextFieldIcon
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
                <TextFieldIcon
                  label="Annual Leave"
                  name="annualLeave"
                  type="number"
                  required
                  icon={
                    <TooltipHelper
                      trigger={
                        <IconHelpCircle className="h-4 w-4 text-neutral-600" />
                      }
                      content={
                        <p className="text-sm text-center">
                          Value ignored and set to 0 if employee hasn’t 
                          reached 1 year.
                        </p>
                      }
                      side="right"
                    />
                  }
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
                <TextFieldIcon
                  label="Account Number"
                  name="accountNumber"
                  required
                />
              </div>
              <div className="space-y-4">
                <TextFieldIcon
                  label="Bank Account Name"
                  name="bankAccountName"
                  required
                />
              </div>
            </div>
          </FormSection>

          {error && (
            <AlertMessage
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
              className="fixed bottom-6 right-6"
            />
          )}
          {success && (
            <AlertMessage
              type="success"
              title="Success!"
              message={success}
              onClose={() => setSuccess(null)}
              className="fixed bottom-6 right-6"
            />
          )}

          <div className="flex justify-end">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="cursor-pointer hover:bg-neutral-200"
                onClick={() => router.push(`/employment/employee-details/${id}`)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="gap-4 bg-primary-900 text-white hover:bg-primary-700"
              >
                {loading ? "Loading..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
