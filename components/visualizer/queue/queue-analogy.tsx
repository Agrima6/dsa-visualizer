"use client"
// components/visualizer/queue/queue-analogy.tsx
// "Understand" step: connects FIFO to something already familiar — a
// printer queue / CPU process scheduler — before formal terminology.

import { useState } from "react"
import { Printer, Sparkles, Users } from "lucide-react"

const JOB_NAMES = ["Process A", "Process B", "Process C", "Process D"]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function QueueAnalogy() {
  const [queue, setQueue] = useState<string[]>([])
  const [nextIdx, setNextIdx] = useState(0)
  const [justProcessed, setJustProcessed] = useState<string | null>(null)

  const canSubmit = nextIdx < JOB_NAMES.length
  const front = queue[0]

  const submit = () => {
    if (!canSubmit) return
    setJustProcessed(null)
    setQueue((q) => [...q, JOB_NAMES[nextIdx]])
    setNextIdx((i) => i + 1)
  }

  const processNext = () => {
    if (queue.length === 0) return
    setJustProcessed(front)
    setQueue((q) => q.slice(1))
  }

  const reset = () => {
    setQueue([])
    setNextIdx(0)
    setJustProcessed(null)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <Printer className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">A queue is just a fair line</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Send three documents to a shared office printer, and they don&apos;t print in random order —
              the first one you sent is the first one that comes out. Your computer&apos;s CPU schedules
              processes the same way: whoever got in line first gets served first. That&apos;s FIFO: First In, First Out.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">Try it</p>

        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-violet-500" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Process queue</p>
        </div>

        <div className="flex min-h-[110px] items-center gap-3 overflow-x-auto rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] p-4">
          {queue.length === 0 && (
            <p className="w-full text-center text-xs text-muted-foreground/70">Empty — submit a process to enqueue it</p>
          )}
          {queue.map((job, i) => {
            const isFront = i === 0
            return (
              <div key={`${job}-${i}`} className="flex shrink-0 flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-16 w-24 items-center justify-center rounded-xl border px-2 text-center text-xs font-semibold transition-all",
                    isFront
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-600 dark:text-violet-300 shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
                      : "border-border/60 bg-white/60 text-muted-foreground dark:bg-white/[0.03]"
                  )}
                >
                  {job}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/70">
                  {isFront ? "front — next out" : `#${i + 1} waiting`}
                </span>
              </div>
            )
          })}
          {queue.length > 0 && (
            <div className="ml-auto shrink-0 text-2xl text-violet-500/40">→</div>
          )}
        </div>
        {justProcessed && (
          <p className="mt-2 text-xs text-emerald-500">
            ✓ <span className="font-semibold">{justProcessed}</span> processed — it had been waiting longest, at the front.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] transition-all disabled:opacity-40"
          >
            {canSubmit ? `Submit ${JOB_NAMES[nextIdx]}` : "All processes submitted"}
          </button>
          <button
            onClick={processNext}
            disabled={queue.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-violet-500/5 disabled:opacity-40 dark:bg-white/[0.03]"
          >
            Process next →
          </button>
          <button onClick={reset} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] to-blue-500/[0.06] p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-violet-500" />
          <div>
            <h3 className="text-sm font-semibold">Everywhere in real systems</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Download managers, network request buffers, message brokers, and people waiting in an
              actual line all follow the same rule: whoever arrived first gets served first. Nothing
              jumps the queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
