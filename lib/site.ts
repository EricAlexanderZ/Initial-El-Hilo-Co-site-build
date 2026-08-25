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
  /**
   * Meta description. Deliberately short: Google truncates around 155
   * characters in results, so this is the trimmed version of `longDescription`
   * rather than the whole thing.
   */
  description:
    "Custom embroidery in the Rio Grande Valley. Hats, polos, hoodies and sweaters for businesses, teams and schools, with free local pickup and delivery. No minimum order.",

  /**
   * The full description, kept word for word identical to the Google Business
   * Profile description. Used for the LocalBusiness schema, where there is room
   * for it and where matching the profile matters: two descriptions of the same
   * business that disagree are two things Google has to reconcile, and it is
   * one of the signals that decides whether the site and the profile are
   * treated as one entity.
   *
   * If the Business Profile text is ever edited, edit this to match.
   */
  longDescription:
    "El Hilo Co is a custom embroidery shop serving the Rio Grande Valley. We stitch hats, polos, hoodies and sweaters for businesses, teams, schools and events, with free local pickup and delivery across Palmview, Mission, McAllen, Edinburg and Pharr. There is no minimum order. One piece or two hundred, embroidery is priced per piece and the cost per piece falls as the quantity rises. Choose from ten cap styles, add front, side or back placement, and see your price before you order. Every job starts with a digital proof. Nothing is stitched until you approve it, and most orders finish within five to seven business days of approval. Orders are coordinated by appointment.",

  /**
   * Used for canonicals, the sitemap and JSON-LD, so it must be the exact host
   * that serves a 200.
   *
   * Verified 2026-08-17: the apex answers 307 and redirects here, so the www
   * host is the canonical one. Pointing canonicals at the apex would make every
   * single one a redirect hop.
   */
  url: "https://www.elhiloco.com",

  /**
   * Text only, by the owner's instruction. Rendered as an sms: link everywhere
   * so nobody dials a number that does not take calls.
   */
  phone: "(956) 332-3651",
  phoneE164: "+19563323651",
  smsHref: "sms:+19563323651",

  email: "orders@elhiloco.com",

  /**
   * Confirmed 2026-08-17: there is no storefront. El Hilo Co is a service-area
   * business, so this is city, region and country only — deliberately no
   * street address anywhere on the site or in the schema.
   *
   * That is the correct shape, not a gap. Publishing a home address for an SAB
   * is the common mistake: it exposes a private address and Google can suspend
   * a listing whose address does not match a staffed, visitable location.
   * `areaServed` in the LocalBusiness block is what carries the geography here.
   *
   * The Google Business Profile must be configured the same way — set as a
   * service-area business with the address hidden — or the profile and the site
   * disagree, which is exactly the inconsistency that weakens local ranking.
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
