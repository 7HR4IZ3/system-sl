import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from ".";

export const api = createTRPCReact<AppRouter>();
