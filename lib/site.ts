/**
 * Single source of truth for everything factual about the business.
 *
 * NAP (name, address, phone) consistency is the backbone of local SEO. Google
 * cross-references it against the Google Business Profile and directory
 * listings, and a mismatch anywhere weakens the whole domain. Declared once
 * here; every page, footer and JSON-LD block reads from this object. Never
 * hardcode these in a component.
 */

export const site = {
  name: "El Hilo Co",
  legalName: "El Hilo Co",
  tagline: "Custom embroidery in the Rio Grande Valley",
  description:
    "Custom embroidery for businesses, teams and events across the Rio Grande Valley. Hats, polos, hoodies and sweaters, stitched in house with free local pickup and delivery.",

  /**
   * Used for canonicals, the sitemap and JSON-LD, so it must be the exact host
   * that serves a 200. Verify with a real request before changing it.
   */
  url: "https://elhiloco.com",

  /**
   * Text only, by the owner's instruction. Rendered as an sms: link everywhere
   * so nobody dials a number that does not take calls.
   */
  phone: "(956) 332-3651",
  phoneE164: "+19563323651",
  smsHref: "sms:+19563323651",

  email: "orders@elhiloco.com",

  /**
   * ⚠️ PLACEHOLDER. El Hilo Co operates as a service-area business, so the
   * schema below uses `areaServed` rather than a storefront address. If a real
   * address is ever published it must match the Google Business Profile
   * character for character.
   */
  address: {
    locality: "Palmview",
    region: "TX",
    country: "US",
  },
} as const;

/**
 * Cities targeted for local search, in the order they matter commercially.
 *
 * Each one drives a blog post, a sitemap entry and an `areaServed` entry in the
 * LocalBusiness schema. `areaServed` is what justifies ranking outside the home
 * city, and the per-city pages are what actually rank for "embroidery in
 * <city>" — the phrasing RGV buyers really use alongside "near me".
 */
export type ServiceCity = {
  slug: string;
  name: string;
  county: string;
  /** Honest, human context. Used in copy; keep it true. */
  blurb: string;
};

export const serviceCities: ServiceCity[] = [
  {
    slug: "palmview",
    name: "Palmview",
    county: "Hidalgo County",
    blurb:
      "Our home base. Same-day proofs and free drop-off for Palmview businesses, schools and teams.",
  },
  {
    slug: "mission",
    name: "Mission",
    county: "Hidalgo County",
    blurb:
      "Minutes east on Expressway 83. Free pickup and delivery for Mission shops, clinics and school groups.",
  },
  {
    slug: "mcallen",
    name: "McAllen",
    county: "Hidalgo County",
    blurb:
      "The Valley's biggest commercial base, and our busiest route for corporate uniform runs.",
  },
  {
    slug: "edinburg",
    name: "Edinburg",
    county: "Hidalgo County",
    blurb:
      "University town work: club apparel, athletics, and staff polos for county offices.",
  },
  {
    slug: "pharr",
    name: "Pharr",
    county: "Hidalgo County",
    blurb:
      "Logistics and trade country. Durable embroidered workwear that survives a real shift.",
  },
];

export const cityNames = serviceCities.map((c) => c.name);

/** "Palmview, Mission, McAllen, Edinburg and Pharr" — for prose. */
export const cityList = `${cityNames.slice(0, -1).join(", ")} and ${cityNames[cityNames.length - 1]}`;

export function getCity(slug: string): ServiceCity | undefined {
  return serviceCities.find((c) => c.slug === slug);
}
