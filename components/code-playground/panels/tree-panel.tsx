"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { runUserTreeCode, type TreeRunResult, type TreeStep } from "@/lib/code-playground/tree-runner"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { BinaryTreeDisplay } from "@/components/visualizer/binary-tree/binary-tree-display"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"
import { CodeEditor } from "@/components/visualizer/shared/code-editor"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface SharedTreePlaygroundState {
  code: string
  values: number[]
}

const EMPTY_TREE_STEP: TreeStep = { tree: null, highlightedNodes: [], message: "" }

const STARTER_CODE = `function insert(root, value) {
  if (root === null) {
    return makeNode(value);
  }
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else {
    root.right = insert(root.right, value);
  }
  return root;
}`

export function TreePanel() {
  const [code, setCode] = useState(STARTER_CODE)
  const [input, setInput] = useState("50, 30, 70, 20, 40, 60, 80")
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TreeRunResult | null>(null)
  const [speed, setSpeed] = useState(1)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_TREE_STEP, 500 / speed)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("p")
    if (!param) return
    const shared = decodeState<SharedTreePlaygroundState>(param)
    if (!shared) return
    if (typeof shared.code === "string") setCode(shared.code)
    if (Array.isArray(shared.values) && shared.values.length > 0) setInput(shared.values.join(", "))
  }, [])

  const run = async () => {
    const values = input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))
    if (values.length === 0) {
      setError("Enter comma-separated values to insert first.")
      return
    }
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const res = await runUserTreeCode(code, values)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong running your code.")
    } finally {
      setRunning(false)
    }
  }

  const randomize = () => {
    const seen = new Set<number>()
    while (seen.size < 7) seen.add(Math.floor(Math.random() * 90) + 10)
    setInput(Array.from(seen).join(", "))
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your insert function
        </label>
        <CodeEditor value={code} onChange={setCode} className="h-72" />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comma-separated values to insert, in order"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40"
          />
          <button onClick={randomize} className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <Shuffle className="h-3.5 w-3.5" /> Random
          </button>
        </div>

        <button
          onClick={run}
          disabled={running}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
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
      <div className="rounded-2xl border border-border bg-card p-5">
        {!result ? (
          <div className="flex h-full min-h-[280px] items-center justify-center text-center text-sm text-muted-foreground">
            Run your code to see it animate here.
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground">{result.comparisons}</strong> comparisons
              </span>
              <span className="text-xs text-muted-foreground">
                Step {player.currentStep + 1}/{player.totalSteps}
              </span>
            </div>

            <SpeedControl speed={speed} onSetSpeed={setSpeed} className="mb-3" />

            <div className="h-[360px] overflow-hidden rounded-xl border border-border">
              <BinaryTreeDisplay tree={player.current.tree} highlightedNodes={player.current.highlightedNodes} />
            </div>
            <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">{player.current.message}</p>

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
