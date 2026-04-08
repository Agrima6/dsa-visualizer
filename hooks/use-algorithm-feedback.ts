"use client"

import { useCallback, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"

type ToneType = "step" | "success" | "warn"

export function useAlgorithmFeedback() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = () => {
    if (typeof window === "undefined") return null

    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext
        }).webkitAudioContext

      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }

    return ctxRef.current
  }

  const beep = useCallback(
    async (
      freq: number,
      duration = 0.08,
      type: OscillatorType = "sine",
      volume = 0.04
    ) => {
      const ctx = getCtx()
      if (!ctx) return

      if (ctx.state === "suspended") {
        await ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.value = freq

      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    },
    []
  )

  const play = useCallback(
    async (kind: ToneType = "step") => {
      if (kind === "step") {
        await beep(320, 0.06, "square", 0.03)
        return
      }

      if (kind === "warn") {
        await beep(220, 0.08, "sawtooth", 0.04)
        return
      }

      // success / end sound
      await beep(523.25, 0.10, "sine", 0.05)
      setTimeout(() => {
        beep(659.25, 0.10, "sine", 0.05)
      }, 120)
      setTimeout(() => {
        beep(783.99, 0.16, "sine", 0.05)
      }, 240)
    },
    [beep]
  )

  const showEndMessage = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
    })
  }, [])

  const stepSound = useCallback(() => {
    play("step")
  }, [play])

  const endSound = useCallback(() => {
    play("success")
  }, [play])

  const warnSound = useCallback(() => {
    play("warn")
  }, [play])

  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close()
      }
    }
  }, [])

  return {
    stepSound,
    endSound,
    warnSound,
    showEndMessage,
  }
}