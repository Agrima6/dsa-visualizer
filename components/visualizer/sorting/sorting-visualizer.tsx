"use client"
// components/visualizer/sorting/sorting-visualizer.tsx

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSorting } from "@/hooks/use-sorting"
import SortingCodeView from "./sorting-code-view"

const MAX_ELEMENTS = 10

const speedOptions = [
  { label: "0.5x", value: 1500 },
  { label: "1x", value: 800 },
  { label: "1.5x", value: 500 },
  { label: "2x", value: 250 },
]

// ── Router ──
function SortingVisualizerInner() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  if (mode === "code") {
    return <SortingCodeView />
  }

  return <SortingVisualizerOriginal />
}

export default function SortingVisualizer() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SortingVisualizerInner />
    </Suspense>
  )
}

// ── Original Visualizer ──
function SortingVisualizerOriginal() {
  const {
    input, setInput, algorithm, setAlgorithm, steps, currentStep,
    current, isPlaying, speed, setSpeed, loadInputArray,
    generateRandomArray, clear, startSorting, nextStep, prevStep, togglePlay,
  } = useSorting()

  const [error, setError] = useState("")

  const maxValue = current.array.length > 0 ? Math.max(...current.array) : 1

  // ✅ FIXED INPUT (max 10, commas allowed)
  const handleInputChange = (value: string) => {
    const parts = value.split(",")
    const cleaned = parts.map(v => v.trim()).filter(v => v !== "")

    if (cleaned.length > MAX_ELEMENTS) {
      setError("Max 10 elements allowed")
      return
    }

    setError("")
    setInput(value)
  }

  return (
    <div className="container mx-auto space-y-8">

      {/* TOP TITLE CONTAINER */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Sorting Visualization
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Understand how sorting algorithms compare, swap, and arrange values step by step through animated visual execution.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[340px_1fr]">
        
        {/* LEFT PANEL */}
        <div className="space-y-6">
          <Card className="p-5 rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]">
            
            <div className="mb-5">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Sorting Controls
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Configure input, algorithm and speed
              </p>
            </div>

            <div className="space-y-4">
              
              {/* INPUT */}
              <div className="space-y-2">
                <label className="text-sm">Enter numbers</label>
                <Input
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g. 5, 2, 9, 1, 7"
                  className="rounded-xl border-violet-500/20 focus:ring-violet-500"
                />
                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
              </div>

              {/* ALGORITHM */}
              <div className="space-y-2">
                <label className="text-sm">Algorithm</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as any)}
                  className="w-full rounded-xl border border-violet-500/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="heap">Heap Sort</option>
                  <option value="shell">Shell Sort</option>
                </select>
              </div>

              {/* ✅ SPEED (only this block changed) */}
              <div className="space-y-2">
                <label className="text-sm">Animation Speed</label>
                <div className="flex gap-2">
                  {speedOptions.map((option) => {
                    const active = speed === option.value
                    return (
                      <button
                        key={option.label}
                        onClick={() => setSpeed(option.value)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all
                          ${active
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-transparent text-muted-foreground border-violet-500/20 hover:bg-violet-500/10"
                          }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={loadInputArray} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white">
                  Set Array
                </Button>
                <Button variant="outline" onClick={() => generateRandomArray(10)} className="rounded-xl border-violet-500/20 hover:bg-violet-500/5">
                  Random
                </Button>
              </div>

              <Button
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)]"
                onClick={startSorting}
                disabled={input.trim().length === 0}
              >
                Start Sorting
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={prevStep} disabled={steps.length === 0 || currentStep === 0}>Prev</Button>
                <Button variant="outline" onClick={togglePlay} disabled={steps.length === 0}>{isPlaying ? "Pause" : "Play"}</Button>
                <Button variant="outline" onClick={nextStep} disabled={steps.length === 0 || currentStep >= steps.length - 1}>Next</Button>
              </div>

              <Button variant="destructive" className="w-full rounded-xl" onClick={clear}>Clear</Button>
            </div>
          </Card>

          {/* STEP INFO */}
          <Card className="p-5 rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04]">
            <div className="mb-5">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Step Info
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Live algorithm execution details
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Step:</strong> {steps.length > 0 ? currentStep + 1 : 0} / {steps.length}</div>
              <div><strong>Message:</strong> {current.message}</div>
              <div><strong>Compared:</strong> {current.compared.length ? current.compared.join(", ") : "-"}</div>
              <div><strong>Swapped:</strong> {current.swapped.length ? current.swapped.join(", ") : "-"}</div>
              <div><strong>Sorted:</strong> {current.sorted.length ? current.sorted.join(", ") : "-"}</div>
            </div>
          </Card>
        </div>

        {/* RIGHT VISUALIZATION (UNCHANGED) */}
        <Card className="p-5 rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Sorting Visualization
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Visual step-by-step execution of sorting algorithm
              </p>
            </div>
            <div className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              {algorithm.toUpperCase()}
            </div>
          </div>

          <div className="flex h-[420px] items-end gap-3 overflow-x-auto rounded-xl border border-violet-500/10 p-4">
            {current.array.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Enter values and click Set Array
              </div>
            ) : (
              current.array.map((value, index) => {
                const isCompared = current.compared.includes(index)
                const isSwapped  = current.swapped.includes(index)
                const isSorted   = current.sorted.includes(index)

                return (
                  <div key={`${index}-${value}-${currentStep}`} className="flex min-w-[42px] flex-col items-center gap-2">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={[
                        "w-10 rounded-t-xl transition-all duration-500 shadow-md",
                        isSorted   ? "bg-gradient-to-t from-green-500 to-emerald-400"
                        : isSwapped ? "bg-gradient-to-t from-rose-500 to-pink-400"
                        : isCompared ? "bg-gradient-to-t from-amber-400 to-yellow-300"
                        : "bg-gradient-to-t from-violet-600 to-blue-500",
                      ].join(" ")}
                      style={{ height: `${Math.max((value / maxValue) * 300, 20)}px` }}
                    />
                    <div className="text-xs text-muted-foreground">{index}</div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}