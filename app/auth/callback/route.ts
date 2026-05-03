import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Validate the `next` redirect target so an attacker cannot craft a link like
 *   /auth/callback?code=...&next=//evil.com
 * and redirect the user off-site after they authenticate.
 * Rules: must start with "/", must not start with "//", must not contain
 * a colon early in the path (protocol-relative attacks).
 */
function sanitizeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return "/dashboard";
  if (trimmed.startsWith("//")) return "/dashboard";
  if (/^\/[^/]*:/.test(trimmed)) return "/dashboard";
  return trimmed;
}

export async function GET(request: Request) {
  // `origin` comes directly from the request URL — correct for both dev and prod.
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));

  if (!code) {
    // No code present — redirect to login with a generic error flag.
    // Do not leak any details about why the callback failed.
    return NextResponse.redirect(`${origin}/auth/login?error=callback`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Exchange failed — redirect to login with a generic error flag.
  // Do not expose the underlying Supabase error message.
  return NextResponse.redirect(`${origin}/auth/login?error=callback`);
}
