"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Trophy, Clock } from "lucide-react";

// Sample challenges data
const challenges = [
  {
    id: 1,
    title: "30-Day Fitness Challenge",
    description: "Complete a workout every day for 30 days",
    category: "Health",
    startDate: "2025-05-10",
    endDate: "2025-06-09",
    participants: 24,
    reward: 500,
    creator: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
  },
  {
    id: 2,
    title: "Book Reading Marathon",
    description: "Read 5 books in 30 days",
    category: "Education",
    startDate: "2025-05-15",
    endDate: "2025-06-15",
    participants: 18,
    reward: 400,
    creator: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
  },
  {
    id: 3,
    title: "Coding Sprint",
    description: "Build a small project in 7 days",
    category: "Career",
    startDate: "2025-05-20",
    endDate: "2025-05-27",
    participants: 12,
    reward: 300,
    creator: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
  },
];

export default function UpcomingChallenges() {
  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {challenge.category}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                {new Date(challenge.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {challenge.participants} participants
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                {challenge.reward} XP reward
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={challenge.creator.avatar || "/placeholder.svg"}
                  alt={challenge.creator.name}
                />
                <AvatarFallback>{challenge.creator.initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs">
                Created by {challenge.creator.name}
              </span>
            </div>
          </CardContent>
          <CardFooter className="px-4 py-2 border-t flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Starts in{" "}
              {Math.ceil(
                (new Date(challenge.startDate).getTime() -
                  new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              days
            </div>
            <Button size="sm">Join Challenge</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
