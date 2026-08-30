export interface LearningPathStep {
  topicSlug: string // must match a slug in lib/visualizer-topics.ts
  estimatedMinutes: number
  note?: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  steps: LearningPathStep[]
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "foundations",
    title: "DSA Foundations",
    description: "Start here if data structures still feel abstract. Builds the mental model everything else leans on.",
    steps: [
      { topicSlug: "time-complexity", estimatedMinutes: 15, note: "Why we measure speed the way we do" },
      { topicSlug: "array", estimatedMinutes: 15 },
      { topicSlug: "sorting", estimatedMinutes: 20 },
      { topicSlug: "stack", estimatedMinutes: 15 },
      { topicSlug: "queue", estimatedMinutes: 15 },
      { topicSlug: "linked-list", estimatedMinutes: 20 },
      { topicSlug: "recursion", estimatedMinutes: 25, note: "The idea that unlocks trees, graphs, and DP" },
    ],
  },
  {
    id: "trees-and-graphs",
    title: "Trees & Graphs",
    description: "The two structures interview questions lean on most, from a plain binary tree to shortest paths.",
    steps: [
      { topicSlug: "binary-tree", estimatedMinutes: 20 },
      { topicSlug: "avl-tree", estimatedMinutes: 25, note: "Why unbalanced trees are a problem, and the fix" },
      { topicSlug: "heap", estimatedMinutes: 15 },
      { topicSlug: "trie", estimatedMinutes: 15 },
      { topicSlug: "graph", estimatedMinutes: 20 },
      { topicSlug: "dijkstra", estimatedMinutes: 20 },
    ],
  },
  {
    id: "interview-ready",
    title: "Interview Ready",
    description: "The topics that come up again and again at Google, Amazon, and Microsoft interviews — including the one most people skip.",
    steps: [
      { topicSlug: "sorting", estimatedMinutes: 20 },
      { topicSlug: "recursion", estimatedMinutes: 25 },
      { topicSlug: "binary-tree", estimatedMinutes: 20 },
      { topicSlug: "graph", estimatedMinutes: 20 },
      { topicSlug: "dp", estimatedMinutes: 30, note: "The topic that decides most FAANG interviews" },
      { topicSlug: "stack-applications", estimatedMinutes: 15 },
    ],
  },
]

export function getLearningPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.id === id)
}

export function getTotalMinutes(path: LearningPath): number {
  return path.steps.reduce((sum, s) => sum + s.estimatedMinutes, 0)
}
