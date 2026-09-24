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
 * The business on Google, by its Place ID.
 *
 * This used to be a text search for "El Hilo Co embroidery Palmview TX", which
 * had two problems: it spent an extra API call resolving something that never
 * changes, and it would have stopped resolving the day the Business Profile was
 * renamed — precisely mid-rebrand, when nobody would have been watching the
 * carousel.
 *
 * A Place ID is stable across renames, address edits and profile changes. This
 * one was read out of the redirect chain behind the profile's own "get more
 * reviews" short link, so it is the listing's own id rather than a guess:
 *
 *   https://g.page/r/CS72F3FhN4O5EAI/review
 *     -> search.google.com/local/writereview?placeid=ChIJ3_9DA7u7liERLvYXcWE3g7k
 */
export const PLACE_ID = "ChIJ3_9DA7u7liERLvYXcWE3g7k";
