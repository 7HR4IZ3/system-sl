"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RefreshCw, Star, Timer } from "lucide-react";

// Sample challenges data
const initialChallenges = [
  {
    id: 1,
    title: "Complete 3 high-priority tasks",
    description: "Finish 3 tasks marked as high priority",
    progress: 1,
    total: 3,
    xp: 75,
    completed: false,
  },
  {
    id: 2,
    title: "Update progress on all goals",
    description: "Review and update the progress of all your active goals",
    progress: 0,
    total: 1,
    xp: 50,
    completed: false,
  },
  {
    id: 3,
    title: "Add a new habit to track",
    description: "Create a new habit you want to build",
    progress: 0,
    total: 1,
    xp: 30,
    completed: false,
  },
];

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState(initialChallenges);

  const handleCompleteChallenge = (challengeId) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, completed: true, progress: challenge.total }
          : challenge,
      ),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Refreshes in 10:45:32</p>
        </div>

        <Badge variant="outline" className="flex items-center gap-1">
          <Timer className="h-3 w-3" /> Daily
        </Badge>
      </div>

      {challenges.map((challenge) => (
        <Card key={challenge.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
              </div>

              <Badge className="bg-violet-100 border-violet-200 text-violet-700">
                <Star className="h-3 w-3 mr-1" /> {challenge.xp} XP
              </Badge>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm">
                Progress:{" "}
                <span className="font-medium">
                  {challenge.progress}/{challenge.total}
                </span>
              </div>

              {!challenge.completed ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-violet-700 border-violet-200 hover:bg-violet-50"
                  onClick={() => handleCompleteChallenge(challenge.id)}
                >
                  Complete
                </Button>
              ) : (
                <Badge className="bg-emerald-100 border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
