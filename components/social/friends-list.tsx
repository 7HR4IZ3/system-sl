"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, UserPlus, Check, X } from "lucide-react";
import {
  getUserFriends,
  getSuggestedFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/lib/actions/social";
import { toast } from "@/hooks/use-toast";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const [friendsData, suggestionsData, requestsData] = await Promise.all([
          getUserFriends(),
          getSuggestedFriends(5),
          getFriendRequests(),
        ]);

        setFriends(friendsData);
        setSuggestions(suggestionsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Error fetching social data:", error);
        toast({
          title: "Error fetching friends",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSendFriendRequest = async (userId) => {
    setProcessingId(userId);
    try {
      const result = await sendFriendRequest(userId);

      if (result.success) {
        toast({
          title: "Friend request sent",
          description: "They will receive your request",
        });

        // Remove from suggestions
        setSuggestions(suggestions.filter((user) => user.id !== userId));
      } else {
        toast({
          title: "Failed to send request",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error sending request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      const result = await acceptFriendRequest(requestId);

      if (result.success) {
        toast({ title: "Friend request accepted" });

        // Refresh data
        const [friendsData, requestsData] = await Promise.all([
          getUserFriends(),
          getFriendRequests(),
        ]);
        setFriends(friendsData);
        setRequests(requestsData);
      } else {
        toast({
          title: "Failed to accept request",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error accepting request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      const result = await rejectFriendRequest(requestId);

      if (result.success) {
        toast({ title: "Friend request rejected" });

        // Remove from requests
        setRequests(requests.filter((request) => request.id !== requestId));
      } else {
        toast({
          title: "Failed to reject request",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error rejecting request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Filter friends based on search query
  const filteredFriends = searchQuery
    ? friends.filter(
        (friend) =>
          friend.friend?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          friend.friend?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : friends;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search friends..."
            className="pl-8 w-full"
            disabled
          />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="hover:shadow-sm transition-shadow animate-pulse"
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 w-8 rounded bg-gray-100"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search friends..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {requests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Friend Requests</h3>
          {requests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-sm transition-shadow bg-primary/5"
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={request.user?.avatar_url || "/placeholder.svg"}
                      alt={request.user?.username}
                    />
                    <AvatarFallback>
                      {getInitials(request.user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {request.user?.full_name || request.user?.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Wants to be friends
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-green-600"
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={processingId === request.id}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-red-600"
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={processingId === request.id}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Friends</h3>
        {filteredFriends.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {searchQuery
                ? "No friends found matching your search."
                : "No friends yet. Add some friends to get started!"}
            </CardContent>
          </Card>
        ) : (
          filteredFriends.map((friend) => (
            <Card key={friend.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={friend.friend?.avatar_url || "/placeholder.svg"}
                        alt={friend.friend?.username}
                      />
                      <AvatarFallback>
                        {getInitials(friend.friend?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    {/* For online status we would need a real-time system */}
                  </div>
                  <div>
                    <div className="font-medium">
                      {friend.friend?.full_name || friend.friend?.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Level {friend.friend?.level || 1}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Suggested Friends</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowSuggestions(false)}
            >
              Hide
            </Button>
          </div>

          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="hover:shadow-sm transition-shadow bg-muted/30"
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={suggestion.avatar_url || "/placeholder.svg"}
                        alt={suggestion.username}
                      />
                      <AvatarFallback>
                        {getInitials(suggestion.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {suggestion.full_name || suggestion.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Suggested for you
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => handleSendFriendRequest(suggestion.id)}
                    disabled={processingId === suggestion.id}
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
