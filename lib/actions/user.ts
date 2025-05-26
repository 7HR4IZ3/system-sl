"use server";

import { createServerActionClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { User, userSchema } from "../schemas/database";

// Get user profile
export async function getUserProfile(): Promise<User> {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.message);
  }

  return userSchema.parse(data);
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const full_name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;

  // Check if username is already taken
  if (username) {
    const { data: existingUser, error: usernameError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .neq("id", session.user.id)
      .single();

    if (existingUser) {
      throw new Error("Username is already taken");
    }
  }

  // Update user profile
  const { data, error } = await supabase
    .from("users")
    .update({
      full_name,
      username,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)
    .select();

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/settings");
  return data;
}

// Update avatar
export async function updateAvatar(avatarUrl: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, error: "Not authenticated", isAuthError: true };
  }

  // Update avatar
  const { data, error } = await supabase
    .from("users")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)
    .select();

  if (error) {
    console.error("Error updating avatar:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/settings");
  return data;
}

// Get user stats
export async function getUserStats() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw { message: "Not authenticated", isAuthError: true };
  }

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("level, xp")
    .eq("id", session.user.id)
    .single();

  if (userError) {
    console.error("Error fetching user profile:", userError);
    throw new Error(userError.message);
  }

  // Count completed tasks
  const { count: tasksCount, error: tasksError } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("completed", true);

  // Count completed goals
  const { count: goalsCount, error: goalsError } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("completed", true);

  // Count habits
  const { count: habitsCount, error: habitsError } = await supabase
    .from("habits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id);

  // Count achievements
  const { count: achievementsCount, error: achievementsError } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("completed", true);

  let error = null;
  if ((error = tasksError || goalsError || habitsError || achievementsError)) {
    console.error("Error fetching user stats:", {
      tasksError,
      goalsError,
      habitsError,
      achievementsError,
    });
    throw new Error(error.message);
  }

  return {
    level: Number(user?.level ?? 1),
    xp: Number(user?.xp ?? 0),
    tasks_completed: tasksCount ?? 0,
    goals_completed: goalsCount ?? 0,
    habits_count: habitsCount ?? 0,
    achievements_count: achievementsCount ?? 0,
  };
}

// Calculate XP needed for next level
export async function calculateXpForNextLevel(currentLevel: number) {
  return currentLevel * 100;
}
