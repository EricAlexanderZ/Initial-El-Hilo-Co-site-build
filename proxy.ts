/*
 * Next 16 renamed the middleware file convention to `proxy`. Same runtime, same
 * matcher semantics; the file and the exported function are what changed, and
 * `middleware.ts` now logs a deprecation warning on every dev boot.
 *
 * The Supabase helper it calls still lives at utils/supabase/middleware, which
 * is that library's own path and is deliberately not renamed to match.
 */
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const COOKIE = "ehc_admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection (existing logic — unchanged)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
      return NextResponse.next();
    }
    const token = request.cookies.get(COOKIE)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!token || !secret || token !== secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Dashboard protection via Supabase session
  if (pathname.startsWith("/dashboard")) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*"],
};
