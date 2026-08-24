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
    default: `${site.name} — Custom Embroidery in the Rio Grande Valley`,
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
    description: site.description,
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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
