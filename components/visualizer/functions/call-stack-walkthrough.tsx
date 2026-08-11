"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { FUNCTION_DEMOS, getRecursionDemo } from "./call-demos-data"
import { getConcept } from "./concepts-data"

export function CallStackWalkthrough() {
  const [demoId, setDemoId] = useState(FUNCTION_DEMOS[0].id)
  const [n, setN] = useState(4)
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRecursion = demoId === "recursion"
  // Memoized on (demoId, n) specifically — getRecursionDemo(n) builds a new
  // object every call, so memoizing on the object itself would never hit
  // the cache and would silently re-run the whole simulation on every
  // render (new frame ids each time, confusing AnimatePresence).
  const demo = useMemo(
    () => (isRecursion ? getRecursionDemo(n) : FUNCTION_DEMOS.find((d) => d.id === demoId)!),
    [isRecursion, demoId, n]
  )
  const concept = getConcept(demo.conceptId)
  const steps = useMemo(() => demo.run(), [demo])
  const codeLines = demo.code.split("\n")
  const step = steps[Math.min(stepIdx, steps.length - 1)]
  const outputLog = steps.slice(0, stepIdx + 1).map((s) => s.output).filter(Boolean) as string[]

  useEffect(() => {
    setStepIdx(0)
    setPlaying(false)
  }, [demoId, n])

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
      }, 700)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, steps.length])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {FUNCTION_DEMOS.map((d) => {
          const c = getConcept(d.conceptId)
          const active = d.id === demoId
          return (
            <button
              key={d.id}
              onClick={() => setDemoId(d.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-transparent text-white shadow-md"
                  : "border-violet-500/15 bg-white/60 text-muted-foreground hover:border-violet-500/30 dark:bg-white/[0.03]"
              )}
              style={active ? { backgroundColor: c.color } : undefined}
            >
              {d.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
        {isRecursion && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              factorial(n) — try growing n and watch the stack get taller
            </p>
            <div className="w-32 shrink-0 sm:w-48">
              <Slider value={n} onChange={setN} min={2} max={7} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Call stack visualization */}
          <div className="flex flex-col gap-4">
            <div
              className="flex min-h-[220px] flex-col-reverse items-center justify-start gap-2 overflow-y-auto rounded-2xl border border-violet-500/10 bg-white/50 p-4 dark:bg-white/[0.02]"
              style={{ maxHeight: 320 }}
            >
              {/*
                Plain conditional rendering on purpose, not AnimatePresence:
                exit animations here occasionally failed to fire their
                completion callback (framer-motion + layout + a reversed
                flex container), which left old frames stuck in the DOM
                forever. A key per frame still gives entrance animation
                and correct reconciliation without depending on exit
                completion for correctness.
              */}
              {step.stack.length === 0 && (
                <div className="py-6 text-xs text-muted-foreground">Call stack is empty</div>
              )}
              {step.stack.map((frame, i) => (
                <motion.div
                  key={frame.id}
                  initial={{ opacity: 0, y: -12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: i === step.stack.length - 1 ? 1 : 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-xs rounded-xl border-2 px-3 py-2.5 text-sm"
                  style={{
                    borderColor: i === step.stack.length - 1 ? concept.color : "hsl(var(--border))",
                    backgroundColor: i === step.stack.length - 1 ? `${concept.color}14` : "transparent",
                  }}
                >
                  <p className="font-mono font-semibold">{frame.label}</p>
                  {frame.vars.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {frame.vars.map((v) => (
                        <p key={v.name} className="font-mono text-xs text-muted-foreground">
                          {v.name} = {v.value}
                        </p>
                      ))}
                    </div>
                  )}
                  {frame.note && <p className="mt-1 text-xs italic text-muted-foreground">{frame.note}</p>}
                </motion.div>
              ))}
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
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${concept.color}1a`, color: concept.color }}>
                  stack depth: {step.stack.length}
                </span>
              </div>
            </div>

            {outputLog.length > 0 && (
              <div className="rounded-2xl border border-violet-500/10 bg-neutral-950 p-3 font-mono text-xs text-emerald-400">
                {outputLog.map((line, i) => (
                  <p key={i}>&gt; {line}</p>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => { setStepIdx(0); setPlaying(false) }} title="Restart">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setPlaying(false); setStepIdx((i) => Math.max(0, i - 1)) }}
                disabled={stepIdx === 0}
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
            <div className="max-h-[400px] overflow-y-auto p-2 font-mono text-[13px] leading-6">
              {codeLines.map((line, i) => {
                const lineNum = i + 1
                const isActive = step.codeLine === lineNum
                return (
                  <div
                    key={lineNum}
                    className={cn("flex gap-3 rounded px-2 transition-colors", isActive && "bg-white/10")}
                    style={isActive ? { boxShadow: `inset 3px 0 0 ${concept.color}` } : undefined}
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
