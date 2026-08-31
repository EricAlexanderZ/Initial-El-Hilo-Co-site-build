/**
 * Stitch Depot pricing engine — single source of truth.
 *
 * Mirrors the client's pricing spreadsheet:
 *   per-hat = (blank cost x (1 + markup)) + sum of embroidery charges
 *   total   = per-hat x quantity
 *
 * Both the /hats configurator and POST /api/orders call quoteOrder(), so the
 * server never trusts a price sent by the browser.
 */

// ---------------------------------------------------------------------------
// Quantity tiers
// ---------------------------------------------------------------------------

export type PriceTier = {
  min:    number;
  max:    number;
  markup: number;  // multiplier applied to blank cost: 1.8 = 180%
  front:  number;  // front embroidery, per hat
  sideText: number;  // side/back embroidery, text only, per hat
  sideDesign: number;  // side design (logo/art), per hat
  puff:   number;  // 3D puff upcharge, per hat
};

export const PRICE_TIERS: PriceTier[] = [
  { min:   1, max:   3, markup: 1.80, front: 15.00, sideText: 7.00, sideDesign: 10.00, puff: 4.20 },
  { min:   4, max:   8, markup: 1.40, front: 13.00, sideText: 6.00, sideDesign:  9.50, puff: 4.00 },
  { min:   9, max:  11, markup: 1.00, front: 12.00, sideText: 5.00, sideDesign:  9.00, puff: 3.75 },
  { min:  12, max:  24, markup: 0.75, front: 10.00, sideText: 5.00, sideDesign:  8.50, puff: 3.50 },
  { min:  25, max:  49, markup: 0.60, front:  9.75, sideText: 4.75, sideDesign:  8.00, puff: 3.25 },
  { min:  50, max:  99, markup: 0.45, front:  9.50, sideText: 4.50, sideDesign:  7.50, puff: 3.00 },
  { min: 100, max: 149, markup: 0.30, front:  9.00, sideText: 4.00, sideDesign:  7.00, puff: 2.80 },
  { min: 150, max: 199, markup: 0.20, front:  8.50, sideText: 3.75, sideDesign:  6.50, puff: 2.50 },
  { min: 200, max: 999, markup: 0.10, front:  8.00, sideText: 3.50, sideDesign:  6.00, puff: 2.50 },
];

export const MIN_QUANTITY = PRICE_TIERS[0].min;
export const MAX_QUANTITY = PRICE_TIERS[PRICE_TIERS.length - 1].max;

/** Free shipping kicks in at 25 units (per the supplier terms). */
export const FREE_SHIPPING_QTY = 25;

export function getTier(quantity: number): PriceTier {
  const qty = clampQuantity(quantity);
  // Quantities above the top tier keep the best rate rather than falling through.
  return PRICE_TIERS.find((t) => qty >= t.min && qty <= t.max) ?? PRICE_TIERS[PRICE_TIERS.length - 1];
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.floor(quantity)));
}

// ---------------------------------------------------------------------------
// Blank hat catalog — wholesale cost per style
// ---------------------------------------------------------------------------

export type CapBrand = "OTTO" | "Pitbull Caps" | "Lonestar";

export type CapStyle = {
  id:        string;
  brand:     CapBrand;
  sku?:      string;
  name:      string;   // short label used in tab selectors
  fullName:  string;   // supplier's full product name
  blankCost: number;
  /**
   * Temporarily keep a style out of the storefront without deleting it.
   * `getStylesByBrand()` skips it, so it vanishes from the configurator's style
   * tabs. `getCapStyle()` still resolves it, so pricing and any in-flight order
   * keep working. Flip back to `false` / remove the flag to unhide.
   */
  hidden?:   boolean;
};

