import { serviceCities, site, type ServiceCity } from "./site";

/**
 * Blog content, as data rather than MDX.
 *
 * Every post is a plain object, so titles, descriptions, dates and keywords are
 * all available to `generateMetadata` and to the sitemap without parsing files
 * at build time. Bodies are structured blocks rather than a markdown blob so
 * headings stay real `<h2>`s — heading structure is one of the few on-page
 * signals that still measurably matters for local queries.
 *
 * The strategy is a hub and spoke: one pillar post targeting "embroidery near
 * me" across the Valley, and one post per city targeting "embroidery in
 * <city>". Every spoke links back to the pillar and the pillar links out to
 * every spoke, which is what makes a small site rank for a spread of local
 * variations instead of competing with itself.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  /** Meta description. Keep near 155 characters. */
  description: string;
  /** ISO date. Drives sitemap lastmod and the Article schema. */
  date: string;
  updated?: string;
  readMinutes: number;
  /** Primary search phrases this post is written for. */
  keywords: string[];
  /** Set when the post targets one city, which links it to that city's data. */
  citySlug?: string;
  body: Block[];
};

const p = (text: string): Block => ({ kind: "p", text });
const h2 = (text: string): Block => ({ kind: "h2", text });
const ul = (items: string[]): Block => ({ kind: "ul", items });

/** Shared closing section so every post ends with a real call to action. */
function closing(where: string): Block[] {
  return [
    h2("How to get a quote"),
    p(
      `Text your logo and a rough quantity to ${site.phone} and we will come back with a price and a stitched proof. No account, no minimum order form to fill in first. If you would rather see the numbers yourself, the hat, polo, hoodie and sweater pages price live as you change quantity and placement.`
    ),
    p(
      `Pickup and delivery in ${where} is free. We handle the run to you, which for most orders is faster than shipping and removes the part where a box sits at a carrier depot over a weekend.`
    ),
  ];
}

const PILLAR: Post = {
  slug: "custom-embroidery-near-me-rio-grande-valley",
  title: "Custom Embroidery Near Me: A Straight Answer for the Rio Grande Valley",
  description:
    "What custom embroidery actually costs in the RGV, how long it takes, and what to send us. Serving Palmview, Mission, McAllen, Edinburg and Pharr.",
  date: "2026-08-17",
  readMinutes: 7,
  keywords: [
    "custom embroidery near me",
    "embroidery near me",
    "embroidery rio grande valley",
    "custom embroidery RGV",
    "embroidery shop near me",
  ],
  body: [
    p(
      "If you searched for embroidery near me, you probably want three things answered before you talk to anybody: what it costs, how long it takes, and whether your logo will actually look right. This post answers all three plainly, without making you fill in a form first."
    ),

    h2("What custom embroidery costs in the Valley"),
    p(
      "Embroidery is priced per piece, and the per-piece price falls as the quantity rises. That is not a sales tactic, it is how the machines work: the expensive part is setting up a design and threading the heads, and that cost spreads across the run. A dozen hats carries the same setup as a hundred, so a dozen costs more each."
    ),
    p(
      "The second thing that moves price is how many places you want stitched. A front logo is the base of any order. A left side, a right side or a back adds per piece, and a back with text costs less than a back with a full design because it is fewer stitches. 3D puff, where the thread sits raised off the cap, is an upcharge on top."
    ),
    p(
      "Our hat, polo, hoodie and sweater pages all quote live. Change the quantity and the number of placements and the price updates, so you can see the whole curve before you commit to anything."
    ),

    h2("How long it takes"),
    p(
      "A standard run is about five to seven business days from approved proof. Rush is possible and we will tell you honestly whether we can hit your date rather than take the order and hope. The clock starts when you approve the proof, not when you place the order, so the fastest thing you can do to speed up your own job is reply to the proof quickly."
    ),

    h2("What to send us"),
    ul([
      "Vector artwork if you have it: .AI, .EPS, or .PDF. This is ideal.",
      "A high-resolution PNG or JPG works. We can usually digitize from it.",
      "A photo of an existing shirt or a screenshot is enough to start a conversation.",
      "Thread colors, if you have brand colors you need matched.",
      "The rough quantity and which garment you have in mind.",
    ]),
    p(
      "Embroidery is thread, not ink, so very fine detail and thin lettering do not survive at small sizes. If your logo has either, we will tell you before we stitch it and suggest the smallest change that keeps it recognizable. That conversation is free and it is better to have it before a hundred hats exist."
    ),

    h2("Embroidery vs screen printing"),
    p(
      "Embroidery lasts longer, reads as more premium, and survives industrial laundry, which is why uniforms and caps are almost always stitched. Screen printing is cheaper per piece at high volume and handles photographic or many-color art that embroidery cannot. For polos, hats, jackets and anything a staff member wears daily, embroidery is usually the right call. For a hundred event tees with a big colorful front graphic, printing usually is."
    ),

    h2("Where we work"),
    p(
      `We are based in Palmview and cover ${serviceCities.map((c) => c.name).join(", ")} with free pickup and delivery. Each of those has its own page below with local specifics.`
    ),

    ...closing("the Valley"),
  ],
};

