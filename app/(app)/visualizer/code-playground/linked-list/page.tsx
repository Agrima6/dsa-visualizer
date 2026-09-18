"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, RotateCcw, Shuffle, Sparkles, SkipBack, SkipForward } from "lucide-react"
import { runUserLinkedListCode, type LinkedListRunMode, type LinkedListRunResult, type LinkedListStep } from "@/lib/code-playground/linked-list-runner"
import { useTracePlayer } from "@/hooks/use-trace-player"
import { LinkedListChainDisplay } from "@/components/code-playground/linked-list-chain-display"
import { ShareButton } from "@/components/visualizer/shared/share-button"
import { decodeState } from "@/lib/share-state"
import { Reveal } from "@/components/motion/reveal"
import { ConstellationBackground } from "@/components/visualizer/shared/constellation-background"
import { Planet } from "@/components/visualizer/shared/planet"
import { Rows3, GitBranch, Boxes } from "lucide-react"

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

export default function LinkedListCodePlaygroundPage() {
  const [code, setCode] = useState(TEMPLATES[0].code)
  const [input, setInput] = useState("10, 20, 30")
  const [queryTarget, setQueryTarget] = useState("20")
  const [mode, setMode] = useState<LinkedListRunMode>(TEMPLATES[0].mode)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LinkedListRunResult | null>(null)

  const player = useTracePlayer(result?.steps ?? [], EMPTY_STEP)

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
    <div className="relative z-0 container mx-auto space-y-8">
      <ConstellationBackground />
      <Reveal className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Code Playground — The Linked List Chain
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Forge Your Own Chain of Nodes
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Write your own singly-linked list function — insert, search, or anything else that walks a
            list via <code className="rounded bg-muted px-1">.next</code> — and watch <em>your</em> pointer
            actually move through it.
          </p>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Runs entirely in your browser in a sandboxed worker — nothing is sent to a server. Create
            nodes with the provided <code className="rounded bg-muted px-1">makeNode(value)</code> helper,
            then read/compare <code className="rounded bg-muted px-1">node.value</code> and assign{" "}
            <code className="rounded bg-muted px-1">node.next</code> as usual. Works best for operations
            that don't change which node is the head mid-function (append, search, insert-at-front) —
            an operation like reversing the whole list will still return the right answer, but its
            in-progress animation frames may look incomplete until the final step.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a href="/visualizer/code-playground" className="group flex items-center gap-2.5">
              <Planet theme="amber" size="sm"><Rows3 className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">← Array & Sorting Playground</span>
            </a>
            <a href="/visualizer/code-playground/tree" className="group flex items-center gap-2.5">
              <Planet theme="blue" size="sm"><GitBranch className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">Binary Tree Playground</span>
            </a>
            <a href="/visualizer/code-playground/stack-queue" className="group flex items-center gap-2.5">
              <Planet theme="violet" size="sm"><Boxes className="h-3.5 w-3.5" /></Planet>
              <span className="text-xs font-semibold text-violet-600 group-hover:underline dark:text-violet-300">Stack & Queue Playground →</span>
            </a>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
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
            className="h-64 w-full resize-none rounded-xl border border-violet-500/15 bg-neutral-950 p-4 font-mono text-[13px] leading-relaxed text-emerald-300 outline-none focus:border-violet-500/40"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "build" ? "Comma-separated values to insert, in order" : "Comma-separated starting list values"}
              className="rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
            <button onClick={randomize} className="flex items-center justify-center gap-1.5 rounded-xl border border-violet-500/20 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <Shuffle className="h-3.5 w-3.5" /> Random
            </button>
          </div>

          {mode === "query" && (
            <input
              value={queryTarget}
              onChange={(e) => setQueryTarget(e.target.value)}
              placeholder="Value to search for"
              className="mt-3 w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
          )}

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
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{result.comparisons}</strong> comparisons
                </span>
                <span className="text-xs text-muted-foreground">
                  Step {player.currentStep + 1}/{player.totalSteps}
                </span>
              </div>

              <div className="min-h-[180px] overflow-hidden rounded-xl border border-violet-500/10">
                <LinkedListChainDisplay list={player.current.list} highlightedNodes={player.current.highlightedNodes} />
              </div>
              <p className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">{player.current.message}</p>

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
                  state={{
                    code,
                    values: input.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v)),
                    mode,
                    queryTarget: mode === "query" ? parseInt(queryTarget.trim(), 10) : undefined,
                  }}
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
