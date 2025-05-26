"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

// Sample habit data
const habitData = {
  "Morning meditation": {
    "2025-05-01": true,
    "2025-05-02": true,
    "2025-05-03": true,
    "2025-05-04": false,
  },
  "Read for 30 minutes": {
    "2025-05-01": true,
    "2025-05-02": true,
    "2025-05-03": true,
    "2025-05-04": false,
  },
  "Practice Spanish": {
    "2025-05-01": true,
    "2025-05-02": false,
    "2025-05-03": false,
    "2025-05-04": false,
  },
  Exercise: {
    "2025-05-01": true,
    "2025-05-02": true,
    "2025-05-03": false,
    "2025-05-04": true,
  },
};

export default function HabitCalendar() {
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[640px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-medium p-2 border-b">Habit</th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="text-center font-medium p-2 border-b w-10"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(habitData).map(([habit, dates]) => (
                <tr key={habit} className="border-b last:border-0">
                  <td className="p-2 font-medium">{habit}</td>
                  {days.map((day) => {
                    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const status = dates[dateString];

                    return (
                      <td key={day} className="text-center p-2">
                        {status === undefined ? (
                          <span className="text-muted-foreground">-</span>
                        ) : status ? (
                          <div className="mx-auto w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                          </div>
                        ) : (
                          <div className="mx-auto w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <X className="h-4 w-4 text-red-600 dark:text-red-500" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
