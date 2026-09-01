import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Playground | AlgoMaitri",
  description: "Write your own sorting function and watch its actual comparisons and swaps animate — not a reference implementation.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
