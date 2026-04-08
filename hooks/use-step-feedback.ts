"use client"

import { useEffect, useRef } from "react"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

export function useStepFeedback(
  currentStep: number,
  totalSteps: number,
  algorithmName: string
) {
  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()
  const lastStepRef = useRef(-1)
  const doneRef = useRef(false)

  useEffect(() => {
    if (currentStep < 0 || totalSteps <= 0) return

    if (currentStep === lastStepRef.current) return
    lastStepRef.current = currentStep

    const isLast = currentStep === totalSteps - 1

    if (isLast) {
      if (!doneRef.current) {
        doneRef.current = true
        endSound()
        showEndMessage("Algorithm ended", `${algorithmName} completed successfully.`)
      }
    } else {
      doneRef.current = false
      stepSound()
    }
  }, [currentStep, totalSteps, algorithmName, stepSound, endSound, showEndMessage])
}