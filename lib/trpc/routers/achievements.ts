import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  getAllAchievements,
  getUserAchievements,
  updateAchievementProgress,
} from "@/lib/actions/achievements";
import { TRPCError } from "@trpc/server";

export const achievementsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getAllAchievements();
  }),
  getUser: protectedProcedure.query(async () => {
    return await getUserAchievements();
  }),
  updateProgress: protectedProcedure
    .input(
      z.object({
        achievementId: z.string(),
        progress: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await updateAchievementProgress(
        input.achievementId,
        input.progress,
      );
    }),
});
