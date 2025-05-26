export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          level: number;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          progress: number;
          due_date: string | null;
          specific: string | null;
          measurable: string | null;
          achievable: string | null;
          relevant: string | null;
          time_bound: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          progress?: number;
          due_date?: string | null;
          specific?: string | null;
          measurable?: string | null;
          achievable?: string | null;
          relevant?: string | null;
          time_bound?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          progress?: number;
          due_date?: string | null;
          specific?: string | null;
          measurable?: string | null;
          achievable?: string | null;
          relevant?: string | null;
          time_bound?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string | null;
          title: string;
          description: string | null;
          priority: string;
          due_date: string | null;
          due_time: string | null;
          completed: boolean;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id?: string | null;
          title: string;
          description?: string | null;
          priority: string;
          due_date?: string | null;
          due_time?: string | null;
          completed?: boolean;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: string;
          due_date?: string | null;
          due_time?: string | null;
          completed?: boolean;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          frequency: string;
          days_of_week: string[];
          streak: number;
          longest_streak: number;
          xp_per_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          frequency: string;
          days_of_week: string[];
          streak?: number;
          longest_streak?: number;
          xp_per_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          frequency?: string;
          days_of_week?: string[];
          streak?: number;
          longest_streak?: number;
          xp_per_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          icon: string;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          icon: string;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          icon?: string;
          xp_reward?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          progress: number;
          completed: boolean;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          progress?: number;
          completed?: boolean;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          progress?: number;
          completed?: boolean;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string;
          category: string;
          start_date: string;
          end_date: string;
          reward: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description: string;
          category: string;
          start_date: string;
          end_date: string;
          reward?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string;
          category?: string;
          start_date?: string;
          end_date?: string;
          reward?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenge_participants: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          joined_at: string;
          completed: boolean;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          joined_at?: string;
          completed?: boolean;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          joined_at?: string;
          completed?: boolean;
        };
      };
      activity_feed: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          content: string;
          related_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          content: string;
          related_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          content?: string;
          related_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
