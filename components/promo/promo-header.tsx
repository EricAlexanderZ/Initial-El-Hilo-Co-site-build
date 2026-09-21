import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

// Minimal header for promo landing pages: the wordmark only — no Products
// dropdown, no cart/auth — to keep the ad funnel focused.
export function PromoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-2 sm:py-3">
        <Link prefetch={false} href="/" aria-label="Brand First Merch home">
          <Wordmark className="h-14 sm:h-16" sizes="(min-width: 640px) 78px, 68px" priority />
        </Link>
      </div>
    </header>
  );
}
