import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import GoalsList from "@/components/goals/goals-list";
import HabitTracker from "@/components/habits/habit-tracker";
import AchievementShowcase from "@/components/achievements/achievement-showcase";
import DailyTasks from "@/components/tasks/daily-tasks";
import ProgressCharts from "@/components/progress/progress-charts";
import RecommendedGoals from "@/components/goals/recommended-goals";
import UpcomingChallenges from "@/components/social/upcoming-challenges";
import { getTasksByDate } from "@/app/actions/tasks"; // Import the action
import { Database } from "@/lib/supabase/database.types"; // Import database types
import {
  getHabitsWithCompletionForToday, // Import the new action
  HabitWithCompletion, // Import the type
} from "@/lib/actions/habits";
import { getActiveGoals } from "@/app/actions/goals";

// Define the Task type again, matching the one expected by DailyTasks component
type TaskWithGoalTitle = Database["public"]["Tables"]["tasks"]["Row"] & {
  goalTitle: string | null;
};

type Goal = Database["public"]["Tables"]["goals"]["Row"];

// Helper function to get today's date in YYYY-MM-DD format, adjusting for timezone
const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - offset * 60 * 1000);
  return localToday.toISOString().split("T")[0];
};

export default async function Dashboard() {
  // Make component async
  const today = getTodayDateString();
  const todaysTasks: TaskWithGoalTitle[] = await getTasksByDate(today); // Fetch tasks
  // Fetch habits data
  const habitsData: HabitWithCompletion[] =
    await getHabitsWithCompletionForToday();
  const goals: Goal[] = await getActiveGoals();

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<Skeleton className="h-24 w-full rounded-lg" />}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recommended Goals</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <RecommendedGoals />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Current Goals</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <GoalsList initialGoals={goals} />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Daily Tasks</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <DailyTasks initialTasks={todaysTasks} />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Habit Tracker</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <HabitTracker initialHabits={habitsData} />{" "}
                {/* Pass data as prop */}
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Progress Overview</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-80 w-full rounded-lg" />}
              >
                <ProgressCharts />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Achievements</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <AchievementShowcase />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Challenges</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <UpcomingChallenges />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
