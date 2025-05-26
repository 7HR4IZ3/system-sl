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
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Clock, Repeat } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const daysOfWeek = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
];

export default function HabitsPage() {
  const { nextStep } = useOnboarding();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "health",
    frequency_type: "daily",
    frequency_count: 1,
    days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    reminder_time: "08:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const days = [...prev.days_of_week];
      if (days.includes(day)) {
        return { ...prev, days_of_week: days.filter((d) => d !== day) };
      } else {
        return { ...prev, days_of_week: [...days, day] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Insert the habit
        await supabase.from("habits").insert({
          user_id: session.user.id,
          name: formData.name,
          category: formData.category,
          frequency_type: formData.frequency_type,
          frequency_count: formData.frequency_count,
          days_of_week: formData.days_of_week,
          reminder_time: formData.reminder_time,
          created_at: new Date().toISOString(),
        });

        // Award XP for creating first habit
        await supabase.rpc("increment_user_xp", {
          user_id_param: session.user.id,
          xp_amount: 50,
        });

        // Add to activity feed
        await supabase.from("activity_feed").insert({
          user_id: session.user.id,
          activity_type: "habit_created",
          description: `Created first habit: ${formData.name}`,
          xp_earned: 50,
        });

        nextStep();
      }
    } catch (error) {
      console.error("Error creating habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a Habit</CardTitle>
          <CardDescription>
            Build consistency with daily habits to achieve your goals
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Meditation"
                  required
                  className="pl-10"
                />
                <Repeat className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health & Fitness</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency_type">Frequency</Label>
              <Select
                value={formData.frequency_type}
                onValueChange={(value) =>
                  handleSelectChange("frequency_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex justify-between">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex flex-col items-center">
                    <Checkbox
                      id={day.id}
                      checked={formData.days_of_week.includes(day.id)}
                      onCheckedChange={() => handleDayToggle(day.id)}
                      className="mb-1"
                    />
                    <Label htmlFor={day.id} className="text-xs">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder_time">Reminder Time</Label>
              <div className="relative">
                <Input
                  id="reminder_time"
                  name="reminder_time"
                  type="time"
                  value={formData.reminder_time}
                  onChange={handleChange}
                  className="pl-10"
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Habit...
                </>
              ) : (
                "Create Habit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
