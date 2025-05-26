"use server";

import { createServerActionClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getAllAchievements() {
  const supabase = await createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createAchievement(formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const icon = formData.get("icon");
  const xp_reward = Number.parseInt(formData.get("xp_reward") as string);

  const { data, error } = await supabase
    .from("achievements")
    .insert({
      title,
      description,
      category,
      icon,
      xp_reward,
    })
    .select();

  if (error) {
    console.error("Error creating achievement:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateAchievement(id: string, formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const icon = formData.get("icon");
  const xp_reward = Number.parseInt(formData.get("xp_reward") as string);

  const { data, error } = await supabase
    .from("achievements")
    .update({
      title,
      description,
      category,
      icon,
      xp_reward,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating achievement:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteAchievement(id: string) {
  const supabase = await createServerActionClient({ cookies });

  const { error } = await supabase.from("achievements").delete().eq("id", id);

  if (error) {
    console.error("Error deleting achievement:", error);
    throw new Error(error.message);
  }

  return { success: true };
}
