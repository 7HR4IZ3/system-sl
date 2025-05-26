"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Trophy } from "lucide-react";

export default function AchievementsHeader() {
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Achievements</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search achievements..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
                <SelectItem value="habits">Habits</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Trophy className="h-4 w-4 mr-1" /> Share Achievements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
