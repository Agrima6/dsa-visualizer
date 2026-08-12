import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Message Queue Visualizer | AlgoMaitri",
  description: "Simulate message queuing systems with producers and consumers, and watch message flow visually.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
