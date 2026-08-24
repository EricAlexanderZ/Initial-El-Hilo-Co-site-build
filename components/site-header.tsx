"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { productLinks } from "@/lib/navigation";
import CartNavLink from "@/components/cart/cart-nav-link";
import { createClient } from "@/utils/supabase/client";

/**
 * Rotating announcement bar.
 *
 * Every message is present in the markup and hidden with opacity rather than
 * swapped in and out of state, so all of them are in the HTML a crawler sees and
 * the bar reads correctly before hydration.
 */
const ANNOUNCEMENTS: { lead: string; rest: string; sms?: boolean }[] = [
  { lead: "Free local pickup & delivery", rest: "on every order across the RGV" },
  { lead: "Text only", rest: "(956) 332-3651", sms: true },
  { lead: "Premium custom embroidery", rest: "with fast turnaround" },
];

const ROTATE_MS = 3000;

export function TopBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Honour a reduced-motion preference by simply not rotating.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    /*
      Navy rather than the old yellow-with-black. Black on #ffd84d is high
      contrast but reads cheap, and a light bar above a white header has nothing
      to push against. A dark band at the very top of the page separates cleanly
      from the header beneath it and lets the gold carry the emphasis.
    */
    <div
      className="bg-[#13294b] px-4 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        Every message is absolutely positioned, including the visible one, and
        the container holds its own height.

        The previous version left the active message in normal flow and only the
        inactive ones absolute, so each swap moved an element between positioning
        modes and the text visibly jumped. Keeping all three out of flow means
        nothing reflows and the change is purely a crossfade.
      */}
      <div className="relative mx-auto min-h-11 w-full max-w-7xl">
        {ANNOUNCEMENTS.map((item, i) => {
          const active = i === index;
          const body = (
            <span className="flex flex-wrap items-center justify-center gap-x-2 text-center text-[13px] leading-tight sm:text-sm">
              <span className="font-extrabold uppercase tracking-[0.08em] text-[#ffd84d]">
                {item.lead}
              </span>
              <span className="font-medium text-white/90">{item.rest}</span>
            </span>
          );
          return (
            <div
              key={item.lead}
              aria-hidden={!active}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {item.sms ? (
                // Opens a text, not a call, so nobody dials a number that only
                // accepts messages.
                <a
                  href="sms:+19563323651"
                  className="flex h-full w-full items-center justify-center px-4 transition hover:brightness-110"
                >
                  {body}
                </a>
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4">{body}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          (user.user_metadata?.full_name as string | undefined) ??
          user.email ??
          "";
        setUserInitial(name.charAt(0).toUpperCase());
      } else {
        setUserInitial(null);
      }
      setAuthLoaded(true);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          (session.user.user_metadata?.full_name as string | undefined) ??
          session.user.email ??
          "";
        setUserInitial(name.charAt(0).toUpperCase());
      } else {
        setUserInitial(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // User avatar circle linking to dashboard
  const UserAvatar = () => (
    <Link prefetch={false}
      href="/dashboard"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#13294b] text-sm font-bold text-white transition hover:opacity-80"
      aria-label="Go to dashboard"
    >
      {userInitial}
    </Link>
  );

  // Login link (shown when logged out)
  const LoginLink = ({
    className,
    onClick,
  }: {
    className: string;
    onClick?: () => void;
  }) => (
    <Link prefetch={false} href="/auth/login" className={className} onClick={onClick}>
      Login
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">

      {/* ── Mobile header ── */}
      <div className="relative flex items-center justify-between px-4 py-5 md:hidden">
        {/* Hamburger — left */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex flex-col gap-[5px] p-1"
        >
          <span className="block h-[2px] w-6 bg-black" />
          <span className="block h-[2px] w-6 bg-black" />
          <span className="block h-[2px] w-6 bg-black" />
        </button>

        {/* Logo — center */}
        <Link prefetch={false} href="/" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative h-16 w-16">
            <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill sizes="64px" className="object-contain" />
          </div>
        </Link>

        {/* Cart — right */}
        <CartNavLink />
      </div>

      {/* ── Desktop header ── */}
      <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 md:flex">
        <Link prefetch={false} href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill sizes="64px" className="object-contain" />
          </div>
          <span className="text-lg font-extrabold tracking-wide">EL HILO CO</span>
        </Link>

        <nav className="flex items-center gap-8">
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-[#13294b]">
              Products <span>▾</span>
            </button>
            <div className="invisible absolute left-0 top-full mt-3 w-[320px] rounded-[1.75rem] border border-black/10 bg-white p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="space-y-2">
                {productLinks.map((item) => (
                  <Link prefetch={false}
                    key={item.name}
                    href={item.href}
                    className="group/item flex items-center gap-4 rounded-2xl p-3 transition duration-200 hover:bg-[#f7f9fc]"
                  >
                    <div className="relative h-16 w-16 transition duration-200 group-hover/item:scale-105">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain" />
                    </div>
                    <p className="text-base font-bold text-black transition group-hover/item:text-[#13294b]">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-5">
          <CartNavLink />
          {/* Auth state — desktop */}
          {!authLoaded ? (
            // Placeholder to avoid layout shift while auth loads
            <span className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
          ) : userInitial ? (
            <UserAvatar />
          ) : (
            <>
              <LoginLink className="text-sm font-medium hover:text-[#13294b]" />
              <Link prefetch={false}
                href="/auth/signup"
                className="rounded-full bg-[#13294b] px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:bg-[#0f1f39]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile drawer (slides from left) ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/images/home/elhilocologo.png" alt="El Hilo Co" fill sizes="64px" className="object-contain" />
            </div>
            <span className="text-sm font-extrabold tracking-wide">EL HILO CO</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="text-lg text-gray-400"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Products</p>
          <div className="space-y-1">
            {productLinks.map((item) => (
              <Link prefetch={false}
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-[#f7f9fc]"
              >
                <div className="relative h-10 w-10 shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain" />
                </div>
                <span className="font-semibold">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* The local guides are the pages chasing "embroidery in <city>", so
              they need a real link rather than only a sitemap entry. */}
          <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            Learn
          </p>
          <div className="space-y-1">
            <Link prefetch={false}
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl p-3 font-semibold transition hover:bg-[#f7f9fc]"
            >
              Embroidery Guides
            </Link>
            <Link prefetch={false}
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl p-3 font-semibold transition hover:bg-[#f7f9fc]"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Auth state — mobile drawer */}
        <div className="space-y-3 border-t border-black/10 px-5 py-5">
          {!authLoaded ? (
            <div className="h-10 animate-pulse rounded-full bg-gray-100" />
          ) : userInitial ? (
            <Link prefetch={false}
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-3 rounded-full border border-[#13294b]/20 py-2.5 px-4 text-sm font-semibold text-[#13294b] transition hover:bg-[#f7f9fc]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#13294b] text-xs font-bold text-white">
                {userInitial}
              </span>
              My Dashboard
            </Link>
          ) : (
            <>
              <LoginLink
                className="block w-full rounded-full border border-black/10 py-2.5 text-center text-sm font-semibold transition hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              />
              <Link prefetch={false}
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full bg-[#13294b] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0f1f39]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
