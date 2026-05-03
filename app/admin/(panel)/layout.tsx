"use client";

import { useState } from "react";
import AdminNav from "@/components/admin/admin-nav";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f0f1f3]">
      {/* Mobile top bar */}
      <div className="flex shrink-0 items-center gap-4 bg-[#13294b] px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[5px]"
          aria-label="Open menu"
        >
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
        </button>
        <p className="text-sm font-bold text-white">Admin Panel</p>
      </div>

      {/* Sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminNav open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
