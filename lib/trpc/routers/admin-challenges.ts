import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "@/lib/actions/admin-challenges";
import { TRPCError } from "@trpc/server";

export const adminChallengesRouter = router({
  getAll: protectedProcedure.query(async () => {
    return getAllChallenges();
  }),
  create: protectedProcedure
    .input(z.any()) // TODO: Define proper input schema with Zod
    .mutation(async ({ input }) => {
      // Note: Handling FormData directly in tRPC might require adjustments
      // depending on how you plan to pass form data from the client.
      // This is a placeholder.
      return await createChallenge(input as any);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(), // Assuming id is a string
        formData: z.any(), // TODO: Define proper input schema with Zod
      }),
    )
    .mutation(async ({ input }) => {
      // Note: Handling FormData directly in tRPC might require adjustments.
      // This is a placeholder.
      return await updateChallenge(input.id, input.formData as any);
    }),
  delete: protectedProcedure
    .input(z.string()) // Assuming id is a string
    .mutation(async ({ input }) => {
      return await deleteChallenge(input);
    }),
});
