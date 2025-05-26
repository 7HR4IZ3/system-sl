"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Star,
  BookOpen,
  Dumbbell,
  Brain,
  Calendar,
  Target,
  Flame,
  Award,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Sample achievements data
const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first goal",
    icon: <Target className="h-5 w-5 text-primary" />,
    progress: 100,
    completed: true,
    xp: 100,
    date: "Apr 20, 2025",
    category: "Goals",
  },
  {
    id: 2,
    title: "Habit Master",
    description: "Maintain a 7-day streak on any habit",
    icon: <Flame className="h-5 w-5 text-amber-500" />,
    progress: 100,
    completed: true,
    xp: 150,
    date: "Apr 28, 2025",
    category: "Habits",
  },
  {
    id: 3,
    title: "Bookworm",
    description: "Read for 10 days in a row",
    icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
    progress: 70,
    completed: false,
    xp: 200,
    date: null,
    category: "Habits",
  },
  {
    id: 4,
    title: "Fitness Fanatic",
    description: "Complete 20 workout sessions",
    icon: <Dumbbell className="h-5 w-5 text-red-500" />,
    progress: 45,
    completed: false,
    xp: 250,
    date: null,
    category: "Health",
  },
  {
    id: 5,
    title: "Mind Master",
    description: "Complete 3 learning goals",
    icon: <Brain className="h-5 w-5 text-violet-500" />,
    progress: 33,
    completed: false,
    xp: 300,
    date: null,
    category: "Education",
  },
  {
    id: 6,
    title: "30-Day Warrior",
    description: "Maintain any habit for 30 consecutive days",
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
    progress: 47,
    completed: false,
    xp: 500,
    date: null,
    category: "Habits",
  },
  {
    id: 7,
    title: "Goal Crusher",
    description: "Complete 5 goals",
    icon: <Award className="h-5 w-5 text-yellow-500" />,
    progress: 20,
    completed: false,
    xp: 400,
    date: null,
    category: "Goals",
  },
];

export default function AchievementShowcase() {
  const [selectedTab, setSelectedTab] = useState("all");

  // Filter achievements based on selected tab
  const filteredAchievements =
    selectedTab === "all"
      ? achievements
      : achievements.filter(
          (achievement) =>
            achievement.category.toLowerCase() === selectedTab.toLowerCase(),
        );

  // Sort achievements: completed first, then by progress
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return b.progress - a.progress;
  });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {sortedAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`hover:shadow-md transition-shadow ${
              achievement.completed ? "border-primary/30" : "border-gray-200"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${achievement.completed ? "bg-primary/10" : "bg-muted"}`}
                  >
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {achievement.completed ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Trophy className="h-3 w-3 mr-1" /> Unlocked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    {achievement.progress}% Complete
                  </Badge>
                )}
              </div>

              {!achievement.completed && (
                <div className="mt-3">
                  <Progress value={achievement.progress} className="h-1.5" />
                </div>
              )}

              <div className="mt-3 flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-700 dark:text-amber-500">
                    +{achievement.xp} XP
                  </span>
                </div>

                {achievement.completed && (
                  <span className="text-muted-foreground">
                    Earned {achievement.date}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
