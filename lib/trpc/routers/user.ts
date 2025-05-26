import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  getUserStats,
  calculateXpForNextLevel,
} from "@/lib/actions/user";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getProfile: protectedProcedure.query(async () => {
    return getUserProfile();
  }),
  updateProfile: protectedProcedure
    .input(z.any()) // TODO: Define proper input schema with Zod for FormData
    .mutation(async ({ input }) => {
      // Note: Handling FormData directly in tRPC might require adjustments.
      // This is a placeholder.
      return await updateUserProfile(input as any);
    }),
  updateAvatar: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await updateAvatar(input);
    }),
  getStats: protectedProcedure.query(async () => {
    return getUserStats();
  }),
  calculateXpForNextLevel: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return calculateXpForNextLevel(input);
    }),
});
