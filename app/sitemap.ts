import type { MetadataRoute } from "next"

// The whole site is currently behind an invite-only pre-launch password
// gate (middleware.ts) — every one of these paths except the ones listed
// here in `staticRoutes` redirects an unauthenticated crawler straight to
// "/". Listing gated URLs in the sitemap while they 302 to the gate page
// just trains Googlebot to associate them with a redirect/soft-404, which
// is worse for future indexing than not listing them at all. Add the
// /visualizer/* and /company-questions routes back here once the gate
// comes down.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://algomaitri.com"

  // No lastModified: none of these dates were previously tracking anything
  // real — they were stamped with `new Date()` on every request, which
  // tells crawlers every page changed every time they checked. Omitting
  // the field is more honest than that. Bring it back if/when a real
  // "content updated at" date is tracked per page.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/term`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
  ]

  return staticRoutes
}
