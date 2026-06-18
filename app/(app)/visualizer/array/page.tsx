// app/visualizer/array/page.tsx
import { ArrayVisualizer } from "@/components/visualizer/array/Array visualizer"

export const metadata = {
  title: "Array Visualizer | AlgoMaitri",
  description: "Visualize array operations: insert, delete, search, reverse, and rotate step by step.",
}

export default function ArrayPage() {
  return <ArrayVisualizer />
}