"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if push notifications are supported
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      setIsSupported(true);

      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
          .getSubscription()
          .then((existingSubscription) => {
            setSubscription(existingSubscription);
            setIsSubscribed(!!existingSubscription);
          });
      });
    }
  }, []);

  const subscribeUser = async () => {
    if (!isSupported) {
      toast({
        title: "Push notifications not supported",
        description: "Your browser does not support push notifications.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      // Get public key from server
      const response = await fetch("/api/push-key");
      const { publicKey } = await response.json();

      // Subscribe the user
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      await fetch("/api/push-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription: pushSubscription }),
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);

      toast({
        title: "Notifications enabled",
        description: "You will now receive push notifications.",
      });
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      toast({
        title: "Subscription failed",
        description: "Could not enable push notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) return;

    setIsLoading(true);

    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe();

      // Remove subscription from server
      await fetch("/api/push-subscription", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });

      setSubscription(null);
      setIsSubscribed(false);

      toast({
        title: "Notifications disabled",
        description: "You will no longer receive push notifications.",
      });
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      toast({
        title: "Unsubscribe failed",
        description: "Could not disable push notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert base64 to Uint8Array
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribeUser,
    unsubscribeUser,
  };
}
