"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import { Progress } from "@/components/ui/progress";

// Sample data
const habitConsistencyData = [
  { name: "Week 1", consistency: 85 },
  { name: "Week 2", consistency: 92 },
  { name: "Week 3", consistency: 78 },
  { name: "Week 4", consistency: 88 },
  { name: "Week 5", consistency: 95 },
];

const topHabits = [
  { name: "Morning meditation", streak: 14, consistency: 85 },
  { name: "Read for 30 minutes", streak: 7, consistency: 70 },
  { name: "Exercise", streak: 3, consistency: 60 },
];

export default function HabitConsistency() {
  // Ensure data is available before rendering
  const safeChartData = habitConsistencyData || [];
  const safeHabitsData = topHabits || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Habit Consistency</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <Chart>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={safeChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
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
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
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
                                  Consistency: {payload[0].value}%
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
                    dataKey="consistency"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium">Top Habits</h3>
          {safeHabitsData.map((habit) => (
            <div key={habit.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{habit.name}</span>
                <span>{habit.consistency}%</span>
              </div>
              <Progress value={habit.consistency} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Current streak: {habit.streak} days
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
