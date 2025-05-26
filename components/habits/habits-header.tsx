"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HabitsHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    category: "",
    frequency: "Daily",
  });

  const handleAddHabit = () => {
    if (newHabit.title.trim() === "") return;

    // In a real app, this would add the habit to the database
    console.log("Adding habit:", newHabit);

    setNewHabit({
      title: "",
      description: "",
      category: "",
      frequency: "Daily",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Habits</h1>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search habits..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-1" /> Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Habit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Habit Title</Label>
                    <Input
                      id="title"
                      placeholder="What habit do you want to build?"
                      value={newHabit.title}
                      onChange={(e) =>
                        setNewHabit({ ...newHabit, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add details about this habit"
                      value={newHabit.description}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewHabit({ ...newHabit, category: value })
                        }
                        defaultValue={newHabit.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wellness">Wellness</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Career">Career</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewHabit({ ...newHabit, frequency: value })
                        }
                        defaultValue={newHabit.frequency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddHabit}>Create Habit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
