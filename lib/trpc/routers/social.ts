import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getUserFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getSuggestedFriends,
  getActivityFeed,
} from "@/lib/actions/social";
import { TRPCError } from "@trpc/server";

export const socialRouter = router({
  getUserFriends: protectedProcedure.query(async () => {
    return getUserFriends();
  }),
  getFriendRequests: protectedProcedure.query(async () => {
    return getFriendRequests();
  }),
  sendFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await sendFriendRequest(input);
    }),
  acceptFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await acceptFriendRequest(input);
    }),
  rejectFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await rejectFriendRequest(input);
    }),
  getSuggestedFriends: protectedProcedure
    .input(z.number().optional())
    .query(async ({ input }) => {
      return getSuggestedFriends(input);
    }),
  getActivityFeed: protectedProcedure.query(async () => {
    return getActivityFeed();
  }),
});
