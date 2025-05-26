import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HabitsHeader from "@/components/habits/habits-header";
import HabitTracker from "@/components/habits/habit-tracker";
import HabitCalendar from "@/components/habits/habit-calendar";
import HabitStats from "@/components/habits/habit-stats";

export default function HabitsPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <HabitsHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Habit Tracker</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <HabitTracker />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Habit Calendar</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <HabitCalendar />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Habit Statistics</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <HabitStats />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
