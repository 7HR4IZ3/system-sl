"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notifications";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Fetch notifications periodically (every 30 seconds)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const data = await getUserNotifications();
      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 px-2 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-default ${!notification.read ? "bg-muted/50" : ""}`}
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex items-start gap-2 w-full">
                  <div className="text-xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {notification.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {notification.message}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString(
                          undefined,
                          {
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
                            className="h-7 text-xs"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Link href={getNotificationLink(notification)} passHref>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 10 && (
              <div className="p-2 text-center">
                <Link href="/notifications" passHref>
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
