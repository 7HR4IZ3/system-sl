import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next//server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for the auth pages
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  // If user is signed in and trying to access auth page, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not signed in and trying to access protected pages, redirect to login
  if (!session && !isAuthPage && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
