"use client"

import Link from "next/link"
import { AlertTriangle, Sparkles, Bug } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { getDailyProgress, getTopicStats, getBugSpotStats } from "@/lib/user-progress"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navigation/navbar"

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getCalendarDays() {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  const start = new Date(today)
  start.setDate(today.getDate() - mondayOffset - 28)
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return { date: formatDate(date), label: date.getDate(), isToday: formatDate(date) === formatDate(today) }
  })
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="pt-4 sm:pt-6">
        <Navbar />
      </div>
      <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </main>
    </div>
  )
}

export default function DashboardClient() {
  const { progress, loading, error } = useProgress()
  const { user } = useUser()

  if (loading) return <DashboardSkeleton />

  const today = getDailyProgress(progress)
  const calendarDays = getCalendarDays()
  const topics = getTopicStats(progress)
  const bugStats = getBugSpotStats(progress)
  const solved = progress.solvedProblems.length
  const firstName = user?.firstName || user?.username || "there"
  const isFirstVisit = solved === 0

  const activityByDate = new Map<string, number>()
  for (const problem of progress.solvedProblems) {
    const date = problem.solvedAt.slice(0, 10)
    activityByDate.set(date, (activityByDate.get(date) ?? 0) + 1)
  }

  return (
    <div className="min-h-screen">
      <div className="pt-4 sm:pt-6">
        <Navbar />
      </div>
        <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
        <section className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10 p-6 md:p-8">
          <p className="text-sm font-medium text-violet-500">Your learning dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome back, {firstName}.</h1>
          <p className="mt-2 text-muted-foreground">Every number here comes from the questions you open and solve.</p>
        </section>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300" role="alert">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {isFirstVisit && (
          <section className="flex items-center gap-4 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
            <Sparkles className="h-8 w-8 shrink-0 text-violet-500" />
            <div>
              <h2 className="font-semibold">Nothing here yet — let's fix that.</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Open a company practice question and it'll show up here automatically: streaks, topic progress, and XP.
              </p>
              <Link
                href="/company-questions"
                className="mt-3 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Browse company questions
              </Link>
            </div>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Topics opened" value={solved} note="Saved to your account" />
          <Metric
            label="Current streak"
            value={`${progress.streak.current} day${progress.streak.current === 1 ? "" : "s"}`}
            note={`Best: ${progress.streak.longest} days`}
          />
          <Metric label="Today" value={`${today} / ${progress.dailyGoal}`} note="Practice goal" />
          <Metric label="XP" value={progress.xp} note="10 / 25 / 50 per Easy / Medium / Hard" />
          <Metric
            icon={<Bug className="h-3.5 w-3.5" />}
            label="Bugs spotted"
            value={bugStats.attempts ? `${bugStats.correct}/${bugStats.attempts}` : "—"}
            note={bugStats.attempts ? `${bugStats.accuracy}% accuracy` : "Try it on a Sorting problem"}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Activity calendar</h2>
              <span className="text-xs text-muted-foreground">Monday to Sunday</span>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const count = activityByDate.get(day.date) ?? 0
                return (
                  <div
                    key={day.date}
                    role="img"
                    aria-label={`${day.date}: ${count} topic${count === 1 ? "" : "s"} opened`}
                    title={`${day.date}: ${count} topics`}
                    className={`relative aspect-square rounded-md border ${
                      count ? "border-emerald-500/40 bg-emerald-500" : "border-border bg-muted/40"
                    } ${day.isToday ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-background" : ""}`}
                  >
                    <span className="absolute inset-0 grid place-items-center text-[10px] font-medium text-muted-foreground/80">
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">A green day means you opened a company practice topic.</p>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h2 className="font-semibold">Continue learning</h2>
            <p className="mt-2 text-sm text-muted-foreground">Choose a company topic to begin or continue a visualizer.</p>
            <Link
              href="/company-questions"
              className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Browse company questions
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <h2 className="font-semibold">Topic progress</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {topics.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-sm">
                  <span>{t.label}</span>
                  <span className="text-muted-foreground">
                    {t.solved}/{t.total}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width]"
                    style={{ width: `${t.total ? Math.min(100, (t.solved / t.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <h2 className="font-semibold">Recent practice</h2>
          {progress.solvedProblems.length ? (
            <ul className="mt-4 space-y-2">
              {progress.solvedProblems.slice(0, 6).map((problem) => (
                <li key={problem.slug} className="flex justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm">
                  <span>{problem.title}</span>
                  <span className="text-muted-foreground">{problem.difficulty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No practice yet. Open a company question to start your calendar.</p>
          )}
        </section>
      </main>
    </div>
  )
}

function Metric({
  label,
  value,
  note,
  icon,
}: {
  label: string
  value: string | number
  note: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}
