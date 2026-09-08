/**
 * Google reviews, fetched from the Places API.
 *
 * ⚠️ Google returns a MAXIMUM OF FIVE reviews per place, and there is no
 * official API that returns all of them. Every "show all your Google reviews"
 * widget on the market either scrapes (against Google's terms, and breaks
 * whenever the markup changes) or stores a copy the first time it sees one.
 * This takes the supported path and shows up to five.
 *
 * Google's terms also require attribution and forbid caching Places content
 * indefinitely, so the route revalidates daily rather than storing reviews in
 * the database.
 */

export type GoogleReview = {
  author: string;
  authorPhoto?: string;
  rating: number;
  /** Relative, as Google phrases it: "a month ago". */
  when: string;
  text: string;
  /** Deep link to the review on Google. Required attribution. */
  url?: string;
};

export type ReviewsPayload = {
  reviews: GoogleReview[];
  rating: number | null;
  total: number | null;
  /** Link to the full listing, so people can read past the five. */
  placeUrl: string | null;
};

export const EMPTY_REVIEWS: ReviewsPayload = {
  reviews: [],
  rating: null,
  total: null,
  placeUrl: null,
};

/**
 * The business on Google.
 *
 * Resolved by text search rather than hardcoded, so it survives the listing
 * being edited. If it ever resolves to the wrong business, hardcode the place
 * id here instead — it is stable.
 */
export const PLACE_QUERY = "El Hilo Co embroidery Palmview TX";
