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

export default function GoalsHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleAddGoal = () => {
    if (newGoal.title.trim() === "") return;

    // In a real app, this would add the goal to the database
    console.log("Adding goal:", newGoal);

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

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Goals</h1>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search goals..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-1" /> Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create SMART Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
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
                        onValueChange={(value) =>
                          setNewGoal({ ...newGoal, category: value })
                        }
                        defaultValue={newGoal.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Career">Career</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
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
                            setNewGoal({
                              ...newGoal,
                              measurable: e.target.value,
                            })
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
                            setNewGoal({
                              ...newGoal,
                              achievable: e.target.value,
                            })
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
                            setNewGoal({
                              ...newGoal,
                              timeBound: e.target.value,
                            })
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
        </div>
      </div>
    </div>
  );
}
