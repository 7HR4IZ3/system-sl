"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Progress } from "@/components/ui/progress";

// Sample data
const goalCompletionData = [
  { name: "Jan", completed: 2, target: 3 },
  { name: "Feb", completed: 3, target: 3 },
  { name: "Mar", completed: 1, target: 4 },
  { name: "Apr", completed: 4, target: 4 },
  { name: "May", completed: 2, target: 5 },
];

const goalsByCategory = [
  { name: "Health", completed: 3, total: 5, color: "#ef4444" },
  { name: "Education", completed: 4, total: 6, color: "#8b5cf6" },
  { name: "Career", completed: 2, total: 4, color: "#3b82f6" },
  { name: "Personal", completed: 3, total: 3, color: "#10b981" },
  { name: "Financial", completed: 1, total: 2, color: "#f59e0b" },
];

export default function GoalCompletion() {
  // Ensure data is available before rendering
  const safeChartData = goalCompletionData || [];
  const safeCategoryData = goalsByCategory || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Goal Completion Rate</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <Chart>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safeChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
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
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const completionRate = Math.round(
                          (data.completed / data.target) * 100,
                        );

                        return (
                          <ChartTooltip>
                            <ChartTooltipContent>
                              <div className="font-medium">{data.name}</div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                <span className="text-sm">
                                  Completed: {data.completed}/{data.target}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                <span className="text-sm">
                                  Completion Rate: {completionRate}%
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
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium">Goals by Category</h3>
          <div className="space-y-3">
            {safeCategoryData.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span>
                    {category.completed}/{category.total}
                  </span>
                </div>
                <Progress
                  value={(category.completed / category.total) * 100}
                  className="h-2"
                  style={{ "--primary": category.color } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
