"use client"

import { useEffect, useState } from "react"
import { ArrowRightLeft, CheckCircle2, Shuffle, Sparkles, XCircle } from "lucide-react"
import { useSorting } from "@/hooks/use-sorting"
import { SortingBars } from "@/components/visualizer/sorting/sorting-bars"
import type { SortAlgorithm } from "@/components/visualizer/sorting/types"

const ALGORITHMS: { id: SortAlgorithm; label: string }[] = [
  { id: "bubble", label: "Bubble Sort" },
  { id: "selection", label: "Selection Sort" },
  { id: "insertion", label: "Insertion Sort" },
]

type Verdict = { correct: boolean; predictedSwap: boolean; actualSwap: boolean } | null

export default function SortingChallengePage() {
  const sorting = useSorting()
  const [input, setInput] = useState("29, 10, 14, 37, 3")
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble")
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [verdict, setVerdict] = useState<Verdict>(null)

  useEffect(() => {
    sorting.setVoiceEnabled(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const parse = (value: string) => value.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))

  const start = () => {
    const values = parse(input)
    if (values.length === 0) return
    setScore({ correct: 0, total: 0 })
    setVerdict(null)
    setStarted(true)
    sorting.loadSteps(values, algorithm)
  }

  const randomize = () => {
    const arr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10)
    setInput(arr.join(", "))
  }

  // A "predictable" step is one where two indices are being compared —
  // that's the moment right before the algorithm decides whether to swap.
  const isPredictable = sorting.current.compared.length === 2 && sorting.steps.length > 0
  const nextStepData = sorting.steps[sorting.currentStep + 1]
  const isFinished = sorting.steps.length > 0 && sorting.currentStep >= sorting.steps.length - 1

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null

  const predict = (guessSwap: boolean) => {
    if (!nextStepData) return
    const actualSwap = nextStepData.swapped.length > 0
    const correct = guessSwap === actualSwap
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setVerdict({ correct, predictedSwap: guessSwap, actualSwap })
    sorting.nextStep()
  }

  const advance = () => {
    setVerdict(null)
    sorting.nextStep()
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Challenge Mode
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Predict the Swap
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Every time the algorithm compares two elements, guess whether it's about to swap them —
            <em> before</em> the animation reveals the answer. Real understanding beats pattern-watching.
          </p>
        </div>
      </div>

      {!started ? (
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto_auto]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Comma-separated numbers"
              className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as SortAlgorithm)}
              className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm dark:bg-white/[0.04]"
            >
              {ALGORITHMS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <button onClick={randomize} className="flex items-center gap-1.5 rounded-xl border border-violet-500/20 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <Shuffle className="h-3.5 w-3.5" /> Random
            </button>
            <button onClick={start} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Start Challenge
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-3">
            <span className="text-sm font-medium">
              Score: {score.correct}/{score.total} {accuracy !== null && `(${accuracy}%)`}
            </span>
            <button onClick={() => setStarted(false)} className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300">
              New array
            </button>
          </div>

          <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
            <SortingBars step={sorting.current} height={220} />
            <p className="mt-4 text-sm text-muted-foreground">{sorting.current.message}</p>

            {isFinished ? (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">Sorted! Final score: {score.correct}/{score.total}</p>
              </div>
            ) : verdict ? (
              <div className={`mt-5 flex items-center justify-between rounded-xl border p-4 ${verdict.correct ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`}>
                <div className="flex items-center gap-2">
                  {verdict.correct ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
                  <span className="text-sm font-medium">
                    {verdict.correct ? "Correct!" : "Not quite."} They {verdict.actualSwap ? "did" : "didn't"} swap.
                  </span>
                </div>
                <button onClick={advance} className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Continue
                </button>
              </div>
            ) : isPredictable ? (
              <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-500/5 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ArrowRightLeft className="h-4 w-4 text-amber-500" />
                  Will these two elements swap places?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => predict(true)} className="rounded-xl border border-violet-500/20 bg-white/70 py-2.5 text-sm font-semibold transition hover:border-violet-500/40 dark:bg-white/[0.04]">
                    Yes, they'll swap
                  </button>
                  <button onClick={() => predict(false)} className="rounded-xl border border-violet-500/20 bg-white/70 py-2.5 text-sm font-semibold transition hover:border-violet-500/40 dark:bg-white/[0.04]">
                    No, they won't
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={advance} className="mt-5 w-full rounded-xl border border-violet-500/20 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
                Next step →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
