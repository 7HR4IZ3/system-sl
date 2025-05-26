import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GoalsHeader from "@/components/goals/goals-header";
import GoalsList from "@/components/goals/goals-list";
import GoalCategories from "@/components/goals/goal-categories";
import GoalInsights from "@/components/goals/goal-insights";

export default function GoalsPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <GoalsHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">All Goals</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}
              >
                <GoalsList />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Categories</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <GoalCategories />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Goal Insights</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <GoalInsights />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
