"use client"
// components/dashboard/dashboard-achievements.tsx

import type { UserProgress } from "@/lib/user-progress"
import { Lock } from "lucide-react"

interface Props {
  progress: UserProgress
  totalSolved: number
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }
const PANEL = "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035]"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xp: number
  unlocked: (p: UserProgress, total: number) => boolean
  progress: (p: UserProgress, total: number) => { current: number; target: number }
  category: "solving" | "streak" | "xp" | "topics"
}

const ACHIEVEMENTS: Achievement[] = [
  // ── Solving ──────────────────────────────────────────────────
  {
    id: "first-blood",
    title: "First Blood",
    description: "Solve your first problem",
    icon: "🎯",
    xp: 50,
    unlocked: (_, t) => t >= 1,
    progress: (_, t) => ({ current: Math.min(t, 1), target: 1 }),
    category: "solving",
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Solve 5 problems",
    icon: "🚀",
    xp: 100,
    unlocked: (_, t) => t >= 5,
    progress: (_, t) => ({ current: Math.min(t, 5), target: 5 }),
    category: "solving",
  },
  {
    id: "problem-solver",
    title: "Problem Solver",
    description: "Solve 10 problems",
    icon: "💡",
    xp: 200,
    unlocked: (_, t) => t >= 10,
    progress: (_, t) => ({ current: Math.min(t, 10), target: 10 }),
    category: "solving",
  },
  {
    id: "halfway-there",
    title: "Halfway There",
    description: "Solve 14 problems (50% complete)",
    icon: "⭐",
    xp: 300,
    unlocked: (_, t) => t >= 14,
    progress: (_, t) => ({ current: Math.min(t, 14), target: 14 }),
    category: "solving",
  },
  {
    id: "array-master",
    title: "Array Master",
    description: "Solve all 28 array problems",
    icon: "👑",
    xp: 1000,
    unlocked: (_, t) => t >= 28,
    progress: (_, t) => ({ current: Math.min(t, 28), target: 28 }),
    category: "solving",
  },
  // ── Difficulty ───────────────────────────────────────────────
  {
    id: "easy-rider",
    title: "Easy Rider",
    description: "Solve all Easy problems",
    icon: "🌱",
    xp: 150,
    unlocked: (p) => p.solvedProblems.filter(s => s.difficulty === "Easy").length >= 9,
    progress: (p) => ({ current: Math.min(p.solvedProblems.filter(s => s.difficulty === "Easy").length, 9), target: 9 }),
    category: "solving",
  },
  {
    id: "medium-rare",
    title: "Medium Rare",
    description: "Solve 5 Medium problems",
    icon: "🔥",
    xp: 250,
    unlocked: (p) => p.solvedProblems.filter(s => s.difficulty === "Medium").length >= 5,
    progress: (p) => ({ current: Math.min(p.solvedProblems.filter(s => s.difficulty === "Medium").length, 5), target: 5 }),
    category: "solving",
  },
  {
    id: "hard-mode",
    title: "Hard Mode",
    description: "Solve a Hard problem",
    icon: "💀",
    xp: 500,
    unlocked: (p) => p.solvedProblems.some(s => s.difficulty === "Hard"),
    progress: (p) => ({ current: p.solvedProblems.some(s => s.difficulty === "Hard") ? 1 : 0, target: 1 }),
    category: "solving",
  },
  // ── Streaks ──────────────────────────────────────────────────
  {
    id: "on-fire",
    title: "On Fire",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    xp: 100,
    unlocked: (p) => p.streak.longest >= 3,
    progress: (p) => ({ current: Math.min(p.streak.longest, 3), target: 3 }),
    category: "streak",
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    xp: 250,
    unlocked: (p) => p.streak.longest >= 7,
    progress: (p) => ({ current: Math.min(p.streak.longest, 7), target: 7 }),
    category: "streak",
  },
  {
    id: "unstoppable",
    title: "Unstoppable",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    xp: 1000,
    unlocked: (p) => p.streak.longest >= 30,
    progress: (p) => ({ current: Math.min(p.streak.longest, 30), target: 30 }),
    category: "streak",
  },
  // ── XP ───────────────────────────────────────────────────────
  {
    id: "xp-100",
    title: "Century",
    description: "Earn 100 XP",
    icon: "💎",
    xp: 0,
    unlocked: (p) => p.xp >= 100,
    progress: (p) => ({ current: Math.min(p.xp, 100), target: 100 }),
    category: "xp",
  },
  {
    id: "xp-500",
    title: "XP Hunter",
    description: "Earn 500 XP",
    icon: "🏆",
    xp: 0,
    unlocked: (p) => p.xp >= 500,
    progress: (p) => ({ current: Math.min(p.xp, 500), target: 500 }),
    category: "xp",
  },
  {
    id: "xp-1000",
    title: "Elite",
    description: "Earn 1000 XP",
    icon: "🥇",
    xp: 0,
    unlocked: (p) => p.xp >= 1000,
    progress: (p) => ({ current: Math.min(p.xp, 1000), target: 1000 }),
    category: "xp",
  },
]

const CATEGORIES = [
  { id: "solving", label: "Problem Solving" },
  { id: "streak",  label: "Streaks"         },
  { id: "xp",      label: "XP Milestones"   },
] as const

export function DashboardAchievements({ progress, totalSolved }: Props) {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked(progress, totalSolved)).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className={cn(PANEL, "p-5")}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Achievements
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {unlockedCount} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
          <div className="text-3xl font-bold font-mono text-amber-500">
            {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-500/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* By category */}
      {CATEGORIES.map(({ id, label }) => {
        const list = ACHIEVEMENTS.filter(a => a.category === id)
        return (
          <div key={id} className={cn(PANEL, "p-6 space-y-4")}>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{label}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {list.map(a => {
                const unlocked = a.unlocked(progress, totalSolved)
                const { current, target } = a.progress(progress, totalSolved)
                const pct = Math.min(100, Math.round((current / target) * 100))
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-4 transition-all duration-200",
                      unlocked
                        ? "border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                        : "border-violet-500/10 bg-white/40 dark:bg-white/[0.02]"
                    )}
                  >
                    {/* Lock overlay */}
                    {!unlocked && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/30" />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl",
                        unlocked ? "opacity-100" : "opacity-30 grayscale"
                      )}>
                        {a.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-semibold",
                            unlocked ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {a.title}
                          </span>
                          {unlocked && a.xp > 0 && (
                            <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                              +{a.xp} XP
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-4">{a.description}</p>

                        {/* Progress bar */}
                        {!unlocked && (
                          <div className="mt-2 space-y-1">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-violet-500/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground/50">
                              {current} / {target}
                            </div>
                          </div>
                        )}

                        {unlocked && (
                          <div className="mt-1.5 flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-semibold">Unlocked!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}