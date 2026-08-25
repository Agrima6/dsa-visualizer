"use client"

import type { CellStatus } from "@/hooks/use-dp"

interface DPGridProps {
  table: number[][]
  status: CellStatus[][]
  rowLabels: string[]
  colLabels: string[]
}

const statusClasses: Record<CellStatus, string> = {
  idle: "border-border/50 bg-muted/20 text-muted-foreground/40",
  active: "border-amber-400 bg-gradient-to-br from-amber-500/25 to-orange-500/25 text-amber-700 dark:text-amber-300 scale-105 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]",
  filled: "border-violet-500/20 bg-white/70 text-foreground dark:bg-white/[0.04]",
  path: "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300",
}

export function DPGrid({ table, status, rowLabels, colLabels }: DPGridProps) {
  if (table.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-violet-500/20 text-sm text-muted-foreground">
        Press "Run" to build the DP table step by step.
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-[28px] border border-violet-500/15 bg-white/70 p-4 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
      <table className="border-separate" style={{ borderSpacing: 6 }}>
        <thead>
          <tr>
            <th className="h-10 w-10" />
            {colLabels.map((label, j) => (
              <th key={j} className="min-w-10 px-1 text-xs font-mono font-semibold text-muted-foreground">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              <td className="pr-2 text-right text-xs font-mono font-semibold text-muted-foreground">
                {rowLabels[i]}
              </td>
              {row.map((cell, j) => (
                <td key={j}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-sm font-semibold transition-all duration-200 ${statusClasses[status[i]?.[j] ?? "idle"]}`}
                  >
                    {cell}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
