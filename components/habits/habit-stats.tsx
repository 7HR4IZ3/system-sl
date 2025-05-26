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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Flame, Trophy, Calendar } from "lucide-react";

// Sample data
const streakData = [
  { name: "Apr 22", value: 1 },
  { name: "Apr 23", value: 2 },
  { name: "Apr 24", value: 3 },
  { name: "Apr 25", value: 4 },
  { name: "Apr 26", value: 5 },
  { name: "Apr 27", value: 6 },
  { name: "Apr 28", value: 7 },
  { name: "Apr 29", value: 8 },
  { name: "Apr 30", value: 9 },
  { name: "May 1", value: 10 },
  { name: "May 2", value: 11 },
  { name: "May 3", value: 12 },
  { name: "May 4", value: 13 },
];

const habitStats = [
  {
    name: "Morning meditation",
    streak: 14,
    longestStreak: 21,
    completionRate: 85,
  },
  {
    name: "Read for 30 minutes",
    streak: 7,
    longestStreak: 12,
    completionRate: 70,
  },
  {
    name: "Practice Spanish",
    streak: 0,
    longestStreak: 5,
    completionRate: 45,
  },
  {
    name: "Exercise",
    streak: 3,
    longestStreak: 8,
    completionRate: 60,
  },
];

export default function HabitStats() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Current Streak</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-500" />
            <span className="text-2xl font-bold">14 days</span>
          </div>

          <div className="h-48 mt-4">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={streakData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
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
                                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                  <span className="text-sm">
                                    Streak: {payload[0].value} days
                                  </span>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Habit Performance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {habitStats.map((habit) => (
              <div key={habit.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{habit.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {habit.completionRate}%
                  </span>
                </div>
                <Progress value={habit.completionRate} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>Current: {habit.streak} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                    <span>Best: {habit.longestStreak} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Milestones</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">30-Day Streak</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>16 days remaining</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium">100 Days of Meditation</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>86 days completed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
