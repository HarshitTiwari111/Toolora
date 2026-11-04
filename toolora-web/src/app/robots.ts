import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// Staging (NEXT_PUBLIC_SITE_INDEXABLE != "true") par poori site block.
// Launch par: sirf admin, search aur developer pages block; sitemap ka link.
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/search/", "/api-test/"] }],
    sitemap: absUrl("/sitemap.xml"),
    host: absUrl("/"),
  };
}
