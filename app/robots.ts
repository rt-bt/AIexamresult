import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin", "/api/auth", "/api/analytics"] },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/admin", "/api/auth"] },
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/auth"] },
    ],
    sitemap: [
      `${base}/sitemap-index.xml`,
      `${base}/sitemap.xml`,
    ]
  };
}
