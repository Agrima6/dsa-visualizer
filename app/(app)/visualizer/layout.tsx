import { BeginnerIntro } from "@/components/visualizer/shared/beginner-intro"
import { TopicQuiz } from "@/components/visualizer/shared/topic-quiz"

export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BeginnerIntro />
      {children}
      <TopicQuiz />
    </>
  )
}
