"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import type { Database } from "@/lib/supabase/database.types";

type OnboardingStep = "welcome" | "profile" | "goals" | "habits" | "complete";

type OnboardingContextType = {
  currentStep: OnboardingStep;
  isCompleted: boolean;
  isLoading: boolean;
  goToStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "profile",
  "goals",
  "habits",
  "complete",
];

// Local storage keys
const LS_ONBOARDING_STEP = "levelup_onboarding_step";
const LS_ONBOARDING_COMPLETED = "levelup_onboarding_completed";

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // First check local storage
        const storedStep = localStorage.getItem(
          LS_ONBOARDING_STEP,
        ) as OnboardingStep | null;
        const storedCompleted =
          localStorage.getItem(LS_ONBOARDING_COMPLETED) === "true";

        if (storedStep && ONBOARDING_STEPS.includes(storedStep)) {
          setCurrentStep(storedStep);
        }

        if (storedCompleted) {
          setIsCompleted(true);
        }

        // Then try to get from database if user is logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsLoading(false);
          setUseLocalStorage(true);
          return;
        }

        setUserId(session.user.id);

        // Try to get user data
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.warn("Error fetching user data:", error);
            setUseLocalStorage(true);
          } else if (userData) {
            // Check if the database has onboarding fields
            try {
              // We'll try to update with a test value to see if the columns exist
              const { error: updateError } = await supabase
                .from("users")
                .update({
                  // TypeScript might complain about these fields not existing
                  // @ts-ignore
                  onboarding_step: currentStep,
                  // @ts-ignore
                  onboarding_completed: isCompleted,
                })
                .eq("id", session.user.id);

              // If we get a specific error about columns not existing, use local storage
              if (
                updateError &&
                (updateError.message.includes("column") ||
                  updateError.message.includes("does not exist") ||
                  updateError.message.includes("schema cache"))
              ) {
                console.warn(
                  "Onboarding columns don't exist in users table, using local storage",
                );
                setUseLocalStorage(true);
              }
            } catch (e) {
              console.warn("Error checking onboarding columns:", e);
              setUseLocalStorage(true);
            }
          }
        } catch (error) {
          console.warn("Error checking user data:", error);
          setUseLocalStorage(true);
        }

        // Check if user is new and should be redirected to onboarding
        const isInOnboardingFlow = pathname?.startsWith("/onboarding");
        const shouldStartOnboarding =
          !isCompleted &&
          !isInOnboardingFlow &&
          pathname !== "/auth/login" &&
          pathname !== "/auth/register" &&
          pathname !== "/auth/reset-password";

        if (shouldStartOnboarding) {
          router.push("/onboarding/welcome");
        }

        // If we're in the onboarding flow, update the current step based on the URL
        if (isInOnboardingFlow) {
          const pathStep = pathname?.split("/").pop() as OnboardingStep;
          if (ONBOARDING_STEPS.includes(pathStep)) {
            setCurrentStep(pathStep);
            // Update local storage
            localStorage.setItem(LS_ONBOARDING_STEP, pathStep);
          }
        }
      } catch (error) {
        console.error("Error in onboarding check:", error);
        setUseLocalStorage(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [supabase, router, pathname]);

  // Go to specific step
  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
    router.push(`/onboarding/${step}`);

    // Always update local storage
    localStorage.setItem(LS_ONBOARDING_STEP, step);

    // Try to update in database if possible
    if (userId && !useLocalStorage) {
      try {
        supabase
          .from("users")
          .update({
            // @ts-ignore - TypeScript might complain about these fields
            onboarding_step: step,
          })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) {
              console.warn(
                "Could not update onboarding step in database:",
                error,
              );
              setUseLocalStorage(true);
            }
          });
      } catch (error) {
        console.warn("Error updating onboarding step:", error);
        setUseLocalStorage(true);
      }
    }
  };

  // Go to next step
  const nextStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentIndex + 1];
      goToStep(nextStep);
    }
  };

  // Go to previous step
  const prevStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = ONBOARDING_STEPS[currentIndex - 1];
      goToStep(prevStep);
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    setIsCompleted(true);

    // Always update local storage
    localStorage.setItem(LS_ONBOARDING_COMPLETED, "true");

    // Try to update in database if possible
    if (userId && !useLocalStorage) {
      try {
        const { error } = await supabase
          .from("users")
          .update({
            // @ts-ignore - TypeScript might complain about these fields
            onboarding_completed: true,
            onboarding_step: "complete",
          })
          .eq("id", userId);

        if (error) {
          console.warn(
            "Could not update onboarding status in database:",
            error,
          );
          setUseLocalStorage(true);
        }
      } catch (error) {
        console.warn("Error completing onboarding:", error);
        setUseLocalStorage(true);
      }
    }

    // Redirect to dashboard
    router.push("/");
  };

  // Skip onboarding
  const skipOnboarding = () => {
    setIsCompleted(true);
    localStorage.setItem(LS_ONBOARDING_COMPLETED, "true");

    // Try to update in database if possible
    if (userId && !useLocalStorage) {
      try {
        supabase
          .from("users")
          .update({
            // @ts-ignore - TypeScript might complain about these fields
            onboarding_completed: true,
          })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) {
              console.warn(
                "Could not update onboarding status in database:",
                error,
              );
            }
          });
      } catch (error) {
        console.warn("Error skipping onboarding:", error);
      }
    }

    router.push("/");
  };

  const value = {
    currentStep,
    isCompleted,
    isLoading,
    goToStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
