import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Linked List Code Playground | AlgoMaitri",
  description: "Write your own singly-linked list function and watch your actual pointer walk through it — not a reference implementation.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
