"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

// Sample data
const taskCompletionData = [
  { name: "Mon", completed: 5, total: 7 },
  { name: "Tue", completed: 8, total: 10 },
  { name: "Wed", completed: 6, total: 8 },
  { name: "Thu", completed: 4, total: 9 },
  { name: "Fri", completed: 7, total: 7 },
  { name: "Sat", completed: 3, total: 5 },
  { name: "Sun", completed: 2, total: 4 },
];

const tasksByPriority = [
  { name: "High", value: 5, color: "#ef4444" },
  { name: "Medium", value: 8, color: "#f59e0b" },
  { name: "Low", value: 4, color: "#10b981" },
];

export default function TasksStats() {
  // Calculate task statistics
  const totalTasks = 17;
  const completedTasks = 9;
  const overdueTasks = 2;
  const upcomingTasks = 6;

  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Task Completion</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="h-2 mt-2" />

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-green-500 mb-1">
                <CheckCircle2 className="h-4 w-4 mr-1" />
              </div>
              <div className="text-xl font-bold">{completedTasks}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center text-amber-500 mb-1">
                <Clock className="h-4 w-4 mr-1" />
              </div>
              <div className="text-xl font-bold">{upcomingTasks}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center text-red-500 mb-1">
                <AlertCircle className="h-4 w-4 mr-1" />
              </div>
              <div className="text-xl font-bold">{overdueTasks}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">
                                  {payload[0].payload.name}
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                  <span className="text-sm">
                                    Completed: {payload[0].payload.completed}/
                                    {payload[0].payload.total}
                                  </span>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="completed"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {tasksByPriority.map((priority) => (
              <div key={priority.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: priority.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{priority.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {priority.value}
                    </span>
                  </div>
                  <Progress
                    value={(priority.value / totalTasks) * 100}
                    className="h-1.5"
                    style={{
                      backgroundColor: `${priority.color}20`,
                      "--primary": priority.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
