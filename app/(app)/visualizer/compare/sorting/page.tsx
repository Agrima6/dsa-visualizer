"use client"

import { useEffect, useState } from "react"
import { Play, Shuffle, Sparkles } from "lucide-react"
import { useSorting } from "@/hooks/use-sorting"
import { SortingBars } from "@/components/visualizer/sorting/sorting-bars"
import type { SortAlgorithm } from "@/components/visualizer/sorting/types"

const ALGORITHMS: { id: SortAlgorithm; label: string }[] = [
  { id: "bubble", label: "Bubble Sort" },
  { id: "selection", label: "Selection Sort" },
  { id: "insertion", label: "Insertion Sort" },
  { id: "merge", label: "Merge Sort" },
  { id: "quick", label: "Quick Sort" },
  { id: "heap", label: "Heap Sort" },
  { id: "shell", label: "Shell Sort" },
]

function ComparePanel({ label, algorithm, array }: { label: string; algorithm: SortAlgorithm; array: number[] }) {
  const sorting = useSorting()

  // Comparison mode drives both panels from one shared array + a per-panel
  // algorithm choice — narration is muted here since two instances
  // narrating simultaneously would talk over each other (and double the
  // TTS cost for no benefit; the side-by-side bars already show the story).
  useEffect(() => {
    sorting.setVoiceEnabled(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (array.length === 0) return
    void sorting.loadAndRun(array, algorithm, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, array])

  const stepCount = sorting.steps.length
  const progress = stepCount > 0 ? Math.round((sorting.currentStep / (stepCount - 1)) * 100) : 0

  return (
    <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <span className="text-xs text-muted-foreground">
          {stepCount > 0 ? `Step ${sorting.currentStep + 1}/${stepCount} · ${progress}%` : "Waiting"}
        </span>
      </div>
      <SortingBars step={sorting.current} height={200} />
      <p className="mt-3 min-h-[1.25rem] text-xs text-muted-foreground">{sorting.current.message}</p>
    </div>
  )
}

export default function SortingComparePage() {
  const [input, setInput] = useState("38, 27, 43, 3, 9, 82, 10")
  const [array, setArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10])
  const [algoA, setAlgoA] = useState<SortAlgorithm>("bubble")
  const [algoB, setAlgoB] = useState<SortAlgorithm>("quick")
  const [runKey, setRunKey] = useState(0)

  const parse = (value: string) => value.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))

  const randomize = () => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10)
    setInput(arr.join(", "))
    setArray(arr)
    setRunKey((k) => k + 1)
  }

  const setAndRun = () => {
    setArray(parse(input))
    setRunKey((k) => k + 1)
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Comparison Mode
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Sorting Algorithms, Side by Side
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Run the same array through two algorithms at once and watch how differently they get to the same answer.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comma-separated numbers"
            className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
          />
          <select
            value={algoA}
            onChange={(e) => setAlgoA(e.target.value as SortAlgorithm)}
            className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm dark:bg-white/[0.04]"
          >
            {ALGORITHMS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
          <select
            value={algoB}
            onChange={(e) => setAlgoB(e.target.value as SortAlgorithm)}
            className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm dark:bg-white/[0.04]"
          >
            {ALGORITHMS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={randomize} className="flex items-center gap-1.5 rounded-xl border border-violet-500/20 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <Shuffle className="h-3.5 w-3.5" /> Random
            </button>
            <button onClick={setAndRun} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
              <Play className="h-3.5 w-3.5" /> Compare
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" key={runKey}>
        <ComparePanel label={ALGORITHMS.find((a) => a.id === algoA)?.label ?? algoA} algorithm={algoA} array={array} />
        <ComparePanel label={ALGORITHMS.find((a) => a.id === algoB)?.label ?? algoB} algorithm={algoB} array={array} />
      </div>
    </div>
  )
}
