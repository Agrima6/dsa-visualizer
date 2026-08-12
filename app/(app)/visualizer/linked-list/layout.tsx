import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Linked List Visualizer | AlgoMaitri",
  description: "Explore different types of linked lists and watch node-based operations step by step.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
