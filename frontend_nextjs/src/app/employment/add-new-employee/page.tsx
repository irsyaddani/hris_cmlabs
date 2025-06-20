"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/lib/schemas/EmployeeSchema";
import { useState, useEffect } from "react"; // Import useEffect from react
import UploadProfile from "@/components/ui/upload-profile";
import { DatePicker } from "@/components/form/date-picker";
import { FormSection } from "@/components/form/form-section";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";
import { useRouter } from "next/navigation";
import { IconHelpCircle } from "@tabler/icons-react";
import { TooltipHelper } from "@/components/ui/tooltip-helper";
import { TextFieldIcon } from "@/components/form/text-field-icon";
import { differenceInYears } from "date-fns";
import { useSearchParams } from "next/navigation"; // For handling success/failure params

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function AddNewEmployeePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // To handle success/failure params
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // For add success

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
      annualLeave: undefined,
    },
  });

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

  // Helper function to check if join date is >= 1 year
  const isEligibleForAnnualLeave = (
    joinDate: Date | null | undefined
  ): boolean => {
    if (!joinDate) return false;
    const today = new Date();
    const yearsWorked = differenceInYears(today, joinDate);
    return yearsWorked >= 1;
  };

  useEffect(() => {
    // Check for success parameter on mount (for redirect feedback)
    if (searchParams) {
      const success = searchParams.get("success");
      if (success === "employee-added") {
        setShowSuccessAlert(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setLoading(true);
    setError(null);
    setShowSuccessAlert(false);

    if (!isEligibleForAnnualLeave(data.joinDate)) {
      data.annualLeave = 0;
    }

    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Upload gambar ke Cloudinary kalau ada
      let imageUrl = "";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "nl52nz8z");

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dj6rpnycb/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();
        console.log("Cloudinary Response:", cloudinaryData);

        imageUrl = cloudinaryData.secure_url;
      }

      // 2️⃣ Kirim data employee ke Laravel
      const response = await fetch("http://localhost:8000/api/employees", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          birthDate: data.birthDate?.toISOString().split("T")[0],
          joinDate: data.joinDate?.toISOString().split("T")[0],
          profile_picture: imageUrl,
        }),
      });

      const text = await response.text();
      console.log("Raw response text:", text);

      try {
        const json = JSON.parse(text);

        if (!response.ok) {
          console.error("Backend validation error or other:", json);
          setError(json.message || "Failed to save data.");
          return;
        }

        setShowSuccessAlert(true);
        router.push("/employment/?success=employee-added");
      } catch (jsonError) {
        console.error("Response is not valid JSON:", jsonError);
        setError("Respons server tidak valid JSON.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while trying to send the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-7 relative">
      <UploadProfile onChange={handleImageChange} />

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
                          Value ignored and set to 0 if employee hasn’t reached
                          1 year.
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
            <AlertMessage
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
              className="fixed bottom-6 right-6"
            />
          )}
          {showSuccessAlert && (
            <AlertMessage
              type="success"
              title="Success!"
              message="Employee added successfully"
              onClose={() => setShowSuccessAlert(false)}
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
                onClick={() => router.push("/employment")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
              >
                {loading ? "Loading..." : "Add employee"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
