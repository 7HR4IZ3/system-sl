"use server";

import { createServerActionClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Get all achievements
export async function getAllAchievements() {
  const supabase = await createServerActionClient({ cookies });

  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("*")
    .order("xp_reward", { ascending: true });

  if (error) {
    console.error("Error fetching achievements:", error);
    throw new Error(error.message);
  }

  return achievements;
}

// Get user achievements
export async function getUserAchievements() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("user_achievements")
    .select(
      `
      *,
      achievement:achievement_id(
        id,
        title,
        description,
        category,
        icon,
        xp_reward
      )
    `
    )
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error fetching user achievements:", error);
    throw new Error(error.message);
  }

  return data;
}

// Update achievement progress
export async function updateAchievementProgress(
  achievementId: string,
  progress: number
) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Check if user already has this achievement
  const { data: existingAchievement } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("achievement_id", achievementId)
    .single();

  if (existingAchievement) {
    // Update existing progress
    const { error } = await supabase
      .from("user_achievements")
      .update({
        progress: progress,
        completed: progress >= 100,
        completed_date: progress >= 100 ? new Date().toISOString() : null,
      })
      .eq("id", existingAchievement.id);

    if (error) {
      console.error("Error updating achievement progress:", error);
      throw new Error(error.message);
    }

    // If achievement is newly completed, award XP
    if (progress >= 100 && existingAchievement.progress < 100) {
      const { data: achievement } = await supabase
        .from("achievements")
        .select("xp_reward, title")
        .eq("id", achievementId)
        .single();

      if (achievement) {
        // Award XP
        await supabase.rpc("increment_user_xp", {
          user_id_param: session.user.id,
          xp_amount: achievement.xp_reward,
        });

        // Add to activity feed
        await supabase.from("activity_feed").insert({
          user_id: session.user.id,
          activity_type: "achievement",
          content: `earned the '${achievement.title}' achievement`,
          related_id: achievementId,
        });
      }
    }
  } else {
    // Create new user achievement
    const { error } = await supabase.from("user_achievements").insert({
      user_id: session.user.id,
      achievement_id: achievementId,
      progress: progress,
      completed: progress >= 100,
      completed_date: progress >= 100 ? new Date().toISOString() : null,
    });

    if (error) {
      console.error("Error creating user achievement:", error);
      throw new Error(error.message);
    }

    // If achievement is completed immediately, award XP
    if (progress >= 100) {
      const { data: achievement } = await supabase
        .from("achievements")
        .select("xp_reward, title")
        .eq("id", achievementId)
        .single();

      if (achievement) {
        // Award XP
        await supabase.rpc("increment_user_xp", {
          user_id_param: session.user.id,
          xp_amount: achievement.xp_reward,
        });

        // Add to activity feed
        await supabase.from("activity_feed").insert({
          user_id: session.user.id,
          activity_type: "achievement",
          content: `earned the '${achievement.title}' achievement`,
          related_id: achievementId,
        });
      }
    }
  }

  // revalidatePath("/achievements");
  return { success: true };
}
