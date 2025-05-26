"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, UserCog, Shield, Award, Ban } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUsers, updateUserRole } from "@/lib/actions/admin-users";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error loading users",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleViewUser(user) {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  }

  async function handleToggleAdminRole(userId, currentIsAdmin) {
    try {
      const result = await updateUserRole(userId, !currentIsAdmin);

      if (result.success) {
        toast({
          title: "User role updated",
          description: result.message,
        });

        // Update local state
        setUsers(
          users.map((user) => {
            if (user.id === userId) {
              return { ...user, is_admin: !currentIsAdmin };
            }
            return user;
          }),
        );

        // Update selected user if dialog is open
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, is_admin: !currentIsAdmin });
        }
      } else {
        toast({
          title: "Error updating user role",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error updating user role",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 w-full"
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-60"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 rounded"></div>
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
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No users match your search query"
                : "No users in the system yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {user.full_name || user.username || "Anonymous"}
                      </h3>
                      {user.is_admin && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewUser(user)}
                  >
                    <UserCog className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.avatar_url || "/placeholder.svg"}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback>
                    {getInitials(selectedUser.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedUser.full_name || "No name"}
                  </h3>
                  <p className="text-muted-foreground">
                    @{selectedUser.username || "anonymous"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p>{selectedUser.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">XP</p>
                  <p>{selectedUser.xp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p>
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Actions</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleToggleAdminRole(
                        selectedUser.id,
                        selectedUser.is_admin,
                      )
                    }
                  >
                    {selectedUser.is_admin ? (
                      <>
                        <Shield className="h-4 w-4 mr-1" /> Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1" /> Make Admin
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Award className="h-4 w-4 mr-1" /> Award XP
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Ban className="h-4 w-4 mr-1" /> Suspend
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
