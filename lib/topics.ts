export interface TopicMeta {
  slug: string
  label: string
  total: number
}

/**
 * Single source of truth for topic slugs + problem counts, used by the
 * dashboard's progress bars and the server-side progress API.
 *
 * Slugs MUST match `topic.title.toLowerCase().replace(/\s+/g, "-")` from
 * app/(app)/company-questions/page.tsx — that's where ProblemEntry.topic
 * actually gets its value from.
 *
 * `total` is a plain number rather than `SOME_PROBLEMS.length` on purpose:
 * those problems-data files are large (full solution code, hints,
 * examples per problem) and importing them here would ship all of that
 * into every client bundle that renders dashboard progress bars, just to
 * read a count. Run `node scripts/check-topic-counts.mjs` after adding or
 * removing a problem to catch drift instead.
 */
export const TOPIC_REGISTRY: TopicMeta[] = [
  { slug: "arrays", label: "Arrays", total: 28 },
  { slug: "sorting", label: "Sorting", total: 10 },
  { slug: "linked-lists", label: "Linked Lists", total: 10 },
  { slug: "stacks", label: "Stacks", total: 10 },
  { slug: "queues", label: "Queues", total: 10 },
  { slug: "binary-tree", label: "Binary Tree", total: 10 },
  { slug: "heaps", label: "Heaps", total: 10 },
  { slug: "graphs", label: "Graphs", total: 10 },
  { slug: "recursion", label: "Recursion", total: 20 },
]

export const TOPIC_SLUGS = new Set(TOPIC_REGISTRY.map((t) => t.slug))

export function getTopicLabel(slug: string): string {
  return TOPIC_REGISTRY.find((t) => t.slug === slug)?.label ?? slug
}
