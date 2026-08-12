import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stack Visualizer | AlgoMaitri",
  description: "Visualize LIFO stack operations — push and pop — step by step.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
