"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Clock, Calendar } from "lucide-react";

// Sample data
const initialTasks = [
  {
    id: 1,
    title: "Complete React module 5",
    completed: false,
    dueTime: "14:00",
    dueDate: "2025-05-04",
    priority: "High",
    goalId: 1,
    goalTitle: "Complete React certification",
    xp: 50,
  },
  {
    id: 2,
    title: "5km training run",
    completed: false,
    dueTime: "17:30",
    dueDate: "2025-05-04",
    priority: "Medium",
    goalId: 2,
    goalTitle: "Run a half marathon",
    xp: 30,
  },
  {
    id: 3,
    title: "Spanish vocabulary practice",
    completed: true,
    dueTime: "21:00",
    dueDate: "2025-05-04",
    priority: "Low",
    goalId: 3,
    goalTitle: "Learn Spanish",
    xp: 20,
  },
  {
    id: 4,
    title: "Weekly meal prep",
    completed: false,
    dueTime: "19:00",
    dueDate: "2025-05-04",
    priority: "Medium",
    goalId: null,
    goalTitle: null,
    xp: 25,
  },
  {
    id: 5,
    title: "Review project proposal",
    completed: false,
    dueTime: "10:00",
    dueDate: "2025-05-05",
    priority: "High",
    goalId: null,
    goalTitle: null,
    xp: 40,
  },
  {
    id: 6,
    title: "Doctor's appointment",
    completed: false,
    dueTime: "14:30",
    dueDate: "2025-05-10",
    priority: "Medium",
    goalId: null,
    goalTitle: null,
    xp: 15,
  },
  {
    id: 7,
    title: "Submit quarterly report",
    completed: false,
    dueTime: "17:00",
    dueDate: "2025-05-15",
    priority: "High",
    goalId: null,
    goalTitle: null,
    xp: 50,
  },
];

export default function TasksList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTab, setSelectedTab] = useState("all");

  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          // Simulate XP gain notification
          if (!task.completed) {
            const xpGain = task.xp;
            // In a real app, you would update the user's XP here
            console.log(`Gained ${xpGain} XP!`);
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      }),
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800";
      case "Medium":
        return "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800";
      case "Low":
        return "text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800";
      default:
        return "text-slate-600 border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800";
    }
  };

  // Filter tasks based on selected tab
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const filteredTasks = tasks.filter((task) => {
    if (selectedTab === "today") return task.dueDate === today;
    if (selectedTab === "tomorrow") return task.dueDate === tomorrow;
    if (selectedTab === "upcoming") return task.dueDate > tomorrow;
    if (selectedTab === "completed") return task.completed;
    return true; // all
  });

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="all"
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No tasks for this period. Add a new task to get started!
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:shadow-sm transition-shadow ${task.completed ? "bg-muted/50" : ""}`}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div
                    className={
                      task.completed ? "text-muted-foreground line-through" : ""
                    }
                  >
                    <label
                      htmlFor={`task-${task.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {task.title}
                    </label>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <Badge
                        variant="outline"
                        className={`${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>

                      {task.goalId && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-primary/20 bg-primary/10 text-primary"
                        >
                          <Target className="h-3 w-3" /> {task.goalTitle}
                        </Badge>
                      )}

                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" /> {task.dueTime}
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/20 text-primary"
                >
                  +{task.xp} XP
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
