"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { HeapControls } from "@/components/visualizer/heap/heap-controls"
import { HeapDisplay } from "@/components/visualizer/heap/heap-display"
import { HeapArray } from "@/components/visualizer/heap/heap-array"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useHeap } from "@/hooks/use-heap"

import { Sparkles } from "lucide-react"
import HeapCodeView from "./Heap code view"

interface HeapVisualizerProps {
  content: React.ReactNode
}

//
// ─────────────────────────────────────────────────────────
// MODE ROUTER (Same as Binary Tree)
// ─────────────────────────────────────────────────────────
//
function HeapVisualizerInner({ content }: HeapVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") {
    return <HeapCodeView />
  }

  return <HeapVisualizerOriginal content={content} />
}

//
// ─────────────────────────────────────────────────────────
// MAIN EXPORT WITH SUSPENSE
// ─────────────────────────────────────────────────────────
//
export function HeapVisualizer({ content }: HeapVisualizerProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <HeapVisualizerInner content={content} />
    </Suspense>
  )
}

//
// ─────────────────────────────────────────────────────────
// ORIGINAL VISUALIZER UI
// ─────────────────────────────────────────────────────────
//
function HeapVisualizerOriginal({ content }: HeapVisualizerProps) {
  const router = useRouter()

  const maxHeap = useHeap("max")
  const minHeap = useHeap("min")

  return (
    <div className="container mx-auto space-y-8">

      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Priority Structure
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Heap Visualization
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              Choose the heap variant you want to explore, and the selected view will fill the workspace.
            </p>
          </div>

          {/* ─── FIXED BUTTON (Now matches Binary Tree) ─── */}
          <button
            onClick={() => router.push("/visualizer/heap?mode=code")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-blue-600/10 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:from-violet-600/20 hover:to-blue-600/20 hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)] dark:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Try with Code
          </button>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <Tabs defaultValue="visualization" className="w-full space-y-6">

        <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-violet-500/12 bg-white/65 p-1 backdrop-blur-lg dark:bg-white/[0.04]">
          <TabsTrigger value="visualization"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Visualization
          </TabsTrigger>

          <TabsTrigger value="explanation"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Explanation
          </TabsTrigger>
        </TabsList>

        {/* ─── VISUALIZATION TAB ─── */}
        <TabsContent value="visualization" className="space-y-6">
          <Tabs defaultValue="max" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/60 backdrop-blur-lg border border-violet-500/10 dark:bg-white/[0.05]">
              <TabsTrigger value="max" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Max Heap
              </TabsTrigger>

              <TabsTrigger value="min" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Min Heap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="max" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Max Heap</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Highest priority item is always at the root.</p>
                      </div>
                      <div className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                        Max Heap
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <HeapControls title="Max Heap" onInsert={maxHeap.insert} onInsertMany={maxHeap.insertMany} onExtract={maxHeap.extractRoot} onClear={maxHeap.clear} heapType={maxHeap.heapType} speed={maxHeap.speed} onSetSpeed={maxHeap.setSpeed} />
                  </div>

                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <HeapArray array={maxHeap.heapArray} />
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                  <HeapDisplay heap={maxHeap.heap} highlightedNodes={maxHeap.highlightedNodes} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="min" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Min Heap</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Lowest priority item is always at the root.</p>
                      </div>
                      <div className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                        Min Heap
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <HeapControls title="Min Heap" onInsert={minHeap.insert} onInsertMany={minHeap.insertMany} onExtract={minHeap.extractRoot} onClear={minHeap.clear} heapType={minHeap.heapType} speed={minHeap.speed} onSetSpeed={minHeap.setSpeed} />
                  </div>

                  <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 dark:bg-white/[0.04] backdrop-blur-xl">
                    <HeapArray array={minHeap.heapArray} />
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                  <HeapDisplay heap={minHeap.heap} highlightedNodes={minHeap.highlightedNodes} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ─── EXPLANATION TAB ─── */}
        <TabsContent value="explanation">
          <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
            <MarkdownContent content={content} />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}