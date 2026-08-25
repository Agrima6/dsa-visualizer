import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trie Visualizer | AlgoMaitri",
  description: "Insert, search, and prefix-search words in a live prefix tree — the structure behind autocomplete and spell-check.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
