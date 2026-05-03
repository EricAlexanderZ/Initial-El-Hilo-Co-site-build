"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productLinks } from "@/lib/navigation";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-black/10 md:hidden"
        aria-label="Open menu"
      >
        <span className="block h-0.5 w-5 bg-black" />
        <span className="block h-0.5 w-5 bg-black" />
        <span className="block h-0.5 w-3 bg-black" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[90vw] flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill className="object-contain" />
            </div>
            <span className="text-sm font-extrabold tracking-wide">EL HILO CO</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-sm"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav content */}
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Products</p>
          <div className="space-y-1">
            {productLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-[#f7f9fc]"
              >
                <div className="relative h-10 w-10 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <span className="font-semibold">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Account links */}
        <div className="border-t border-black/10 px-5 py-5 space-y-3">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block w-full rounded-full border border-black/10 py-2.5 text-center text-sm font-semibold transition hover:bg-gray-50"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="block w-full rounded-full bg-[#13294b] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0f1f39]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
