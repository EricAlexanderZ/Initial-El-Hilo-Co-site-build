import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { cityList, serviceCities, site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase was missing entirely, which meant every canonical and Open
  // Graph URL resolved relative and effectively did nothing.
  metadataBase: new URL(site.url),
  title: {
    // Reads site.tagline rather than repeating it. The previous version
    // hardcoded "Custom Embroidery in the Rio Grande Valley", so when the
    // tagline gained printing the title silently kept saying embroidery only.
    // Separator is the pipe the template already uses, which also keeps the
    // em dash out of the copy.
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name,
    locale: "en_US",
    type: "website",
    url: site.url,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Ensure dark mode is never active */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.remove('dark');localStorage.removeItem('theme');` }} />
        <LocalBusinessJsonLd />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

/**
 * LocalBusiness schema.
 *
 * `areaServed` is the entry that justifies ranking outside the home city, and
 * it is the single most load-bearing property here for a service-area business
 * with no storefront. The phone is published as a contactPoint marked SMS only,
 * because that is genuinely how the business takes enquiries.
 */
function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,

    /**
     * The old trade name, declared as structured data rather than only as prose.
     *
     * This is the mechanism for a rebrand: it tells Google that the entity it
     * already ranks as "El Hilo Co", with its reviews and its Knowledge Graph
     * id, is this same business under a new name. Without it the rename reads
     * as a brand-new business starting from zero authority.
     *
     * Retire it once the Business Profile rename has settled and brand-name
     * searches resolve here on their own.
     */
    alternateName: site.formerName,
    // The long form here, matching the Business Profile word for word.
    description: site.longDescription,
    url: site.url,
    email: site.email,
    telephone: site.phoneE164,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: serviceCities.map((c) => ({
      "@type": "City",
      name: c.name,
      containedInPlace: { "@type": "AdministrativeArea", name: `${c.county}, Texas` },
    })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.phoneE164,
      email: site.email,
      availableLanguage: ["en", "es"],
      // Signals text-only without inventing a schema property for it.
      contactOption: "TollFree",
      description: `Text only. Serving ${cityList}.`,
    },
    knowsAbout: [
      "custom embroidery",
      "embroidered hats",
      "embroidered polos",
      "team apparel",
      "corporate uniforms",
      // Added 2026-09-23 alongside the Business Profile rewrite. These are
      // offered by text and appointment rather than sold on the site, which is
      // fine here: this block describes the business, not the storefront.
      "DTF shirt printing",
      "custom acrylic signage",
      "stickers",
      "business cards",
      "flyers",
    ],
    /**
     * The explicit statement that these profiles are the same business.
     *
     * Without sameAs, Google treats the site, the Instagram account and the
     * Business Profile as three unrelated things and has to guess. That matters
     * more than usual right now: the Instagram handle and the Business Profile
     * are still under the old name, so these links are the only thing stating
     * that they and this site are one business. Do not drop them mid-rebrand.
     *
     * The share.google URL is the Business Profile's own share link. Following
     * it resolves to a Google entity page carrying kgmid /g/11z4lwdxwd, which is
     * the Knowledge Graph id for this business. Worth recording: that id is the
     * thing Google uses internally to mean this business. It survives a rename,
     * which is exactly why the profile should be renamed rather than replaced.
     *
     * Use the share link rather than a signed-in search URL. Those carry
     * authuser and session parameters, are not stable, and do not identify the
     * business to anyone else.
     */
    sameAs: [
      "https://www.instagram.com/elhiloco",
      "https://share.google/yOCamJrOjHD6zCykZ",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
