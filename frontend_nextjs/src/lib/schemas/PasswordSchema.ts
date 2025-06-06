import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email format"),
    token: z
      .string()
      .nonempty("Token is required"),
    password:  z
        .string()
        .nonempty("Password is required")
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi harus sama",
  path: ["confirmPassword"],
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
