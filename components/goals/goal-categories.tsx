"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, GraduationCap, Briefcase, User, Wallet } from "lucide-react";

// Sample data
const categories = [
  {
    name: "Health",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    goals: 3,
    completed: 1,
    progress: 33,
  },
  {
    name: "Education",
    icon: GraduationCap,
    color: "text-violet-500",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    goals: 2,
    completed: 1,
    progress: 50,
  },
  {
    name: "Career",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    goals: 2,
    completed: 0,
    progress: 0,
  },
  {
    name: "Personal",
    icon: User,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    goals: 1,
    completed: 0,
    progress: 0,
  },
  {
    name: "Financial",
    icon: Wallet,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    goals: 2,
    completed: 1,
    progress: 50,
  },
];

export default function GoalCategories() {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <Card key={category.name} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${category.bgColor}`}>
                <category.icon className={`h-5 w-5 ${category.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {category.completed}/{category.goals} goals
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <Progress value={category.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.progress}% complete</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
