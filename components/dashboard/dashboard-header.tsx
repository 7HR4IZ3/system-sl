"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/trpc/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

export default function DashboardHeader() {
  const router = useRouter();

  const {
    data: userStats,
    error: userStatsError,
    isLoading: userStatsLoading,
  } = api.user.getStats.useQuery();
  const {
    data: userProfile,
    error: userProfileError,
    isLoading: userProfileLoading,
  } = api.user.getProfile.useQuery();

  const xpForNextLevel = useMemo(() => {
    if (!userStats) return 0;
    return userStats.level * 100;
  }, [userStats]);

  if (!userStats || userStatsError || userProfileError) {
    router.push("/auth/login");
    return;
  }

  // Calculate XP progress
  const xpProgress = Math.min(
    100,
    xpForNextLevel > 0 ? Math.round((userStats.xp / xpForNextLevel) * 100) : 0
  );

  // Get initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left side: Welcome message and Avatar */}
          <div className="flex items-center gap-4">
            {userProfileLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={userProfile?.avatar_url ?? undefined}
                  alt={userProfile?.full_name ?? "User Avatar"}
                />
                <AvatarFallback>
                  {getInitials(userProfile?.full_name)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              {userProfileLoading ? (
                <>
                  <Skeleton className="h-7 w-48 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back,{" "}
                    {userProfile?.full_name?.split(" ")[0] || "User"}!
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to conquer your day?
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right side: Level and XP */}
          <div className="w-full sm:w-auto flex flex-col mt-4 sm:mt-0">
            {userStatsLoading ? (
              <>
                <Skeleton className="h-5 w-24 mb-2 self-end" />
                <div className="flex items-center gap-2 w-full sm:w-64">
                  <Skeleton className="h-2 flex-grow" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1 self-end">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">
                    Level {userStats.level} • {userStats.xp} XP
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-64">
                  <Progress value={xpProgress} className="h-2" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {userStats.xp}/{xpForNextLevel} XP
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
