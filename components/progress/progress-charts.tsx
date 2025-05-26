"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Sample data for charts
const weeklyData = [
  { day: "Mon", tasks: 5, xp: 120, goals: 1 },
  { day: "Tue", tasks: 8, xp: 180, goals: 2 },
  { day: "Wed", tasks: 6, xp: 150, goals: 1 },
  { day: "Thu", tasks: 9, xp: 210, goals: 3 },
  { day: "Fri", tasks: 4, xp: 90, goals: 0 },
  { day: "Sat", tasks: 3, xp: 70, goals: 0 },
  { day: "Sun", tasks: 7, xp: 160, goals: 2 },
];

const monthlyData = [
  { week: "Week 1", tasks: 25, xp: 580, goals: 2 },
  { week: "Week 2", tasks: 32, xp: 720, goals: 3 },
  { week: "Week 3", tasks: 28, xp: 650, goals: 1 },
  { week: "Week 4", tasks: 35, xp: 800, goals: 4 },
];

const categoryData = [
  { name: "Health", value: 35, fill: "#ef4444" },
  { name: "Education", value: 45, fill: "#8b5cf6" },
  { name: "Career", value: 20, fill: "#3b82f6" },
  { name: "Personal", value: 30, fill: "#10b981" },
  { name: "Financial", value: 15, fill: "#f59e0b" },
];

const radarData = [
  { subject: "Health", A: 80, fullMark: 100 },
  { subject: "Education", A: 65, fullMark: 100 },
  { subject: "Career", A: 45, fullMark: 100 },
  { subject: "Personal", A: 70, fullMark: 100 },
  { subject: "Financial", A: 50, fullMark: 100 },
];

const COLORS = ["#ef4444", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

export default function ProgressCharts() {
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="balance">Life Balance</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="h-80">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="20vh">
                  <RechartsLineChart
                    data={weeklyData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
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
                                  {payload[0].payload.day}
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
                                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                  <span className="text-sm">
                                    Goals: {payload[0].payload.goals}
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
                      dataKey="xp"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-2 justify-center">
                <ChartLegendItem className="text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>XP Earned</span>
                </ChartLegendItem>
                <ChartLegendItem className="text-green-600 dark:text-green-500">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Tasks Completed</span>
                </ChartLegendItem>
              </ChartLegend>
            </Chart>
          </TabsContent>

          <TabsContent value="monthly" className="h-80">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="20vh">
                  <RechartsBarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="week"
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
                                  {payload[0].payload.week}
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
                                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                  <span className="text-sm">
                                    Goals: {payload[0].payload.goals}
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
                      dataKey="xp"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-2 justify-center">
                <ChartLegendItem className="text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>XP Earned</span>
                </ChartLegendItem>
              </ChartLegend>
            </Chart>
          </TabsContent>

          <TabsContent value="categories" className="h-80">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="20vh">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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
                                      backgroundColor: payload[0].payload.fill,
                                    }}
                                  />
                                  <span className="text-sm">
                                    Tasks: {payload[0].value}
                                  </span>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-2 justify-center flex-wrap">
                {categoryData.map((category, index) => (
                  <ChartLegendItem key={index} style={{ color: category.fill }}>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.fill }}
                    />
                    <span>{category.name}</span>
                  </ChartLegendItem>
                ))}
              </ChartLegend>
            </Chart>
          </TabsContent>

          <TabsContent value="balance" className="h-80">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="20vh">
                  <RechartsRadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={radarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Progress"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">
                                  {payload[0].payload.subject}
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                  <span className="text-sm">
                                    Progress: {payload[0].value}%
                                  </span>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsRadarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-2 justify-center">
                <ChartLegendItem className="text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Life Balance Score</span>
                </ChartLegendItem>
              </ChartLegend>
            </Chart>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
