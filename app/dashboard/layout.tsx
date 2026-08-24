import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconPackage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconLogOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <IconHome /> },
  { label: "Orders", href: "/dashboard/orders", icon: <IconPackage /> },
  { label: "Profile", href: "/dashboard/profile", icon: <IconUser /> },
  { label: "Artwork", href: "/dashboard/artwork", icon: <IconImage /> },
  { label: "Addresses", href: "/dashboard/addresses", icon: <IconMapPin /> },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const displayName =
    user.user_metadata?.full_name ?? user.email ?? "Account";
  const firstName = displayName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-dvh bg-[#f6f6f4]">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/10 bg-white md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-black/10 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#13294b] text-sm font-extrabold text-white">
            EH
          </div>
          <Link prefetch={false} href="/" className="text-sm font-extrabold tracking-wide text-[#13294b] hover:opacity-80">
            El Hilo Co
          </Link>
        </div>

        {/* User info */}
        <div className="border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#13294b]/10 text-sm font-bold text-[#13294b]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link prefetch={false}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-[#f6f6f4] hover:text-[#13294b] [&.active]:bg-[#13294b] [&.active]:text-white"
                >
                  <span className="opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign out */}
        <div className="border-t border-black/10 px-3 py-4">
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <IconLogOut />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-4 md:hidden">
          <Link prefetch={false} href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#13294b] text-xs font-extrabold text-white">
              EH
            </div>
            <span className="text-sm font-bold text-[#13294b]">Dashboard</span>
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13294b] text-sm font-bold text-white">
            {initial}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="flex border-t border-black/10 bg-white md:hidden">
          {navItems.map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium text-gray-500 transition hover:text-[#13294b]"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
