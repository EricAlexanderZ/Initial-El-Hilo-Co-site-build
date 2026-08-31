import type { DeliveryMethod } from "@/types/checkout";

/**
 * Free local delivery, offered instead of a carrier where El Hilo Co drives the
 * order out itself.
 *
 * ⚠️ This list is NOT the same as `serviceCities` in lib/site.ts, which drives
 * the local SEO pages. That list has Palmview and this one has Alton. Both were
 * given by the owner for different purposes, so they are kept separate rather
 * than merged, but if one is wrong they should be reconciled.
 */
export const LOCAL_DELIVERY_CITIES = [
  "Mission",
  "Alton",
  "McAllen",
  "Edinburg",
  "Pharr",
] as const;

/** "Mission, Alton, McAllen, Edinburg and Pharr" */
export const LOCAL_DELIVERY_CITY_LIST =
  LOCAL_DELIVERY_CITIES.slice(0, -1).join(", ") +
  " and " +
  LOCAL_DELIVERY_CITIES[LOCAL_DELIVERY_CITIES.length - 1];

export const LOCAL_DELIVERY_ID = "local-delivery";

/**
 * Whether a typed city qualifies.
 *
 * Deliberately forgiving about case, spacing and punctuation, because this is
 * matched against something a customer typed by hand. It is not forgiving about
 * the state: "Mission, KS" is a real place and must not get free delivery from
 * a shop in the Rio Grande Valley.
 */
export function isLocalDeliveryEligible(city: string, state: string): boolean {
  const st = state.trim().toUpperCase();
  if (st !== "TX" && st !== "TEXAS") return false;

  const normalised = city.trim().toLowerCase().replace(/[^a-z]/g, "");
  return LOCAL_DELIVERY_CITIES.some(
    (c) => c.toLowerCase().replace(/[^a-z]/g, "") === normalised
  );
}

/** The option itself. Free by definition, so selecting it zeroes the shipping. */
export function localDeliveryMethod(): DeliveryMethod {
  return {
    id: LOCAL_DELIVERY_ID,
    label: "Free Local Delivery",
    eta: "We drop it off, usually within a day of completion",
    price: 0,
  };
}
