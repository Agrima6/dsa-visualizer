import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dijkstra's Algorithm Visualizer | AlgoMaitri",
  description: "Visualize Dijkstra's algorithm finding the shortest path in a graph, step by step.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
