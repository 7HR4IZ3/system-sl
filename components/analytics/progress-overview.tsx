"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Target, CheckSquare, Trophy, Star } from "lucide-react";

// Sample data
const progressData = [
  { date: "Apr 1", xp: 120, tasks: 5, goals: 0, achievements: 0 },
  { date: "Apr 8", xp: 180, tasks: 8, goals: 1, achievements: 1 },
  { date: "Apr 15", xp: 150, tasks: 6, goals: 0, achievements: 0 },
  { date: "Apr 22", xp: 210, tasks: 9, goals: 1, achievements: 0 },
  { date: "Apr 29", xp: 250, tasks: 10, goals: 1, achievements: 1 },
  { date: "May 6", xp: 300, tasks: 12, goals: 2, achievements: 1 },
];

export default function ProgressOverview() {
  // Ensure data is available before rendering
  const safeData = progressData || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-80">
          <Chart>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={safeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltip>
                            <ChartTooltipContent>
                              <div className="font-medium">
                                {payload[0].payload.date}
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                <span className="text-sm">
                                  XP: {payload[0].payload.xp}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                <span className="text-sm">
                                  Tasks: {payload[0].payload.tasks}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                                <span className="text-sm">
                                  Goals: {payload[0].payload.goals}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                <span className="text-sm">
                                  Achievements:{" "}
                                  {payload[0].payload.achievements}
                                </span>
                              </div>
                            </ChartTooltipContent>
                          </ChartTooltip>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      return <span className="text-sm">{value}</span>;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    name="XP"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="goals"
                    name="Goals"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="achievements"
                    name="Achievements"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-2xl font-bold">1,210</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold">50</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Achieved</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
