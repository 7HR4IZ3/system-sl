import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getHabitsWithCompletionForToday,
  getUserHabits,
  createHabit,
  markHabitCompletion,
  deleteHabit,
  getHabitCompletions,
} from "@/lib/actions/habits";
import { TRPCError } from "@trpc/server";

export const habitsRouter = router({
  getWithCompletionForToday: protectedProcedure.query(async () => {
    return getHabitsWithCompletionForToday();
  }),
  getUser: protectedProcedure.query(async () => {
    return getUserHabits();
  }),
  create: protectedProcedure
    .input(z.any()) // TODO: Define proper input schema with Zod for FormData
    .mutation(async ({ input }) => {
      // Note: Handling FormData directly in tRPC might require adjustments.
      // This is a placeholder.
      return await createHabit(input as any);
    }),
  markCompletion: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        completed: z.boolean(),
        path: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await markHabitCompletion(
        input.habitId,
        input.completed,
        input.path,
      );
    }),
  delete: protectedProcedure
    .input(z.string()) // Assuming habitId is a string
    .mutation(async ({ input }) => {
      return await deleteHabit(input);
    }),
  getCompletions: protectedProcedure
    .input(z.string()) // Assuming habitId is a string
    .query(async ({ input }) => {
      return getHabitCompletions(input);
    }),
});
