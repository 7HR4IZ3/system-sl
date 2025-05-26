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
import { Plus, Edit, Trash2, Search, Users } from "lucide-react";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "@/lib/actions/admin-challenges";

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Health",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    reward: 100,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    setLoading(true);
    try {
      const data = await getAllChallenges();
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error loading challenges",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditChallenge(challenge) {
    setCurrentChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      start_date: challenge.start_date,
      end_date: challenge.end_date,
      reward: challenge.reward,
    });
    setIsEditDialogOpen(true);
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category);
    formDataObj.append("start_date", formData.start_date);
    formDataObj.append("end_date", formData.end_date);
    formDataObj.append("reward", formData.reward);

    try {
      const result = await createChallenge(formDataObj);

      if (result.success) {
        toast({
          title: "Challenge created",
          description: "The challenge has been created successfully",
        });
        setIsCreateDialogOpen(false);
        fetchChallenges();
        setFormData({
          title: "",
          description: "",
          category: "Health",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          reward: 100,
        });
      } else {
        toast({
          title: "Error creating challenge",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast({
        title: "Error creating challenge",
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
    formDataObj.append("start_date", formData.start_date);
    formDataObj.append("end_date", formData.end_date);
    formDataObj.append("reward", formData.reward);

    try {
      const result = await updateChallenge(currentChallenge.id, formDataObj);

      if (result.success) {
        toast({
          title: "Challenge updated",
          description: "The challenge has been updated successfully",
        });
        setIsEditDialogOpen(false);
        fetchChallenges();
      } else {
        toast({
          title: "Error updating challenge",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating challenge:", error);
      toast({
        title: "Error updating challenge",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteChallenge(id) {
    if (!confirm("Are you sure you want to delete this challenge?")) {
      return;
    }

    try {
      const result = await deleteChallenge(id);

      if (result.success) {
        toast({
          title: "Challenge deleted",
          description: "The challenge has been deleted successfully",
        });
        fetchChallenges();
      } else {
        toast({
          title: "Error deleting challenge",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting challenge:", error);
      toast({
        title: "Error deleting challenge",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  // Filter challenges based on search query
  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search challenges..."
              className="pl-8 w-full"
              disabled
            />
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-1" /> Add Challenge
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
            placeholder="Search challenges..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
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
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward">XP Reward</Label>
                <Input
                  id="reward"
                  type="number"
                  min="10"
                  max="1000"
                  value={formData.reward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward: Number.parseInt(e.target.value),
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
                <Button type="submit">Create Challenge</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Challenge</DialogTitle>
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
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date</Label>
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date</Label>
                  <Input
                    id="edit-end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-reward">XP Reward</Label>
                <Input
                  id="edit-reward"
                  type="number"
                  min="10"
                  max="1000"
                  value={formData.reward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward: Number.parseInt(e.target.value),
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
                <Button type="submit">Update Challenge</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredChallenges.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-1">No challenges found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No challenges match your search query"
                : "Create your first challenge to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="text-xs bg-muted px-2 py-1 rounded-md">
                        {challenge.category}
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {challenge.reward} XP
                      </div>
                      <div className="text-xs flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                        <Users className="h-3 w-3" />
                        <span>
                          {challenge.participants?.length || 0} participants
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(challenge.start_date).toLocaleDateString()} -{" "}
                      {new Date(challenge.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditChallenge(challenge)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteChallenge(challenge.id)}
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
