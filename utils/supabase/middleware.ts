import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Validate a redirect path so we never store a protocol-relative or
 * off-site URL in the ?redirect query param.
 * Rules: must start with "/", must not start with "//", must not contain
 * a colon early in the path segment.
 */
function sanitizeRedirect(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return "/dashboard";
  if (trimmed.startsWith("//")) return "/dashboard";
  if (/^\/[^/]*:/.test(trimmed)) return "/dashboard";
  return trimmed;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // Sanitize the pathname before storing it as the post-login redirect
    // target to prevent open-redirect attacks via a crafted URL.
    url.searchParams.set(
      "redirect",
      sanitizeRedirect(request.nextUrl.pathname)
    );
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
