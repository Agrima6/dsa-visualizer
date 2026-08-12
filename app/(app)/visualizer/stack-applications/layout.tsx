import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Infix to Postfix Visualizer | AlgoMaitri",
  description: "Convert infix expressions to postfix notation using a stack, and step through the conversion process.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
