"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { ALGORITHM_DEMOS } from "./algorithms-data"
import { getComplexity } from "./complexity-data"

export function CodeWalkthrough() {
  const [algoId, setAlgoId] = useState(ALGORITHM_DEMOS[0].id)
  const [n, setN] = useState(6)
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const demo = ALGORITHM_DEMOS.find((d) => d.id === algoId)!
  const complexity = getComplexity(demo.complexityId)
  const { steps, input } = useMemo(() => demo.run(n), [demo, n])
  const codeLines = demo.code.split("\n")
  const step = steps[Math.min(stepIdx, steps.length - 1)]

  useEffect(() => {
    setStepIdx(0)
    setPlaying(false)
  }, [algoId, n])

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= steps.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, 500)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, steps.length])

  const maxN = demo.id === "bubble-sort" || demo.id === "merge-sort" ? 14 : 24

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {ALGORITHM_DEMOS.map((d) => {
          const c = getComplexity(d.complexityId)
          const active = d.id === algoId
          return (
            <button
              key={d.id}
              onClick={() => setAlgoId(d.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-transparent text-white shadow-md"
                  : "border-violet-500/15 bg-white/60 text-muted-foreground hover:border-violet-500/30 dark:bg-white/[0.03]"
              )}
              style={active ? { backgroundColor: c.color } : undefined}
            >
              {d.label}
              <span className="ml-1.5 opacity-75">{c.notation}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input size</p>
            <p className="text-sm text-muted-foreground">{demo.inputHint(n)}</p>
          </div>
          <div className="w-32 shrink-0 sm:w-48">
            <Slider value={n} onChange={setN} min={3} max={maxN} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Array visualization */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-1.5 rounded-2xl border border-violet-500/10 bg-white/50 p-4 dark:bg-white/[0.02]" style={{ minHeight: 96 }}>
              {step.array.map((val, idx) => {
                const isHighlighted = step.highlighted.includes(idx)
                const isSwapped = step.swapped?.includes(idx)
                const isFound = step.found?.includes(idx)
                return (
                  <motion.div
                    key={idx}
                    layout
                    className="flex flex-col items-center gap-1"
                  >
                    <motion.div
                      animate={{
                        scale: isHighlighted ? 1.12 : 1,
                        backgroundColor: isFound
                          ? "#22c55e33"
                          : isSwapped
                          ? "#ef444433"
                          : isHighlighted
                          ? `${complexity.color}33`
                          : "transparent",
                        borderColor: isFound ? "#22c55e" : isSwapped ? "#ef4444" : isHighlighted ? complexity.color : "hsl(var(--border))",
                      }}
                      transition={{ duration: 0.25 }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border-2 text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm"
                    >
                      {val}
                    </motion.div>
                    <span className="text-[9px] text-muted-foreground">{idx}</span>
                  </motion.div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-violet-500/10 bg-white/50 p-4 dark:bg-white/[0.02]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-muted-foreground"
                >
                  {step.message}
                </motion.p>
              </AnimatePresence>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Step {Math.min(stepIdx, steps.length - 1) + 1} / {steps.length}
                </span>
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${complexity.color}1a`, color: complexity.color }}>
                  {step.opCount} real operation{step.opCount === 1 ? "" : "s"} so far
                </span>
              </div>
            </div>

            {/* Player controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => { setStepIdx(0); setPlaying(false) }} title="Restart" aria-label="Restart">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setPlaying(false); setStepIdx((i) => Math.max(0, i - 1)) }}
                disabled={stepIdx === 0}
                aria-label="Previous step"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => setPlaying((p) => !p)}
                disabled={stepIdx >= steps.length - 1 && !playing}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setPlaying(false); setStepIdx((i) => Math.min(steps.length - 1, i + 1)) }}
                disabled={stepIdx >= steps.length - 1}
                aria-label="Next step"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Code panel */}
          <div className="overflow-hidden rounded-2xl border border-violet-500/10 bg-neutral-950">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 font-mono text-xs text-neutral-500">{demo.id}.js</span>
            </div>
            <div className="max-h-[340px] overflow-y-auto p-2 font-mono text-[13px] leading-6">
              {codeLines.map((line, i) => {
                const lineNum = i + 1
                const isActive = step.codeLine === lineNum
                return (
                  <div
                    key={lineNum}
                    className={cn(
                      "flex gap-3 rounded px-2 transition-colors",
                      isActive && "bg-white/10"
                    )}
                    style={isActive ? { boxShadow: `inset 3px 0 0 ${complexity.color}` } : undefined}
                  >
                    <span className="w-5 shrink-0 select-none text-right text-neutral-600">{lineNum}</span>
                    <span className={cn("whitespace-pre text-neutral-300", isActive && "text-white")}>{line || " "}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
