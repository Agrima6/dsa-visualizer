"use client"
// hooks/use-progress.tsx
// Reads and writes progress from Clerk unsafeMetadata.
// No backend needed — Clerk stores it per-user automatically.

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from "react"
import { useUser } from "@clerk/nextjs"
import {
  type UserProgress, type ProblemEntry,
  EMPTY_PROGRESS, XP_TABLE, recalcStreak,
} from "@/lib/user-progress"
import { trackActivity } from "@/components/activity-tracker"

interface ProgressCtx {
  progress: UserProgress
  loading: boolean
  markSolved: (entry: Omit<ProblemEntry, "solvedAt">) => Promise<void>
  markMultipleSolved: (entries: Omit<ProblemEntry, "solvedAt">[]) => Promise<void>
  unmarkSolved: (slug: string) => Promise<void>
  isSolved: (slug: string) => boolean
  setDailyGoal: (n: number) => Promise<void>
  updateNotes: (slug: string, notes: string) => Promise<void>
}

const Ctx = createContext<ProgressCtx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)
  const [loading, setLoading] = useState(true)

  // Load from Clerk unsafeMetadata on mount
  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }

    const raw = user.unsafeMetadata?.progress as UserProgress | undefined
    if (raw) {
      setProgress({ ...EMPTY_PROGRESS, ...raw })
    } else {
      // First login — seed joinedAt
      setProgress(prev => ({ ...prev, joinedAt: user.createdAt?.toISOString() ?? new Date().toISOString() }))
    }
    setLoading(false)
  }, [isLoaded, user])

  // Refresh progress if Clerk metadata changes after the initial load
  useEffect(() => {
    if (!isLoaded || !user) return
    const raw = user.unsafeMetadata?.progress as UserProgress | undefined
    if (!raw) return

    setProgress(prev => {
      const next = { ...EMPTY_PROGRESS, ...raw }
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next
    })
  }, [isLoaded, user, user?.unsafeMetadata?.progress])

  // Persist to Clerk through a secure API route and fallback to direct client update.
  const persist = useCallback(async (next: UserProgress) => {
    if (!user?.id) return
    setProgress(next)

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, progress: next }),
        credentials: "include",
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Progress API save failed", response.status, text)
      }
    } catch (error) {
      console.error("Progress API request failed", error)
    }

    if ((user as any)?.update) {
      try {
        await (user as any).update({ unsafeMetadata: { progress: next } })
      } catch (error) {
        console.error("Clerk client update failed", error)
      }
    }
  }, [user])

  const markSolved = useCallback(async (entry: Omit<ProblemEntry, "solvedAt">) => {
    let nextProgress: UserProgress | null = null

    setProgress(prev => {
      if (prev.solvedProblems.some(s => s.slug === entry.slug)) return prev
      const newEntry: ProblemEntry = { ...entry, solvedAt: new Date().toISOString() }
      const solvedProblems = [newEntry, ...prev.solvedProblems]
      const xp = prev.xp + XP_TABLE[entry.difficulty]
      const streak = recalcStreak({ ...prev, solvedProblems })
      nextProgress = { ...prev, solvedProblems, xp, streak }
      return nextProgress
    })

    if (!user || !nextProgress) return

    await persist(nextProgress)
    void trackActivity(user.id, entry.topic, "solved")
  }, [persist, user])

  const markMultipleSolved = useCallback(async (entries: Omit<ProblemEntry, "solvedAt">[]) => {
    if (!user || entries.length === 0) return

    let nextProgress: UserProgress | null = null
    let addedEntries: (ProblemEntry & { topic: string })[] = []

    setProgress(prev => {
      const newEntries = entries
        .filter(entry => !prev.solvedProblems.some(s => s.slug === entry.slug))
        .map(entry => ({ ...entry, solvedAt: new Date().toISOString() }))

      if (newEntries.length === 0) return prev

      addedEntries = newEntries
      const solvedProblems = [...newEntries, ...prev.solvedProblems]
      const xp = prev.xp + newEntries.reduce((sum, entry) => sum + XP_TABLE[entry.difficulty], 0)
      const streak = recalcStreak({ ...prev, solvedProblems })
      nextProgress = { ...prev, solvedProblems, xp, streak }
      return nextProgress
    })

    if (!nextProgress || addedEntries.length === 0) return

    await persist(nextProgress)
    for (const entry of addedEntries) {
      void trackActivity(user.id, entry.topic, "solved")
    }
  }, [persist, user])

  const unmarkSolved = useCallback(async (slug: string) => {
    let nextProgress: UserProgress | null = null
    let removedTopic: string | null = null

    setProgress(prev => {
      const removed = prev.solvedProblems.find(s => s.slug === slug)
      if (!removed) return prev
      removedTopic = removed.topic
      const solvedProblems = prev.solvedProblems.filter(s => s.slug !== slug)
      const xp = Math.max(0, prev.xp - XP_TABLE[removed.difficulty])
      const streak = recalcStreak({ ...prev, solvedProblems })
      nextProgress = { ...prev, solvedProblems, xp, streak }
      return nextProgress
    })

    if (!user || !nextProgress) return

    await persist(nextProgress)
    if (removedTopic) {
      void trackActivity(user.id, removedTopic, "unmarked")
    }
  }, [persist, user])

  const isSolved = useCallback((slug: string) =>
    progress.solvedProblems.some(s => s.slug === slug), [progress])

  const setDailyGoal = useCallback(async (n: number) => {
    const next = { ...progress, dailyGoal: n }
    await persist(next)
  }, [progress, persist])

  const updateNotes = useCallback(async (slug: string, notes: string) => {
    const solvedProblems = progress.solvedProblems.map(s =>
      s.slug === slug ? { ...s, notes } : s
    )
    await persist({ ...progress, solvedProblems })
  }, [progress, persist])

  return (
    <Ctx.Provider value={{ progress, loading, markSolved, markMultipleSolved, unmarkSolved, isSolved, setDailyGoal, updateNotes }}>
      {children}
    </Ctx.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider")
  return ctx
}