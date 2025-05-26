import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TasksHeader from "@/components/tasks/tasks-header";
import TasksCalendar from "@/components/tasks/tasks-calendar";
import TasksList from "@/components/tasks/tasks-list";
import TasksStats from "@/components/tasks/tasks-stats";

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <TasksHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Calendar View</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <TasksCalendar />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Task List</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <TasksList />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Task Statistics</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <TasksStats />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
