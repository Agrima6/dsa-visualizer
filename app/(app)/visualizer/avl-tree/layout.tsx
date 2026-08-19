import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AVL Tree Visualizer | AlgoMaitri",
  description: "Watch a self-balancing AVL tree track balance factors and perform LL, RR, LR, and RL rotations in real time.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
