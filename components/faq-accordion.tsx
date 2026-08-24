"use client";

import { useState } from "react";
import { FAQS, type FAQItem } from "@/lib/faqs";

/**
 * One question and answer.
 *
 * The answer is ALWAYS in the DOM and collapsed with CSS, never conditionally
 * rendered. `{open && <p>}` meant the answers existed only after a click, so
 * every crawler saw 29 questions and zero answers — the content this page is
 * built on was invisible to search entirely.
 *
 * Collapsing uses a 0fr/1fr grid row rather than max-height, so it animates to
 * the answer's real height without hardcoding a guess that clips long text.
 */
function FAQItem({ q, a, id }: FAQItem & { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold transition hover:text-[#13294b]"
      >
        <span>{q}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-lg text-gray-400 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>

      <div
        id={id}
        className={`grid transition-all duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-7 text-gray-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

/** Stable, collision-free id for the aria-controls pairing. */
function slugId(value: string): string {
  return "faq-" + value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export default function FAQAccordion() {
  return (
    <div className="space-y-10">
      {FAQS.map((section) => (
        <div key={section.category}>
          <h2 className="mb-4 text-xl font-extrabold">{section.category}</h2>
          <div className="rounded-[1.75rem] bg-white px-6 shadow-sm">
            {section.items.map((item) => (
              <FAQItem key={item.q} {...item} id={slugId(item.q)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
