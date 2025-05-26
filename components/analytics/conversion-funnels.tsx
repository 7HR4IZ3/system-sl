"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/chart";

export default function ConversionFunnels() {
  // Sample data - in a real app, this would come from the database
  const onboardingFunnel = {
    labels: [
      "Visit",
      "Sign Up",
      "Complete Profile",
      "First Goal",
      "First Task",
      "Return Visit",
    ],
    datasets: [
      {
        label: "Conversion Rate",
        data: [100, 42, 35, 28, 22, 18],
        backgroundColor: "hsl(var(--primary) / 0.8)",
      },
    ],
  };

  const featureAdoptionFunnel = {
    labels: ["Goals", "Tasks", "Habits", "Achievements", "Social", "Rewards"],
    datasets: [
      {
        label: "Feature Adoption",
        data: [95, 88, 72, 58, 45, 32],
        backgroundColor: "hsl(var(--primary) / 0.8)",
      },
    ],
  };

  const premiumConversionFunnel = {
    labels: [
      "Free User",
      "Feature Usage",
      "Premium Page View",
      "Checkout Started",
      "Payment",
      "Subscription Active",
    ],
    datasets: [
      {
        label: "Premium Conversion",
        data: [100, 65, 38, 22, 15, 12],
        backgroundColor: "hsl(var(--primary) / 0.8)",
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnels</CardTitle>
        <CardDescription>
          Track user journey and conversion points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="onboarding">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="features">Feature Adoption</TabsTrigger>
            <TabsTrigger value="premium">Premium Conversion</TabsTrigger>
          </TabsList>
          <TabsContent value="onboarding">
            <div className="h-[350px]">
              <BarChart
                data={onboardingFunnel}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Users (%)",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Sign Up Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42%</div>
                  <p className="text-xs text-muted-foreground">
                    +3.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Profile Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">83%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Return Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82%</div>
                  <p className="text-xs text-muted-foreground">
                    +4.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="features">
            <div className="h-[350px]">
              <BarChart
                data={featureAdoptionFunnel}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Users (%)",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Feature Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">
                    Average across features
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Feature Stickiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">
                    Weekly return rate to features
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Multi-feature Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">58%</div>
                  <p className="text-xs text-muted-foreground">
                    Users using 3+ features
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="premium">
            <div className="h-[350px]">
              <BarChart
                data={premiumConversionFunnel}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Users (%)",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Checkout Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">
                    Checkout to payment
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Free to Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall conversion rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">
                    Subscription Renewal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    Monthly renewal rate
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
