"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Bug, LineChart, Loader2, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { runUserSortCode, type RunResult } from "@/lib/code-playground/runner"
import { estimateComplexity, type ComplexityResult } from "@/lib/code-playground/complexity-estimator"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { SortingBars } from "@/components/visualizer/sorting/sorting-bars"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"
import { CodeEditor } from "@/components/visualizer/shared/code-editor"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"
import { HintPanel } from "@/components/code-playground/hint-panel"
import { BLANKS_MESSAGE, hasBlanks } from "@/lib/code-playground/blanks"

interface SharedPlaygroundState {
  code: string
  values: number[]
}

const EMPTY_SORT_STEP = { array: [], compared: [], swapped: [], sorted: [], message: "" }

interface Template {
  id: string
  label: string
  code: string
  input: string
  sortsArray: boolean
  hints: string[]
  solution?: string
}

const TEMPLATES: Template[] = [
  {
    id: "guided-bubble",
    label: "Guided: Bubble Sort (fill in the blanks)",
    sortsArray: true,
    input: "38, 27, 43, 3, 9, 82, 10",
    hints: [
      "Bubble sort repeatedly compares each pair of neighbours and swaps them if they are in the wrong order.",
      "To sort smallest to largest, swap when the left value is bigger than the right one. Which comparison operator means \"bigger than\"?",
      "A swap trades the two values: arr[j] receives the old arr[j + 1], and arr[j + 1] receives the old arr[j].",
    ],
    solution: "if (arr[j] > arr[j + 1]) {\n  [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n}",
    code: `function solve(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      // Is the left neighbour bigger than the right one?
      if (arr[j] ___ arr[j + 1]) {
        // Swap the two neighbours
        [arr[j], arr[j + 1]] = [arr[j + 1], ___];
      }
    }
  }
  return arr;
}`,
  },
  {
    id: "guided-reverse",
    label: "Guided: Reverse Array (fill in the blanks)",
    sortsArray: false,
    input: "5, 12, 8, 1, 27, 9",
    hints: [
      "Use two pointers: one at the start, one at the end. Swap what they point at, then move them toward each other.",
      "The last valid index of an array is its length minus 1.",
      "After each swap, the right pointer must move one step left.",
    ],
    solution: "let right = arr.length - 1;\n...\nright = right - 1;",
    code: `function solve(arr) {
  let left = 0;
  // Start the right pointer at the LAST element
  let right = ___;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left = left + 1;
    // Move the right pointer one step toward the middle
    right = ___;
  }
  return arr;
}`,
  },
  {
    id: "guided-linear-search",
    label: "Guided: Linear Search (fill in the blanks)",
    sortsArray: false,
    input: "12, 5, 8, 19, 3, 27, 14",
    hints: [
      "Linear search looks at each element in turn until it finds the target.",
      "To check whether two values are equal, use three equals signs: ===.",
      "When you find it, return the position where you found it — that's the loop variable i.",
    ],
    solution: "if (arr[i] === target) {\n  return i;\n}",
    code: `function solve(arr) {
  var target = 19;
  for (let i = 0; i < arr.length; i++) {
    // Is this element the one we're looking for?
    if (arr[i] ___ target) {
      // Return the position where we found it
      return ___;
    }
  }
  return -1;
}`,
  },
  {
    id: "bubble-sort",
    label: "Bubble Sort",
    sortsArray: true,
    hints: [
      "Each pass of the inner loop pushes the largest remaining value to the end, like a bubble rising.",
      "The inner loop stops at arr.length - 1 - i because the last i values are already in their final place.",
    ],
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
    hints: [
      "It checks every element one by one, so the work grows with the array's length: O(n).",
      "Change the value of target to search for something else, then re-run and watch where it stops.",
    ],
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
    hints: [
      "Two pointers start at opposite ends and meet in the middle, swapping as they go.",
      "It only needs to loop while left < right — once they meet, everything is already swapped.",
    ],
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
    hints: [
      "Because the input is sorted, duplicates sit next to each other, so you only compare with the previous element.",
      "writeIndex marks where the next unique value should be written. Everything before it is already de-duplicated.",
    ],
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

const DEFAULT_TEMPLATE = TEMPLATES.find((t) => t.id === "bubble-sort")!

export function ArraySortPanel() {
  const [code, setCode] = useState(DEFAULT_TEMPLATE.code)
  const [input, setInput] = useState(DEFAULT_TEMPLATE.input)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [runArray, setRunArray] = useState<number[]>([])
  const [debugMode, setDebugMode] = useState(true)
  const [sortsArray, setSortsArray] = useState(DEFAULT_TEMPLATE.sortsArray)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [complexity, setComplexity] = useState<ComplexityResult | null>(null)
  const [speed, setSpeed] = useState(1)
  const [templateId, setTemplateId] = useState("bubble-sort")

  const player = useTracePlayer(result?.steps ?? [], EMPTY_SORT_STEP, 500 / speed)

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
    if (hasBlanks(code)) {
      setError(BLANKS_MESSAGE)
      return
    }
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

  const analyzeComplexity = async () => {
    setAnalyzing(true)
    setAnalyzeProgress(0)
    setComplexity(null)
    setError(null)
    try {
      const res = await estimateComplexity(code, sortsArray, (completed, total) => setAnalyzeProgress(completed / total))
      setComplexity(res)
      if (res.dataPoints.length === 0) {
        setError(res.error ?? "Couldn't measure complexity — check your code runs correctly first.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong analyzing complexity.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your function
          </label>
          <select
            onChange={(e) => {
              const t = TEMPLATES.find((tpl) => tpl.id === e.target.value)
              if (t) { setTemplateId(t.id); setCode(t.code); setInput(t.input); setSortsArray(t.sortsArray); setResult(null); setError(null); setComplexity(null) }
            }}
            value={templateId}
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <CodeEditor value={code} onChange={setCode} className="h-72" />
        <HintPanel
          hints={TEMPLATES.find((t) => t.id === templateId)?.hints ?? []}
          solution={TEMPLATES.find((t) => t.id === templateId)?.solution}
          resetKey={templateId}
        />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comma-separated numbers"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40"
          />
          <button onClick={randomize} className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <Shuffle className="h-3.5 w-3.5" /> Random
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr]">
          <button
            onClick={run}
            disabled={running}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "Running..." : "Run & Visualize"}
          </button>
          <button
            onClick={analyzeComplexity}
            disabled={analyzing}
            title="Runs your code at several input sizes to estimate its real growth rate — average-case, from an empirical measurement, not a formal proof."
            className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-violet-600 transition hover:border-violet-500/40 disabled:opacity-60 dark:text-violet-300"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <LineChart className="h-4 w-4" />}
            {analyzing ? `Analyzing... ${Math.round(analyzeProgress * 100)}%` : "Analyze Complexity"}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {complexity && complexity.dataPoints.length > 0 && (
          <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <LineChart className="h-4 w-4 text-violet-500" />
                Estimated: <span className="text-violet-600 dark:text-violet-300">{complexity.bestFit}</span>
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
              {complexity.dataPoints.map((p) => (
                <span key={p.n}>n={p.n} → {p.ops.toLocaleString()} ops</span>
              ))}
            </div>
            {complexity.error && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Stopped early at a larger size: {complexity.error}
              </p>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Measured on random input, not a worst-case guarantee — an algorithm whose behavior depends on
              already-sorted or adversarial input may show a different growth rate here than its textbook worst case.
            </p>
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="rounded-2xl border border-border bg-card p-5">
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

            <SpeedControl speed={speed} onSetSpeed={setSpeed} className="mb-3" />

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
              <button onClick={player.reset} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Restart">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={player.prevStep} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Previous step">
                <SkipBack className="h-4 w-4" />
              </button>
              <button onClick={player.togglePlay} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {player.isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={player.nextStep} className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Next step">
                <SkipForward className="h-4 w-4" />
              </button>
              <ShareButton
                state={{ code, values: input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v)) }}
                paramName="p"
                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
