import { z } from "zod";
import { differenceInYears } from "date-fns";

const today = new Date();

export const employeeSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    birthPlace: z.string().min(1, "Birth Place is required"),
    birthDate: z
      .date({
        required_error: "Birth Date is required",
        invalid_type_error: "Invalid date",
      })
      .refine((date) => date <= today, "Birth date cannot be in the future"),

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

    joinDate: z
      .date({
        required_error: "Join Date is required",
        invalid_type_error: "Invalid date",
      })
      .refine((date) => date <= today, "Join date cannot be in the future"),

    branch: z.string().min(1, "Branch is required"),

    // Conditional annual leave field
    annualLeave: z
      .union([
        z.string().min(1, "Annual Leave is required"),
        z.string().optional(),
      ])
      .transform((val) => val || undefined),

    bank: z.string().min(1, "Bank is required"),
    accountNumber: z
      .string()
      .min(6, "Account number too short")
      .regex(/^\d+$/, "Account number must be numeric"),
    bankAccountName: z
      .string()
      .min(1, "Bank Account Name is required")
      .regex(
        /^[A-Za-z\s]+$/,
        "Account name must only contain letters and spaces"
      ),
  })
  .refine(
    (data) => {
      // Custom validation for annual leave based on join date
      if (data.joinDate) {
        const yearsWorked = differenceInYears(today, data.joinDate);
        if (yearsWorked >= 1) {
          // If eligible, annual leave is required
          return data.annualLeave && data.annualLeave.trim() !== "";
        }
      }
      // If not eligible, annual leave is not required
      return true;
    },
    {
      message:
        "Annual Leave is required for employees with 1+ years of service",
      path: ["annualLeave"],
    }
  );

// Alternative: More flexible schema
export const createEmployeeSchemaWithConditionals = () => {
  return z
    .object({
      // ... other fields
      joinDate: z
        .date({
          required_error: "Join Date is required",
          invalid_type_error: "Invalid date",
        })
        .refine((date) => date <= today, "Join date cannot be in the future"),

      annualLeave: z.string().optional(),
      // ... other fields
    })
    .superRefine((data, ctx) => {
      // Check if employee is eligible for annual leave
      if (data.joinDate) {
        const yearsWorked = differenceInYears(today, data.joinDate);

        if (yearsWorked >= 1) {
          // Employee is eligible, so annual leave is required
          if (!data.annualLeave || data.annualLeave.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Annual Leave is required for employees with 1+ years of service",
              path: ["annualLeave"],
            });
          } else {
            // Validate annual leave value (e.g., must be a number)
            const annualLeaveNum = parseInt(data.annualLeave);
            if (isNaN(annualLeaveNum) || annualLeaveNum < 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Annual Leave must be a valid number",
                path: ["annualLeave"],
              });
            }
            if (annualLeaveNum > 30) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Annual Leave cannot exceed 30 days",
                path: ["annualLeave"],
              });
            }
          }
        }
      }
    });
};
