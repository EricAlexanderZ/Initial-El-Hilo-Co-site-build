import { Suspense } from "react";
import type { Metadata } from "next";
import { TopBanner } from "@/components/site-header";
import { PromoHeader } from "@/components/promo/promo-header";
import { SiteFooter } from "@/components/site-footer";
import EverydayPoloClient from "./everyday-polo-client";

// Unlisted promo landing page for Meta ads. It is intentionally NOT linked from
// the nav or footer, and is excluded from search indexing — reachable only via
// the direct ad link (with its ?ref= attribution tag).
export const metadata: Metadata = {
  title: "The Everyday Work Polo — El Hilo Co",
  description:
    "Custom embroidered work polos for your company. Buy our Everyday Work Polo or bring your own garments — left chest logo, names, and more.",
  robots: { index: false, follow: false },
};

export default function EverydayWorkPoloPage() {
  return (
    <main className="min-h-dvh bg-[#f6f6f4] text-black">
      <TopBanner />
      <PromoHeader />
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center text-gray-400">
            Loading…
          </div>
        }
      >
        <EverydayPoloClient />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
