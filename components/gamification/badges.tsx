"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserAchievements } from "@/lib/actions/achievements";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Award, Lock } from "lucide-react";

// Badge categories and their icons
const badgeCategories = {
  Beginner: "🌱",
  Intermediate: "🌟",
  Advanced: "🏆",
  Expert: "👑",
  Master: "🔮",
};

// Badge colors based on rarity
const badgeColors = {
  Common: "bg-gray-100 text-gray-800 border-gray-200",
  Uncommon: "bg-green-100 text-green-800 border-green-200",
  Rare: "bg-blue-100 text-blue-800 border-blue-200",
  Epic: "bg-purple-100 text-purple-800 border-purple-200",
  Legendary: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function UserBadges() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const data = await getUserAchievements();
        setAchievements(data || []);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  // Transform achievements into badges
  const badges = achievements
    .filter((achievement) => achievement.completed)
    .map((achievement) => {
      // Determine badge category and rarity based on achievement properties
      const category = achievement.achievement.category || "Beginner";
      let rarity = "Common";

      // Assign rarity based on XP reward
      if (achievement.achievement.xp_reward >= 500) {
        rarity = "Legendary";
      } else if (achievement.achievement.xp_reward >= 300) {
        rarity = "Epic";
      } else if (achievement.achievement.xp_reward >= 200) {
        rarity = "Rare";
      } else if (achievement.achievement.xp_reward >= 100) {
        rarity = "Uncommon";
      }

      return {
        id: achievement.id,
        title: achievement.achievement.title,
        description: achievement.achievement.description,
        icon: achievement.achievement.icon,
        category,
        rarity,
        earnedDate: achievement.completed_date,
      };
    });

  // Group badges by category
  const groupedBadges = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {});

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gray-200"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6">
            <Lock className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No badges yet</h3>
            <p className="text-muted-foreground">
              Complete achievements to earn badges
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span>{badgeCategories[category] || "🔶"}</span>
                  <span>{category} Badges</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categoryBadges.map((badge) => (
                    <TooltipProvider key={badge.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                              badgeColors[badge.rarity]
                            } cursor-help`}
                          >
                            {badge.icon ? badge.icon : "🏅"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-sm font-medium">
                            {badge.title}
                          </div>
                          <div className="text-xs">{badge.description}</div>
                          <div className="text-xs mt-1 flex justify-between">
                            <span className="text-muted-foreground">
                              {new Date(badge.earnedDate).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="text-xs h-5">
                              {badge.rarity}
                            </Badge>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
