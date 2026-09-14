import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Playground — Stacks & Queues",
  description: "Write your own stack or queue algorithm and watch it run step by step.",
}

export default function StackQueueCodePlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children
}
