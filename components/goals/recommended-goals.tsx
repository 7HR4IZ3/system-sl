"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Sparkles } from "lucide-react";

// Sample recommended goals
const recommendedGoals = [
  {
    id: 1,
    title: "Learn a new programming language",
    description: "Based on your education goals",
    category: "Education",
    difficulty: "Medium",
    estimatedTime: "3 months",
    popularity: "High",
  },
  {
    id: 2,
    title: "Train for a 10K run",
    description: "Next step after your 5K progress",
    category: "Health",
    difficulty: "Medium",
    estimatedTime: "2 months",
    popularity: "Medium",
  },
  {
    id: 3,
    title: "Read 20 books this year",
    description: "Popular among users with similar interests",
    category: "Personal",
    difficulty: "Low",
    estimatedTime: "12 months",
    popularity: "High",
  },
];

export default function RecommendedGoals() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Personalized recommendations based on your activity</span>
      </div>

      <div className="flex flex-wrap gap-4">
        {recommendedGoals.map((goal) => (
          <Card
            key={goal.id}
            className="md:flex-2 flex-grow hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{goal.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {goal.category}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  Difficulty: {goal.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  Est. Time: {goal.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  Popularity: {goal.popularity}
                </span>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-2 border-t flex justify-end">
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Goal
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
