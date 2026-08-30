"use client"

import type { SortStep } from "./types"

interface SortingBarsProps {
  step: SortStep
  height?: number
}

/** The bar-chart rendering shared between the main sorting visualizer and comparison mode. */
export function SortingBars({ step, height = 220 }: SortingBarsProps) {
  const maxValue = step.array.length > 0 ? Math.max(...step.array) : 1

  return (
    <div className="flex items-end gap-2 overflow-x-auto rounded-xl border border-violet-500/10 p-3" style={{ height: height + 40 }}>
      {step.array.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No array yet</div>
      ) : (
        step.array.map((value, index) => {
          const isCompared = step.compared.includes(index)
          const isSwapped = step.swapped.includes(index)
          const isSorted = step.sorted.includes(index)
          return (
            <div key={`${index}-${value}`} className="flex min-w-[28px] flex-col items-center gap-1">
              <div className="text-[10px] font-medium">{value}</div>
              <div
                className={[
                  "w-7 rounded-t-lg shadow-md transition-all duration-300",
                  isSorted ? "bg-gradient-to-t from-green-500 to-emerald-400"
                  : isSwapped ? "bg-gradient-to-t from-rose-500 to-pink-400"
                  : isCompared ? "bg-gradient-to-t from-amber-400 to-yellow-300"
                  : "bg-gradient-to-t from-violet-600 to-blue-500",
                ].join(" ")}
                style={{ height: `${Math.max((value / maxValue) * height, 14)}px` }}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
