"use client"

import { useEffect, useState } from "react"
import type { SortStep } from "@/components/visualizer/sorting/types"

const EMPTY_STEP: SortStep = { array: [], compared: [], swapped: [], sorted: [], message: "" }

/** Generic play/pause/scrub controls over an externally-provided SortStep[] —
 * used by the code playground, which generates its steps from a user's own
 * traced execution rather than from a built-in algorithm generator. */
export function useTracePlayer(steps: SortStep[], speedMs = 500) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [steps])

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1)), speedMs)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speedMs])

  return {
    current: steps[currentStep] ?? EMPTY_STEP,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    togglePlay: () => steps.length > 0 && setIsPlaying((p) => !p),
    nextStep: () => setCurrentStep((s) => Math.min(s + 1, Math.max(steps.length - 1, 0))),
    prevStep: () => setCurrentStep((s) => Math.max(s - 1, 0)),
    reset: () => { setCurrentStep(0); setIsPlaying(false) },
  }
}
