import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const employmentTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  branch: z.string(),
  position: z.string(),
  grade: z.string(),
  status: z.string(),
  profile_picture: z.string().nullable().optional(),

  // type: z.enum(["income", "expense"]),
  // amount: z.number(),
  // date: z.string(),
});

export type Employee = z.infer<typeof employmentTableSchema>;