export const CAP_STYLES: CapStyle[] = [
  // OTTO — grouped under one page, one tab per style
  { id: "otto-5-panel-aframe",  brand: "OTTO", name: "5 Panel Mid Profile (A-Frame)", fullName: "OTTO CAP 5 Panel Mid Profile Baseball Cap (A FRAME)",     blankCost: 4.55 },
  { id: "otto-5-panel-pro",     brand: "OTTO", name: "5 Panel Pro Style",             fullName: "OTTO CAP 5 Panel Pro Style Baseball Cap",                  blankCost: 5.10 },
  { id: "otto-6-panel-dad",     brand: "OTTO", name: "6 Panel Low Profile Dad Hat",   fullName: "OTTO CAP 6 Panel Low Profile Dad Hat",                     blankCost: 5.35 },
  { id: "otto-6-panel-trucker", brand: "OTTO", name: "6 Panel Mesh Back Trucker",     fullName: "OTTO CAP 6 Panel Mid Profile Mesh Back Trucker Hat",       blankCost: 4.10 },

  // Pitbull Caps
  { id: "pb311",  brand: "Pitbull Caps", sku: "PB311",  name: "Hybrid 5 Panel Perforated Rope", fullName: "PB311 Hybrid 5 Panel Perforated Rope",              blankCost: 7.50 },
  { id: "pb301",  brand: "Pitbull Caps", sku: "PB301",  name: "Hybrid Perforated Rope",         fullName: "PB301 Hybrid Perforated Rope",                      blankCost: 7.50 },
  { id: "pb274c", brand: "Pitbull Caps", sku: "PB274C", name: "5 Panel Two-Tone Camo",          fullName: "PB274C 5 Panel Two-Tone Camo",                      blankCost: 5.50 },
  { id: "pb275",  brand: "Pitbull Caps", sku: "PB275",  name: "5 Panel High Frame Meshback",    fullName: "PB275 5 Panel High Frame Cream Two-Tone Meshback",  blankCost: 5.00 },
  { id: "pb136k", brand: "Pitbull Caps", sku: "PB136K", name: "Khaki Two-Tone Low Profile",     fullName: "PB136K Khaki Two-Tone Low Profile",                 blankCost: 5.00 },
  // HIDDEN until the client sends real colorways + photos — it still has the
  // 5 invented TWO_TONES placeholders and no photography. Remove `hidden` to
  // put it back on /pitbull-caps.
  { id: "pb222",  brand: "Pitbull Caps", sku: "PB222",  name: "Cambridge Mesh Trucker",         fullName: "PB222 Cambridge Mesh Trucker",                      blankCost: 4.75, hidden: true },
  /**
   * ⚠️ HIDDEN pending a confirmed blank cost.
   *
   * blankCost below is a placeholder, NOT a real supplier price. Everything the
   * customer is charged derives from it, so shipping it unverified would quote
   * wrong money on a live store. `hidden: true` keeps it out of the configurator
   * until the real figure is in. Set the cost, delete the flag, and it appears.
   */
  {
    id: "lonestar-gameday-hydro",
    brand: "Lonestar",
    name: "Gameday Hydro Snapback",
    fullName: "Lonestar Gameday Hydro 6 Panel Flat Bill Snapback",
    blankCost: 0,
    hidden: true,
  },
];

export const CAP_BRANDS: CapBrand[] = ["OTTO", "Pitbull Caps", "Lonestar"];

/** Each brand gets its own page; this drives that page's route and copy. */
export const BRAND_PAGES: Record<CapBrand, {
  href:    string;
  heading: string;
  blurb:   string;
}> = {
  "OTTO": {
    href:    "/hats",
    heading: "OTTO Caps",
    blurb:   "Structured A-frames, pro styles, low-profile dad hats and mesh back truckers, all embroidered in-house with your logo. Choose regular or 3D puff stitching. Low minimums, free digital proof on every order.",
  },
  "Pitbull Caps": {
    href:    "/pitbull-caps",
    heading: "Pitbull Caps",
    blurb:   "Hybrid perforated rope caps, two-tone camo and mesh truckers, all embroidered in-house with your logo. Choose regular or 3D puff stitching. Low minimums, free digital proof on every order.",
  },
  // This site renders brands as tabs on /products/custom-hats rather than
  // giving each its own route, so href is nominal. The Record type still
  // requires an entry for every CapBrand.
  "Lonestar": {
    href: "/products/custom-hats",
    heading: "Lonestar",
    blurb: "Performance snapbacks built for heat and long days outdoors.",
  },
};

