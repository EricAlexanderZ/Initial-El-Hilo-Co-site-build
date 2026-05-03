import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  // Only require HTTPS when the site is actually served over HTTPS
  const isHttps = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https") ?? false;
  response.cookies.set("ehc_admin", process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
