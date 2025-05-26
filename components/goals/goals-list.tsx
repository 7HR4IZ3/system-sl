"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronRight,
  Calendar,
  Target,
  CheckSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryModal } from "@/components/ui/add-category-modal";
import { createGoal, getActiveGoals } from "@/app/actions/goals";
import { Database } from "@/lib/supabase/database.types";

// Define the Goal type based on the database schema
type Goal = Database["public"]["Tables"]["goals"]["Row"];

export default function GoalsList({ initialGoals }: { initialGoals: Goal[] }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const [goals, setGoals] = useState(initialGoals);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timeBound: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [allCategoriesState, setAllCategoriesState] = useState<string[]>([]);

  useEffect(() => {
    setAllCategoriesState(
      Array.from(new Set(initialGoals.map((goal) => goal.category))).filter(
        (category): category is string => typeof category === "string",
      ),
    );
  }, [initialGoals]);

  const handleSaveCategory = (categoryName: string) => {
    setAllCategoriesState((prevCategories) => {
      const newCategories = Array.from(
        new Set([...prevCategories, categoryName]),
      );
      return newCategories;
    });
    setNewGoal({ ...newGoal, category: categoryName });
    setIsCategoryModalOpen(false);
  };

  const [customCategory, setCustomCategory] = useState("fitness");

  const handleAddGoal = async () => {
    if (newGoal.title.trim() === "") return;

    const goal = new FormData();

    goal.append("title", newGoal.title);
    goal.append("description", newGoal.description);
    goal.append("category", newGoal.category);
    goal.append("dueDate", newGoal.dueDate);
    goal.append("specific", newGoal.specific);
    goal.append("measurable", newGoal.measurable);
    goal.append("achievable", newGoal.achievable);
    goal.append("relevant", newGoal.relevant);
    goal.append("timeBound", newGoal.timeBound);

    await createGoal(goal, false);
    setGoals(await getActiveGoals());

    setNewGoal({
      title: "",
      description: "",
      category: "",
      dueDate: "",
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timeBound: "",
    });
    setIsDialogOpen(false);
  };

  // const allCategories = Array.from(new Set(goals.map((goal) => goal.category))); // Replaced by allCategoriesState

  const filteredGoals =
    selectedTab === "all"
      ? goals
      : goals.filter((goal) => goal.category?.toLowerCase() === selectedTab);

  return (
    <div className="space-y-4">
      {allCategoriesState.length > 0 && (
        <div className="flex justify-between items-center">
          <Tabs
            defaultValue="all"
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {allCategoriesState
                .filter(
                  (category): category is string =>
                    typeof category === "string",
                )
                .map((category) => (
                  <TabsTrigger key={category} value={category.toLowerCase()}>
                    {category}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-2 shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create SMART Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="What do you want to achieve?"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal in detail"
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
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
                          setNewGoal({ ...newGoal, category: value });
                        }
                      }}
                      value={newGoal.category} // Use value instead of defaultValue to reflect state changes
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategoriesState
                          .filter(
                            (category): category is string =>
                              typeof category === "string",
                          )
                          .map((category) => (
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
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">SMART Criteria</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specific">Specific</Label>
                      <Textarea
                        id="specific"
                        placeholder="What exactly will you accomplish?"
                        value={newGoal.specific}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, specific: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="measurable">Measurable</Label>
                      <Textarea
                        id="measurable"
                        placeholder="How will you know when it's accomplished?"
                        value={newGoal.measurable}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, measurable: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="achievable">Achievable</Label>
                      <Textarea
                        id="achievable"
                        placeholder="Is it realistic given your resources?"
                        value={newGoal.achievable}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, achievable: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relevant">Relevant</Label>
                      <Textarea
                        id="relevant"
                        placeholder="Why is this goal important to you?"
                        value={newGoal.relevant}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, relevant: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeBound">Time-bound</Label>
                      <Textarea
                        id="timeBound"
                        placeholder="When will you achieve this goal?"
                        value={newGoal.timeBound}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, timeBound: e.target.value })
                        }
                      />
                    </div>
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
                <Button onClick={handleAddGoal}>Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        currentCategories={allCategoriesState.filter(
          (c): c is string => typeof c === "string",
        )}
      />
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't set any goals yet. Start by creating one!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
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
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {formatDate(goal.due_date)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <CheckSquare className="h-3 w-3" />
                      <span>
                        {/* {goal.completedTasks}/{goal.tasks} tasks */}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary -mr-2"
                >
                  Details <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
