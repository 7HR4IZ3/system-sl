"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Star, Medal } from "lucide-react";

// Sample data
const achievementData = [
  { name: "Completed", value: 12, color: "#8b5cf6" },
  { name: "In Progress", value: 8, color: "#f59e0b" },
  { name: "Locked", value: 15, color: "#6b7280" },
];

const achievementsByCategory = [
  { name: "Goals", completed: 4, total: 10 },
  { name: "Habits", completed: 5, total: 12 },
  { name: "Education", completed: 2, total: 8 },
  { name: "Health", completed: 1, total: 5 },
];

export default function AchievementProgress() {
  // Calculate total XP from achievements
  const totalXP = 2150;
  const nextMilestone = 2500;
  const xpProgress = (totalXP / nextMilestone) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={achievementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {achievementData.map((entry, index) => (
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
                                    Achievements: {payload[0].value}
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
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            {achievementData.map((status) => (
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
          <CardTitle className="text-base">Achievement XP</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="text-xl font-bold">{totalXP} XP</span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Next milestone: {nextMilestone} XP</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Gold tier unlocked!</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {achievementsByCategory.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span>
                    {category.completed}/{category.total}
                  </span>
                </div>
                <Progress
                  value={(category.completed / category.total) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