/** Per-city copy. Deliberately specific so the pages are not near-duplicates. */
const CITY_ANGLES: Record<
  string,
  { intro: string; who: string; local: string }
> = {
  palmview: {
    intro:
      "Palmview is home. If you are here, you are the shortest drive on our route and usually the fastest turnaround we can offer.",
    who: "Local restaurants and taquerias putting staff in embroidered polos, contractors who need durable caps that survive a job site, and school groups ordering team apparel.",
    local:
      "Because we are here, Palmview orders can often get a same-day proof and a next-day drop-off once artwork is approved. If you want to see thread colors against your logo in person before committing, that is easiest here.",
  },
  mission: {
    intro:
      "Mission is minutes east of us on Expressway 83, which makes it one of our simplest delivery runs and one of our most frequent.",
    who: "Clinics and dental offices ordering staff polos, citrus and agriculture businesses needing caps that hold up outdoors, and Mission CISD groups ordering team and club apparel.",
    local:
      "We deliver to Mission for free, including the business corridor along Conway and Shary. For multi-location businesses we can split a single run across sites so each location gets its own box.",
  },
  mcallen: {
    intro:
      "McAllen is the Valley's commercial center and our busiest route. Most of what we stitch for McAllen is uniform work: staff polos, branded caps, and outerwear that has to look consistent across a whole team.",
    who: "Retail and hospitality staff uniforms, real estate and insurance offices, medical practices, and corporate teams ordering branded apparel for events and conferences.",
    local:
      "We deliver free across McAllen including the 10th Street and Trenton corridors and the airport-area business parks. For recurring uniform orders we keep your digitized logo on file so reorders skip setup entirely and price out lower.",
  },
  edinburg: {
    intro:
      "Edinburg work skews toward organizations rather than single businesses: university groups, athletics, county offices and school programs.",
    who: "Student organizations and Greek life ordering club apparel, athletics and rec league teams, county and municipal staff needing consistent branded polos, and campus-adjacent businesses.",
    local:
      "We deliver free throughout Edinburg. Group orders where everyone pays individually are common here, and we can quote per person so a club treasurer is not fronting the whole cost.",
  },
  pharr: {
    intro:
      "Pharr is logistics and trade country, and the apparel has to match. Most Pharr orders are workwear that needs to survive a real shift, not look good in a photo.",
    who: "Warehouse and distribution crews, customs brokers and freight offices, trucking companies branding driver apparel, and trade businesses along the Cage and Jackson corridors.",
    local:
      "We deliver free across Pharr including the port district. For high-wear workwear we will steer you toward heavier garments and a denser stitch, which costs slightly more up front and lasts materially longer.",
  },
};

function cityPost(city: ServiceCity): Post {
  const angle = CITY_ANGLES[city.slug];
  return {
    slug: `custom-embroidery-${city.slug}-tx`,
    title: `Custom Embroidery in ${city.name}, TX`,
    description: `Custom embroidery for ${city.name} businesses, teams and schools. Hats, polos, hoodies and sweaters with free local pickup and delivery. Text ${site.phone}.`,
    date: "2026-08-17",
    readMinutes: 5,
    citySlug: city.slug,
    keywords: [
      `embroidery ${city.name} TX`,
      `custom embroidery ${city.name}`,
      `embroidery near me ${city.name}`,
      `custom hats ${city.name} TX`,
      `embroidered polos ${city.name}`,
    ],
    body: [
      p(angle.intro),

      h2(`Who we stitch for in ${city.name}`),
      p(angle.who),

      h2("What we make"),
      ul([
        "Custom hats: ten styles across OTTO and Pitbull Caps, structured and unstructured, with front, side and back placement.",
        "Embroidered polos for staff uniforms and daily wear.",
        "Hoodies and sweaters for teams, schools and cooler months.",
        "Left chest logos, sleeve marks, back designs and 3D puff.",
      ]),

      h2(`Free pickup and delivery in ${city.name}`),
      p(angle.local),

      h2("Pricing"),
      p(
        `Embroidery is priced per piece and the per-piece cost drops as quantity rises, because the setup cost spreads across the run. Placement matters too: a front logo is the base, and each additional side or back position adds per piece. Our product pages quote live, so you can see the price for your exact ${city.name} order before contacting anyone.`
      ),

      h2("Turnaround"),
      p(
        `Standard is five to seven business days from approved proof, and ${city.name} is on our regular delivery route so there is no shipping leg on the end. If you have a hard date, tell us up front and we will say honestly whether we can hit it.`
      ),

      ...closing(city.name),
    ],
  };
}

export const posts: Post[] = [PILLAR, ...serviceCities.map(cityPost)];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Newest first, for the index. */
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const PILLAR_SLUG = PILLAR.slug;
