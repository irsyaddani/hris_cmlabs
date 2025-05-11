import { z } from "zod";

const today = new Date();

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  birthPlace: z.string().min(1, "Birth Place is required"),
  birthDate: z.date({
    required_error: "Birth Date is required",
    invalid_type_error: "Invalid date",
  }).refine(date => date <= today, "Birth date cannot be in the future"),
  nik: z
    .string()
    .length(16, "NIK must be 16 digits")
    .regex(/^\d+$/, "NIK must be numeric"),
  gender: z.string().min(1, "Gender is required"),

  lastEducation: z.string().min(1, "Last Education is required"),
  email: z.string().email("Invalid email format"),
  mobileNumber: z
    .string()
    .min(10, "Mobile number too short")
    .max(15, "Mobile number too long")
    .regex(/^\d+$/, "Mobile number must contain only digits"),

  position: z.string().min(1, "Position is required"),
  employeeType: z.string().min(1, "Employee Type is required"),
  grade: z.string().min(1, "Grade is required"),
  joinDate: z.date({
    required_error: "Join Date is required",
    invalid_type_error: "Invalid date",
  }).refine(date => date <= today, "Join date cannot be in the future"),
  branch: z.string().min(1, "Branch is required"),

  bank: z.string().min(1, "Bank is required"),
  accountNumber: z
    .string()
    .min(6, "Account number too short")
    .regex(/^\d+$/, "Account number must be numeric"),
  bankAccountName: z
    .string()
    .min(1, "Bank Account Name is required")
    .regex(/^[A-Za-z\s]+$/, "Account name must only contain letters and spaces"),
});
