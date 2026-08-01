"use client"

"use client"

import Link from "next/link"
import { useProgress } from "@/hooks/use-progress"
import { getDailyProgress, getTopicStats } from "@/lib/user-progress"
import { useUser } from "@clerk/nextjs"
import DashboardActivityFeed from "@/components/dashboard/dashboard-activity-feed"

const labels: Record<string, string> = { array: "Arrays", stack: "Stack", queue: "Queue", "linked-list": "Linked list", "binary-tree": "Binary tree", sorting: "Sorting", graph: "Graphs", heap: "Heap" }
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function formatDate(date: Date) { return date.toISOString().slice(0, 10) }

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

export default function DashboardClient() {
  const { progress, loading } = useProgress()
  const { user } = useUser()
  if (loading) return <main className="container mx-auto p-6 text-muted-foreground">Loading your progress…</main>
  const today = getDailyProgress(progress)
  const calendarDays = getCalendarDays()
  const topics = getTopicStats(progress)
  const solved = progress.solvedProblems.length
  const firstName = user?.firstName || user?.username || "there"
  const activityByDate = new Map<string, number>()
  for (const problem of progress.solvedProblems) {
    const date = problem.solvedAt.slice(0, 10)
    activityByDate.set(date, (activityByDate.get(date) ?? 0) + 1)
  }
  return <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
    <section className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10 p-6 md:p-8">
      <p className="text-sm font-medium text-violet-500">Your learning dashboard</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome back, {firstName}.</h1>
      <p className="mt-2 text-muted-foreground">Every number here comes from the questions you open and solve.</p>
    </section>
    <section className="grid gap-4 sm:grid-cols-3">
      <Metric label="Topics opened" value={solved} note="Saved to your account" />
      <Metric label="Current streak" value={`${progress.streak.current} day${progress.streak.current === 1 ? "" : "s"}`} note={`Best: ${progress.streak.longest} days`} />
      <Metric label="Today" value={`${today} / ${progress.dailyGoal}`} note="Practice goal" />
    </section>
    <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-3xl border bg-card p-6">
        <div className="flex items-baseline justify-between"><h2 className="font-semibold">Activity calendar</h2><span className="text-xs text-muted-foreground">Monday to Sunday</span></div>
        <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">{weekdays.map(day => <span key={day}>{day}</span>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-2">{calendarDays.map(day => { const count = activityByDate.get(day.date) ?? 0; return <div key={day.date} title={`${day.date}: ${count} topics`} className={`relative aspect-square rounded-md border ${count ? "border-emerald-500/40 bg-emerald-500" : "border-border bg-muted/40"} ${day.isToday ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-background" : ""}`}><span className="absolute inset-0 grid place-items-center text-[10px] font-medium text-muted-foreground/80">{day.label}</span></div> })}</div>
        <p className="mt-3 text-sm text-muted-foreground">A green day means you opened a company practice topic.</p>
      </div>
      <div className="rounded-3xl border bg-card p-6"><h2 className="font-semibold">Continue learning</h2><p className="mt-2 text-sm text-muted-foreground">Choose a company topic to begin or continue a visualizer.</p><Link href="/company-questions" className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Browse company questions</Link></div>
    </section>
    <section className="rounded-3xl border bg-card p-6"><h2 className="font-semibold">Topic progress</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{topics.map(t => <div key={t.topic}><div className="flex justify-between text-sm"><span>{labels[t.topic] ?? t.topic}</span><span className="text-muted-foreground">{t.solved}/{t.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, t.solved / t.total * 100)}%` }} /></div></div>)}</div></section>
    <section className="rounded-3xl border bg-card p-6"><h2 className="font-semibold">Recent practice</h2>{progress.solvedProblems.length ? <ul className="mt-4 space-y-2">{progress.solvedProblems.slice(0, 6).map(problem => <li key={problem.slug} className="flex justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm"><span>{problem.title}</span><span className="text-muted-foreground">{problem.difficulty}</span></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No practice yet. Open a company question to start your calendar.</p>}</section>
    <DashboardActivityFeed />
  </main>
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) { return <div className="rounded-3xl border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div> }
