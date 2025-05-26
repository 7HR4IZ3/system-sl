"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserEngagement() {
  const [timeRange, setTimeRange] = useState("30days");

  // Sample data - in a real app, this would come from the database
  const engagementData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Active Users",
          data: [120, 132, 145, 140, 158, 142, 152],
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
        },
      ],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Active Users",
          data: [850, 920, 980, 1020],
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
        },
      ],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Active Users",
          data: [3200, 3500, 4100, 4300, 4800, 5200],
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
        },
      ],
    },
  };

  const retentionData = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
    ],
    datasets: [
      {
        label: "User Retention",
        data: [100, 85, 72, 65, 58, 52, 48, 45],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
      },
    ],
  };

  const featureUsageData = {
    labels: ["Goals", "Tasks", "Habits", "Achievements", "Social", "Rewards"],
    datasets: [
      {
        label: "Feature Usage",
        data: [85, 92, 78, 65, 58, 72],
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--primary) / 0.8)",
          "hsl(var(--primary) / 0.6)",
          "hsl(var(--primary) / 0.4)",
          "hsl(var(--primary) / 0.3)",
          "hsl(var(--primary) / 0.2)",
        ],
      },
    ],
  };

  const sessionData = {
    labels: ["<1 min", "1-5 mins", "5-15 mins", "15-30 mins", ">30 mins"],
    datasets: [
      {
        label: "Session Duration",
        data: [10, 25, 35, 20, 10],
        backgroundColor: [
          "hsl(var(--primary) / 0.2)",
          "hsl(var(--primary) / 0.4)",
          "hsl(var(--primary) / 0.6)",
          "hsl(var(--primary) / 0.8)",
          "hsl(var(--primary))",
        ],
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              Track how users interact with the platform
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="features">Feature Usage</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="h-[350px]">
              <LineChart
                data={engagementData.weekly}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Number of Users",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Time Period",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Daily Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">152</div>
                  <p className="text-xs text-muted-foreground">
                    +5.3% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Weekly Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,020</div>
                  <p className="text-xs text-muted-foreground">
                    +4.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Monthly Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,200</div>
                  <p className="text-xs text-muted-foreground">
                    +8.3% from last quarter
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="retention">
            <div className="h-[350px]">
              <LineChart
                data={retentionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Retention Rate (%)",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Weeks After Signup",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Week 1 Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from previous cohort
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Week 4 Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">
                    +3.5% from previous cohort
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Week 8 Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from previous cohort
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="features">
            <div className="h-[350px]">
              <BarChart
                data={featureUsageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Usage Percentage (%)",
                      },
                    },
                  },
                  indexAxis: "y",
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Most Used Feature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Tasks</div>
                  <p className="text-xs text-muted-foreground">92% of users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Least Used Feature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Social</div>
                  <p className="text-xs text-muted-foreground">58% of users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Fastest Growing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rewards</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% this month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="sessions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[350px]">
                <PieChart
                  data={sessionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">
                      Average Session Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.5 minutes</div>
                    <p className="text-xs text-muted-foreground">
                      +1.2 minutes from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">
                      Sessions Per User (Weekly)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8</div>
                    <p className="text-xs text-muted-foreground">
                      +0.3 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">
                      Bounce Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.2%</div>
                    <p className="text-xs text-muted-foreground">
                      -2.5% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
