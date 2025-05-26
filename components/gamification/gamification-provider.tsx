"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";
import { useToast } from "@/components/ui/use-toast";

type GamificationContextType = {
  level: number;
  xp: number;
  nextLevelXp: number;
  progress: number;
  badges: Badge[];
  rewards: Reward[];
  quests: Quest[];
  earnXp: (amount: number, reason?: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  purchaseReward: (rewardId: string) => Promise<void>;
  isLoading: boolean;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: string;
};

type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  unlocked: boolean;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  progress: number;
  total: number;
  deadline?: string;
};

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined,
);

// Helper function to calculate XP needed for next level
const calculateNextLevelXp = (level: number) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user gamification data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        setUserId(session.user.id);

        // Try to get user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("level, xp")
          .eq("id", session.user.id)
          .single();

        // Handle case where tables might not exist yet
        if (userError) {
          if (userError.message.includes("does not exist")) {
            console.warn(
              "Gamification tables don't exist yet. Using default values.",
            );
            setLevel(1);
            setXp(0);
            setNextLevelXp(100);
            setProgress(0);
            setBadges([]);
            setRewards([]);
            setQuests([]);
            setIsLoading(false);
            return;
          } else {
            throw userError;
          }
        }

        if (userData) {
          setLevel(userData.level || 1);
          setXp(userData.xp || 0);
          const nextXp = calculateNextLevelXp(userData.level || 1);
          setNextLevelXp(nextXp);
          setProgress(((userData.xp || 0) / nextXp) * 100);
        }

        // Load badges, rewards, and quests if tables exist
        try {
          // Try to load badges
          const { data: badgeData } = await supabase
            .from("user_badges")
            .select("*, badge:badges(*)")
            .eq("user_id", session.user.id);

          if (badgeData) {
            setBadges(
              badgeData.map((item) => ({
                id: item.badge.id,
                name: item.badge.name,
                description: item.badge.description,
                icon: item.badge.icon,
                rarity: item.badge.rarity,
                unlocked: item.unlocked,
                unlockedAt: item.unlocked_at,
              })),
            );
          }
        } catch (error) {
          console.warn("Badges table might not exist yet:", error);
        }

        try {
          // Try to load rewards
          const { data: rewardData } = await supabase
            .from("rewards")
            .select("*, user_rewards(*)")
            .eq("user_rewards.user_id", session.user.id);

          if (rewardData) {
            setRewards(
              rewardData.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                cost: item.cost,
                type: item.type,
                unlocked: item.user_rewards.length > 0,
              })),
            );
          }
        } catch (error) {
          console.warn("Rewards table might not exist yet:", error);
        }

        try {
          // Try to load quests
          const { data: questData } = await supabase
            .from("quests")
            .select("*, user_quests(*)")
            .eq("user_quests.user_id", session.user.id);

          if (questData) {
            setQuests(
              questData.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                xpReward: item.xp_reward,
                completed: item.user_quests[0]?.completed || false,
                progress: item.user_quests[0]?.progress || 0,
                total: item.total_steps,
                deadline: item.deadline,
              })),
            );
          }
        } catch (error) {
          console.warn("Quests table might not exist yet:", error);
        }
      } catch (error) {
        console.error("Error loading gamification data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [supabase]);

  // Earn XP function
  const earnXp = async (amount: number, reason?: string) => {
    if (!userId) return;

    const newXp = xp + amount;
    let newLevel = level;
    let newNextLevelXp = nextLevelXp;
    let didLevelUp = false;

    // Check if user leveled up
    if (newXp >= nextLevelXp) {
      newLevel = level + 1;
      newNextLevelXp = calculateNextLevelXp(newLevel);
      didLevelUp = true;
    }

    // Update local state
    setXp(newXp);
    setLevel(newLevel);
    setNextLevelXp(newNextLevelXp);
    setProgress((newXp / newNextLevelXp) * 100);

    // Try to update in database if it exists
    try {
      const { error } = await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel })
        .eq("id", userId);

      if (error && !error.message.includes("does not exist")) {
        console.error("Error updating XP:", error);
      }
    } catch (error) {
      console.warn("Could not update XP in database:", error);
    }

    // Show toast notification
    toast({
      title: reason || "XP Earned!",
      description: `+${amount} XP${didLevelUp ? ` • Level up to ${newLevel}!` : ""}`,
      variant: didLevelUp ? "default" : "success",
    });

    // If leveled up, show level up notification
    if (didLevelUp) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}!`,
        variant: "default",
      });
    }
  };

  // Complete quest function
  const completeQuest = async (questId: string) => {
    if (!userId) return;

    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    // Update local state
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, completed: true, progress: q.total } : q,
      ),
    );

    // Award XP
    await earnXp(quest.xpReward, `Quest Completed: ${quest.title}`);

    // Try to update in database if it exists
    try {
      const { error } = await supabase
        .from("user_quests")
        .update({ completed: true, progress: quest.total })
        .eq("quest_id", questId)
        .eq("user_id", userId);

      if (error && !error.message.includes("does not exist")) {
        console.error("Error completing quest:", error);
      }
    } catch (error) {
      console.warn("Could not update quest in database:", error);
    }
  };

  // Purchase reward function
  const purchaseReward = async (rewardId: string) => {
    if (!userId) return;

    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || reward.unlocked) return;

    // Check if user has enough XP
    if (xp < reward.cost) {
      toast({
        title: "Not enough XP",
        description: `You need ${reward.cost - xp} more XP to purchase this reward.`,
        variant: "destructive",
      });
      return;
    }

    // Update local state
    setXp((prev) => prev - reward.cost);
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, unlocked: true } : r)),
    );

    // Try to update in database if it exists
    try {
      // Begin transaction
      const { error: xpError } = await supabase
        .from("users")
        .update({ xp: xp - reward.cost })
        .eq("id", userId);

      if (xpError && !xpError.message.includes("does not exist")) {
        console.error("Error updating XP:", xpError);
        return;
      }

      const { error: rewardError } = await supabase
        .from("user_rewards")
        .insert({
          user_id: userId,
          reward_id: rewardId,
          purchased_at: new Date().toISOString(),
        });

      if (rewardError && !rewardError.message.includes("does not exist")) {
        console.error("Error purchasing reward:", rewardError);
        return;
      }
    } catch (error) {
      console.warn("Could not update reward in database:", error);
    }

    // Show toast notification
    toast({
      title: "Reward Purchased!",
      description: `You've unlocked: ${reward.name}`,
      variant: "success",
    });
  };

  const value = {
    level,
    xp,
    nextLevelXp,
    progress,
    badges,
    rewards,
    quests,
    earnXp,
    completeQuest,
    purchaseReward,
    isLoading,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider",
    );
  }
  return context;
};
