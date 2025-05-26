"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { getUserAchievements } from "@/lib/actions/achievements";
import dynamic from "next/dynamic";

// Dynamically import icons
const icons = {
  Target: dynamic(() => import("lucide-react").then((mod) => mod.Target)),
  Flame: dynamic(() => import("lucide-react").then((mod) => mod.Flame)),
  BookOpen: dynamic(() => import("lucide-react").then((mod) => mod.BookOpen)),
  Dumbbell: dynamic(() => import("lucide-react").then((mod) => mod.Dumbbell)),
  Brain: dynamic(() => import("lucide-react").then((mod) => mod.Brain)),
  Calendar: dynamic(() => import("lucide-react").then((mod) => mod.Calendar)),
  Award: dynamic(() => import("lucide-react").then((mod) => mod.Award)),
  Sunrise: dynamic(() => import("lucide-react").then((mod) => mod.Sunrise)),
  Moon: dynamic(() => import("lucide-react").then((mod) => mod.Moon)),
  Users: dynamic(() => import("lucide-react").then((mod) => mod.Users)),
  Trophy: dynamic(() => import("lucide-react").then((mod) => mod.Trophy)),
};

// Helper function to get the icon component
const getIconComponent = (iconName) => {
  const Icon = icons[iconName] || Trophy;
  return <Icon className="h-5 w-5" />;
};

// Helper function to get icon color
const getIconColor = (category) => {
  const colorMap = {
    Goals: "text-blue-500",
    Habits: "text-green-500",
    Tasks: "text-purple-500",
    Social: "text-pink-500",
    Health: "text-red-500",
    Education: "text-emerald-500",
  };
  return colorMap[category] || "text-amber-500";
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const data = await getUserAchievements();
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-40"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-100 rounded w-16"></div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="h-4 bg-gray-100 rounded w-16"></div>
                <div className="h-4 bg-gray-100 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {achievements.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No achievements yet</h3>
            <p className="text-muted-foreground">
              Complete goals and maintain habits to earn achievements
            </p>
          </CardContent>
        </Card>
      ) : (
        achievements.map((achievement) => {
          const iconColor = getIconColor(achievement.achievement.category);
          return (
            <Card
              key={achievement.id}
              className={`hover:shadow-md transition-shadow ${
                achievement.completed ? "border-amber-200" : "border-gray-200"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${achievement.completed ? "bg-amber-100" : "bg-gray-100"}`}
                    >
                      {achievement.achievement.icon ? (
                        <span className={iconColor}>
                          {getIconComponent(achievement.achievement.icon)}
                        </span>
                      ) : (
                        <Trophy className={`h-5 w-5 ${iconColor}`} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {achievement.achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.achievement.description}
                      </p>
                    </div>
                  </div>

                  {achievement.completed ? (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      <Trophy className="h-3 w-3 mr-1" /> Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {achievement.progress}% Complete
                    </Badge>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-amber-700">
                      +{achievement.achievement.xp_reward} XP
                    </span>
                  </div>

                  {achievement.completed && (
                    <span className="text-muted-foreground">
                      Earned {formatDate(achievement.completed_date)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
