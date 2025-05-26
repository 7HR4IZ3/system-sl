"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Sample data
const categoryData = [
  { name: "Health", value: 35, fill: "#ef4444" },
  { name: "Education", value: 45, fill: "#8b5cf6" },
  { name: "Career", value: 20, fill: "#3b82f6" },
  { name: "Personal", value: 30, fill: "#10b981" },
  { name: "Financial", value: 15, fill: "#f59e0b" },
];

export default function CategoryBreakdown() {
  // Ensure data is available before rendering
  const safeData = categoryData || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <Chart>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {safeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const total = safeData.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        );
                        const percentage = Math.round(
                          (payload[0].value / total) * 100,
                        );

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
                                    backgroundColor: payload[0].payload.fill,
                                  }}
                                />
                                <span className="text-sm">
                                  Tasks: {payload[0].value}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{
                                    backgroundColor: payload[0].payload.fill,
                                  }}
                                />
                                <span className="text-sm">
                                  Percentage: {percentage}%
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

        <ChartLegend className="mt-2 justify-center flex-wrap">
          {safeData.map((category, index) => (
            <ChartLegendItem key={index} style={{ color: category.fill }}>
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.fill }}
              />
              <span>{category.name}</span>
            </ChartLegendItem>
          ))}
        </ChartLegend>
      </CardContent>
    </Card>
  );
}
