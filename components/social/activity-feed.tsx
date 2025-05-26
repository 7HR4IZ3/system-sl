"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Calendar,
  Star,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { getActivityFeed } from "@/lib/actions/social";
import { toast } from "@/hooks/use-toast";

// Helper function to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
};

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

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getActivityFeed();
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching activity feed:", error);
        toast({
          title: "Error loading activity feed",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "goal":
        return <Target className="h-5 w-5 text-primary" />;
      case "streak":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "level":
        return <Star className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  // Get activity badge based on type
  const getActivityBadge = (type) => {
    switch (type) {
      case "achievement":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            Achievement
          </Badge>
        );
      case "goal":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Goal
          </Badge>
        );
      case "streak":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Streak
          </Badge>
        );
      case "level":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Level Up
          </Badge>
        );
      case "friend":
        return (
          <Badge className="bg-pink-100 text-pink-700 border-pink-200">
            Friend
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="hover:shadow-md transition-shadow animate-pulse"
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-40"></div>
                    <div className="h-5 bg-gray-100 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No activity yet</h3>
            <p className="text-muted-foreground">
              Activity from you and your friends will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage
                    src={activity.user?.avatar_url || "/placeholder.svg"}
                    alt={activity.user?.username}
                  />
                  <AvatarFallback>
                    {getInitials(activity.user?.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium">
                      {activity.user?.username ||
                        activity.user?.full_name ||
                        "Anonymous"}
                    </span>
                    <span className="text-muted-foreground">
                      {activity.content}
                    </span>
                    {getActivityBadge(activity.activity_type)}
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    {getActivityIcon(activity.activity_type)}
                    <span>{formatRelativeTime(activity.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Like</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Comment</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
