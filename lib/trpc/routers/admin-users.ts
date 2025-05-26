import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { getAllUsers, updateUserRole } from "@/lib/actions/admin-users";
import { TRPCError } from "@trpc/server";

export const adminUsersRouter = router({
  getAll: protectedProcedure.query(async () => {
    return getAllUsers();
  }),
  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(), // Assuming userId is a string
        isAdmin: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      return await updateUserRole(input.userId, input.isAdmin);
    }),
});
