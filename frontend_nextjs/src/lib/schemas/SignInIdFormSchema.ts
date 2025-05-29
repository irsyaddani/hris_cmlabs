import { z } from "zod";

export const IdLoginFormSchema = z.object({
  identifier: z
    .string().nonempty("Employee ID is required")
    .min(7, "Minimum 7 characters")
    .refine((val) => !val.includes('@'), {
      message: "Employee ID cannot contain '@' or be an email",
    }),
  password: z
    .string()
    .min(7, "Minimum 7 characters")
});

export type IdLoginFormType = z.infer<typeof IdLoginFormSchema>;
