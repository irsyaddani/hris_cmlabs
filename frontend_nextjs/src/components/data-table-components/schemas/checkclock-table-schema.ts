import { z } from "zod";

// Schema untuk data karyawan dengan kolom tambahan
export const employeeCheckclockSchema = z.object({
  id: z.string(),
  avatarUrl: z.string(),
  name: z.string(),
  position: z.string(),
  clockIn: z.string().datetime(), // Tipe data string dengan format datetime
  clockOut: z.string().datetime(), // Tipe data string dengan format datetime
  workHours: z.number().min(0), // Tipe data number untuk jumlah jam kerja
  approval: z.enum(["pending", "approved", "denied"]), // Enum untuk status approval
  status: z.enum(["on time", "late", "annual leave", "absent"]), // Enum untuk status kehadiran
});

export type Checkclock = z.infer<typeof employeeCheckclockSchema>;
