import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | AlgoMaitri",
  description: "Learn about AlgoMaitri, an interactive platform for visualizing data structures and algorithms.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
