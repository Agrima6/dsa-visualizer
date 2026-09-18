"use client"

import Link from "next/link"
import { AlertTriangle, Sparkles, Bug, Target, Flame, BookOpen, Zap, Crosshair } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { getDailyProgress, getTopicStats, getBugSpotStats, getWeakTopics } from "@/lib/user-progress"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navigation/navbar"
import { Reveal } from "@/components/motion/reveal"
import { ConstellationBackground } from "@/components/visualizer/shared/constellation-background"
import { Planet } from "@/components/visualizer/shared/planet"
import { Compass } from "lucide-react"

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Level is purely cosmetic — a Gen-Z-friendly reframing of the same XP
// number the rest of the dashboard already shows, not a new mechanic.
const XP_PER_LEVEL = 100

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
    const dateStr = formatDate(date)
    return {
      date: dateStr,
      label: date.getDate(),
      isToday: dateStr === formatDate(today),
      isFuture: dateStr > formatDate(today),
    }
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
  const weakTopics = getWeakTopics(progress)
  const solved = progress.solvedProblems.length
  const firstName = user?.firstName || user?.username || "there"
  const isFirstVisit = solved === 0

  const activityByDate = new Map<string, number>()
  for (const problem of progress.solvedProblems) {
    const date = problem.solvedAt.slice(0, 10)
    activityByDate.set(date, (activityByDate.get(date) ?? 0) + 1)
  }

  const level = Math.floor(progress.xp / XP_PER_LEVEL) + 1
  const xpIntoLevel = progress.xp % XP_PER_LEVEL
  const streakOnFire = progress.streak.current >= 3

  return (
    <div className="min-h-screen">
      <div className="pt-4 sm:pt-6">
        <Navbar />
      </div>
        <main className="relative z-0 container mx-auto max-w-6xl space-y-6 px-4 py-8">
        <ConstellationBackground />
        <Reveal as="section" className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10 p-6 md:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-500">Your DSA journey</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Welcome back, {firstName}{" "}
                <span aria-hidden>{streakOnFire ? "🔥" : "👋"}</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                {isFirstVisit
                  ? "Your world map is empty — go solve something and watch it fill in."
                  : "Every number here comes from the questions you actually open and solve."}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 rounded-2xl border border-violet-500/20 bg-background/70 px-4 py-3 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-500">Level {level}</span>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width]"
                  style={{ width: `${xpIntoLevel}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{xpIntoLevel}/{XP_PER_LEVEL} XP to next level</span>
            </div>
          </div>
        </Reveal>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300" role="alert">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {isFirstVisit && (
          <section className="flex items-center gap-4 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
            <Planet theme="violet"><Sparkles className="h-4 w-4" /></Planet>
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
          <Reveal delay={0 * 0.05}>
            <Metric
              icon={<BookOpen className="h-3.5 w-3.5" />}
              accent="violet"
              label="Topics opened"
              value={solved}
              note="Saved to your account"
            />
          </Reveal>
          <Reveal delay={1 * 0.05}>
            <Metric
              icon={<Flame className="h-3.5 w-3.5" />}
              accent="orange"
              label="Current streak"
              value={`${progress.streak.current} day${progress.streak.current === 1 ? "" : "s"}`}
              note={`Best: ${progress.streak.longest} days`}
            />
          </Reveal>
          <Reveal delay={2 * 0.05}>
            <Metric
              icon={<Crosshair className="h-3.5 w-3.5" />}
              accent="blue"
              label="Today"
              value={`${today} / ${progress.dailyGoal}`}
              note="Practice goal"
            />
          </Reveal>
          <Reveal delay={3 * 0.05}>
            <Metric
              icon={<Zap className="h-3.5 w-3.5" />}
              accent="amber"
              label="XP"
              value={progress.xp}
              note="10 / 25 / 50 per Easy / Medium / Hard"
            />
          </Reveal>
          <Reveal delay={4 * 0.05}>
            <Metric
              icon={<Bug className="h-3.5 w-3.5" />}
              accent="emerald"
              label="Bugs spotted"
              value={bugStats.attempts ? `${bugStats.correct}/${bugStats.attempts}` : "—"}
              note={bugStats.attempts ? `${bugStats.accuracy}% accuracy` : "Try it on a Sorting problem"}
            />
          </Reveal>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Reveal className="rounded-3xl border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Your learning streak map 🗺️</h2>
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
                const won = count > 0
                // Future days can't have been "missed" yet, so they stay
                // neutral instead of guilt-tripping the user in advance.
                // Today only turns sad once the day is actually over — while
                // it's still in progress it just carries the usual ring.
                const state: "won" | "lost" | "neutral" = day.isFuture ? "neutral" : won ? "won" : "lost"
                const emoji = state === "won" ? "😄" : state === "lost" ? "😢" : ""
                const label =
                  state === "won"
                    ? `${day.date}: ${count} topic${count === 1 ? "" : "s"} opened — nice!`
                    : state === "lost"
                      ? `${day.date}: nothing opened`
                      : `${day.date}: upcoming`
                return (
                  <div
                    key={day.date}
                    role="img"
                    aria-label={label}
                    title={label}
                    className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
                      state === "won"
                        ? "border-emerald-500/40 bg-emerald-500/15 dark:bg-emerald-500/20"
                        : state === "lost"
                          ? "border-rose-400/40 bg-rose-500/10 dark:bg-rose-500/15"
                          : "border-border bg-muted/30"
                    } ${day.isToday ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {emoji && <span className="text-sm leading-none" aria-hidden>{emoji}</span>}
                    <span
                      className={`text-[10px] font-medium leading-none ${
                        state === "neutral" ? "text-muted-foreground/60" : "text-muted-foreground/90"
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">😄 a day you showed up</span>
              <span className="flex items-center gap-1">😢 a day you didn't</span>
            </p>
          </Reveal>

          <Reveal className="rounded-3xl border bg-card p-6" delay={0.1}>
            <div className="flex items-center gap-3">
              <Planet theme="violet" size="sm"><Compass className="h-3.5 w-3.5" /></Planet>
              <h2 className="font-semibold">Continue exploring</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Choose a company topic to begin or continue a visualizer.</p>
            <Link
              href="/company-questions"
              className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Browse company questions
            </Link>
          </Reveal>
        </section>

        <Reveal as="section" className="rounded-3xl border bg-card p-6">
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
        </Reveal>

        {weakTopics.length > 0 && (
          <Reveal as="section" className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-500" />
              <h2 className="font-semibold">Recommended focus</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on what you haven't opened yet and where your Spot-the-Bug accuracy is lowest.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {weakTopics.map((t) => (
                <Link
                  key={t.topic}
                  href="/company-questions"
                  className="group rounded-2xl border border-amber-500/20 bg-card p-4 transition hover:border-amber-500/40"
                >
                  <p className="font-medium">{t.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.reason === "unstarted" && "Not started yet"}
                    {t.reason === "low-progress" && `${t.solved}/${t.total} solved`}
                    {t.reason === "low-quiz-accuracy" && `${t.bugAccuracy}% quiz accuracy`}
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal as="section" className="rounded-3xl border bg-card p-6">
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
        </Reveal>
      </main>
    </div>
  )
}

const ACCENTS = {
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  orange: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-300",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
} as const

function Metric({
  label,
  value,
  note,
  icon,
  accent = "violet",
}: {
  label: string
  value: string | number
  note: string
  icon?: React.ReactNode
  accent?: keyof typeof ACCENTS
}) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${ACCENTS[accent]}`}>
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}
