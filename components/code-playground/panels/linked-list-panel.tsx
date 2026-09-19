"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { runUserLinkedListCode, type LinkedListRunMode, type LinkedListRunResult, type LinkedListStep } from "@/lib/code-playground/linked-list-runner"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { LinkedListChainDisplay } from "@/components/code-playground/linked-list-chain-display"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"
import { CodeEditor } from "@/components/visualizer/shared/code-editor"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface SharedLinkedListPlaygroundState {
  code: string
  values: number[]
  mode?: LinkedListRunMode
  queryTarget?: number
}

const EMPTY_STEP: LinkedListStep = { list: [], highlightedNodes: [], message: "" }

const TEMPLATES: { id: string; label: string; code: string; mode: LinkedListRunMode }[] = [
  {
    id: "insert-at-end",
    label: "Insert at End",
    mode: "build",
    code: `function insertAtEnd(head, value) {
  const node = makeNode(value);
  if (head === null) return node;
  let current = head;
  while (current.next !== null) {
    current = current.next;
  }
  current.next = node;
  return head;
}`,
  },
  {
    id: "insert-at-front",
    label: "Insert at Front",
    mode: "build",
    code: `function insertAtFront(head, value) {
  const node = makeNode(value);
  node.next = head;
  return node;
}`,
  },
  {
    id: "search",
    label: "Search",
    mode: "query",
    code: `function search(head, target) {
  let current = head;
  while (current !== null) {
    if (current.value === target) {
      return true;
    }
    current = current.next;
  }
  return false;
}`,
  },
]

export function LinkedListPanel() {
  const [code, setCode] = useState(TEMPLATES[0].code)
  const [input, setInput] = useState("10, 20, 30")
  const [queryTarget, setQueryTarget] = useState("20")
  const [mode, setMode] = useState<LinkedListRunMode>(TEMPLATES[0].mode)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LinkedListRunResult | null>(null)
  const [speed, setSpeed] = useState(1)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_STEP, 500 / speed)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("p")
    if (!param) return
    const shared = decodeState<SharedLinkedListPlaygroundState>(param)
    if (!shared) return
    if (typeof shared.code === "string") setCode(shared.code)
    if (Array.isArray(shared.values) && shared.values.length > 0) setInput(shared.values.join(", "))
    if (shared.mode === "build" || shared.mode === "query") setMode(shared.mode)
    if (typeof shared.queryTarget === "number") setQueryTarget(String(shared.queryTarget))
  }, [])

  const run = async () => {
    const values = input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v))
    if (values.length === 0) {
      setError(mode === "build" ? "Enter comma-separated values first." : "Enter the list's starting values first.")
      return
    }
    const target = parseInt(queryTarget.trim(), 10)
    if (mode === "query" && isNaN(target)) {
      setError("Enter a value to search for.")
      return
    }
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const res = await runUserLinkedListCode(code, values, mode, mode === "query" ? target : undefined)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong running your code.")
    } finally {
      setRunning(false)
    }
  }

  const randomize = () => {
    const arr = Array.from({ length: 4 }, () => Math.floor(Math.random() * 90) + 10)
    setInput(arr.join(", "))
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your list function
          </label>
          <select
            onChange={(e) => {
              const t = TEMPLATES.find((tpl) => tpl.id === e.target.value)
              if (t) { setCode(t.code); setMode(t.mode); setResult(null); setError(null) }
            }}
            defaultValue=""
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="" disabled>Load a starter...</option>
            {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <CodeEditor value={code} onChange={setCode} className="h-64" />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "build" ? "Comma-separated values to insert, in order" : "Comma-separated starting list values"}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40"
          />
          <button onClick={randomize} className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <Shuffle className="h-3.5 w-3.5" /> Random
          </button>
        </div>

        {mode === "query" && (
          <input
            value={queryTarget}
            onChange={(e) => setQueryTarget(e.target.value)}
            placeholder="Value to search for"
            className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40"
          />
        )}

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

            <div className="min-h-[180px] overflow-hidden rounded-xl border border-border">
              <LinkedListChainDisplay list={player.current.list} highlightedNodes={player.current.highlightedNodes} />
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
                state={{
                  code,
                  values: input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v)),
                  mode,
                  queryTarget: mode === "query" ? parseInt(queryTarget.trim(), 10) : undefined,
                }}
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
