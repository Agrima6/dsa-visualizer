import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tree Code Playground | AlgoMaitri",
  description: "Write your own BST insert function and watch its actual comparisons walk the tree — not a reference implementation.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
