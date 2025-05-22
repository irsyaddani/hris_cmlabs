import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password:  z
        .string()
        .nonempty("Password is required")
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
