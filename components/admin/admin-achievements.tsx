"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "@/lib/actions/admin-achievements";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Goals",
    icon: "",
    xp_reward: 100,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    setLoading(true);
    try {
      const data = await getAllAchievements();
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error loading achievements",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditAchievement(achievement) {
    setCurrentAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      icon: achievement.icon,
      xp_reward: achievement.xp_reward,
    });
    setIsEditDialogOpen(true);
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category);
    formDataObj.append("icon", formData.icon);
    formDataObj.append("xp_reward", formData.xp_reward);

    try {
      const result = await createAchievement(formDataObj);

      if (result.success) {
        toast({
          title: "Achievement created",
          description: "The achievement has been created successfully",
        });
        setIsCreateDialogOpen(false);
        fetchAchievements();
        setFormData({
          title: "",
          description: "",
          category: "Goals",
          icon: "",
          xp_reward: 100,
        });
      } else {
        toast({
          title: "Error creating achievement",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating achievement:", error);
      toast({
        title: "Error creating achievement",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category);
    formDataObj.append("icon", formData.icon);
    formDataObj.append("xp_reward", formData.xp_reward);

    try {
      const result = await updateAchievement(
        currentAchievement.id,
        formDataObj,
      );

      if (result.success) {
        toast({
          title: "Achievement updated",
          description: "The achievement has been updated successfully",
        });
        setIsEditDialogOpen(false);
        fetchAchievements();
      } else {
        toast({
          title: "Error updating achievement",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast({
        title: "Error updating achievement",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteAchievement(id) {
    if (!confirm("Are you sure you want to delete this achievement?")) {
      return;
    }

    try {
      const result = await deleteAchievement(id);

      if (result.success) {
        toast({
          title: "Achievement deleted",
          description: "The achievement has been deleted successfully",
        });
        fetchAchievements();
      } else {
        toast({
          title: "Error deleting achievement",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error deleting achievement",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  // Filter achievements based on search query
  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      achievement.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search achievements..."
              className="pl-8 w-full"
              disabled
            />
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-1" /> Add Achievement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-60 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded w-16"></div>
                      <div className="h-6 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded"></div>
                    <div className="h-8 w-8 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search achievements..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Achievement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goals">Goals</SelectItem>
                      <SelectItem value="Habits">Habits</SelectItem>
                      <SelectItem value="Tasks">Tasks</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Target">Target</SelectItem>
                      <SelectItem value="Flame">Flame</SelectItem>
                      <SelectItem value="BookOpen">Book</SelectItem>
                      <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="Brain">Brain</SelectItem>
                      <SelectItem value="Calendar">Calendar</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                      <SelectItem value="Sunrise">Sunrise</SelectItem>
                      <SelectItem value="Moon">Moon</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xp_reward">XP Reward</Label>
                <Input
                  id="xp_reward"
                  type="number"
                  min="10"
                  max="1000"
                  value={formData.xp_reward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      xp_reward: Number.parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Achievement</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Achievement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goals">Goals</SelectItem>
                      <SelectItem value="Habits">Habits</SelectItem>
                      <SelectItem value="Tasks">Tasks</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Target">Target</SelectItem>
                      <SelectItem value="Flame">Flame</SelectItem>
                      <SelectItem value="BookOpen">Book</SelectItem>
                      <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="Brain">Brain</SelectItem>
                      <SelectItem value="Calendar">Calendar</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                      <SelectItem value="Sunrise">Sunrise</SelectItem>
                      <SelectItem value="Moon">Moon</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-xp_reward">XP Reward</Label>
                <Input
                  id="edit-xp_reward"
                  type="number"
                  min="10"
                  max="1000"
                  value={formData.xp_reward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      xp_reward: Number.parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Achievement</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredAchievements.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-1">No achievements found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No achievements match your search query"
                : "Create your first achievement to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex gap-2">
                      <div className="text-xs bg-muted px-2 py-1 rounded-md">
                        {achievement.category}
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {achievement.xp_reward} XP
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAchievement(achievement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteAchievement(achievement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
