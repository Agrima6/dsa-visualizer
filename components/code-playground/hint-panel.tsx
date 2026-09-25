"use client"

import { useEffect, useState } from "react"
import { Eye, Lightbulb } from "lucide-react"

interface HintPanelProps {
  hints: string[]
  /** The finished code for guided starters, shown only on request. */
  solution?: string
  /** Changing this (e.g. the loaded starter's id) collapses everything again. */
  resetKey: string
}

export function HintPanel({ hints, solution, resetKey }: HintPanelProps) {
  const [shown, setShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    setShown(0)
    setShowSolution(false)
  }, [resetKey])

  if (hints.length === 0 && !solution) return null

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Hints
        </span>
        {shown < hints.length && (
          <button
            onClick={() => setShown((n) => n + 1)}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted"
          >
            {shown === 0 ? "Give me a hint" : `Another hint (${shown}/${hints.length})`}
          </button>
        )}
        {solution && !showSolution && (
          <button
            onClick={() => setShowSolution(true)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Eye className="h-3.5 w-3.5" /> Show answer
          </button>
        )}
      </div>

      {shown > 0 && (
        <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {hints.slice(0, shown).map((h, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-xs text-violet-600 dark:text-violet-300">{i + 1}.</span>
              <span>{h}</span>
            </li>
          ))}
        </ol>
      )}

      {solution && showSolution && (
        <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-neutral-950 p-3 font-mono text-[12px] leading-relaxed text-emerald-300">
          {solution}
        </pre>
      )}
    </div>
  )
}
