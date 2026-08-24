import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, TopBanner } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { postsByDate, PILLAR_SLUG } from "@/lib/blog";
import { cityList, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Embroidery Guides for the Rio Grande Valley | ${site.name}`,
  description: `Pricing, turnaround and local guides for custom embroidery in ${cityList}. Straight answers, no forms.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Embroidery Guides for the Rio Grande Valley",
    description: `Custom embroidery guides for ${cityList}.`,
    url: `${site.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const pillar = postsByDate.find((post) => post.slug === PILLAR_SLUG)!;
  const rest   = postsByDate.filter((post) => post.slug !== PILLAR_SLUG);

  return (
    <>
      <TopBanner />
      <SiteHeader />

      <main>
        <section className="bg-[#111111] py-14 text-white">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e3b33d]">Guides</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Embroidery in the Rio Grande Valley
            </h1>
            <p className="mt-4 text-lg text-white/70">
              What it costs, how long it takes, and what to send us. Written for {cityList}.
            </p>
          </div>
        </section>

        <section className="bg-[#ececeb] py-12">
          <div className="mx-auto max-w-4xl px-6">
            {/* The pillar leads, because it is the page every other post links
                back to and the one competing for the broadest phrase. */}
            <Link prefetch={false}
              href={`/blog/${pillar.slug}`}
              className="block rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e3b33d]">
                Start here
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#13294b]">
                {pillar.title}
              </h2>
              <p className="mt-3 text-gray-700">{pillar.description}</p>
              <p className="mt-4 text-sm font-semibold text-[#13294b]">
                {pillar.readMinutes} min read →
              </p>
            </Link>

            <h2 className="mb-4 mt-10 text-sm font-extrabold uppercase tracking-[0.16em] text-[#13294b]">
              By city
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {rest.map((post) => (
                <Link prefetch={false}
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="text-lg font-extrabold leading-snug text-[#13294b]">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-700">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[#13294b]">
                    {post.readMinutes} min read →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
