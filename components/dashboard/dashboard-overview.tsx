"use client"
// components/dashboard/dashboard-overview.tsx

import { TopicStat, UserProgress } from "@/lib/user-progress";
import { TrendingUp, Zap, Target, Clock } from "lucide-react"

interface Props {
  progress: UserProgress
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  topicStats: TopicStat[]
  activity: { date: string; count: number }[]
  dailyCount: number
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }

const PANEL = "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035] dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string
  color: string; icon: React.ElementType
}) {
  return (
    <div className={cn(PANEL, "p-5 space-y-3")}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold font-mono tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  )
}

export function DashboardOverview({
  progress, totalSolved, easySolved, mediumSolved, hardSolved,
  topicStats, activity, dailyCount,
}: Props) {
  const TOTAL_PROBLEMS = 28

  // Activity heatmap (last 7 days)
  const maxCount = Math.max(...activity.map(a => a.count), 1)

  const dayLabels = activity.map(a => {
    const d = new Date(a.date)
    return d.toLocaleDateString("en", { weekday: "short" })
  })

  return (
    <div className="space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Solved"
          value={totalSolved}
          sub={`of ${TOTAL_PROBLEMS} problems`}
          color="bg-gradient-to-br from-violet-600 to-blue-600"
          icon={Target}
        />
        <StatCard
          label="Current Streak"
          value={`${progress.streak.current}d`}
          sub={`Best: ${progress.streak.longest} days`}
          color="bg-gradient-to-br from-rose-500 to-orange-500"
          icon={Zap}
        />
        <StatCard
          label="Total XP"
          value={progress.xp.toLocaleString()}
          sub="Experience points"
          color="bg-gradient-to-br from-amber-500 to-yellow-500"
          icon={TrendingUp}
        />
        <StatCard
          label="Today"
          value={dailyCount}
          sub={`Goal: ${progress.dailyGoal} problems`}
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">

        {/* ── Topic progress ── */}
        <div className={cn(PANEL, "p-6 space-y-5")}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Topic Progress
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {totalSolved} / {TOTAL_PROBLEMS}
            </span>
          </div>

          <div className="space-y-3">
            {topicStats.map(({ topic, solved, total }) => {
              const pct = total > 0 ? Math.round((solved / total) * 100) : 0
              const topicLabel = topic.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())
              return (
                <div key={topic} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{topicLabel}</span>
                    <span className="font-mono text-xs text-muted-foreground">{solved}/{total}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-violet-500/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">

          {/* Difficulty breakdown */}
          <div className={cn(PANEL, "p-5 space-y-4")}>
            <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Difficulty Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { label: "Easy",   value: easySolved,   total: 9,  color: "bg-emerald-500", textColor: "text-emerald-500",  barColor: "from-emerald-500 to-teal-400"  },
                { label: "Medium", value: mediumSolved, total: 17, color: "bg-amber-500",   textColor: "text-amber-500",    barColor: "from-amber-500 to-orange-400"  },
                { label: "Hard",   value: hardSolved,   total: 2,  color: "bg-rose-500",    textColor: "text-rose-500",     barColor: "from-rose-500 to-pink-500"     },
              ].map(({ label, value, total, textColor, barColor }) => {
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={cn("font-semibold text-xs", textColor)}>{label}</span>
                      <span className="font-mono text-xs text-muted-foreground">{value}/{total}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet-500/8">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", barColor)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 7-day activity mini chart */}
          <div className={cn(PANEL, "p-5 space-y-4")}>
            <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Last 7 Days
            </h3>
            <div className="flex items-end justify-between gap-2 h-20">
              {activity.map(({ date, count }, i) => {
                const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
                const isToday = i === activity.length - 1
                return (
                  <div key={date} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative w-full flex items-end justify-center" style={{ height: 64 }}>
                      <div
                        className={cn(
                          "w-full rounded-t-lg transition-all duration-500",
                          count === 0
                            ? "bg-violet-500/8"
                            : isToday
                            ? "bg-gradient-to-t from-violet-600 to-fuchsia-500"
                            : "bg-gradient-to-t from-violet-600/70 to-blue-500/70"
                        )}
                        style={{ height: `${Math.max(heightPct, count > 0 ? 15 : 8)}%` }}
                        title={`${count} solved`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{dayLabels[i]}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total this week:</span>
              <span className="font-mono font-semibold text-violet-500">
                {activity.reduce((a, b) => a + b.count, 0)} solved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent solves ── */}
      {progress.solvedProblems.length > 0 && (
        <div className={cn(PANEL, "p-6 space-y-4")}>
          <h3 className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            Recently Solved
          </h3>
          <div className="space-y-2">
            {progress.solvedProblems.slice(0, 5).map((p) => (
              <div
                key={p.slug}
                className="flex items-center justify-between rounded-2xl border border-violet-500/8 bg-white/50 px-4 py-3 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    p.difficulty === "Easy"   ? "bg-emerald-500" :
                    p.difficulty === "Medium" ? "bg-amber-500"   : "bg-rose-500"
                  )} />
                  <span className="text-sm font-medium">{p.title}</span>
                  <span className="rounded-full border border-violet-500/10 bg-violet-500/5 px-2 py-0.5 text-[10px] text-violet-500 capitalize">
                    {p.topic}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[11px] font-semibold",
                    p.difficulty === "Easy"   ? "text-emerald-500" :
                    p.difficulty === "Medium" ? "text-amber-500"   : "text-rose-500"
                  )}>{p.difficulty}</span>
                  <span className="text-[11px] text-muted-foreground/60 font-mono">
                    {new Date(p.solvedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}