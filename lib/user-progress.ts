// lib/user-progress.ts
// All progress is stored in Clerk's publicMetadata (server) and
// unsafeMetadata (client-writable).  We use unsafeMetadata so the
// client can update it directly without a custom API route.

export interface ProblemEntry {
    slug: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    topic: string          // e.g. "array"
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
    return p.solvedProblems.filter(s => s.difficulty === "Easy").length
  }
  
  export function getMediumSolved(p: UserProgress) {
    return p.solvedProblems.filter(s => s.difficulty === "Medium").length
  }
  
  export function getHardSolved(p: UserProgress) {
    return p.solvedProblems.filter(s => s.difficulty === "Hard").length
  }
  
  export function getTopicStats(p: UserProgress): TopicStat[] {
    const topicTotals: Record<string, number> = {
      array: 28, stack: 10, queue: 10, "linked-list": 10,
      "binary-tree": 10, sorting: 10, graph: 10, heap: 10,
    }
    const counts: Record<string, number> = {}
    for (const s of p.solvedProblems) {
      counts[s.topic] = (counts[s.topic] ?? 0) + 1
    }
    return Object.entries(topicTotals).map(([topic, total]) => ({
      topic, solved: counts[topic] ?? 0, total,
    }))
  }
  
  export function getRecentActivity(p: UserProgress, days = 7): { date: string; count: number }[] {
    const result: { date: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      const count = p.solvedProblems.filter(s => s.solvedAt.startsWith(dateStr)).length
      result.push({ date: dateStr, count })
    }
    return result
  }
  
  export function getDailyProgress(p: UserProgress): number {
    const today = new Date().toISOString().split("T")[0]
    return p.solvedProblems.filter(s => s.solvedAt.startsWith(today)).length
  }
  
  // ── Streak calculation ─────────────────────────────────────────
  export function recalcStreak(p: UserProgress): StreakData {
    const today = new Date().toISOString().split("T")[0]
    const dates = [...new Set(p.solvedProblems.map(s => s.solvedAt.split("T")[0]))].sort()
  
    if (dates.length === 0) return { current: 0, longest: 0, lastActiveDate: "" }
  
    let current = 0, longest = 0, run = 1
  
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (curr.getTime() - prev.getTime()) / 86400000
      if (diff === 1) { run++; longest = Math.max(longest, run) }
      else { run = 1 }
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