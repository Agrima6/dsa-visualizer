"use client"
// components/dashboard/dashboard-client.tsx

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useProgress } from "@/hooks/use-progress"
import {
  getTotalSolved, getEasySolved, getMediumSolved, getHardSolved,
  getTopicStats, getRecentActivity, getDailyProgress,
} from "@/lib/user-progress"
import { DashboardOverview }   from "./dashboard-overview"
import { DashboardActivity }   from "./dashboard-activity"
import { DashboardProblems }   from "./dashboard-problems"
import { DashboardAchievements } from "./dashboard-achievements"
//import { DashboardSettings }   from "./dashboard-settings"
import {
  LayoutDashboard, Flame, BookOpen,
  Trophy, Settings, Loader2,
} from "lucide-react"

const TABS = [
  { id: "overview",      label: "Overview",      icon: LayoutDashboard },
  { id: "activity",      label: "Activity",      icon: Flame           },
  { id: "problems",      label: "Problems",      icon: BookOpen        },
  { id: "achievements",  label: "Achievements",  icon: Trophy          },
  { id: "settings",      label: "Settings",      icon: Settings        },
] as const

type TabId = typeof TABS[number]["id"]

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }

export function DashboardClient() {
  const { user } = useUser()
  const { progress, loading } = useProgress()
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-violet-500 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    </div>
  )

  const totalSolved  = getTotalSolved(progress)
  const easySolved   = getEasySolved(progress)
  const mediumSolved = getMediumSolved(progress)
  const hardSolved   = getHardSolved(progress)
  const topicStats   = getTopicStats(progress)
  const activity     = getRecentActivity(progress, 7)
  const dailyCount   = getDailyProgress(progress)

  const firstName = user?.firstName ?? user?.username ?? "Learner"
  const avatarUrl = user?.imageUrl

  return (
    <div className="container mx-auto space-y-6 pb-16">

      {/* ── Hero header ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* User info */}
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl} alt={firstName}
                className="h-14 w-14 rounded-2xl border-2 border-violet-500/20 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl font-bold text-white shadow-lg">
                {firstName[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AlgoMaitri Dashboard
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent md:text-3xl">
                Welcome back, {firstName}!
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            {[
              { label: "XP",      value: progress.xp.toLocaleString(), color: "text-amber-500"   },
              { label: "Streak",  value: `${progress.streak.current}d`, color: "text-rose-500"    },
              { label: "Solved",  value: totalSolved.toString(),         color: "text-violet-500"  },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl border border-violet-500/10 bg-white/60 px-4 py-3 text-center dark:bg-white/[0.04]">
                <div className={cn("text-xl font-bold font-mono", color)}>{value}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily goal bar */}
        <div className="relative mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Today's Goal</span>
            <span className="font-mono">{dailyCount} / {progress.dailyGoal} problems</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-violet-500/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-700"
              style={{ width: `${Math.min(100, (dailyCount / Math.max(1, progress.dailyGoal)) * 100)}%` }}
            />
          </div>
          {dailyCount >= progress.dailyGoal && progress.dailyGoal > 0 && (
            <p className="text-[11px] text-emerald-500 font-semibold">🎉 Daily goal complete!</p>
          )}
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-violet-500/10 bg-white/60 p-1.5 backdrop-blur-xl dark:bg-white/[0.03]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              activeTab === id
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]"
                : "text-muted-foreground hover:bg-violet-500/5 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────────────── */}
      {activeTab === "overview"     && <DashboardOverview   progress={progress} totalSolved={totalSolved} easySolved={easySolved} mediumSolved={mediumSolved} hardSolved={hardSolved} topicStats={topicStats} activity={activity} dailyCount={dailyCount} />}
      {activeTab === "activity"     && <DashboardActivity   progress={progress} activity={activity} />}
      {activeTab === "problems"     && <DashboardProblems   progress={progress} />}
      {activeTab === "achievements" && <DashboardAchievements progress={progress} totalSolved={totalSolved} />}
      {/*activeTab === "settings"     && <DashboardSettings   progress={progress} />*/}
    </div>
  )
}