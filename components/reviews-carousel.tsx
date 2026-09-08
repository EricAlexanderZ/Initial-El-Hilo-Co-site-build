"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EMPTY_REVIEWS, type ReviewsPayload } from "@/lib/reviews";

/**
 * Google reviews carousel.
 *
 * Scroll-snap rather than a JS slider: the browser handles the physics, swipe
 * works natively on a phone, and it degrades to a plain scrolling row if
 * JavaScript never arrives. The arrows scroll by one card width and are hidden
 * when everything already fits, which matters because Google caps this at five
 * reviews and El Hilo Co currently has two. Arrows over a row that does not
 * scroll look broken.
 *
 * Renders nothing at all when there are no reviews. An empty "what our
 * customers say" heading is worse than no section.
 */
export function ReviewsCarousel() {
  const [data, setData] = useState<ReviewsPayload>(EMPTY_REVIEWS);
  const [loaded, setLoaded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d: ReviewsPayload) => alive && setData(d))
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => { alive = false; };
  }, []);

  // Only show arrows when the track actually scrolls.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 8);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data.reviews.length]);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  }

  if (!loaded || data.reviews.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.45em] text-[#5f6675]">
              Reviews
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#13294b] sm:text-4xl">
              What our customers say
            </h2>
            {data.rating !== null && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <Stars value={data.rating} />
                <span className="font-bold text-[#13294b]">{data.rating.toFixed(1)}</span>
                {data.total !== null && <span>from {data.total} Google reviews</span>}
              </p>
            )}
          </div>

          {overflows && (
            <div className="flex gap-2">
              <ArrowButton dir={-1} onClick={() => scrollBy(-1)} />
              <ArrowButton dir={1} onClick={() => scrollBy(1)} />
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.reviews.map((r, i) => (
            <article
              key={`${r.author}-${i}`}
              className="flex w-[85vw] shrink-0 snap-start flex-col rounded-3xl border border-black/10 bg-[#fbfbfa] p-6 shadow-sm sm:w-[22rem]"
            >
              <div className="flex items-center gap-3">
                {r.authorPhoto ? (
                  <Image
                    src={r.authorPhoto}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#13294b] text-sm font-bold text-white">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#13294b]">{r.author}</p>
                  <p className="text-xs text-gray-500">{r.when}</p>
                </div>
                <GoogleMark className="ml-auto h-5 w-5 shrink-0" />
              </div>

              <Stars value={r.rating} className="mt-4" />

              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">{r.text}</p>
            </article>
          ))}
        </div>

        {/* Attribution and a route to the reviews Google will not hand over. */}
        {data.placeUrl && (
          <a
            href={data.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#13294b] hover:underline"
          >
            <GoogleMark className="h-4 w-4" />
            Read all reviews on Google
          </a>
        )}
      </div>
    </section>
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" aria-hidden="true"
          className={`h-4 w-4 ${n <= full ? "fill-[#e3b33d]" : "fill-black/15"}`}>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next reviews" : "Previous reviews"}
      className="grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-white transition hover:border-[#13294b] hover:bg-[#13294b] hover:text-white"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 1 ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
      </svg>
    </button>
  );
}

/** Google's G. Attribution is a condition of using Places content. */
function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36.2 45 30.6 45 24z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8.1 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9z" />
      <path fill="#EA4335" d="M24 10.6c3.2 0 5.4 1.4 6.7 2.6l6.1-6C33.1 3.9 29.9 2 24 2 15.4 2 8.1 6.9 4.4 14.1l7.1 5.5C13.3 14.4 18.2 10.6 24 10.6z" />
    </svg>
  );
}
