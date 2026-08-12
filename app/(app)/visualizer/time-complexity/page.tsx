import { TimeComplexityVisualizer } from "@/components/visualizer/time-complexity/time-complexity-visualizer"

export const metadata = {
  title: "Time Complexity Explorer | AlgoMaitri",
  description: "Learn Big-O by experimenting — drag sliders, watch real code execute, and test yourself with instant-feedback quizzes.",
}

export default function Page() {
  return <TimeComplexityVisualizer />
}
