import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Binary Tree Visualizer | AlgoMaitri",
  description: "Explore binary tree insertions, traversals, and structure with an interactive visualizer.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
