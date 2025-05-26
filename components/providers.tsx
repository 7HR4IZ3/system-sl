"use client";

import type React from "react";
import { usePathname } from "next/navigation";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/trpc/client";

import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { GamificationProvider } from "@/components/gamification/gamification-provider";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/sidebar";
import { httpBatchLink } from "@trpc/client";
import { ConvexClientProvider } from "./convex/convex-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname.match("/(auth|onboarding)");

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <NotificationProvider>
              <GamificationProvider>
                <OnboardingProvider>
                  <div className="flex min-h-screen">
                    {showSidebar && <Sidebar />}
                    <div className="flex-1">{children}</div>
                    <Toaster />
                  </div>
                </OnboardingProvider>
              </GamificationProvider>
            </NotificationProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </api.Provider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
