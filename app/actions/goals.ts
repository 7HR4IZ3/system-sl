"use server";

import { createClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getGoals() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals:", error);
    return [];
  }

  return data;
}

export async function getGoalsByCategory(category: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals by category:", error);
    return [];
  }

  return data;
}
export async function getActiveGoals() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("completed", false) // Fetch only active goals
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active goals:", error);
    return [];
  }

  return data;
}

export async function createGoal(
  formData: FormData,
  path: string | boolean = "/goals",
) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const dueDate = formData.get("dueDate") as string;
  const specific = formData.get("specific") as string;
  const measurable = formData.get("measurable") as string;
  const achievable = formData.get("achievable") as string;
  const relevant = formData.get("relevant") as string;
  const timeBound = formData.get("timeBound") as string;

  const { error } = await supabase.from("goals").insert({
    user_id: session.user.id,
    title,
    description,
    category,
    due_date: dueDate || null,
    specific,
    measurable,
    achievable,
    relevant,
    time_bound: timeBound,
    progress: 0,
    completed: false,
  });

  if (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: error.message };
  }

  // Create activity feed entry
  await supabase.from("activity_feed").insert({
    user_id: session.user.id,
    activity_type: "goal",
    content: `created a new goal: ${title}`,
  });

  return { success: true };
}

export async function updateGoalProgress(goalId: string, progress: number) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Check if goal belongs to user
  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", session.user.id)
    .single();

  if (!goal) {
    return { success: false, error: "Goal not found" };
  }

  const completed = progress >= 100;

  const { error } = await supabase
    .from("goals")
    .update({
      progress,
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goalId);

  if (error) {
    console.error("Error updating goal progress:", error);
    return { success: false, error: error.message };
  }

  // If goal is completed, create activity feed entry
  if (completed && !goal.completed) {
    await supabase.from("activity_feed").insert({
      user_id: session.user.id,
      activity_type: "goal",
      content: `completed the goal: ${goal.title}`,
      related_id: goalId,
    });

    // Check for achievements
    await checkGoalAchievements(session.user.id);
  }

  // revalidatePath("/goals");
  return { success: true };
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: error.message };
  }

  // revalidatePath("/goals");
  return { success: true };
}

// Helper function to check for goal-related achievements
async function checkGoalAchievements(userId: string) {
  const supabase = await createClient();

  // Get completed goals count
  const { data: completedGoals, error: goalsError } = await supabase
    .from("goals")
    .select("id, category")
    .eq("user_id", userId)
    .eq("completed", true);

  if (goalsError) {
    console.error("Error checking goal achievements:", goalsError);
    return;
  }

  // Check for "First Steps" achievement (complete first goal)
  if (completedGoals.length === 1) {
    await unlockAchievement(userId, "First Steps");
  }

  // Check for "Goal Crusher" achievement (complete 5 goals)
  if (completedGoals.length >= 5) {
    await unlockAchievement(userId, "Goal Crusher");
  }

  // Check for "Mind Master" achievement (complete 3 learning goals)
  const educationGoals = completedGoals.filter(
    (goal) => goal.category.toLowerCase() === "education",
  );
  if (educationGoals.length >= 3) {
    await unlockAchievement(userId, "Mind Master");
  }
}

// Helper function to unlock achievements
async function unlockAchievement(userId: string, achievementTitle: string) {
  const supabase = await createClient();

  // Get achievement
  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("*")
    .eq("title", achievementTitle)
    .single();

  if (achievementError || !achievement) {
    console.error("Error finding achievement:", achievementError);
    return;
  }

  // Check if user already has this achievement
  const { data: existingAchievement, error: existingError } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .single();

  if (existingError && !existingError.message.includes("No rows found")) {
    console.error("Error checking existing achievement:", existingError);
    return;
  }

  if (existingAchievement?.completed) {
    return; // Already completed
  }

  // If user doesn't have this achievement or it's not completed, unlock it
  const { error: unlockError } = await supabase
    .from("user_achievements")
    .upsert({
      user_id: userId,
      achievement_id: achievement.id,
      progress: 100,
      completed: true,
      completed_date: new Date().toISOString(),
    });

  if (unlockError) {
    console.error("Error unlocking achievement:", unlockError);
    return;
  }

  // Add XP to user
  const { error: xpError } = await supabase.rpc("add_xp_to_user", {
    user_id: userId,
    xp_amount: achievement.xp_reward,
  });

  if (xpError) {
    console.error("Error adding XP to user:", xpError);
  }

  // Create activity feed entry
  await supabase.from("activity_feed").insert({
    user_id: userId,
    activity_type: "achievement",
    content: `earned the '${achievement.title}' achievement`,
    related_id: achievement.id,
  });
}
