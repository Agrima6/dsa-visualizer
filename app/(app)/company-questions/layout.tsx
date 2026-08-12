import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Company Questions | AlgoMaitri",
  description: "Practice standard interview questions by topic — arrays, sorting, trees, graphs, recursion, and more — with real-executed code walkthroughs.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
