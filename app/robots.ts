import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://algomaitri.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/sign-in"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
