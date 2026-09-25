import { BeginnerIntro } from "@/components/visualizer/shared/beginner-intro"

export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BeginnerIntro />
      {children}
    </>
  )
}
