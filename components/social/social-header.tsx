"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SocialHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");

  const handleAddFriend = () => {
    if (friendEmail.trim() === "") return;

    // In a real app, this would send a friend request
    console.log("Adding friend:", friendEmail);

    setFriendEmail("");
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Social</h1>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search friends..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <UserPlus className="h-4 w-4 mr-1" /> Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Friend</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Friend's Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your friend's email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddFriend}>Send Invitation</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Trophy className="h-4 w-4 mr-1" /> Create Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
