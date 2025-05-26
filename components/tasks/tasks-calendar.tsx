"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample task data
const tasksByDate = {
  "2025-05-01": [
    { id: 1, title: "Team meeting", priority: "Medium", completed: true },
    { id: 2, title: "Workout session", priority: "Low", completed: true },
  ],
  "2025-05-04": [
    {
      id: 3,
      title: "Complete React module 5",
      priority: "High",
      completed: false,
    },
    { id: 4, title: "5km training run", priority: "Medium", completed: false },
    {
      id: 5,
      title: "Spanish vocabulary practice",
      priority: "Low",
      completed: true,
    },
  ],
  "2025-05-05": [
    {
      id: 6,
      title: "Review project proposal",
      priority: "High",
      completed: false,
    },
  ],
  "2025-05-10": [
    {
      id: 7,
      title: "Doctor's appointment",
      priority: "Medium",
      completed: false,
    },
  ],
  "2025-05-15": [
    {
      id: 8,
      title: "Submit quarterly report",
      priority: "High",
      completed: false,
    },
  ],
  "2025-05-20": [
    {
      id: 9,
      title: "Book flight tickets",
      priority: "Medium",
      completed: false,
    },
  ],
};

export default function TasksCalendar() {
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400";
      case "Medium":
        return "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400";
      case "Low":
        return "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const currentDate = isCurrentMonth ? today.getDate() : -1;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-border/50 bg-muted/20"
        ></div>,
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const tasksForDay = tasksByDate[dateString] || [];
      const isToday = day === currentDate;

      days.push(
        <div
          key={day}
          className={`h-24 border border-border/50 p-1 overflow-hidden ${
            isToday ? "bg-primary/5 border-primary/30" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span
              className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}
            >
              {day}
            </span>
            {tasksForDay.length > 0 && (
              <Badge variant="outline" className="text-xs h-5">
                {tasksForDay.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1 overflow-hidden max-h-[calc(100%-20px)]">
            {tasksForDay.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className={`text-xs truncate px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)} ${
                  task.completed ? "line-through opacity-60" : ""
                }`}
              >
                {task.title}
              </div>
            ))}
            {tasksForDay.length > 2 && (
              <div className="text-xs text-muted-foreground px-1">
                +{tasksForDay.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

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
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
      </CardContent>
    </Card>
  );
}
