import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "@/lib/actions/admin-achievements";
import { TRPCError } from "@trpc/server";

export const adminAchievementsRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await getAllAchievements();
  }),
  create: protectedProcedure
    .input(z.any()) // TODO: Define proper input schema with Zod
    .mutation(async ({ input }) => {
      return await createAchievement(input as any);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(), // Assuming id is a string
        formData: z.any(), // TODO: Define proper input schema with Zod
      }),
    )
    .mutation(async ({ input }) => {
      return await updateAchievement(input.id, input.formData as any);
    }),
  delete: protectedProcedure
    .input(z.string()) // Assuming id is a string
    .mutation(async ({ input }) => {
      return await deleteAchievement(input);
    }),
});
