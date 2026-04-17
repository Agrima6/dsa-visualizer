"use client"
// components/visualizer/stack/stack-visualizer.tsx
// REPLACE your existing file with this one

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { StackControls } from "@/components/visualizer/stack/stack-controls"
import { StackDisplay } from "@/components/visualizer/stack/stack-display"
import { StackOperations } from "@/components/visualizer/stack/stack-operations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useStack } from "@/hooks/use-stack"
import StackCodeView from "./stack-code-view"

interface StackVisualizerProps {
  content: React.ReactNode
}

// ── Router ───────────────────────────────────────────────────────
function StackVisualizerInner({ content }: StackVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") return <StackCodeView />
  return <StackVisualizerOriginal content={content} />
}

export function StackVisualizer(props: StackVisualizerProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <StackVisualizerInner {...props} />
    </Suspense>
  )
}

// ── Original Visualizer (unchanged) ─────────────────────────────
function StackVisualizerOriginal({ content }: StackVisualizerProps) {
  const {
    stack, operations, isAnimating, highlightedIndex,
    push, pop, clear, isFull, isEmpty,
  } = useStack()

  return (
    <div className="container mx-auto space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-white/70 backdrop-blur-xl p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-white/[0.04]">
        <div className="absolute -top-10 left-10 h-40 w-40 bg-violet-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-10 h-40 w-40 bg-blue-500/10 blur-3xl rounded-full" />

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
          Stack Visualization
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Understand LIFO (Last-In-First-Out) behavior through interactive push and pop operations.
        </p>
      </div>

      {/* TABS */}
      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
          <TabsTrigger
            value="visualization"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Visualization
          </TabsTrigger>
          <TabsTrigger
            value="explanation"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Explanation
          </TabsTrigger>
        </TabsList>

        {/* VISUALIZATION TAB */}
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <div className="rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl p-4 dark:bg-white/[0.04]">
                <StackControls
                  onPush={push} onPop={pop} onClear={clear}
                  isAnimating={isAnimating} isFull={isFull} isEmpty={isEmpty}
                />
              </div>
              <div className="rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl p-4 dark:bg-white/[0.04]">
                <StackOperations operations={operations} />
              </div>
            </div>
            <div className="xl:col-span-2">
              <div className="rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-white/[0.04]">
                <StackDisplay stack={stack} highlightedIndex={highlightedIndex} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* EXPLANATION TAB */}
        <TabsContent value="explanation">
          <div className="rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl p-6 dark:bg-white/[0.04]">
            <MarkdownContent content={content} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}