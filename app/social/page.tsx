import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SocialHeader from "@/components/social/social-header";
import FriendsList from "@/components/social/friends-list";
import UpcomingChallenges from "@/components/social/upcoming-challenges";
import Leaderboard from "@/components/social/leaderboard";
import ActivityFeed from "@/components/social/activity-feed";

export default function SocialPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <SocialHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Activity Feed</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <ActivityFeed />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Challenges</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <UpcomingChallenges fullDisplay={true} />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Friends</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <FriendsList />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <Leaderboard />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
