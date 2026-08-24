import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, TopBanner } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPost, posts, PILLAR_SLUG } from "@/lib/blog";
import { getCity, site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Every post is known at build time, so all of them prerender as static HTML. */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${site.name}`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const city  = post.citySlug ? getCity(post.citySlug) : undefined;
  const isPillar = post.slug === PILLAR_SLUG;
  const others   = posts.filter((p) => p.slug !== post.slug);

  /**
   * Article schema. `about` and `spatialCoverage` are what tie the post to a
   * place, which is the part that matters for a local query — a BlogPosting
   * with no geographic signal competes nationally and loses.
   */
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.url}/blog/${post.slug}/#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en-US",
    keywords: post.keywords.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
    author:    { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    ...(city && {
      spatialCoverage: {
        "@type": "Place",
        name: `${city.name}, TX`,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressRegion: "TX",
          addressCountry: "US",
        },
      },
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <TopBanner />
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main>
        <section className="bg-[#111111] py-12 text-white">
          <div className="mx-auto max-w-3xl px-6">
            <Link href="/blog" className="text-xs font-bold uppercase tracking-[0.16em] text-[#e3b33d] hover:underline">
              ← Guides
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-white/60">{post.readMinutes} min read</p>
          </div>
        </section>

        <article className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-6">
            {post.body.map((block, i) => {
              if (block.kind === "h2") {
                return (
                  <h2 key={i} className="mt-10 text-2xl font-extrabold tracking-tight text-[#13294b]">
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === "ul") {
                return (
                  <ul key={i} className="mt-4 space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-lg leading-relaxed text-gray-800">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e3b33d]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mt-4 text-lg leading-relaxed text-gray-800">
                  {block.text}
                </p>
              );
            })}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={site.smsHref}
                className="inline-flex min-h-12 items-center rounded-full bg-[#e3b33d] px-6 text-base font-extrabold text-[#111111] transition hover:bg-[#f0c04d]"
              >
                Text {site.phone}
              </a>
              <Link
                href="/products/custom-hats"
                className="inline-flex min-h-12 items-center rounded-full border-2 border-[#13294b] px-6 text-base font-extrabold text-[#13294b] transition hover:bg-[#13294b] hover:text-white"
              >
                Price a hat order
              </Link>
            </div>
          </div>
        </article>

        {/* Internal linking is the whole point of the hub and spoke. Spokes send
            authority to the pillar; the pillar spreads it back across cities. */}
        <section className="bg-[#ececeb] py-12">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#13294b]">
              {isPillar ? "Guides by city" : "Keep reading"}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="rounded-2xl bg-white p-5 text-sm font-bold leading-snug text-[#13294b] shadow-sm transition hover:shadow-md"
                >
                  {other.title}
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
