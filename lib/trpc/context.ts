import { createServerActionClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function createContext() {
  const supabase = await createServerActionClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    supabase,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
