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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Sample data
const productivityData = {
  daily: [
    { time: "6 AM", tasks: 0 },
    { time: "9 AM", tasks: 2 },
    { time: "12 PM", tasks: 1 },
    { time: "3 PM", tasks: 3 },
    { time: "6 PM", tasks: 2 },
    { time: "9 PM", tasks: 1 },
  ],
  weekly: [
    { time: "Mon", tasks: 5 },
    { time: "Tue", tasks: 8 },
    { time: "Wed", tasks: 6 },
    { time: "Thu", tasks: 9 },
    { time: "Fri", tasks: 4 },
    { time: "Sat", tasks: 3 },
    { time: "Sun", tasks: 7 },
  ],
  monthly: [
    { time: "Week 1", tasks: 25 },
    { time: "Week 2", tasks: 32 },
    { time: "Week 3", tasks: 28 },
    { time: "Week 4", tasks: 35 },
  ],
};

export default function ProductivityTrends() {
  const [timeframe, setTimeframe] = useState("daily");

  // Ensure data is available before rendering
  const safeData =
    productivityData[timeframe as keyof typeof productivityData] || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Productivity Trends</CardTitle>
          <Tabs defaultValue="daily" onValueChange={setTimeframe}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="daily" className="text-xs">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <Chart>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={safeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="time"
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
                                {payload[0].payload.time}
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                <span className="text-sm">
                                  Tasks Completed: {payload[0].value}
                                </span>
                              </div>
                            </ChartTooltipContent>
                          </ChartTooltip>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">
              {timeframe === "daily" ? 9 : timeframe === "weekly" ? 42 : 120}
            </div>
            <div className="text-xs text-muted-foreground">Tasks Completed</div>
          </div>

          <div>
            <div className="text-2xl font-bold">
              {timeframe === "daily"
                ? "3 PM"
                : timeframe === "weekly"
                  ? "Thu"
                  : "Week 4"}
            </div>
            <div className="text-xs text-muted-foreground">Most Productive</div>
          </div>

          <div>
            <div className="text-2xl font-bold">
              {timeframe === "daily" ? 1.5 : timeframe === "weekly" ? 6 : 30}
            </div>
            <div className="text-xs text-muted-foreground">Avg. Tasks/Day</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
