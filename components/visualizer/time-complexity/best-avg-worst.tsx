"use client"

import { getComplexity } from "./complexity-data"

interface CaseRow {
  label: string
  complexityId: Parameters<typeof getComplexity>[0]
  detail: string
}

interface AlgoCases {
  name: string
  cases: CaseRow[]
}

const EXAMPLES: AlgoCases[] = [
  {
    name: "Linear Search",
    cases: [
      { label: "Best case", complexityId: "o1", detail: "The target happens to be the very first element checked." },
      { label: "Average case", complexityId: "on", detail: "The target is somewhere in the middle — about half the array gets scanned." },
      { label: "Worst case", complexityId: "on", detail: "The target is last, or missing entirely — every element gets checked." },
    ],
  },
  {
    name: "Quicksort",
    cases: [
      { label: "Best case", complexityId: "onlogn", detail: "Each pivot splits the array roughly in half, giving balanced partitions." },
      { label: "Average case", complexityId: "onlogn", detail: "Random-ish data — pivots are 'good enough' on average across many splits." },
      { label: "Worst case", complexityId: "on2", detail: "Picking the smallest or largest element as pivot every time (e.g. an already-sorted array with a naive pivot choice) — the array barely shrinks each split." },
    ],
  },
]

export function BestAvgWorst() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {EXAMPLES.map((algo) => (
        <div
          key={algo.name}
          className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6"
        >
          <h3 className="font-semibold">{algo.name}</h3>
          <div className="mt-4 space-y-3">
            {algo.cases.map((c) => {
              const info = getComplexity(c.complexityId)
              return (
                <div key={c.label} className="flex gap-3 rounded-xl border border-violet-500/10 bg-white/50 p-3 dark:bg-white/[0.02]">
                  <span
                    className="mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold"
                    style={{ backgroundColor: `${info.color}1a`, color: info.color }}
                  >
                    {info.notation}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
