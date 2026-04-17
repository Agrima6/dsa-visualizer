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

  const {
    heap,
    heapArray,
    heapType,
    highlightedNodes,
    insert,
    insertMany,
    toggleHeapType,
    clear,
  } = useHeap()

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
              {heapType === "max" ? "Max Heap" : "Min Heap"} Visualization
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              A complete binary tree where each parent node is{" "}
              {heapType === "max" ? "greater" : "smaller"} than its children.
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
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Controls + Array */}
            <div className="xl:col-span-1 space-y-6">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HeapControls
                  onInsert={insert}
                  onInsertMany={insertMany}
                  onClear={clear}
                  onToggleType={toggleHeapType}
                  heapType={heapType}
                />
              </div>

              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HeapArray array={heapArray} />
              </div>
            </div>

            {/* Heap Display */}
            <div className="xl:col-span-2">
              <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
                <HeapDisplay
                  heap={heap}
                  highlightedNodes={highlightedNodes}
                />
              </div>
            </div>
          </div>
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