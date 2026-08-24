import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Keep the private and transactional surface out of the index. None of it can
 * rank, and an indexed cart or order-confirmation page is a real leak risk as
 * well as noise.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/auth",
        "/cart",
        "/checkout",
        "/order-confirmation",
        "/upload-artwork",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
