"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/actions/notifications";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Bell, Check, Trash2 } from "lucide-react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error loading notifications",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) => {
          if (n.id === id) {
            return { ...n, read: true };
          }
          return n;
        }),
      );
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error marking notification as read",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error marking all notifications as read",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      toast({
        title: "Notification deleted",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error deleting notification",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "achievement":
        return "🏆";
      case "level_up":
        return "⭐";
      case "friend_request":
        return "👋";
      case "friend_accepted":
        return "🤝";
      case "challenge":
        return "🏅";
      case "goal_completed":
        return "🎯";
      case "streak":
        return "🔥";
      default:
        return "📣";
    }
  };

  // Get notification link based on type
  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "achievement":
        return "/achievements";
      case "level_up":
        return "/profile";
      case "friend_request":
      case "friend_accepted":
        return "/social";
      case "challenge":
        return "/social";
      case "goal_completed":
        return "/goals";
      case "streak":
        return "/habits";
      default:
        return "/";
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type.includes(activeTab);
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-100 rounded w-20"></div>
                      <div className="h-8 bg-gray-100 rounded w-20"></div>
                    </div>
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
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
            <TabsTrigger value="friend">Social</TabsTrigger>
          </TabsList>
        </Tabs>

        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-1" /> Mark all as read
          </Button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className="text-muted-foreground">
              {activeTab === "unread"
                ? "You have no unread notifications"
                : activeTab === "all"
                  ? "You have no notifications yet"
                  : `You have no ${activeTab} notifications`}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:shadow-sm transition-shadow ${!notification.read ? "bg-muted/50" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {notification.message}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark as read
                        </Button>
                      )}
                      <Link href={getNotificationLink(notification)} passHref>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            !notification.read &&
                            handleMarkAsRead(notification.id)
                          }
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
