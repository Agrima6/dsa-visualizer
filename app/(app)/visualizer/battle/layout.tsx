import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Battle | AlgoMaitri",
  description: "Race a friend 1v1 on real DSA problems — pick difficulty, topic, and a time limit, then whoever solves everything correctly first wins.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
