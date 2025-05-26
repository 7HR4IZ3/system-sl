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
import { Search, Plus, Calendar, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TasksHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    goalId: "",
    dueTime: "",
    dueDate: "",
  });
  const [viewMode, setViewMode] = useState("calendar");

  const handleAddTask = () => {
    if (newTask.title.trim() === "") return;

    // In a real app, this would add the task to the database
    console.log("Adding task:", newTask);

    setNewTask({
      title: "",
      priority: "Medium",
      goalId: "",
      dueTime: "",
      dueDate: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tasks</h1>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>

            <Tabs
              defaultValue="calendar"
              onValueChange={setViewMode}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 w-full sm:w-[180px]">
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="What do you need to do?"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewTask({ ...newTask, priority: value })
                        }
                        defaultValue={newTask.priority}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal">Related Goal (Optional)</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewTask({ ...newTask, goalId: value })
                        }
                        defaultValue={newTask.goalId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">
                            Complete React certification
                          </SelectItem>
                          <SelectItem value="2">Run a half marathon</SelectItem>
                          <SelectItem value="3">Learn Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueTime">Due Time</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueTime: e.target.value })
                        }
                      />
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
                  <Button onClick={handleAddTask}>Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
