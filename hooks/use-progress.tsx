"use client"
// hooks/use-progress.tsx
// Thin client for /api/progress. Progress is stored server-side in Clerk
// privateMetadata — this hook never writes it directly. Every mutation is
// applied optimistically (via the same pure functions the server uses) for
// snappy UI, then reconciled with the server's authoritative response; on
// failure the optimistic change is rolled back.

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from "react"
import { useUser } from "@clerk/nextjs"
import {
  type UserProgress, type ProblemEntry, type BugSpotEntry,
  EMPTY_PROGRESS,
  applyMarkSolved, applyMarkMultipleSolved, applyUnmarkSolved,
  applySetDailyGoal, applyUpdateNotes, applySpotBug,
} from "@/lib/user-progress"

interface ProgressCtx {
  progress: UserProgress
  loading: boolean
  error: string | null
  markSolved: (entry: Omit<ProblemEntry, "solvedAt">) => Promise<void>
  markMultipleSolved: (entries: Omit<ProblemEntry, "solvedAt">[]) => Promise<void>
  unmarkSolved: (slug: string) => Promise<void>
  isSolved: (slug: string) => boolean
  setDailyGoal: (n: number) => Promise<void>
  updateNotes: (slug: string, notes: string) => Promise<void>
  spotBug: (entry: Omit<BugSpotEntry, "spottedAt">) => Promise<void>
  getBugSpotResult: (slug: string) => BugSpotEntry | undefined
  refresh: () => Promise<void>
}

const Ctx = createContext<ProgressCtx | null>(null)

async function callAction(body: Record<string, unknown>): Promise<UserProgress> {
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed (${res.status})`)
  }
  const data = await res.json()
  return data.progress as UserProgress
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/progress", { credentials: "include" })
      if (!res.ok) throw new Error(`Failed to load progress (${res.status})`)
      const data = await res.json()
      setProgress({ ...EMPTY_PROGRESS, ...data.progress })
    } catch (err) {
      console.error("Failed to load progress", err)
      setError("Couldn't load your progress. Try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setProgress(EMPTY_PROGRESS)
      setLoading(false)
      return
    }
    void refresh()
  }, [isLoaded, user, refresh])

  // Applies `optimistic` immediately, fires the server action, then
  // reconciles state with whatever the server actually persisted. Rolls
  // back to `previous` if the request fails.
  const mutate = useCallback(
    async (optimistic: UserProgress, previous: UserProgress, action: Record<string, unknown>) => {
      setProgress(optimistic)
      setError(null)
      try {
        const serverProgress = await callAction(action)
        setProgress({ ...EMPTY_PROGRESS, ...serverProgress })
      } catch (err) {
        console.error("Progress update failed", err)
        setProgress(previous)
        setError("That didn't save — check your connection and try again.")
      }
    },
    []
  )

  const markSolved = useCallback(async (entry: Omit<ProblemEntry, "solvedAt">) => {
    if (!user) return
    const previous = progress
    const optimistic = applyMarkSolved(progress, entry)
    if (optimistic === previous) return // already solved
    await mutate(optimistic, previous, { action: "markSolved", entry })
  }, [user, progress, mutate])

  const markMultipleSolved = useCallback(async (entries: Omit<ProblemEntry, "solvedAt">[]) => {
    if (!user || entries.length === 0) return
    const previous = progress
    const optimistic = applyMarkMultipleSolved(progress, entries)
    if (optimistic === previous) return
    await mutate(optimistic, previous, { action: "markMultipleSolved", entries })
  }, [user, progress, mutate])

  const unmarkSolved = useCallback(async (slug: string) => {
    if (!user) return
    const previous = progress
    const optimistic = applyUnmarkSolved(progress, slug)
    if (optimistic === previous) return
    await mutate(optimistic, previous, { action: "unmarkSolved", slug })
  }, [user, progress, mutate])

  const isSolved = useCallback((slug: string) =>
    progress.solvedProblems.some((s) => s.slug === slug), [progress])

  const setDailyGoal = useCallback(async (n: number) => {
    if (!user) return
    const previous = progress
    const optimistic = applySetDailyGoal(progress, n)
    await mutate(optimistic, previous, { action: "setDailyGoal", dailyGoal: n })
  }, [user, progress, mutate])

  const updateNotes = useCallback(async (slug: string, notes: string) => {
    if (!user) return
    const previous = progress
    const optimistic = applyUpdateNotes(progress, slug, notes)
    await mutate(optimistic, previous, { action: "updateNotes", slug, notes })
  }, [user, progress, mutate])

  const spotBug = useCallback(async (entry: Omit<BugSpotEntry, "spottedAt">) => {
    if (!user) return
    const previous = progress
    const optimistic = applySpotBug(progress, entry)
    if (optimistic === previous) return // already attempted
    await mutate(optimistic, previous, { action: "spotBug", entry })
  }, [user, progress, mutate])

  const getBugSpotResult = useCallback((slug: string) =>
    progress.bugsSpotted.find((b) => b.slug === slug), [progress])

  return (
    <Ctx.Provider value={{ progress, loading, error, markSolved, markMultipleSolved, unmarkSolved, isSolved, setDailyGoal, updateNotes, spotBug, getBugSpotResult, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider")
  return ctx
}
