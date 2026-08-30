import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Paths | AlgoMaitri",
  description: "Guided, ordered routes through DSA topics with estimated time and continue-where-you-left-off.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
