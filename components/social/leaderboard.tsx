"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Trophy, Medal, Star } from "lucide-react";

// Sample leaderboard data
const leaderboardData = {
  weekly: [
    {
      id: 1,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      xp: 850,
      level: 10,
      position: 1,
    },
    {
      id: 2,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      xp: 720,
      level: 8,
      position: 2,
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ED",
      xp: 680,
      level: 9,
      position: 3,
    },
    {
      id: 4,
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      xp: 590,
      level: 7,
      position: 4,
    },
    {
      id: 5,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "YO",
      xp: 520,
      level: 7,
      position: 5,
      isCurrentUser: true,
    },
  ],
  monthly: [
    {
      id: 1,
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ED",
      xp: 3200,
      level: 9,
      position: 1,
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      xp: 2950,
      level: 10,
      position: 2,
    },
    {
      id: 3,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "YO",
      xp: 2800,
      level: 7,
      position: 3,
      isCurrentUser: true,
    },
    {
      id: 4,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      xp: 2650,
      level: 8,
      position: 4,
    },
    {
      id: 5,
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      xp: 2400,
      level: 7,
      position: 5,
    },
  ],
  allTime: [
    {
      id: 1,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      xp: 15200,
      level: 10,
      position: 1,
    },
    {
      id: 2,
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ED",
      xp: 14800,
      level: 9,
      position: 2,
    },
    {
      id: 3,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      xp: 12500,
      level: 8,
      position: 3,
    },
    {
      id: 4,
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      xp: 10200,
      level: 7,
      position: 4,
    },
    {
      id: 5,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "YO",
      xp: 9800,
      level: 7,
      position: 5,
      isCurrentUser: true,
    },
  ],
};

export default function Leaderboard() {
  const [period, setPeriod] = useState("weekly");

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{position}</span>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Leaderboard</CardTitle>
          <Tabs defaultValue="weekly" onValueChange={setPeriod}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="weekly" className="text-xs">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="allTime" className="text-xs">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {leaderboardData[period].map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                user.isCurrentUser
                  ? "bg-primary/5 border border-primary/20"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6">
                  {getPositionIcon(user.position)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Level {user.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-medium">{user.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
