"use server";

import { createClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTasks() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*, goals(title)")
    .order("due_date", { ascending: true })
    .order("due_time", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data.map((task) => ({
    ...task,
    goalTitle: task.goals?.title || null,
  }));
}

export async function getTasksByDate(date: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*, goals(title)")
    .eq("due_date", date)
    .order("due_time", { ascending: true });

  if (error) {
    console.error("Error fetching tasks by date:", error);
    return [];
  }

  return data.map((task) => ({
    ...task,
    goalTitle: task.goals?.title || null,
  }));
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const priority = formData.get("priority") as string;
  const goalId = formData.get("goalId") as string;
  const dueDate = formData.get("dueDate") as string;
  const dueTime = formData.get("dueTime") as string;

  // Calculate XP based on priority
  const xp = priority === "High" ? 50 : priority === "Medium" ? 30 : 15;

  const { error } = await supabase.from("tasks").insert({
    user_id: session.user.id,
    title,
    description,
    priority,
    goal_id: goalId === "0" ? null : goalId,
    due_date: dueDate || null,
    due_time: dueTime || null,
    xp,
    completed: false,
  });

  if (error) {
    console.error("Error creating task:", error);
    return { success: false, error: error.message };
  }

  // revalidatePath("/tasks");
  return { success: true };
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Get task details first
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*, goals(title, id)")
    .eq("id", taskId)
    .single();

  if (taskError) {
    console.error("Error fetching task:", taskError);
    return { success: false, error: taskError.message };
  }

  // Update task completion status
  const { error } = await supabase
    .from("tasks")
    .update({
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error updating task completion:", error);
    return { success: false, error: error.message };
  }

  // If task is completed, add XP to user
  if (completed) {
    // Add XP to user
    const { error: xpError } = await supabase.rpc("add_xp_to_user", {
      user_id: session.user.id,
      xp_amount: task.xp,
    });

    if (xpError) {
      console.error("Error adding XP to user:", xpError);
    }

    // If task is associated with a goal, update goal progress
    if (task.goal_id) {
      // Get all tasks for this goal
      const { data: goalTasks, error: goalTasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("goal_id", task.goal_id);

      if (!goalTasksError && goalTasks) {
        const totalTasks = goalTasks.length;
        const completedTasks = goalTasks.filter((t) => t.completed).length;
        const progress = Math.round((completedTasks / totalTasks) * 100);

        // Update goal progress
        await supabase
          .from("goals")
          .update({
            progress,
            completed: progress >= 100,
            updated_at: new Date().toISOString(),
          })
          .eq("id", task.goal_id);
      }
    }

    // Create activity feed entry
    await supabase.from("activity_feed").insert({
      user_id: session.user.id,
      activity_type: "task",
      content: `completed the task: ${task.title}`,
      related_id: taskId,
    });

    // Check for task-related achievements
    await checkTaskAchievements(session.user.id);
  }

  // revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: error.message };
  }

  // revalidatePath("/tasks");
  return { success: true };
}

// Helper function to check for task-related achievements
async function checkTaskAchievements(userId: string) {
  const supabase = await createClient();

  // Get completed tasks
  const { data: completedTasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, due_time")
    .eq("user_id", userId)
    .eq("completed", true);

  if (tasksError) {
    console.error("Error checking task achievements:", tasksError);
    return;
  }

  // Check for "Early Bird" achievement (complete 5 tasks before 10 AM)
  const earlyTasks = completedTasks.filter((task) => {
    if (!task.due_time) return false;
    const hour = Number.parseInt(task.due_time.split(":")[0]);
    return hour < 10;
  });

  if (earlyTasks.length >= 5) {
    await unlockAchievement(userId, "Early Bird");
  }

  // Check for "Night Owl" achievement (complete 5 tasks after 10 PM)
  const nightTasks = completedTasks.filter((task) => {
    if (!task.due_time) return false;
    const hour = Number.parseInt(task.due_time.split(":")[0]);
    return hour >= 22;
  });

  if (nightTasks.length >= 5) {
    await unlockAchievement(userId, "Night Owl");
  }
}

// Helper function to unlock achievements (same as in goals.ts)
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
