"use client"
// components/dashboard/dashboard-problems.tsx
// Shows all problems from array-problems-data with solved/unsolved state
// and a "Mark Solved" button that writes to Clerk.

import { useState } from "react"
import { useProgress } from "@/hooks/use-progress"
import { ARRAY_PROBLEMS } from "@/components/visualizer/array/Array problems data"
import type { UserProgress } from "@/lib/user-progress"
import { CheckCircle2, Circle, Search, Filter } from "lucide-react"

interface Props { progress: UserProgress }

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }
const PANEL = "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035]"

const DIFF_STYLE = {
  Easy:   "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  Medium: "text-amber-500  bg-amber-500/10  border border-amber-500/20",
  Hard:   "text-rose-500   bg-rose-500/10   border border-rose-500/20",
}

export function DashboardProblems({ progress }: Props) {
  const { markSolved, unmarkSolved, isSolved } = useProgress()
  const [search, setSearch] = useState("")
  const [filterDiff, setFilterDiff] = useState<"All" | "Easy" | "Medium" | "Hard">("All")
  const [filterStatus, setFilterStatus] = useState<"All" | "Solved" | "Unsolved">("All")
  const [marking, setMarking] = useState<string | null>(null)

  const filtered = ARRAY_PROBLEMS.filter(p => {
    const matchDiff   = filterDiff === "All" || p.difficulty === filterDiff
    const matchStatus = filterStatus === "All"
      || (filterStatus === "Solved"   &&  isSolved(p.slug))
      || (filterStatus === "Unsolved" && !isSolved(p.slug))
    const q = search.toLowerCase()
    const matchSearch = p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    return matchDiff && matchStatus && matchSearch
  })

  const handleToggle = async (p: typeof ARRAY_PROBLEMS[0]) => {
    setMarking(p.slug)
    try {
      if (isSolved(p.slug)) {
        await unmarkSolved(p.slug)
      } else {
        await markSolved({
          slug:       p.slug,
          title:      p.title,
          difficulty: p.difficulty,
          topic:      "array",
        })
      }
    } finally {
      setMarking(null)
    }
  }

  const solvedCount = ARRAY_PROBLEMS.filter(p => isSolved(p.slug)).length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className={cn(PANEL, "p-5")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Problem Tracker
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {solvedCount} of {ARRAY_PROBLEMS.length} problems solved · Click to mark solved/unsolved
            </p>
          </div>
          {/* Mini progress */}
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-violet-500/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all"
                style={{ width: `${(solvedCount / ARRAY_PROBLEMS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-violet-500">
              {Math.round((solvedCount / ARRAY_PROBLEMS.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems or tags…"
            className="h-11 w-full rounded-xl border border-violet-500/15 bg-white/80 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground/45 focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/15 dark:bg-white/[0.04]"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
            <button
              key={d}
              onClick={() => setFilterDiff(d)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition-all",
                filterDiff === d
                  ? d === "All"    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent"
                    : d === "Easy"   ? "bg-emerald-500/12 text-emerald-600 border-emerald-500/20"
                    : d === "Medium" ? "bg-amber-500/12 text-amber-600 border-amber-500/20"
                    :                  "bg-rose-500/12 text-rose-600 border-rose-500/20"
                  : "border-violet-500/12 bg-white/70 text-muted-foreground hover:bg-violet-500/5 dark:bg-white/[0.03]"
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["All", "Solved", "Unsolved"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition-all",
                filterStatus === s
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent"
                  : "border-violet-500/12 bg-white/70 text-muted-foreground hover:bg-violet-500/5 dark:bg-white/[0.03]"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      <div className={cn(PANEL, "overflow-hidden")}>
        {/* Table header */}
        <div className="hidden sm:grid sm:grid-cols-[32px_1fr_80px_80px_100px] items-center gap-4 px-5 py-3 border-b border-violet-500/8 bg-violet-500/[0.02] text-[11px] uppercase tracking-wider text-muted-foreground/55">
          <span />
          <span>Problem</span>
          <span>Topic</span>
          <span>Difficulty</span>
          <span className="text-right">XP</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">No problems match your filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-violet-500/5">
            {filtered.map(p => {
              const solved  = isSolved(p.slug)
              const loading = marking === p.slug
              const xp      = p.difficulty === "Easy" ? 10 : p.difficulty === "Medium" ? 25 : 50

              return (
                <div
                  key={p.slug}
                  className={cn(
                    "grid grid-cols-1 gap-3 px-5 py-4 transition-colors sm:grid-cols-[32px_1fr_80px_80px_100px] sm:items-center sm:gap-4",
                    solved ? "bg-emerald-500/[0.03]" : "hover:bg-violet-500/[0.02]"
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(p)}
                    disabled={loading}
                    className="flex items-center justify-center h-6 w-6 transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                    ) : solved ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30" />
                    )}
                  </button>

                  {/* Title + tags */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "text-sm font-semibold",
                        solved ? "text-muted-foreground line-through decoration-emerald-500/50" : "text-foreground"
                      )}>
                        {p.title}
                      </span>
                      {p.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="rounded-full border border-violet-500/10 bg-violet-500/5 px-2 py-0.5 text-[10px] text-violet-500 dark:text-violet-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {solved && (() => {
                      const entry = progress.solvedProblems.find(s => s.slug === p.slug)
                      return entry ? (
                        <p className="mt-0.5 text-[11px] text-muted-foreground/50 font-mono">
                          Solved {new Date(entry.solvedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                        </p>
                      ) : null
                    })()}
                  </div>

                  {/* Topic */}
                  <span className="hidden sm:inline text-xs text-muted-foreground capitalize">array</span>

                  {/* Difficulty */}
                  <span className={cn(
                    "hidden sm:inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    DIFF_STYLE[p.difficulty]
                  )}>
                    {p.difficulty}
                  </span>

                  {/* XP */}
                  <div className="hidden sm:flex items-center justify-end">
                    <span className={cn(
                      "text-xs font-mono font-semibold",
                      solved ? "text-emerald-500" : "text-muted-foreground/50"
                    )}>
                      {solved ? "+" : ""}{xp} XP
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}