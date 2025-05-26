import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckSquare, Trophy, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  getDay,
} from "date-fns"; // Added getDay

// Helper function to get user ID
async function getUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    console.error("Error fetching user:", error);
    return null;
  }
  return user.id;
}

// --- Implemented Data Fetching Functions ---

async function getActiveGoalsCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    // Assuming 'active' is a possible status, or filter out 'completed'/'archived'
    .in("status", ["active", "in_progress"]); // Adjust based on your actual status values

  if (error) {
    console.error("Error fetching active goals count:", error);
    return 0;
  }
  return count ?? 0;
}

async function getWeeklyHabitCompletionRate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  const now = new Date();
  // Use ISO 8601 format which Supabase prefers
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();
  const today = getDay(now) === 0 ? 7 : getDay(now); // Monday=1, Sunday=7

  // 1. Get active habits for the user
  const { data: activeHabits, error: habitsError } = await supabase
    .from("habits") // Assuming 'habits' table
    .select("id, frequency, days_of_week") // frequency (e.g., 'daily', 'weekly'), days_of_week (e.g., [1,3,5] for Mon, Wed, Fri)
    .eq("user_id", userId)
    .eq("status", "active"); // Assuming 'active' status

  if (habitsError) {
    console.error("Error fetching active habits:", habitsError.message);
    return 0;
  }
  if (!activeHabits || activeHabits.length === 0) {
    return 0; // No active habits, rate is 0%
  }

  // 2. Calculate total expected entries for the week so far
  let totalExpectedEntries = 0;
  for (const habit of activeHabits) {
    if (habit.frequency === "daily") {
      totalExpectedEntries += today;
    } else if (habit.frequency === "weekly" && habit.days_of_week) {
      // Count how many scheduled days have passed this week
      totalExpectedEntries += habit.days_of_week.filter(
        (day: number) => day <= today,
      ).length;
    }
    // Add other frequency logic if needed (e.g., 'monthly')
  }

  if (totalExpectedEntries === 0) {
    // Avoid division by zero if no habits were expected yet this week
    return 0;
  }

  // 3. Get completed habit entries for the current week
  const { count: completedCount, error: entriesError } = await supabase
    .from("habit_entries") // Assuming 'habit_entries' table
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed") // Assuming 'completed' status
    .gte("date", weekStart) // Use ISO string
    .lte("date", weekEnd); // Use ISO string

  if (entriesError) {
    console.error("Error fetching weekly habit entries:", entriesError.message);
    // Decide how to handle partial errors, maybe return 0 or a specific error indicator
    return 0;
  }

  // 4. Calculate rate
  const rate = Math.round(((completedCount ?? 0) / totalExpectedEntries) * 100);
  return Math.min(rate, 100); // Cap at 100%
}

async function getTasksCompletedToday(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<{ completed: number; total: number }> {
  const todayStart = startOfDay(new Date()).toISOString();
  const todayEnd = endOfDay(new Date()).toISOString();

  // Get completed tasks today
  const { count: completedCount, error: completedError } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed") // Adjust status values
    .gte("completed_at", todayStart) // Check completion timestamp
    .lte("completed_at", todayEnd);

  // Get total tasks due today (or created today, depending on definition)
  // Let's count tasks that are NOT completed and due by end of today
  const { count: totalPendingCount, error: totalError } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .lte("due_date", todayEnd) // Due by end of today
    .in("status", ["pending", "in_progress"]); // Adjust as needed

  if (completedError || totalError) {
    console.error(
      "Error fetching tasks today:",
      (completedError || totalError)?.message,
    );
    return { completed: 0, total: 0 };
  }

  // Total tasks for today = completed today + pending/in_progress due today
  const totalTasks = (completedCount ?? 0) + (totalPendingCount ?? 0);

  return { completed: completedCount ?? 0, total: totalTasks };
}

async function getAchievementPoints(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("users") // Assuming points are stored here
    .select("xp") // Select the specific column
    .eq("id", userId)
    .single(); // Expect only one row for the user

  // Check for error OR if data exists but points are null/undefined
  if (error || !data || data.xp === null || data.xp === undefined) {
    if (error && error.code !== "PGRST116") {
      // PGRST116: "The result contains 0 rows" - handle gracefully
      console.error("Error fetching achievement points:", error.message);
    } else if (!data || data.xp === null || data.xp === undefined) {
      console.log(
        "User profile or achievement points not found for user:",
        userId,
      );
    }
    return 0; // Return 0 if error, no profile, or points are null/undefined
  }

  return data.xp;
}

// --- Component ---

export default async function DashboardStats() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const userId = await getUserId(supabase);

  if (!userId) {
    return (
      <div className="text-center text-muted-foreground">
        Could not load stats. Please log in.
      </div>
    );
  }

  // Fetch all stats concurrently
  const [activeGoalsCount, weeklyHabitRate, tasksToday, achievementPoints] =
    await Promise.all([
      getActiveGoalsCount(supabase, userId),
      getWeeklyHabitCompletionRate(supabase, userId),
      getTasksCompletedToday(supabase, userId),
      getAchievementPoints(supabase, userId),
    ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Goals */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Goals</p>
            <p className="text-2xl font-bold">{activeGoalsCount}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Today */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tasks Today</p>
            <p className="text-2xl font-bold">{`${tasksToday.completed}/${tasksToday.total}`}</p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Habit Rate */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Habit Rate (Week)</p>
            <p className="text-2xl font-bold">{weeklyHabitRate}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Points */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
            <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Achieve Points</p>
            <p className="text-2xl font-bold">{achievementPoints}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
