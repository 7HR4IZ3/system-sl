"use server";

import { createServerActionClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getAllChallenges() {
  const supabase = await createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      *,
      creator:creator_id(username, full_name),
      participants:challenge_participants(count)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching challenges:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createChallenge(formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const reward = Number.parseInt(formData.get("reward") as string);

  const { data, error } = await supabase
    .from("challenges")
    .insert({
      creator_id: session.user.id,
      title,
      description,
      category,
      start_date,
      end_date,
      reward,
    })
    .select();

  if (error) {
    console.error("Error creating challenge:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateChallenge(id: string, formData: FormData) {
  const supabase = await createServerActionClient({ cookies });

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const reward = Number.parseInt(formData.get("reward") as string);

  const { data, error } = await supabase
    .from("challenges")
    .update({
      title,
      description,
      category,
      start_date,
      end_date,
      reward,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating challenge:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteChallenge(id: string) {
  const supabase = await createServerActionClient({ cookies });

  const { error } = await supabase.from("challenges").delete().eq("id", id);

  if (error) {
    console.error("Error deleting challenge:", error);
    throw new Error(error.message);
  }

  return { success: true };
}
