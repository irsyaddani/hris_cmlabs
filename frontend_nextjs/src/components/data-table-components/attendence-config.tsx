// Import default columns
import { columns } from "./columns-clockin";

// Import function untuk konfigurasi custom
import { createAttendanceColumns } from "./columns-clockin";

// Buat columns dengan config custom
const customConfig = {
//   minimumWorkHours: 8,
  workStartHour: 9,
  workEndHour: 17,
  breakStartHour: 13, // Admin setting
  breakDuration: 1,
  lateThreshold: 5,
};

const customColumns = createAttendanceColumns(customConfig);
