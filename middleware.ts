import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const COOKIE = "ehc_admin";

export async function middleware(request: NextRequest) {
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
