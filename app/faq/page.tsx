import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import FAQAccordion from "@/components/faq-accordion";
import { FAQS } from "@/lib/faqs";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Ordering, artwork, pricing, turnaround and delivery for custom embroidery with El Hilo Co. No minimum order.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQPage schema.
 *
 * Built from the same FAQS array the accordion renders, so the structured data
 * and the visible answers cannot drift — Google treats a mismatch between them
 * as a reason to drop the rich result entirely.
 */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/faq#faq`,
    mainEntity: FAQS.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-dvh bg-[#f6f6f4] text-black">
      <FaqJsonLd />
      <TopBanner />
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Everything you need to know about ordering custom embroidery with El Hilo Co.
          </p>
        </div>

        <div className="mt-14">
          <FAQAccordion />
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[1.75rem] bg-[#13294b] p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold">Still have questions?</h2>
          <p className="mt-3 text-sm text-white/70">
            Our team is happy to help. Send us a message and we&apos;ll get back to you within 1–2 business days.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[#ffd84d] px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
