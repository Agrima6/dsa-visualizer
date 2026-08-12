import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Queue Visualizer | AlgoMaitri",
  description: "See enqueue and dequeue operations in action with an interactive FIFO queue visualizer.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
