import Link from "next/link";
import Image from "next/image";

// Minimal header for promo landing pages: logo only — no wordmark, no Products
// dropdown, no cart/auth — to keep the ad funnel focused.
export function PromoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-2 sm:py-3">
        <Link href="/" aria-label="El Hilo Co home">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <Image
              src="/images/home/elhilocologo.png"
              alt="El Hilo Co"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
