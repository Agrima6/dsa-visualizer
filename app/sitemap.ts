import type { MetadataRoute } from "next"

const VISUALIZER_SLUGS = [
  "array",
  "avl-tree",
  "binary-tree",
  "dijkstra",
  "functions",
  "graph",
  "heap",
  "huffman",
  "linked-list",
  "polynomial",
  "queue",
  "queue-applications",
  "recursion",
  "sorting",
  "stack",
  "stack-applications",
  "time-complexity",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://algomaitri.com"
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/visualizer`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/company-questions`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/term`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const visualizerRoutes: MetadataRoute.Sitemap = VISUALIZER_SLUGS.map((slug) => ({
    url: `${baseUrl}/visualizer/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...visualizerRoutes]
}
