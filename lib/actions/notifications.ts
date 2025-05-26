"use server";

import { createServerActionClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Get user notifications
export async function getUserNotifications() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error);
    throw new Error(error.message);
  }

  return data;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/notifications");
  return { success: true };
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", session.user.id)
    .eq("read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/notifications");
  return { success: true };
}

// Delete notification
export async function deleteNotification(notificationId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting notification:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/notifications");
  return { success: true };
}

// Create notification
export async function createNotification({
  userId,
  type,
  title,
  message,
  relatedId = null,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string | null;
}) {
  const supabase = await createServerActionClient({ cookies });

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    related_id: relatedId,
    read: false,
  });

  if (error) {
    console.error("Error creating notification:", error);
    throw new Error(error.message);
  }

  return { success: true };
}

// Get unread notification count
export async function getUnreadNotificationCount() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("read", false);

  if (error) {
    console.error("Error counting unread notifications:", error);
    throw new Error(error.message);
  }

  return count || 0;
}
