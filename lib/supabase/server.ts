import type { Database } from "@/lib/supabase/database.types";

import { createServerClient } from "@supabase/ssr";
import { cookies as headerCookies } from "next/headers";

export async function createClient(
  cookieStore?: Awaited<ReturnType<typeof headerCookies>>,
) {
  cookieStore = cookieStore || (await headerCookies());

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function createServerActionClient({
  cookies,
}: {
  cookies?: () => ReturnType<typeof headerCookies>;
}) {
  return await createClient();
}
