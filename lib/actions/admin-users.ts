"use server";

import { createServerActionClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getAllUsers() {
  const supabase = await createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateUserRole(userId: string, isAdmin: boolean) {
  const supabase = await createServerActionClient({ cookies });

  // In a real app, you would update a role field in the users table
  // For this example, we'll just show a success message

  return {
    success: true,
    message: `User role ${isAdmin ? "promoted to admin" : "demoted to user"}`,
  };
}
