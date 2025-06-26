// hooks/useHolidayData.ts
import { useState, useEffect } from "react";

interface HolidayData {
  isHoliday: boolean;
  holidayName?: string;
}

export const useHolidayData = (dates: string[]) => {
  const [holidayData, setHolidayData] = useState<Record<string, HolidayData>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidayData = async () => {
      if (dates.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get unique dates only
        const uniqueDates = [...new Set(dates)];

        // Fetch holiday data for all dates
        const holidayPromises = uniqueDates.map(async (date) => {
          try {
            const response = await fetch(
              `/api/calendar/check-holiday?date=${date}`
            );

            if (!response.ok) {
              console.warn(
                `Holiday API failed for date ${date}: ${response.status}`
              );
              return { date, isHoliday: false };
            }

            const data = await response.json();
            return {
              date,
              isHoliday: data.isHoliday || false,
              holidayName: data.holidayName,
            };
          } catch (error) {
            console.warn(`Holiday check failed for date ${date}:`, error);
            return { date, isHoliday: false };
          }
        });

        const results = await Promise.all(holidayPromises);

        // Convert to object for easy lookup
        const holidayMap = results.reduce((acc, result) => {
          acc[result.date] = {
            isHoliday: result.isHoliday,
            holidayName: result.holidayName,
          };
          return acc;
        }, {} as Record<string, HolidayData>);

        setHolidayData(holidayMap);
      } catch (error) {
        console.error("Error fetching holiday data:", error);
        setError("Failed to fetch holiday data");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidayData();
  }, [dates.join(",")]); // Re-run when dates change

  return { holidayData, loading, error };
};
