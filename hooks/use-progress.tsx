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

interface ProgressCtx {
  progress: UserProgress
  loading: boolean
  markSolved: (entry: Omit<ProblemEntry, "solvedAt">) => Promise<void>
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

  // Persist to Clerk
  const persist = useCallback(async (next: UserProgress) => {
    if (!user) return
    setProgress(next)
    await user.update({ unsafeMetadata: { progress: next } })
  }, [user])

  const markSolved = useCallback(async (entry: Omit<ProblemEntry, "solvedAt">) => {
    setProgress(prev => {
      // Prevent duplicates
      if (prev.solvedProblems.some(s => s.slug === entry.slug)) return prev
      const newEntry: ProblemEntry = { ...entry, solvedAt: new Date().toISOString() }
      const solvedProblems = [newEntry, ...prev.solvedProblems]
      const xp = prev.xp + XP_TABLE[entry.difficulty]
      const streak = recalcStreak({ ...prev, solvedProblems })
      const next = { ...prev, solvedProblems, xp, streak }
      // async persist
      if (user) user.update({ unsafeMetadata: { progress: next } })
      return next
    })
  }, [user])

  const unmarkSolved = useCallback(async (slug: string) => {
    setProgress(prev => {
      const removed = prev.solvedProblems.find(s => s.slug === slug)
      if (!removed) return prev
      const solvedProblems = prev.solvedProblems.filter(s => s.slug !== slug)
      const xp = Math.max(0, prev.xp - XP_TABLE[removed.difficulty])
      const streak = recalcStreak({ ...prev, solvedProblems })
      const next = { ...prev, solvedProblems, xp, streak }
      if (user) user.update({ unsafeMetadata: { progress: next } })
      return next
    })
  }, [user])

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
    <Ctx.Provider value={{ progress, loading, markSolved, unmarkSolved, isSolved, setDailyGoal, updateNotes }}>
      {children}
    </Ctx.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider")
  return ctx
}