export function getStylesByBrand(brand: CapBrand): CapStyle[] {
  return CAP_STYLES.filter((s) => s.brand === brand && !s.hidden);
}

export function getCapStyle(id: string): CapStyle | undefined {
  return CAP_STYLES.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Placements
// ---------------------------------------------------------------------------

export type PlacementPosition = "front" | "left" | "right" | "back";
export type PlacementArt      = "text" | "design";

export type Placement = {
  position: PlacementPosition;
  /** Ignored for the front, which is always charged at the front rate. */
  art?: PlacementArt;
};

/** Per-hat embroidery charge for one placement at a given tier. */
export function placementCharge(placement: Placement, tier: PriceTier): number {
  if (placement.position === "front") return tier.front;
  return placement.art === "design" ? tier.sideDesign : tier.sideText;
}

const ADD_ON_POSITIONS: PlacementPosition[] = ["left", "right", "back"];

/**
 * Customer-facing placement label used in the cart, upload summary, admin panel
 * and order emails. (The price-breakdown lines use their own wording.)
 */
export function placementLabel(placement: Placement): string {
  if (placement.position === "front") return "Front of Cap";
  const side = placement.position === "left"  ? "Left Side"
             : placement.position === "right" ? "Right Side"
             : "Back of Cap";
  return `${side} (${placement.art === "design" ? "design" : "text"})`;
}

/** Every label for an order: front first, then each add-on. */
export function describeOrderPlacements(addOns: Placement[]): string[] {
  return [
    placementLabel({ position: "front" }),
    ...addOns.filter((p) => p.position !== "front").map(placementLabel),
  ];
}

/** Wire format for add-ons: "left:design,back:text". Front is never included. */
export function serializeAddOns(addOns: Placement[]): string {
  return addOns
    .filter((p) => p.position !== "front")
    .map((p) => `${p.position}:${p.art === "design" ? "design" : "text"}`)
    .join(",");
}

/** Parses the wire format, dropping anything malformed rather than throwing. */
export function parseAddOns(value: string | null | undefined): Placement[] {
  if (!value) return [];
  const seen = new Set<PlacementPosition>();
  const result: Placement[] = [];

  for (const chunk of value.split(",")) {
    const [rawPosition, rawArt] = chunk.split(":").map((s) => s.trim().toLowerCase());
    const position = ADD_ON_POSITIONS.find((p) => p === rawPosition);
    if (!position || seen.has(position)) continue;
    seen.add(position);
    result.push({ position, art: rawArt === "design" ? "design" : "text" });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Quote
// ---------------------------------------------------------------------------

/**
 * Promo codes. The rate lives here so the discount is computed in the same
 * place as every other number — the browser only ever sends the code string,
 * never an amount, and /api/orders re-quotes from this table.
 *
 * `firstOrderOnly` is enforced in /api/orders by looking up the customer's
 * email in the orders table. ⚠️ That check is soft by nature: email addresses
 * are free, so a determined repeat customer can claim it again with a new one.
 * It cannot be made strict until checkout captures a payment instrument to
 * fingerprint against.
 */
export type PromoCode = {
  code:           string;
  /** Fraction off the order subtotal, e.g. 0.15 for 15%. */
  rate:           number;
  label:          string;
  firstOrderOnly: boolean;
};

export const PROMO_CODES: Record<string, PromoCode> = {
  FIRSTORDER: {
    code:           "FIRSTORDER",
    rate:           0.15,
    label:          "First order, 15% off",
    firstOrderOnly: true,
  },
};

/** Case- and whitespace-insensitive lookup. Returns undefined for junk input. */
export function findPromo(code: string | null | undefined): PromoCode | undefined {
  if (!code) return undefined;
  return PROMO_CODES[code.trim().toUpperCase()];
}

export type QuoteInput = {
  styleId:  string;
  quantity: number;
  /**
   * Side and back placements. These are ADD-ONS ONLY — front embroidery is the
   * base of every order and is always charged, so a "front" entry here is
   * ignored rather than double-counted.
   */
  placements: Placement[];
  /** 3D puff is an ADD-ON upcharge on top of the front embroidery, never a replacement. */
  puff?: boolean;
  /**
   * Promo code as typed by the customer. Only the code travels from the
   * browser — the rate and the resulting discount are resolved here.
   */
  promoCode?: string | null;
};

export type QuoteLine = {
  label:  string;
  perHat: number;
};

export type Quote = {
  styleId:      string;
  styleName:    string;
  quantity:     number;
  tier:         PriceTier;
  blankCost:    number;
  markedUpHat:  number;
  embroidery:   number;
  puffCharge:   number;
  perHat:       number;
  /** Order value before any promo discount. */
  subtotal:     number;
  /** Amount taken off by `promo`. Zero when no valid code was supplied. */
  discount:     number;
  /** The applied code, or null. Resolved server-side, never trusted from the client. */
  promo:        PromoCode | null;
  /** What the customer actually owes: `subtotal - discount`. */
  total:        number;
  freeShipping: boolean;
  lines:        QuoteLine[];
};

export function quoteOrder(input: QuoteInput): Quote {
  const style = getCapStyle(input.styleId);
  if (!style) throw new Error(`Unknown cap style: ${input.styleId}`);

  const quantity = clampQuantity(input.quantity);
  const tier     = getTier(quantity);

  const markedUpHat = round2(style.blankCost * (1 + tier.markup));

  // Front embroidery is the base of every order. Side/back placements are
  // add-ons layered on top, so any "front" passed in is dropped to avoid
  // charging it twice.
  const addOns = input.placements.filter((p) => p.position !== "front");
  const placements: Placement[] = [{ position: "front" }, ...addOns];

  const lines: QuoteLine[] = [
    // Customer-facing label — never expose the blank cost or markup rate here.
    { label: style.name, perHat: markedUpHat },
  ];

  let embroidery = 0;
  for (const placement of placements) {
    const charge = placementCharge(placement, tier);
    embroidery += charge;
    lines.push({ label: lineLabel(placement), perHat: charge });
  }

  const puffCharge = input.puff ? tier.puff : 0;
  if (puffCharge > 0) lines.push({ label: "3D puff embroidery", perHat: puffCharge });

  const perHat   = round2(markedUpHat + embroidery + puffCharge);
  const subtotal = round2(perHat * quantity);

  // Resolve the code here rather than trusting any amount from the caller.
  // Eligibility that depends on customer history (firstOrderOnly) is checked
  // in /api/orders, which is the only place that can see past orders.
  const promo    = findPromo(input.promoCode) ?? null;
  const discount = promo ? round2(subtotal * promo.rate) : 0;
  const total    = round2(subtotal - discount);

  return {
    styleId:      style.id,
    styleName:    style.name,
    quantity,
    tier,
    blankCost:    style.blankCost,
    markedUpHat,
    embroidery:   round2(embroidery),
    puffCharge,
    perHat,
    subtotal,
    discount,
    promo,
    total,
    freeShipping: quantity >= FREE_SHIPPING_QTY,
    lines,
  };
}

/** Wording for the price-breakdown rows, distinct from the customer-facing label. */
function lineLabel(placement: Placement): string {
  if (placement.position === "front") return "Front embroidery";
  const side = placement.position === "left" ? "Left side"
             : placement.position === "right" ? "Right side"
             : "Back";
  return `${side} ${placement.art === "design" ? "design" : "text"}`;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
