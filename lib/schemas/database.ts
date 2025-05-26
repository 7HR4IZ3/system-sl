import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  full_name: z.string().nullable(),
  username: z.string().nullable(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  level: z.number(),
  xp: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const userInsertSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  full_name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  level: z.number().optional(),
  xp: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const userUpdateSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  full_name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  level: z.number().optional(),
  xp: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const goalSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  progress: z.number(),
  due_date: z.string().nullable(),
  specific: z.string().nullable(),
  measurable: z.string().nullable(),
  achievable: z.string().nullable(),
  relevant: z.string().nullable(),
  time_bound: z.string().nullable(),
  completed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const goalInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  progress: z.number().optional(),
  due_date: z.string().nullable().optional(),
  specific: z.string().nullable().optional(),
  measurable: z.string().nullable().optional(),
  achievable: z.string().nullable().optional(),
  relevant: z.string().nullable().optional(),
  time_bound: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const goalUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.string().optional(),
  progress: z.number().optional(),
  due_date: z.string().nullable().optional(),
  specific: z.string().nullable().optional(),
  measurable: z.string().nullable().optional(),
  achievable: z.string().nullable().optional(),
  relevant: z.string().nullable().optional(),
  time_bound: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const taskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  goal_id: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.string(),
  due_date: z.string().nullable(),
  due_time: z.string().nullable(),
  completed: z.boolean(),
  xp: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const taskInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  goal_id: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: z.string(),
  due_date: z.string().nullable().optional(),
  due_time: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  xp: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const taskUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  goal_id: z.string().nullable().optional(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  priority: z.string().optional(),
  due_date: z.string().nullable().optional(),
  due_time: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  xp: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const habitSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  frequency: z.string(),
  days_of_week: z.array(z.string()),
  streak: z.number(),
  longest_streak: z.number(),
  xp_per_completion: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const habitInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  frequency: z.string(),
  days_of_week: z.array(z.string()),
  streak: z.number().optional(),
  longest_streak: z.number().optional(),
  xp_per_completion: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const habitUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.string().optional(),
  frequency: z.string().optional(),
  days_of_week: z.array(z.string()).optional(),
  streak: z.number().optional(),
  longest_streak: z.number().optional(),
  xp_per_completion: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const habitCompletionSchema = z.object({
  id: z.string(),
  habit_id: z.string(),
  user_id: z.string(),
  completed_date: z.string(),
  completed: z.boolean(),
  created_at: z.string(),
});


export const habitCompletionInsertSchema = z.object({
  id: z.string().optional(),
  habit_id: z.string(),
  user_id: z.string(),
  completed_date: z.string(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
});

export const habitCompletionUpdateSchema = z.object({
  id: z.string().optional(),
  habit_id: z.string().optional(),
  user_id: z.string().optional(),
  completed_date: z.string().optional(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  xp_reward: z.number(),
  created_at: z.string(),
});


export const achievementInsertSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  xp_reward: z.number().optional(),
  created_at: z.string().optional(),
});

export const achievementUpdateSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  xp_reward: z.number().optional(),
  created_at: z.string().optional(),
});

export const userAchievementSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  achievement_id: z.string(),
  progress: z.number(),
  completed: z.boolean(),
  completed_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const userAchievementInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  achievement_id: z.string(),
  progress: z.number().optional(),
  completed: z.boolean().optional(),
  completed_date: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const userAchievementUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  achievement_id: z.string().optional(),
  progress: z.number().optional(),
  completed: z.boolean().optional(),
  completed_date: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const friendSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  friend_id: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const friendInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  friend_id: z.string(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const friendUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  friend_id: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const challengeSchema = z.object({
  id: z.string(),
  creator_id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  reward: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


export const challengeInsertSchema = z.object({
  id: z.string().optional(),
  creator_id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  reward: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const challengeUpdateSchema = z.object({
  id: z.string().optional(),
  creator_id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  reward: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const challengeParticipantSchema = z.object({
  id: z.string(),
  challenge_id: z.string(),
  user_id: z.string(),
  joined_at: z.string(),
  completed: z.boolean(),
});


export const challengeParticipantInsertSchema = z.object({
  id: z.string().optional(),
  challenge_id: z.string(),
  user_id: z.string(),
  joined_at: z.string().optional(),
  completed: z.boolean().optional(),
});

export const challengeParticipantUpdateSchema = z.object({
  id: z.string().optional(),
  challenge_id: z.string().optional(),
  user_id: z.string().optional(),
  joined_at: z.string().optional(),
  completed: z.boolean().optional(),
});

export const activityFeedSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  activity_type: z.string(),
  content: z.string(),
  related_id: z.string().nullable(),
  created_at: z.string(),
});


export const activityFeedInsertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  activity_type: z.string(),
  content: z.string(),
  related_id: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export const activityFeedUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  activity_type: z.string().optional(),
  content: z.string().optional(),
  related_id: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export type ActivityFeed = z.infer<typeof activityFeedSchema>;
export type ChallengeParticipant = z.infer<typeof challengeParticipantSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Friend = z.infer<typeof friendSchema>;
export type UserAchievement = z.infer<typeof userAchievementSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type HabitCompletion = z.infer<typeof habitCompletionSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type User = z.infer<typeof userSchema>;