import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Binary Tree Visualizer | AlgoMaitri",
  description: "Binary Search Tree and Heap in one visualizer — ordered insertions and traversals, or priority-based heap operations.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
