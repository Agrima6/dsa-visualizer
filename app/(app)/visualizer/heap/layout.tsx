import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Heap Visualizer | AlgoMaitri",
  description: "Explore heap operations with an interactive min-heap and max-heap visualizer.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
