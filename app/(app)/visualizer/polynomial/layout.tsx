import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polynomial Multiplication Visualizer | AlgoMaitri",
  description: "Visualize polynomial multiplication using linked lists, term by term.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
