import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// SECURITY: Only POST is accepted.  A GET handler here would allow an attacker
// to sign users out via a simple <img src="/auth/signout"> tag (CSRF via GET).
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Redirect to the site root using the request's own origin so this works
  // in all environments (localhost, staging, production) without hard-coded
  // URLs or reliance on env vars.
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`, { status: 302 });
}
