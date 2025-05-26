"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Medal, Crown, Sparkles } from "lucide-react";

// Sample rewards data
const rewards = [
  {
    id: 1,
    title: "Custom Theme",
    description: "Unlock a special theme for your dashboard",
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    unlocked: true,
    claimed: true,
  },
  {
    id: 2,
    title: "Profile Badge",
    description: "Special badge for your profile",
    icon: <Medal className="h-5 w-5 text-primary" />,
    unlocked: true,
    claimed: false,
  },
  {
    id: 3,
    title: "Premium Template",
    description: "Unlock a premium goal template",
    icon: <Crown className="h-5 w-5 text-amber-500" />,
    unlocked: false,
    claimed: false,
    requiredAchievements: 15,
  },
];

export default function AchievementRewards() {
  return (
    <div className="space-y-3">
      {rewards.map((reward) => (
        <Card
          key={reward.id}
          className={reward.unlocked ? "border-primary/30" : ""}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${reward.unlocked ? "bg-primary/10" : "bg-muted"}`}
              >
                {reward.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  </div>
                  {reward.unlocked ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {reward.requiredAchievements} achievements required
                    </Badge>
                  )}
                </div>

                {reward.unlocked && (
                  <div className="mt-3 flex justify-end">
                    {reward.claimed ? (
                      <Badge variant="outline" className="text-green-600">
                        Claimed
                      </Badge>
                    ) : (
                      <Button size="sm">
                        <Gift className="h-4 w-4 mr-1" /> Claim Reward
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
