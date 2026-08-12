import { FunctionsVisualizer } from "@/components/visualizer/functions/functions-visualizer"

export const metadata = {
  title: "Functions Visualizer | AlgoMaitri",
  description: "Learn functions by watching real call stacks push and pop — recursion, closures, and higher-order functions in action.",
}

export default function Page() {
  return <FunctionsVisualizer />
}
