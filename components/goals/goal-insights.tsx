"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CalendarDays, Clock } from "lucide-react";

// Sample data
const goalStatusData = [
  { name: "In Progress", value: 6, color: "#8b5cf6" },
  { name: "Completed", value: 3, color: "#10b981" },
  { name: "Not Started", value: 2, color: "#6b7280" },
  { name: "Overdue", value: 1, color: "#ef4444" },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "Complete React certification",
    dueDate: "2025-05-30",
    daysLeft: 26,
  },
  {
    id: 2,
    title: "Run a half marathon",
    dueDate: "2025-09-15",
    daysLeft: 134,
  },
];

export default function GoalInsights() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Goal Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={goalStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {goalStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">
                                  {payload[0].name}
                                </div>
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{
                                      backgroundColor: payload[0].payload.color,
                                    }}
                                  />
                                  <span className="text-sm">
                                    Goals: {payload[0].value}
                                  </span>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center mt-2">
            {goalStatusData.map((status) => (
              <div key={status.name} className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm">{status.name}</span>
                </div>
                <span className="text-lg font-medium">{status.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {upcomingDeadlines.map((goal) => (
              <div
                key={goal.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
              >
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{goal.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
