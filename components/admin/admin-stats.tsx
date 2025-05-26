"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { useState, useEffect } from "react";

// Admin stats data types
interface AdminStatsData {
  userCount: number;
  goalsCount: number;
  habitsCount: number;
  achievementsCount: number;
  dailyActiveUsers: number[];
  weeklyActiveUsers: number[];
  monthlyActiveUsers: number[];
  userRetention: number[];
  featureUsage: {
    name: string;
    value: number;
  }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
}

// Admin stats actions
async function getAdminStats() {
  try {
    // This would normally fetch from the server
    // For now, returning mock data
    return {
      userCount: 1250,
      goalsCount: 4320,
      habitsCount: 6840,
      achievementsCount: 3210,
      dailyActiveUsers: [120, 132, 141, 135, 160, 148, 155],
      weeklyActiveUsers: [850, 940, 980, 1020, 1050, 1100, 1150],
      monthlyActiveUsers: [1800, 1950, 2100, 2300, 2450, 2600, 2800],
      userRetention: [100, 85, 75, 70, 65, 62, 60],
      featureUsage: [
        { name: "Goals", value: 35 },
        { name: "Habits", value: 25 },
        { name: "Tasks", value: 20 },
        { name: "Social", value: 15 },
        { name: "Analytics", value: 5 },
      ],
      userGrowth: [
        { date: "Jan", count: 500 },
        { date: "Feb", count: 650 },
        { date: "Mar", count: 780 },
        { date: "Apr", count: 850 },
        { date: "May", count: 950 },
        { date: "Jun", count: 1050 },
        { date: "Jul", count: 1150 },
        { date: "Aug", count: 1250 },
      ],
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Failed to load admin statistics</p>
      </div>
    );
  }

  const userGrowthData = stats.userGrowth.map((item) => ({
    name: item.date,
    total: item.count,
  }));

  const activeUsersData = [
    {
      name: "Mon",
      daily: stats.dailyActiveUsers[0],
      weekly: stats.weeklyActiveUsers[0] / 10,
      monthly: stats.monthlyActiveUsers[0] / 20,
    },
    {
      name: "Tue",
      daily: stats.dailyActiveUsers[1],
      weekly: stats.weeklyActiveUsers[1] / 10,
      monthly: stats.monthlyActiveUsers[1] / 20,
    },
    {
      name: "Wed",
      daily: stats.dailyActiveUsers[2],
      weekly: stats.weeklyActiveUsers[2] / 10,
      monthly: stats.monthlyActiveUsers[2] / 20,
    },
    {
      name: "Thu",
      daily: stats.dailyActiveUsers[3],
      weekly: stats.weeklyActiveUsers[3] / 10,
      monthly: stats.monthlyActiveUsers[3] / 20,
    },
    {
      name: "Fri",
      daily: stats.dailyActiveUsers[4],
      weekly: stats.weeklyActiveUsers[4] / 10,
      monthly: stats.monthlyActiveUsers[4] / 20,
    },
    {
      name: "Sat",
      daily: stats.dailyActiveUsers[5],
      weekly: stats.weeklyActiveUsers[5] / 10,
      monthly: stats.monthlyActiveUsers[5] / 20,
    },
    {
      name: "Sun",
      daily: stats.dailyActiveUsers[6],
      weekly: stats.weeklyActiveUsers[6] / 10,
      monthly: stats.monthlyActiveUsers[6] / 20,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.userCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.userCount * 0.05).toLocaleString()} from last
              month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Created</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.goalsCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.goalsCount * 0.08).toLocaleString()} from last
              month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Habits Tracked
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.habitsCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.habitsCount * 0.12).toLocaleString()} from last
              month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Achievements Earned
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.achievementsCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.achievementsCount * 0.1).toLocaleString()} from
              last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={userGrowthData}
                  index="name"
                  categories={["total"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value.toLocaleString()} users`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>
                  Distribution of feature usage across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={stats.featureUsage}
                  index="name"
                  categories={["value"]}
                  colors={["sky", "violet", "indigo", "rose", "emerald"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly active users
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart
                  data={activeUsersData}
                  index="name"
                  categories={["daily", "weekly", "monthly"]}
                  colors={["sky", "violet", "indigo"]}
                  valueFormatter={(value) => `${value} users`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>
                  Percentage of users retained over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { week: "Week 1", retention: stats.userRetention[0] },
                    { week: "Week 2", retention: stats.userRetention[1] },
                    { week: "Week 3", retention: stats.userRetention[2] },
                    { week: "Week 4", retention: stats.userRetention[3] },
                    { week: "Week 5", retention: stats.userRetention[4] },
                    { week: "Week 6", retention: stats.userRetention[5] },
                    { week: "Week 7", retention: stats.userRetention[6] },
                  ]}
                  index="week"
                  categories={["retention"]}
                  colors={["emerald"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>
                  Average time spent on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Detailed analytics coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>
                  Free to premium user conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Detailed analytics coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Download detailed platform reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Report generation coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
