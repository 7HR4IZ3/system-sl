"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  image_url?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient<Database>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const router = useRouter();

  // Check if notifications table exists
  const checkNotificationsTable = async () => {
    try {
      // Try to get the schema information
      const { error } = await supabase
        .from("notifications")
        .select("id")
        .limit(1)
        .single();

      // If we get a specific error about the relation not existing
      if (
        error &&
        error.message.includes('relation "public.notifications" does not exist')
      ) {
        console.warn(
          "Notifications table does not exist yet. Using local storage fallback.",
        );
        setTableExists(false);
        return false;
      }

      return true;
    } catch (error) {
      console.warn("Error checking notifications table:", error);
      setTableExists(false);
      return false;
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // Check if table exists first
      const exists = await checkNotificationsTable();
      if (!exists) {
        // Use local storage fallback
        const storedNotifications = localStorage.getItem(
          `notifications_${session.user.id}`,
        );
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
          setUnreadCount(
            parsedNotifications.filter((n: Notification) => !n.read).length,
          );
        }
        return;
      }

      // If table exists, query it
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (
          error.message.includes(
            'relation "public.notifications" does not exist',
          )
        ) {
          setTableExists(false);
          // Use local storage fallback
          const storedNotifications = localStorage.getItem(
            `notifications_${session.user.id}`,
          );
          if (storedNotifications) {
            const parsedNotifications = JSON.parse(storedNotifications);
            setNotifications(parsedNotifications);
            setUnreadCount(
              parsedNotifications.filter((n: Notification) => !n.read).length,
            );
          }
        } else {
          throw error;
        }
      } else {
        setNotifications(data || []);
        setUnreadCount(data?.filter((n) => !n.read).length || 0);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      // Don't set notifications to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to new notifications
  useEffect(() => {
    const setupSubscription = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return () => {};

      // Only set up subscription if table exists
      if (tableExists) {
        const subscription = supabase
          .channel("notifications")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${session.user.id}`,
            },
            () => {
              loadNotifications();
            },
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      }

      return () => {};
    };

    loadNotifications();
    const unsubscribe = setupSubscription();

    return () => {
      unsubscribe.then((unsub) => unsub && unsub());
    };
  }, [supabase, tableExists]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      if (tableExists) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", id);
        if (error) throw error;
      } else {
        // Use local storage fallback
        const storedNotifications = localStorage.getItem(
          `notifications_${session.user.id}`,
        );
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const updatedNotifications = parsedNotifications.map(
            (n: Notification) => (n.id === id ? { ...n, read: true } : n),
          );
          localStorage.setItem(
            `notifications_${session.user.id}`,
            JSON.stringify(updatedNotifications),
          );
        }
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      if (tableExists) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", session.user.id)
          .eq("read", false);

        if (error) throw error;
      } else {
        // Use local storage fallback
        const storedNotifications = localStorage.getItem(
          `notifications_${session.user.id}`,
        );
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const updatedNotifications = parsedNotifications.map(
            (n: Notification) => ({ ...n, read: true }),
          );
          localStorage.setItem(
            `notifications_${session.user.id}`,
            JSON.stringify(updatedNotifications),
          );
        }
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      if (tableExists) {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } else {
        // Use local storage fallback
        const storedNotifications = localStorage.getItem(
          `notifications_${session.user.id}`,
        );
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const updatedNotifications = parsedNotifications.filter(
            (n: Notification) => n.id !== id,
          );
          localStorage.setItem(
            `notifications_${session.user.id}`,
            JSON.stringify(updatedNotifications),
          );
        }
      }

      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    setIsLoading(true);
    await loadNotifications();
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
