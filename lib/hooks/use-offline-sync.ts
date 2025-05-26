"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type OfflineData = {
  taskCompletions: Array<{ id: string; completed_at: string }>;
  habitCompletions: Array<{ habit_id: string; completed_at: string }>;
  goalUpdates: Array<{ id: string; current_value: number }>;
};

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Initialize offline storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we have offline data in localStorage
      const storedData = localStorage.getItem("offlineData");
      if (!storedData) {
        localStorage.setItem(
          "offlineData",
          JSON.stringify({
            taskCompletions: [],
            habitCompletions: [],
            goalUpdates: [],
          }),
        );
      }

      // Set up online/offline event listeners
      const handleOnline = () => {
        setIsOnline(true);
        syncOfflineData();
      };

      const handleOffline = () => {
        setIsOnline(false);
        toast({
          title: "You are offline",
          description:
            "Your changes will be saved locally and synced when you reconnect.",
          variant: "destructive",
        });
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Set initial online status
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [toast]);

  // Function to store offline data
  const storeOfflineData = (type: keyof OfflineData, data: any) => {
    if (typeof window !== "undefined") {
      const offlineData: OfflineData = JSON.parse(
        localStorage.getItem("offlineData") || "{}",
      );
      offlineData[type] = [...(offlineData[type] || []), data];
      localStorage.setItem("offlineData", JSON.stringify(offlineData));

      toast({
        title: "Saved offline",
        description: "This change will sync when you reconnect.",
      });
    }
  };

  // Function to sync offline data when back online
  const syncOfflineData = async () => {
    if (typeof window !== "undefined" && navigator.onLine) {
      const offlineData = JSON.parse(
        localStorage.getItem("offlineData") || "{}",
      );

      // Check if there's data to sync
      const hasData = Object.values(offlineData).some(
        (arr: any) => arr.length > 0,
      );

      if (hasData) {
        setIsSyncing(true);

        try {
          const response = await fetch("/api/cron/pwa-sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: offlineData }),
          });

          if (response.ok) {
            // Clear offline data after successful sync
            localStorage.setItem(
              "offlineData",
              JSON.stringify({
                taskCompletions: [],
                habitCompletions: [],
                goalUpdates: [],
              }),
            );

            toast({
              title: "Sync complete",
              description: "Your offline changes have been synchronized.",
            });
          } else {
            throw new Error("Failed to sync");
          }
        } catch (error) {
          toast({
            title: "Sync failed",
            description:
              "We couldn't sync your offline changes. Will try again later.",
            variant: "destructive",
          });
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };

  return {
    isOnline,
    isSyncing,
    storeOfflineData,
    syncOfflineData,
  };
}
