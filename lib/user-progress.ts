// lib/user-progress.ts
// Progress is stored server-side in Clerk's privateMetadata — never
// client-writable. See app/api/progress/route.ts for the only place
// that's allowed to persist it.

import { TOPIC_REGISTRY } from "@/lib/topics"

export interface ProblemEntry {
  slug: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string          // e.g. "arrays" — must match a TOPIC_REGISTRY slug
  solvedAt: string       // ISO date string
  timeTakenSecs?: number // optional stopwatch value
  notes?: string
}

export interface StreakData {
  current: number
  longest: number
  lastActiveDate: string // YYYY-MM-DD
}

export interface TopicStat {
  topic: string
  label: string
  solved: number
  total: number
}

export interface UserProgress {
  solvedProblems: ProblemEntry[]
  streak: StreakData
  joinedAt: string        // ISO date
  dailyGoal: number       // problems per day target
  xp: number
}

export const EMPTY_PROGRESS: UserProgress = {
  solvedProblems: [],
  streak: { current: 0, longest: 0, lastActiveDate: "" },
  joinedAt: new Date().toISOString(),
  dailyGoal: 3,
  xp: 0,
}

// XP awarded per difficulty
export const XP_TABLE = { Easy: 10, Medium: 25, Hard: 50 } as const

// ── Derived stats helpers ──────────────────────────────────────

export function getTotalSolved(p: UserProgress) {
  return p.solvedProblems.length
}

export function getEasySolved(p: UserProgress) {
  return p.solvedProblems.filter((s) => s.difficulty === "Easy").length
}

export function getMediumSolved(p: UserProgress) {
  return p.solvedProblems.filter((s) => s.difficulty === "Medium").length
}

export function getHardSolved(p: UserProgress) {
  return p.solvedProblems.filter((s) => s.difficulty === "Hard").length
}

export function getTopicStats(p: UserProgress): TopicStat[] {
  const counts: Record<string, number> = {}
  for (const s of p.solvedProblems) {
    counts[s.topic] = (counts[s.topic] ?? 0) + 1
  }
  return TOPIC_REGISTRY.map(({ slug, label, total }) => ({
    topic: slug,
    label,
    solved: counts[slug] ?? 0,
    total,
  }))
}

export function getRecentActivity(p: UserProgress, days = 7): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const count = p.solvedProblems.filter((s) => s.solvedAt.startsWith(dateStr)).length
    result.push({ date: dateStr, count })
  }
  return result
}

export function getDailyProgress(p: UserProgress): number {
  const today = new Date().toISOString().split("T")[0]
  return p.solvedProblems.filter((s) => s.solvedAt.startsWith(today)).length
}

// ── Streak calculation ─────────────────────────────────────────
export function recalcStreak(p: UserProgress): StreakData {
  const today = new Date().toISOString().split("T")[0]
  const dates = [...new Set(p.solvedProblems.map((s) => s.solvedAt.split("T")[0]))].sort()

  if (dates.length === 0) return { current: 0, longest: 0, lastActiveDate: "" }

  let current = 0
  let longest = 0
  let run = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) {
      run++
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }
  longest = Math.max(longest, run)

  // Current streak: count backwards from today
  const last = dates[dates.length - 1]
  const lastDate = new Date(last)
  const todayDate = new Date(today)
  const gapFromToday = (todayDate.getTime() - lastDate.getTime()) / 86400000

  if (gapFromToday <= 1) {
    current = 1
    for (let i = dates.length - 2; i >= 0; i--) {
      const diff = (new Date(dates[i + 1]).getTime() - new Date(dates[i]).getTime()) / 86400000
      if (diff === 1) current++
      else break
    }
  }

  return { current, longest, lastActiveDate: last }
}

// ── Server-authoritative mutations ──────────────────────────────
// Pure functions: given a progress snapshot + input, return the next
// snapshot. Used by both the API route (source of truth) and the client
// hook (optimistic UI) so the two can never disagree on the math — xp and
// streak are always DERIVED here, never accepted as raw client input.

export function applyMarkSolved(progress: UserProgress, entry: Omit<ProblemEntry, "solvedAt">): UserProgress {
  if (progress.solvedProblems.some((s) => s.slug === entry.slug)) return progress
  const newEntry: ProblemEntry = { ...entry, solvedAt: new Date().toISOString() }
  const solvedProblems = [newEntry, ...progress.solvedProblems]
  const xp = progress.xp + XP_TABLE[entry.difficulty]
  const streak = recalcStreak({ ...progress, solvedProblems })
  return { ...progress, solvedProblems, xp, streak }
}

export function applyMarkMultipleSolved(progress: UserProgress, entries: Omit<ProblemEntry, "solvedAt">[]): UserProgress {
  const newEntries = entries
    .filter((entry) => !progress.solvedProblems.some((s) => s.slug === entry.slug))
    .map((entry) => ({ ...entry, solvedAt: new Date().toISOString() }))

  if (newEntries.length === 0) return progress

  const solvedProblems = [...newEntries, ...progress.solvedProblems]
  const xp = progress.xp + newEntries.reduce((sum, entry) => sum + XP_TABLE[entry.difficulty], 0)
  const streak = recalcStreak({ ...progress, solvedProblems })
  return { ...progress, solvedProblems, xp, streak }
}

export function applyUnmarkSolved(progress: UserProgress, slug: string): UserProgress {
  const removed = progress.solvedProblems.find((s) => s.slug === slug)
  if (!removed) return progress
  const solvedProblems = progress.solvedProblems.filter((s) => s.slug !== slug)
  const xp = Math.max(0, progress.xp - XP_TABLE[removed.difficulty])
  const streak = recalcStreak({ ...progress, solvedProblems })
  return { ...progress, solvedProblems, xp, streak }
}

export function applySetDailyGoal(progress: UserProgress, n: number): UserProgress {
  const dailyGoal = Math.min(20, Math.max(1, Math.round(n)))
  return { ...progress, dailyGoal }
}

export function applyUpdateNotes(progress: UserProgress, slug: string, notes: string): UserProgress {
  const trimmed = notes.slice(0, 2000)
  const solvedProblems = progress.solvedProblems.map((s) => (s.slug === slug ? { ...s, notes: trimmed } : s))
  return { ...progress, solvedProblems }
}
