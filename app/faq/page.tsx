import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import FAQAccordion from "@/components/faq-accordion";
import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-dvh bg-[#f6f6f4] text-black">
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
