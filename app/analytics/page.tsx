import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsHeader from "@/components/analytics/analytics-header";
import ProgressOverview from "@/components/analytics/progress-overview";
import GoalCompletion from "@/components/analytics/goal-completion";
import HabitConsistency from "@/components/analytics/habit-consistency";
import ProductivityTrends from "@/components/analytics/productivity-trends";
import CategoryBreakdown from "@/components/analytics/category-breakdown";
import UserEngagement from "@/components/analytics/user-engagement";
import ConversionFunnels from "@/components/analytics/conversion-funnels";
import CohortAnalysis from "@/components/analytics/cohort-analysis";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <AnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
            <UserEngagement />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <section className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Progress Overview</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <ProgressOverview />
              </Suspense>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Goal Completion</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <GoalCompletion />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Productivity Trends</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <ProductivityTrends />
              </Suspense>
            </section>

            <Suspense
              fallback={<Skeleton className="h-96 w-full rounded-lg" />}
            >
              <ConversionFunnels />
            </Suspense>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Habit Consistency</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <HabitConsistency />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Category Breakdown</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <CategoryBreakdown />
              </Suspense>
            </section>
          </div>

          <div className="lg:col-span-3">
            <Suspense
              fallback={<Skeleton className="h-96 w-full rounded-lg" />}
            >
              <CohortAnalysis />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
