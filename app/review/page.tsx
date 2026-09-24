import type { Metadata } from "next";
import { Wordmark } from "@/components/brand/wordmark";
import { site } from "@/lib/site";

/*
 * The destination for the QR code on the thank-you cards.
 *
 * The QR points here rather than straight at Google on purpose. A printed code
 * cannot be edited: if Google ever changes its review URL, or the listing is
 * recreated, a card pointing directly at Google becomes waste paper. Pointing
 * at our own path means the destination is one line of config away, and every
 * card already printed keeps working.
 *
 * ⚠️ No star gating here, and do not add it.
 *
 * The widespread pattern of asking for a rating first and sending only the
 * happy ones to Google is called review gating, and it is a direct violation of
 * Google's prohibited-content policy. Penalties run to review removal and
 * listing suspension. Both routes below are offered openly and equally, which
 * is the part that makes it legitimate: a customer with a complaint is free to
 * leave it on Google if they want to.
 */

export const metadata: Metadata = {
  title: "Leave a review",
  description: `Tell us how we did. Reviews help other Rio Grande Valley businesses find ${site.name}.`,
  // A thank-you card is not a search result. Keep it out of the index so it
  // never competes with the pages that are meant to rank.
  robots: { index: false, follow: false },
};

/** Where the review button goes. Falls back so the page is never a dead end. */
function reviewHref(): string {
  if (site.googleReviewUrl) return site.googleReviewUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.name} ${site.address.locality} ${site.address.region}`
  )}`;
}

export default function ReviewPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-shell px-6 py-16">
      <div className="w-full max-w-md text-center">
        <Wordmark className="mx-auto h-20" sizes="98px" priority />

        <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-navy-deep">
          How did we do?
        </h1>

        <p className="mt-4 text-base leading-relaxed text-steel">
          Thanks for your order. If you have a minute, a review on Google genuinely
          helps other businesses around the Valley find us.
        </p>

        <a
          href={reviewHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-navy px-6 py-4 text-base font-bold text-white transition hover:bg-navy-lift"
        >
          {/* Google's G, so the button is recognisable before it is read. */}
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.0 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.0 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C37.0 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Leave a Google review
        </a>

        <p className="mt-4 text-xs text-steel">
          Opens Google. You will need to be signed in to a Google account.
        </p>

        {/*
          Offered alongside the review, not instead of it, and not behind a
          rating question. Someone with a real problem should be able to reach
          a person quickly; that is a courtesy, not a filter.
        */}
        <div className="mt-10 border-t border-line pt-8">
          <p className="text-sm text-steel">
            Something not right with your order?
          </p>
          <a
            href={site.smsHref}
            className="mt-2 inline-block text-sm font-bold text-navy underline underline-offset-4"
          >
            Text us at {site.phone}
          </a>
          <p className="mt-2 text-xs text-steel">
            We would rather fix it than have you live with it.
          </p>
        </div>

        <p className="mt-12 text-xs text-steel">
          {site.name} · {site.address.locality}, {site.address.region}
        </p>
      </div>
    </main>
  );
}
