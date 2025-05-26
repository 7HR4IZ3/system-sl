"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Calendar, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function GoalsPage() {
  const { nextStep } = useOnboarding();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    target_value: 100,
    difficulty: "medium",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, target_date: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Insert the goal
        await supabase.from("goals").insert({
          user_id: session.user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          target_date: formData.target_date.toISOString(),
          target_value: formData.target_value,
          current_value: 0,
          difficulty: formData.difficulty,
          status: "in_progress",
        });

        // Award XP for creating first goal
        await supabase.rpc("increment_user_xp", {
          user_id_param: session.user.id,
          xp_amount: 50,
        });

        // Add to activity feed
        await supabase.from("activity_feed").insert({
          user_id: session.user.id,
          activity_type: "goal_created",
          description: `Created first goal: ${formData.title}`,
          xp_earned: 50,
        });

        nextStep();
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Your First Goal</CardTitle>
          <CardDescription>
            What do you want to achieve? Setting goals is the first step to
            success.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <div className="relative">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Learn Spanish"
                  required
                  className="pl-10"
                />
                <Target className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your goal and why it's important to you"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    handleSelectChange("difficulty", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Date</Label>
              <div className="relative">
                <DatePicker
                  date={formData.target_date}
                  setDate={handleDateChange}
                  className="w-full pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Goal...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
