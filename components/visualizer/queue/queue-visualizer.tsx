"use client"
// components/visualizer/queue/queue-visualizer.tsx
// REPLACE your existing file with this one

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { QueueControls } from "@/components/visualizer/queue/queue-controls"
import { QueueDisplay } from "@/components/visualizer/queue/queue-display"
import { QueueOperations } from "@/components/visualizer/queue/queue-operations"
import { CircularQueueControls } from "@/components/visualizer/queue/circular-queue-controls"
import { CircularQueueDisplay } from "@/components/visualizer/queue/circular-queue-display"
import { PriorityQueueControls } from "@/components/visualizer/queue/priority-queue-controls"
import { PriorityQueueDisplay } from "@/components/visualizer/queue/priority-queue-display"
import { DequeControls } from "@/components/visualizer/queue/deque-controls"
import { DequeDisplay } from "@/components/visualizer/queue/deque-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useQueue } from "@/hooks/use-queue"
import { useCircularQueue } from "@/hooks/use-circular-queue"
import { usePriorityQueue } from "@/hooks/use-priority-queue"
import { useDeque } from "@/hooks/use-deque"
import { Sparkles } from "lucide-react"
import { QueueAnalogy } from "./queue-analogy"
import QueueCodeView from "./queue-code-view"

interface QueueVisualizerProps {
  content: React.ReactNode
}

// ── Router ────────────────────────────────────────────────────────
function QueueVisualizerInner({ content }: QueueVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") return <QueueCodeView />
  return <QueueVisualizerOriginal content={content} />
}

export function QueueVisualizer(props: QueueVisualizerProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <QueueVisualizerInner {...props} />
    </Suspense>
  )
}

// ── Original Visualizer (100% unchanged) ─────────────────────────
function QueueVisualizerOriginal({ content }: QueueVisualizerProps) {
  const {
    queue, operations, isAnimating, highlightedIndex,
    enqueue, dequeue, clear, isFull, isEmpty,
  } = useQueue()

  const circular = useCircularQueue(6)
  const priority = usePriorityQueue()
  const deque = useDeque()

  return (
    <div className="container mx-auto space-y-8">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Data Structure
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Queue (FIFO)
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Four variants, one underlying idea. Compare Simple, Circular, Priority,
            and Double-Ended (Deque) queues side by side in the Visualization tab.
          </p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="understand" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger
            value="understand"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Understand
          </TabsTrigger>
          <TabsTrigger
            value="visualization"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Visualization
          </TabsTrigger>
          <TabsTrigger
            value="explanation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Explanation
          </TabsTrigger>
        </TabsList>

        {/* UNDERSTAND */}
        <TabsContent value="understand">
          <QueueAnalogy />
        </TabsContent>

        {/* VISUALIZATION */}
        <TabsContent value="visualization" className="space-y-6">
          <Tabs defaultValue="simple" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
              <TabsTrigger value="simple" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Simple Queue
              </TabsTrigger>
              <TabsTrigger value="circular" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Circular Queue
              </TabsTrigger>
              <TabsTrigger value="priority" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Priority Queue
              </TabsTrigger>
              <TabsTrigger value="deque" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Deque
              </TabsTrigger>
            </TabsList>

            {/* Simple Queue */}
            <TabsContent value="simple" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueControls
                      onEnqueue={enqueue} onDequeue={dequeue} onClear={clear}
                      isAnimating={isAnimating} isFull={isFull} isEmpty={isEmpty}
                    />
                  </div>
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueOperations operations={operations} />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueDisplay queue={queue} highlightedIndex={highlightedIndex} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Circular Queue */}
            <TabsContent value="circular" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <CircularQueueControls
                      onEnqueue={circular.enqueue} onDequeue={circular.dequeue} onClear={circular.clear}
                      isAnimating={circular.isAnimating} isFull={circular.isFull} isEmpty={circular.isEmpty}
                      size={circular.size} count={circular.count}
                    />
                  </div>
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueOperations operations={circular.operations} />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <CircularQueueDisplay slots={circular.slots} front={circular.front} rear={circular.rear} activeIndex={circular.activeIndex} />
                </div>
              </div>
            </TabsContent>

            {/* Priority Queue */}
            <TabsContent value="priority" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <PriorityQueueControls
                      onInsert={priority.insert} onExtractMin={priority.extractMin} onClear={priority.clear}
                      isAnimating={priority.isAnimating} isEmpty={priority.isEmpty}
                    />
                  </div>
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueOperations operations={priority.operations} />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <PriorityQueueDisplay queue={priority.queue} highlightedIndex={priority.highlightedIndex} />
                </div>
              </div>
            </TabsContent>

            {/* Deque */}
            <TabsContent value="deque" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 space-y-6">
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <DequeControls
                      onAddFront={deque.addFront} onAddRear={deque.addRear}
                      onRemoveFront={deque.removeFront} onRemoveRear={deque.removeRear}
                      onClear={deque.clear}
                      isAnimating={deque.isAnimating} isFull={deque.isFull} isEmpty={deque.isEmpty}
                    />
                  </div>
                  <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                    <QueueOperations operations={deque.operations} />
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <DequeDisplay queue={deque.queue} highlightedIndex={deque.highlightedIndex} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* EXPLANATION */}
        <TabsContent value="explanation">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <MarkdownContent content={content} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}