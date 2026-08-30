"use client"
// hooks/use-learning-path-progress.ts
//
// Tracks which learning-path steps a visitor has marked complete, and
// resolves "continue where you left off" — the first not-yet-completed
// step in a path. Deliberately per-browser (localStorage) rather than
// server-side: it's a lightweight checklist, not account data, and works
// the same whether or not the visitor is signed in.

import { useCallback, useEffect, useState } from "react"
import { LEARNING_PATHS, type LearningPath } from "@/lib/learning-paths"

const STORAGE_KEY = "algomaitri-learning-path-progress"

type ProgressMap = Record<string, string[]> // pathId -> completed topicSlugs

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Non-fatal — progress just won't persist this session.
  }
}

export function useLearningPathProgress() {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProgress(load())
    setHydrated(true)
  }, [])

  const isComplete = useCallback(
    (pathId: string, topicSlug: string) => (progress[pathId] ?? []).includes(topicSlug),
    [progress]
  )

  const toggleComplete = useCallback((pathId: string, topicSlug: string) => {
    setProgress((prev) => {
      const existing = prev[pathId] ?? []
      const next = existing.includes(topicSlug)
        ? existing.filter((s) => s !== topicSlug)
        : [...existing, topicSlug]
      const updated = { ...prev, [pathId]: next }
      save(updated)
      return updated
    })
  }, [])

  const nextStep = useCallback(
    (path: LearningPath) => {
      const done = new Set(progress[path.id] ?? [])
      return path.steps.find((s) => !done.has(s.topicSlug)) ?? null
    },
    [progress]
  )

  const completedCount = useCallback(
    (pathId: string) => (progress[pathId] ?? []).length,
    [progress]
  )

  /** The single best "continue where you left off" step across every path — the
   * first path with any progress that isn't finished, falling back to the
   * very first step of the very first path for a brand-new visitor. */
  const continueStep = useCallback(() => {
    for (const path of LEARNING_PATHS) {
      const done = progress[path.id] ?? []
      if (done.length > 0 && done.length < path.steps.length) {
        const step = nextStep(path)
        if (step) return { path, step }
      }
    }
    const firstPath = LEARNING_PATHS[0]
    return { path: firstPath, step: firstPath.steps[0] }
  }, [progress, nextStep])

  return { hydrated, isComplete, toggleComplete, nextStep, completedCount, continueStep }
}
