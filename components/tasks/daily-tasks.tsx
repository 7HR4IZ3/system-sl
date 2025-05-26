"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Calendar } from "lucide-react";
import { toggleTaskCompletion } from "@/app/actions/tasks";
import { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Define the Task type based on the return type of getTasksByDate
// This assumes getTasksByDate returns an array of tasks with the goalTitle added
type TaskWithGoalTitle = Database["public"]["Tables"]["tasks"]["Row"] & {
  goalTitle: string | null;
};

interface DailyTasksProps {
  initialTasks: TaskWithGoalTitle[];
}

// This component now receives the initial tasks for today as a prop
// Data fetching should happen in the parent server component (app/page.tsx)
export default function DailyTasks({ initialTasks }: DailyTasksProps) {
  // Use state to manage tasks for optimistic updates
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  // Update state if initialTasks prop changes (e.g., due to parent re-render after revalidation)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleToggleTask = (taskId: string, currentStatus: boolean) => {
    // Find the task being toggled to access its properties (like XP)
    const taskToToggle = tasks.find((t) => t.id === taskId);
    if (!taskToToggle) return; // Should not happen

    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      )
    );

    startTransition(async () => {
      // Ensure // revalidatePath('/') is called in the server action if needed
      const result = await toggleTaskCompletion(taskId, !currentStatus);
      if (!result.success) {
        toast.error(`Failed to update task: ${result.error}`);
        // Revert optimistic update on failure
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, completed: currentStatus } : task
          )
        );
      } else {
        // Show success toast only when completing a task
        if (!currentStatus) {
          toast.success(
            `Task '${taskToToggle.title}' completed! +${taskToToggle.xp} XP`
          );
        }
        // Revalidation should update the data source, causing parent re-render
        // The useEffect hook above will sync the state.
      }
    });
  };

  const getPriorityColor = (priority: string | null) => {
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

  return (
    <div className="space-y-4">
      {/* Title is now handled by the parent component or page */}
      {/* <h2 className="text-xl font-semibold">Today's Tasks</h2> */}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center items-center">
              <p className="text-muted-foreground m-4">
                No tasks scheduled for today. Enjoy your day!
              </p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "hover:shadow-sm transition-shadow",
                task.completed ? "bg-muted/50" : "",
                // Indicate pending state visually
                isPending ? "opacity-70 cursor-not-allowed" : ""
              )}
            >
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <div className="flex items-start gap-3 flex-grow min-w-0">
                  {" "}
                  {/* Added flex-grow and min-w-0 */}
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() =>
                      handleToggleTask(task.id, task.completed)
                    }
                    className="mt-1 shrink-0" // Added shrink-0
                    disabled={isPending} // Disable checkbox during transition
                  />
                  <div
                    className={cn(
                      "flex-grow min-w-0", // Added flex-grow and min-w-0
                      task.completed ? "text-muted-foreground line-through" : ""
                    )}
                  >
                    <label
                      htmlFor={`task-${task.id}`}
                      className="font-medium cursor-pointer block truncate" // Added block truncate
                    >
                      {task.title}
                    </label>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs">
                      {" "}
                      {/* Adjusted gap */}
                      {task.priority && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "whitespace-nowrap",
                            getPriorityColor(task.priority)
                          )} // Added whitespace-nowrap
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.goal_id && task.goalTitle && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-primary/20 bg-primary/10 text-primary whitespace-nowrap" // Added whitespace-nowrap
                        >
                          <Target className="h-3 w-3 shrink-0" />{" "}
                          <span className="truncate">{task.goalTitle}</span>{" "}
                          {/* Added truncate */}
                        </Badge>
                      )}
                      {task.due_time && (
                        <div className="flex items-center text-muted-foreground whitespace-nowrap">
                          {" "}
                          {/* Added whitespace-nowrap */}
                          <Clock className="h-3 w-3 mr-1 shrink-0" />{" "}
                          {task.due_time}
                        </div>
                      )}
                      {/* Only show date if it exists - DailyTasks should only show today's */}
                      {/* {task.due_date && (
                        <div className="flex items-center text-muted-foreground whitespace-nowrap">
                          <Calendar className="h-3 w-3 mr-1 shrink-0" />{" "}
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/20 text-primary shrink-0 ml-2" // Added ml-2
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
