"use client"
// components/dashboard/dashboard-activity.tsx

import { useState } from "react"
import { getRecentActivity, UserProgress } from "@/lib/user-progress";
import { CalendarDays, Flame, TrendingUp } from "lucide-react"

interface Props {
  progress: UserProgress
  activity: { date: string; count: number }[]
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }
const PANEL = "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035]"

// Build last 52 weeks of data for heatmap
function buildHeatmapData(progress: UserProgress) {
  const cells: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const count = progress.solvedProblems.filter(s => s.solvedAt.startsWith(dateStr)).length
    cells.push({ date: dateStr, count })
  }
  return cells
}

function heatColor(count: number) {
  if (count === 0) return "bg-violet-500/[0.07] dark:bg-violet-500/[0.05]"
  if (count === 1) return "bg-violet-400/40"
  if (count === 2) return "bg-violet-500/60"
  if (count === 3) return "bg-violet-600/75"
  return "bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
}

export function DashboardActivity({ progress }: Props) {
  const [range, setRange] = useState<30 | 60 | 90>(30)
  const heatmap = buildHeatmapData(progress)
  const rangeActivity = getRecentActivity(progress, range)

  const totalThisRange = rangeActivity.reduce((a, b) => a + b.count, 0)
  const activeDays = rangeActivity.filter(a => a.count > 0).length
  const avgPerDay = activeDays > 0 ? (totalThisRange / activeDays).toFixed(1) : "0"

  // Group heatmap into weeks
  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < heatmap.length; i += 7) {
    weeks.push(heatmap.slice(i, i + 7))
  }

  const months: string[] = []
  let lastMonth = ""
  weeks.forEach(week => {
    const d = new Date(week[0].date)
    const m = d.toLocaleDateString("en", { month: "short" })
    if (m !== lastMonth) { months.push(m); lastMonth = m } else { months.push("") }
  })

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Current Streak",  value: `${progress.streak.current}d`,  icon: Flame,        color: "text-rose-500"    },
          { label: "Longest Streak",  value: `${progress.streak.longest}d`,  icon: TrendingUp,   color: "text-amber-500"   },
          { label: `Active (${range}d)`, value: `${activeDays}d`,            icon: CalendarDays, color: "text-violet-500"  },
          { label: `Solved (${range}d)`, value: totalThisRange,              icon: TrendingUp,   color: "text-blue-500"    },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={cn(PANEL, "p-4 space-y-2")}>
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</span>
            </div>
            <div className={cn("text-2xl font-bold font-mono", color)}>{value}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className={cn(PANEL, "p-6 space-y-4")}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            Contribution Heatmap
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className={cn("h-3 w-3 rounded-sm", heatColor(v))} />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[520px]">
            {/* Month labels */}
            <div className="mb-1 flex gap-1">
              {months.map((m, i) => (
                <div key={i} className="w-[13px] text-[9px] text-muted-foreground/50 shrink-0">{m}</div>
              ))}
            </div>
            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map(({ date, count }) => (
                    <div
                      key={date}
                      title={`${date}: ${count} solved`}
                      className={cn("h-3 w-3 rounded-sm transition-all duration-200 cursor-default hover:scale-110", heatColor(count))}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Range activity chart */}
      <div className={cn(PANEL, "p-6 space-y-4")}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            Daily Activity
          </h3>
          <div className="flex gap-1.5">
            {([30, 60, 90] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  range === r
                    ? "bg-violet-600 text-white shadow-sm"
                    : "border border-violet-500/10 text-muted-foreground hover:bg-violet-500/5"
                )}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="space-y-1">
          {rangeActivity.filter(a => a.count > 0).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CalendarDays className="mb-3 h-8 w-8 opacity-30" />
              <p className="text-sm">No activity in the last {range} days.</p>
              <p className="text-xs opacity-60 mt-1">Start solving problems to see your history!</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {rangeActivity.slice().reverse().filter((a: { date: string; count: number }) => a.count > 0).map(({ date, count }: { date: string; count: number }) => {
                const maxC = Math.max(...rangeActivity.map(a => a.count), 1)
                const pct = (count / maxC) * 100
                const d = new Date(date)
                const label = d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
                return (
                  <div key={date} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-[11px] font-mono text-muted-foreground">{label}</span>
                    <div className="flex-1 h-5 rounded-lg overflow-hidden bg-violet-500/8">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-[11px] font-mono font-bold text-violet-500">{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-violet-500/10 pt-3 text-xs text-muted-foreground">
          <span>Average on active days</span>
          <span className="font-mono font-semibold text-violet-500">{avgPerDay} problems/day</span>
        </div>
      </div>

      {/* Solve log */}
      {progress.solvedProblems.length > 0 && (
        <div className={cn(PANEL, "p-6 space-y-4")}>
          <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            Full Solve Log
          </h3>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {progress.solvedProblems.map(p => (
              <div
                key={`${p.slug}-${p.solvedAt}`}
                className="flex items-center justify-between rounded-xl border border-violet-500/8 bg-white/40 px-4 py-3 dark:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    p.difficulty === "Easy" ? "bg-emerald-500" : p.difficulty === "Medium" ? "bg-amber-500" : "bg-rose-500"
                  )} />
                  <span className="truncate text-sm font-medium">{p.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="hidden sm:inline rounded-full border border-violet-500/10 bg-violet-500/5 px-2 py-0.5 text-[10px] text-violet-500 capitalize">
                    {p.topic}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground/60">
                    {new Date(p.solvedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "2-digit" })}
                  </span>
                  <span className={cn(
                    "text-[11px] font-semibold w-14 text-right",
                    p.difficulty === "Easy" ? "text-emerald-500" : p.difficulty === "Medium" ? "text-amber-500" : "text-rose-500"
                  )}>+{p.difficulty === "Easy" ? 10 : p.difficulty === "Medium" ? 25 : 50} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}