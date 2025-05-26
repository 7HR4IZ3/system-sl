import { router } from "./trpc";
import { achievementsRouter } from "./routers/achievements";
import { adminAchievementsRouter } from "./routers/admin-achievements";
import { adminChallengesRouter } from "./routers/admin-challenges";
import { adminUsersRouter } from "./routers/admin-users";
import { habitsRouter } from "./routers/habits";
import { notificationsRouter } from "./routers/notifications";
import { socialRouter } from "./routers/social";
import { userRouter } from "./routers/user";

export const appRouter = router({
  achievements: achievementsRouter,
  adminAchievements: adminAchievementsRouter,
  adminChallenges: adminChallengesRouter,
  adminUsers: adminUsersRouter,
  habits: habitsRouter,
  notifications: notificationsRouter,
  social: socialRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
