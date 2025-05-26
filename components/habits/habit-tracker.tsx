"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Check, X, RotateCcw, Calendar, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryModal } from "@/components/ui/add-category-modal";
import {
  createHabit,
  getUserHabits,
  markHabitCompletion,
  deleteHabit,
  HabitWithCompletion,
} from "@/lib/actions/habits";

export default function HabitTracker({
  initialHabits,
}: {
  initialHabits: HabitWithCompletion[];
}) {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    category: "",
    frequency: "Daily",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [allHabitCategories, setAllHabitCategories] = useState<string[]>([]);

  useEffect(() => {
    const categories = Array.from(
      new Set(initialHabits.map((habit) => habit.category)),
    ).filter((category): category is string => typeof category === "string");
    // Add default categories if not already present from initialHabits
    const defaultCategories = [
      "Wellness",
      "Health",
      "Education",
      "Career",
      "Personal",
    ];
    const combined = Array.from(new Set([...defaultCategories, ...categories]));
    setAllHabitCategories(combined);
  }, [initialHabits]);

  // Format today's date consistently for the backend
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Handle adding a new habit
  const handleSaveHabitCategory = (categoryName: string) => {
    setAllHabitCategories((prevCategories) => {
      const newCategories = Array.from(
        new Set([...prevCategories, categoryName]),
      );
      return newCategories;
    });
    setNewHabit({ ...newHabit, category: categoryName });
    setIsCategoryModalOpen(false);
  };

  const handleAddHabit = async () => {
    if (newHabit.title.trim() === "") return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", newHabit.title);
      formData.append("description", newHabit.description);
      formData.append("category", newHabit.category || "Personal");
      formData.append("frequency", newHabit.frequency);

      const result = await createHabit(formData);

      if (result.success) {
        toast({
          title: "Habit created",
          description: "Your new habit has been added",
        });

        // Refresh habits
        const habitsData = await getUserHabits();
        setHabits(habitsData);

        // Reset form
        setNewHabit({
          title: "",
          description: "",
          category: "",
          frequency: "Daily",
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Failed to create habit",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error creating habit",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marking habit completion
  const handleMarkHabit = async (habitId: string, completed: boolean) => {
    setIsMarking(true);

    try {
      const result = await markHabitCompletion(habitId, completed);

      if (result.success) {
        // Refresh habits
        const habitsData = await getUserHabits();
        setHabits(habitsData);

        if (completed) {
          toast({
            title: "Habit completed",
            description: "Great job keeping up your streak!",
          });
        }
      } else {
        toast({
          title: "Failed to update habit",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating habit",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  // Handle deleting a habit
  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      const result = await deleteHabit(habitId);

      if (result.success) {
        // Refresh habits
        const habitsData = await getUserHabits();
        setHabits(habitsData);

        toast({
          title: "Habit deleted",
          description: "Your habit has been removed",
        });
      } else {
        toast({
          title: "Failed to delete habit",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting habit",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Filter habits based on selected tab
  const filteredHabits =
    selectedTab === "all"
      ? habits
      : habits.filter(
          (habit) => habit.category.toLowerCase() === selectedTab.toLowerCase(),
        );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Tabs
          defaultValue="all"
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="flex w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {allHabitCategories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-2 shrink-0">
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
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => {
                      if (value === "add_new_category") {
                        setIsCategoryModalOpen(true);
                      } else {
                        setNewHabit({ ...newHabit, category: value });
                      }
                    }}
                    value={newHabit.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allHabitCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="add_new_category">
                        + Add New Category...
                      </SelectItem>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHabit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Habit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveHabitCategory}
        currentCategories={allHabitCategories}
      />
      {habits.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first habit to start building consistency
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap flex-row gap-4">
          {filteredHabits.length === 0 ? (
            <Card className="w-full">
              <CardContent className="p-6 text-center items-center">
                <p className="text-muted-foreground m-4">
                  Create your first habit to start building consistency
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHabits.map((habit) => (
              <Card key={habit.id} className="w-1/2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{habit.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    </div>
                    <Badge variant="outline">{habit.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20"
                      >
                        <Flame className="h-3 w-3" /> {habit.streak} day streak
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" /> Best:{" "}
                        {habit.longest_streak}
                      </Badge>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-primary/10 border-primary/20 text-primary"
                    >
                      +{habit.xp_per_completion} XP
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      {/* We can check if there's a habit completion for today */}
                      {habit.completed_today
                        ? "Completed today"
                        : "Not tracked today"}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-green-600"
                        onClick={() => handleMarkHabit(habit.id, true)}
                        disabled={isMarking || habit.completed_today}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600"
                        onClick={() => handleMarkHabit(habit.id, false)}
                        disabled={isMarking}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleDeleteHabit(habit.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
