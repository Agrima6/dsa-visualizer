import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dynamic Programming Visualizer | AlgoMaitri",
  description: "Watch 0/1 Knapsack and Longest Common Subsequence DP tables fill cell by cell, then trace the backtracked answer.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
