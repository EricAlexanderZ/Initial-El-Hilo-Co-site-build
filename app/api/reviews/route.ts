import { NextResponse } from "next/server";
import { EMPTY_REVIEWS, PLACE_QUERY, type GoogleReview, type ReviewsPayload } from "@/lib/reviews";

/**
 * Google reviews for the storefront carousel.
 *
 * Revalidated daily. Google's terms forbid caching Places content indefinitely,
 * and reviews arrive slowly enough that a day is plenty — refetching per visitor
 * would burn quota for no benefit.
 */
export const revalidate = 86400;

const SEARCH  = "https://places.googleapis.com/v1/places:searchText";
const DETAILS = "https://places.googleapis.com/v1/places";

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.warn("[api/reviews] GOOGLE_MAPS_API_KEY not set");
    return NextResponse.json(EMPTY_REVIEWS);
  }

  try {
    // 1. Resolve the place. Cheaper than storing an id that could go stale, and
    //    the response is cached for a day anyway.
    const found = await fetch(SEARCH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({ textQuery: PLACE_QUERY, maxResultCount: 1 }),
      next: { revalidate },
    }).then((r) => r.json());

    const placeId = found?.places?.[0]?.id;
    if (!placeId) {
      // A PERMISSION_DENIED here means the Places API is not enabled on the key.
      console.warn("[api/reviews] no place found:", found?.error?.status ?? "empty result");
      return NextResponse.json(EMPTY_REVIEWS);
    }

    // 2. Reviews. Google caps this at five and there is no way to ask for more.
    const detail = await fetch(`${DETAILS}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution",
      },
      next: { revalidate },
    }).then((r) => r.json());

    if (detail?.error) {
      console.warn("[api/reviews] details failed:", detail.error.status);
      return NextResponse.json(EMPTY_REVIEWS);
    }

    const reviews: GoogleReview[] = (detail.reviews ?? [])
      .map((r: Record<string, any>) => ({
        author:      r.authorAttribution?.displayName ?? "Google user",
        authorPhoto: r.authorAttribution?.photoUri,
        rating:      r.rating ?? 0,
        when:        r.relativePublishTimeDescription ?? "",
        text:        r.text?.text ?? "",
        url:         r.authorAttribution?.uri,
      }))
      // A rating with no words is not worth a card in a carousel.
      .filter((r: GoogleReview) => r.text.trim().length > 0);

    const payload: ReviewsPayload = {
      reviews,
      rating:   detail.rating ?? null,
      total:    detail.userRatingCount ?? null,
      placeUrl: detail.googleMapsUri ?? null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    // Never let a review widget break the page it sits on.
    console.error("[api/reviews] failed:", error);
    return NextResponse.json(EMPTY_REVIEWS);
  }
}
