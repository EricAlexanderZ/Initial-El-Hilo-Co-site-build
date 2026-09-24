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

  /*
   * Admin protection, pages and API alike.
   *
   * This previously read `if (pathname.startsWith("/admin"))` with a nested
   * exemption for "/api/admin/". That exemption could never be reached, because
   * "/api/admin/..." does not start with "/admin" — so every admin API route
   * fell through this function entirely and ran unauthenticated. Verified
   * against production on 2026-09-24: an unauthenticated PATCH to
   * /api/admin/orders/<id> reached Postgres. Anyone could change an order's
   * status, upload a proof, clone or archive.
   *
   * Both prefixes are now matched explicitly. The only public path is the login
   * page and the endpoint that serves it.
   */
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const isLogin =
      pathname === "/admin/login" ||
      pathname === "/api/admin/login" ||
      pathname === "/api/admin/logout";
    if (isLogin) return NextResponse.next();

    const token = request.cookies.get(COOKIE)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!token || !secret || token !== secret) {
      // An API caller gets 401 rather than a redirect to an HTML page, which a
      // fetch() cannot act on and which would surface as a confusing parse error.
      return isAdminApi
        ? NextResponse.json({ error: "Unauthorized." }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));
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
