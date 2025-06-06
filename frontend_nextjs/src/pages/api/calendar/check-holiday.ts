import type { NextApiRequest, NextApiResponse } from "next";

interface CalendarResponse {
  isHoliday: boolean;
  holidayName?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date } = req.query;
  if (typeof date !== "string") {
    return res.status(400).json({ error: "Invalid date" });
  }

  try {
    const [year, month, day] = date.split("-");
    const apiKey = process.env.CALENDARIFIC_API_KEY;
    if (!apiKey) throw new Error("Missing Calendarific API key");
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=ID&year=${year}&month=${month}&day=${day}`
    );
    if (!response.ok) throw new Error("Calendarific API error");
    const data = await response.json();
    const isHoliday = data.response.holidays.length > 0;
    const holidayName = isHoliday ? data.response.holidays[0].name : undefined;
    const calendarResponse: CalendarResponse = { isHoliday, holidayName };
    res.status(200).json(calendarResponse);
  } catch (error) {
    console.error("Holiday API error:", error);
    res.status(500).json({ isHoliday: false });
  }
}
