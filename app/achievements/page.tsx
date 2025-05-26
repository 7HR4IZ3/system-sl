import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AchievementsHeader from "@/components/achievements/achievements-header";
import AchievementShowcase from "@/components/achievements/achievement-showcase";
import AchievementProgress from "@/components/achievements/achievement-progress";
import AchievementRewards from "@/components/achievements/achievement-rewards";

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <AchievementsHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">All Achievements</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}
              >
                <AchievementShowcase fullDisplay={true} />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Progress</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <AchievementProgress />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Rewards</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <AchievementRewards />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
