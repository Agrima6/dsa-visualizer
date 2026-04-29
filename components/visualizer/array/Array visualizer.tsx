"use client"
// components/visualizer/array/array-visualizer.tsx

import { Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { ArrayDisplay } from "./Array-display"
import { ArrayControls } from "./Array-controls"
import { useArray } from "@/hooks/Use array"
import ArrayCodeView from "./Array code view"

interface ArrayVisualizerProps {
  content?: React.ReactNode
}

// ── Router ────────────────────────────────────────────────────
function ArrayVisualizerInner({ content }: ArrayVisualizerProps) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") return <ArrayCodeView />
  return <ArrayVisualizerOriginal content={content} />
}

export function ArrayVisualizer({ content }: ArrayVisualizerProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <ArrayVisualizerInner content={content} />
    </Suspense>
  )
}

// ── Original Visualizer ───────────────────────────────────────
function ArrayVisualizerOriginal({ content }: ArrayVisualizerProps) {
  const router = useRouter()

  // Speed ref — updated by the controls, read by the hook's internal timer
  const speedRef = useRef<number>(500)

  const {
    array, highlightedIndices, swappedIndices, sortedIndices,
    message, isAnimating, operations, foundIndex,
    // Result-array state (added to the hook — see note below)
    resultArray, resultHighlighted, resultSwapped, resultSorted, resultFound, hasResult,
    loadArray, insertAt, deleteAt, search,
    reverse, rotateLeft, rotateRight, updateAt, clear,
    setAnimationSpeed,
  } = useArray()

  const handleRandom = () => {
    const count = Math.floor(Math.random() * 5) + 5          // 5–9 elements
    const nums  = Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 1)
    loadArray(nums)
  }

  const handleSpeedChange = (ms: number) => {
    speedRef.current = ms
    setAnimationSpeed(ms)   // if your hook exposes this; see note below
  }

  return (
    <div className="container mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Array Structure
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Array Visualization
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              Explore indexed access, insertion, deletion, search, and traversal step by step through animated cell-by-cell operations.
            </p>
          </div>

          <button
            onClick={() => router.push("/visualizer/array?mode=code")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-blue-600/10 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:from-violet-600/20 hover:to-blue-600/20 hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)] dark:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            Try with Code
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
        <div>
          <ArrayControls
            onLoad={loadArray}
            onInsertAt={insertAt}
            onDeleteAt={deleteAt}
            onSearch={search}
            onReverse={reverse}
            onRotateLeft={rotateLeft}
            onRotateRight={rotateRight}
            onUpdateAt={updateAt}
            onClear={clear}
            onRandom={handleRandom}
            onSpeedChange={handleSpeedChange}   // ← new
            isAnimating={isAnimating}
            operations={operations}
            arrayLength={array.length}
          />
        </div>

        <div className="space-y-6">
          <ArrayDisplay
            array={array}
            highlightedIndices={highlightedIndices}
            swappedIndices={swappedIndices}
            sortedIndices={sortedIndices}
            foundIndex={foundIndex}
            message={message}
            // ── Result array ──
            resultArray={resultArray ?? []}
            resultHighlighted={resultHighlighted ?? []}
            resultSwapped={resultSwapped ?? []}
            resultSorted={resultSorted ?? []}
            resultFound={resultFound ?? null}
            hasResult={hasResult ?? false}
          />

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Access", value: "O(1)", color: "text-emerald-500" },
              { label: "Search", value: "O(n)", color: "text-amber-500"   },
              { label: "Insert", value: "O(n)", color: "text-violet-500"  },
              { label: "Delete", value: "O(n)", color: "text-rose-500"    },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-[22px] border border-violet-500/10 bg-white/65 p-4 dark:bg-white/[0.03]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">{label}</p>
                <p className={`mt-1 font-mono text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {content && (
            <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
              <MarkdownContent content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}