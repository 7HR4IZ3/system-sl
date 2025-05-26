import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
  getUnreadNotificationCount,
} from "@/lib/actions/notifications";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  getUser: protectedProcedure.query(async () => {
    return getUserNotifications();
  }),
  markAsRead: protectedProcedure
    .input(z.string()) // Assuming notificationId is a string
    .mutation(async ({ input }) => {
      return await markNotificationAsRead(input);
    }),
  markAllAsRead: protectedProcedure.mutation(async () => {
    return await markAllNotificationsAsRead();
  }),
  delete: protectedProcedure
    .input(z.string()) // Assuming notificationId is a string
    .mutation(async ({ input }) => {
      return await deleteNotification(input);
    }),
  create: protectedProcedure // Assuming createNotification is intended for internal/server use, but exposing via tRPC for completeness
    .input(
      z.object({
        userId: z.string(),
        type: z.string(),
        title: z.string(),
        message: z.string(),
        relatedId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await createNotification(input);
    }),
  getUnreadCount: protectedProcedure.query(async () => {
    return getUnreadNotificationCount();
  }),
});
