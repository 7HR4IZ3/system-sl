"use server";

import { createServerActionClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/database.types"; // Import Database type

// Define the type for the combined habit and completion status
export type HabitWithCompletion =
  Database["public"]["Tables"]["habits"]["Row"] & {
    completed_today: boolean;
  };

// Get habits with completion status for today
export async function getHabitsWithCompletionForToday(): Promise<
  HabitWithCompletion[]
> {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Fetch habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (habitsError) {
    console.error("Error fetching habits:", habitsError);
    throw new Error(habitsError.message);
  }

  if (!habits || habits.length === 0) {
    return [];
  }

  // Fetch today's completions for these habits
  const habitIds = habits.map((h) => h.id);
  const { data: completions, error: completionsError } = await supabase
    .from("habit_completions")
    .select("habit_id, completed")
    .eq("user_id", session.user.id)
    .eq("completed_date", today)
    .in("habit_id", habitIds);

  if (completionsError) {
    console.error("Error fetching habit completions:", completionsError);
    // Proceed without completion data, treating all as incomplete for today
  }

  // Create a map for quick lookup of today's completions
  const completionsMap = new Map<string, boolean>();
  if (completions) {
    completions.forEach((comp) => {
      completionsMap.set(comp.habit_id, comp.completed);
    });
  }

  // Combine habits with completion status
  const habitsWithCompletion: HabitWithCompletion[] = habits.map((habit) => ({
    ...habit,
    completed_today: completionsMap.get(habit.id) ?? false,
  }));

  return habitsWithCompletion;
}

// Get the user's habits
export async function getUserHabits() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data: habits, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching habits:", error);
    throw new Error(error.message);
  }

  return habits;
}

// Create a new habit
export async function createHabit(formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const frequency = formData.get("frequency") as string;

  // Set XP based on frequency
  let xpPerCompletion = 20; // Default for daily
  if (frequency === "Weekly") {
    xpPerCompletion = 50;
  } else if (frequency === "Monthly") {
    xpPerCompletion = 100;
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: session.user.id,
      title,
      description,
      category,
      frequency,
      streak: 0,
      longest_streak: 0,
      xp_per_completion: xpPerCompletion,
    })
    .select();

  if (error) {
    console.error("Error creating habit:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/habits");
  return data;
}

// Mark habit as completed
export async function markHabitCompletion(
  habitId: string,
  completed: boolean,
  path: string = "/"
) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  if (completed) {
    // Add completion record
    const { data: completionData, error: completionError } = await supabase
      .from("habit_completions")
      .upsert({
        habit_id: habitId,
        user_id: session.user.id,
        completed_date: today,
        completed: true,
      })
      .select();

    if (completionError) {
      console.error("Error marking habit as completed:", completionError);
      throw new Error(completionError.message);
    }

    // Update streak
    const { data: habitsData, error: habitsError } = await supabase
      .from("habits")
      .select("streak, longest_streak, xp_per_completion")
      .eq("id", habitId)
      .single();

    if (habitsError) {
      console.error("Error fetching habit data:", habitsError);
      throw new Error(habitsError.message);
    }

    // Increment streak
    const newStreak = (habitsData.streak || 0) + 1;
    const newLongestStreak = Math.max(
      newStreak,
      habitsData.longest_streak || 0
    );

    const { error: updateError } = await supabase
      .from("habits")
      .update({
        streak: newStreak,
        longest_streak: newLongestStreak,
      })
      .eq("id", habitId);

    if (updateError) {
      console.error("Error updating streak:", updateError);
      throw new Error(updateError.message);
    }

    // Update user XP
    const { error: userUpdateError } = await supabase.rpc("increment_user_xp", {
      user_id_param: session.user.id,
      xp_amount: habitsData.xp_per_completion,
    });

    if (userUpdateError) {
      console.error("Error updating user XP:", userUpdateError);
    }

    // Check for streak achievements
    checkStreakAchievements(session.user.id, newStreak);
  } else {
    // Reset streak if marked as not completed
    const { error: updateError } = await supabase
      .from("habits")
      .update({
        streak: 0,
      })
      .eq("id", habitId);

    if (updateError) {
      console.error("Error resetting streak:", updateError);
      throw new Error(updateError.message);
    }

    // Remove completion record if it exists
    const { error: deleteError } = await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("completed_date", today);

    if (deleteError) {
      console.error("Error deleting habit completion:", deleteError);
      throw new Error(deleteError.message);
    }
  }

  // revalidatePath(path); // Revalidate the dashboard page
  return { success: true };
}

// Delete a habit
export async function deleteHabit(habitId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Delete the habit
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting habit:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/habits");
  return { success: true };
}

// Get habit completion history
export async function getHabitCompletions(habitId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error fetching habit completions:", error);
    throw new Error(error.message);
  }

  return data;
}

// Helper function to check streak achievements
async function checkStreakAchievements(userId: string, streak: number) {
  const supabase = await createServerActionClient({ cookies });

  // Define streak achievement thresholds and their achievement IDs
  const streakAchievements = [
    { threshold: 7, achievementTitle: "Habit Master" },
    { threshold: 30, achievementTitle: "30-Day Warrior" },
  ];

  for (const { threshold, achievementTitle } of streakAchievements) {
    if (streak >= threshold) {
      // Find achievement ID
      const { data: achievementData } = await supabase
        .from("achievements")
        .select("id")
        .eq("title", achievementTitle)
        .single();

      if (achievementData) {
        // Check if user already has this achievement
        const { data: existingAchievement } = await supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", userId)
          .eq("achievement_id", achievementData.id)
          .single();

        if (existingAchievement && !existingAchievement.completed) {
          // Update existing user achievement
          await supabase
            .from("user_achievements")
            .update({
              completed: true,
              completed_date: new Date().toISOString(),
              progress: 100,
            })
            .eq("id", existingAchievement.id);

          // Award XP
          const { data: achievement } = await supabase
            .from("achievements")
            .select("xp_reward")
            .eq("id", achievementData.id)
            .single();

          if (achievement) {
            await supabase.rpc("increment_user_xp", {
              user_id_param: userId,
              xp_amount: achievement.xp_reward,
            });
          }

          // Add to activity feed
          await supabase.from("activity_feed").insert({
            user_id: userId,
            activity_type: "achievement",
            content: `earned the '${achievementTitle}' achievement`,
            related_id: achievementData.id,
          });
        } else if (!existingAchievement) {
          // Create new user achievement if it doesn't exist
          await supabase.from("user_achievements").insert({
            user_id: userId,
            achievement_id: achievementData.id,
            progress: 100,
            completed: true,
            completed_date: new Date().toISOString(),
          });

          // Award XP
          const { data: achievement } = await supabase
            .from("achievements")
            .select("xp_reward")
            .eq("id", achievementData.id)
            .single();

          if (achievement) {
            await supabase.rpc("increment_user_xp", {
              user_id_param: userId,
              xp_amount: achievement.xp_reward,
            });
          }

          // Add to activity feed
          await supabase.from("activity_feed").insert({
            user_id: userId,
            activity_type: "achievement",
            content: `earned the '${achievementTitle}' achievement`,
            related_id: achievementData.id,
          });
        }
      }
    }
  }
}
