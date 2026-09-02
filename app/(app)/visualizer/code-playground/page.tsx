"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Bug, Loader2, Pause, Play, RotateCcw, Shuffle, Sparkles, SkipBack, SkipForward } from "lucide-react"
import { runUserSortCode, type RunResult } from "@/lib/code-playground/runner"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { SortingBars } from "@/components/visualizer/sorting/sorting-bars"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"

interface SharedPlaygroundState {
  code: string
  values: number[]
}

const EMPTY_SORT_STEP = { array: [], compared: [], swapped: [], sorted: [], message: "" }

const TEMPLATES: { id: string; label: string; code: string; input: string; sortsArray: boolean }[] = [
  {
    id: "bubble-sort",
    label: "Bubble Sort",
    sortsArray: true,
    input: "38, 27, 43, 3, 9, 82, 10",
    code: `function solve(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
  {
    id: "linear-search",
    label: "Linear Search",
    sortsArray: false,
    input: "12, 5, 8, 19, 3, 27, 14",
    code: `function solve(arr) {
  var target = 19;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
  },
  {
    id: "reverse-array",
    label: "Reverse Array",
    sortsArray: false,
    input: "5, 12, 8, 1, 27, 9",
    code: `function solve(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left = left + 1;
    right = right - 1;
  }
  return arr;
}`,
  },
  {
    id: "remove-duplicates",
    label: "Remove Duplicates (sorted input)",
    sortsArray: false,
    input: "1, 1, 2, 3, 3, 3, 4, 5, 5",
    code: `function solve(arr) {
  let writeIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || arr[i] !== arr[i - 1]) {
      arr[writeIndex] = arr[i];
      writeIndex = writeIndex + 1;
    }
  }
  return arr.slice(0, writeIndex);
}`,
  },
]

export default function CodePlaygroundPage() {
  const [code, setCode] = useState(TEMPLATES[0].code)
  const [input, setInput] = useState(TEMPLATES[0].input)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [runArray, setRunArray] = useState<number[]>([])
  const [debugMode, setDebugMode] = useState(true)
  // Whether the loaded algorithm is even trying to produce an ascending
  // array — a reverse/dedupe/rotate function correctly leaves the array
  // unsorted, so debug mode (and the "isn't fully sorted" message) must
  // only apply to code that's actually meant to sort. Defaults to true
  // since the default starter (and hand-typed custom code) is a sort.
  const [sortsArray, setSortsArray] = useState(TEMPLATES[0].sortsArray)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_SORT_STEP)

  // Ground truth for debug mode: what the array *should* look like once
  // sorted, computed from whatever array this run was actually given
  // (captured at run time, not re-read from the input field — the user
  // may have edited it since). Only meaningful for algorithms that intend
  // to sort — a pure search/reverse function isn't "wrong" just because
  // its output isn't ascending, so this is gated on mutated below.
  const expectedSorted = useMemo(() => [...runArray].sort((a, b) => a - b), [runArray])
  const mutated = (result?.swaps ?? 0) + (result?.writes ?? 0) > 0
  const incorrectIndices = useMemo(() => {
    if (!debugMode || !mutated || !sortsArray || !result) return []
    const current = player.current.array
    if (current.length !== expectedSorted.length) return []
    const wrong: number[] = []
    current.forEach((v, i) => { if (v !== expectedSorted[i]) wrong.push(i) })
    return wrong
  }, [debugMode, mutated, sortsArray, result, player.current.array, expectedSorted])
  const isLastStep = player.currentStep === player.totalSteps - 1
  const hasBug = mutated && sortsArray && isLastStep && incorrectIndices.length > 0

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("p")
    if (!param) return
    const shared = decodeState<SharedPlaygroundState>(param)
    if (!shared) return
    if (typeof shared.code === "string") setCode(shared.code)
    if (Array.isArray(shared.values) && shared.values.length > 0) setInput(shared.values.join(", "))
  }, [])

  const run = async () => {
    const array = input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))
    if (array.length === 0) {
      setError("Enter a comma-separated array first.")
      return
    }
    setRunning(true)
    setError(null)
    setResult(null)
    setRunArray(array)
    try {
      const res = await runUserSortCode(code, array, sortsArray)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong running your code.")
    } finally {
      setRunning(false)
    }
  }

  const randomize = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10)
    setInput(arr.join(", "))
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Code Playground
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Visualize Your Own Code
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Every other visualizer here animates a reference implementation. This one animates{" "}
            <em>yours</em> — write a function that takes an array, and watch your own comparisons,
            swaps, and writes play out on the same grid. Works for sorting, searching, reversing,
            or any array algorithm you write by hand.
          </p>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Runs entirely in your browser in a sandboxed worker — nothing is sent to a server.
            Works best with direct index writes (<code className="rounded bg-muted px-1">arr[i] = ...</code>) and
            comparisons (<code className="rounded bg-muted px-1">arr[i] &gt; arr[j]</code>) — the common shape of
            hand-written array algorithms.
          </p>
          <a
            href="/visualizer/code-playground/tree"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-violet-500/20 bg-white/60 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:border-violet-500/40 dark:bg-white/[0.04] dark:text-violet-300"
          >
            Binary Tree Playground →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your function
            </label>
            <select
              onChange={(e) => {
                const t = TEMPLATES.find((tpl) => tpl.id === e.target.value)
                if (t) { setCode(t.code); setInput(t.input); setSortsArray(t.sortsArray); setResult(null); setError(null) }
              }}
              defaultValue=""
              className="rounded-lg border border-violet-500/15 bg-white/70 px-2 py-1 text-xs dark:bg-white/[0.04]"
            >
              <option value="" disabled>Load a starter...</option>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-xl border border-violet-500/15 bg-neutral-950 p-4 font-mono text-[13px] leading-relaxed text-emerald-300 outline-none focus:border-violet-500/40"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Comma-separated numbers"
              className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
            <button onClick={randomize} className="flex items-center justify-center gap-1.5 rounded-xl border border-violet-500/20 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <Shuffle className="h-3.5 w-3.5" /> Random
            </button>
          </div>

          <button
            onClick={run}
            disabled={running}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "Running..." : "Run & Visualize"}
          </button>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
          {!result ? (
            <div className="flex h-full min-h-[280px] items-center justify-center text-center text-sm text-muted-foreground">
              Run your code to see it animate here.
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">{result.comparisons}</strong> compares</span>
                  <span><strong className="text-foreground">{result.swaps}</strong> swaps</span>
                  <span><strong className="text-foreground">{result.writes}</strong> writes</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Step {player.currentStep + 1}/{player.totalSteps}
                </span>
              </div>

              {mutated && sortsArray && (
                <label className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} className="accent-red-500" />
                  Debug mode — ring wrong positions against the correctly sorted array
                </label>
              )}

              <SortingBars step={player.current} height={220} incorrect={incorrectIndices} />
              <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">{player.current.message}</p>
              {result.returnValue !== null && player.currentStep === player.totalSteps - 1 && (
                <p className="mt-1 text-sm font-semibold text-violet-600 dark:text-violet-300">
                  Returned: {result.returnValue}
                </p>
              )}

              {hasBug && (
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <Bug className="h-4 w-4" /> Bug found — {incorrectIndices.length} position{incorrectIndices.length === 1 ? "" : "s"} wrong
                  </p>
                  <p className="mt-1 text-xs">
                    Your result: <code className="rounded bg-muted px-1">[{player.current.array.join(", ")}]</code>
                  </p>
                  <p className="text-xs">
                    Expected: <code className="rounded bg-muted px-1">[{expectedSorted.join(", ")}]</code>
                  </p>
                  <p className="mt-1 text-xs">
                    Wrong at index {incorrectIndices.join(", ")} — scrub backward to see the last time your code touched {incorrectIndices.length === 1 ? "that index" : "those indices"}.
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button onClick={player.reset} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Restart">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={player.prevStep} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Previous step">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button onClick={player.togglePlay} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2 text-sm font-semibold text-white">
                  {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {player.isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={player.nextStep} className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground" aria-label="Next step">
                  <SkipForward className="h-4 w-4" />
                </button>
                <ShareButton
                  state={{ code, values: input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v)) }}
                  paramName="p"
                  className="rounded-xl border border-violet-500/20 p-2 text-muted-foreground hover:text-foreground"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
