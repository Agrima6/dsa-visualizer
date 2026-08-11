"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const MAX_N = 20

// Real, actually-executed counters — not formulas — for consistency with
// how the rest of this app keeps its numbers honest.
function countFactorialCalls(n: number) {
  let calls = 0
  let maxDepth = 0
  function factorial(k: number, depth: number): number {
    calls++
    maxDepth = Math.max(maxDepth, depth)
    if (k <= 1) return 1
    return k * factorial(k - 1, depth + 1)
  }
  factorial(n, 1)
  return { calls, maxDepth }
}

function countFibCalls(n: number) {
  let calls = 0
  let maxDepth = 0
  function fib(k: number, depth: number): number {
    calls++
    maxDepth = Math.max(maxDepth, depth)
    if (k <= 1) return k
    return fib(k - 1, depth + 1) + fib(k - 2, depth + 1)
  }
  fib(n, 1)
  return { calls, maxDepth }
}

const ROWS = [
  { id: "iterative", label: "Iterative factorial (a loop)", color: "#22c55e" },
  { id: "factorial", label: "Recursive factorial", color: "#3b82f6" },
  { id: "fibonacci", label: "Naive recursive Fibonacci", color: "#ef4444" },
] as const

export function RecursionDepthExplorer() {
  const [n, setN] = useState(6)

  const stats = useMemo(() => {
    const fact = countFactorialCalls(n)
    const fib = countFibCalls(n)
    return {
      iterative: { calls: 1, maxDepth: 1 },
      factorial: fact,
      fibonacci: fib,
    }
  }, [n])

  const maxCalls = Math.max(stats.factorial.calls, stats.fibonacci.calls, 1)

  return (
    <div className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">n</Label>
          <div className="mt-1 text-3xl font-bold tracking-tight">
            n = <span className="hero-gradient-text">{n}</span>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Slider value={n} onChange={setN} min={1} max={MAX_N} />
        </div>
      </div>

      <motion.p
        key={n}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground"
      >
        Recursive factorial makes exactly <span className="font-semibold text-foreground">{stats.factorial.calls}</span> calls
        (one per level) — but naive recursive Fibonacci makes{" "}
        <span className="font-semibold text-rose-500">{stats.fibonacci.calls.toLocaleString("en-US")}</span> calls for the
        same n. Both only ever go <span className="font-semibold text-foreground">{stats.fibonacci.maxDepth}</span> frames deep —
        call <em>count</em> and stack <em>depth</em> are not the same thing.
      </motion.p>

      <div className="mt-5 space-y-3">
        {ROWS.map((row) => {
          const s = stats[row.id]
          const barPercent = Math.max(2, (s.calls / maxCalls) * 100)
          return (
            <div key={row.id} className="flex items-center gap-3 rounded-xl border border-violet-500/10 bg-white/50 px-3 py-2.5 dark:bg-white/[0.02]">
              <span className="w-[190px] shrink-0 text-sm font-medium">{row.label}</span>
              <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                  animate={{ width: `${barPercent}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </span>
              <span className="w-24 shrink-0 text-right font-mono text-sm tabular-nums text-muted-foreground">
                {s.calls.toLocaleString("en-US")} calls
              </span>
              <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground/70">
                depth {s.maxDepth}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
