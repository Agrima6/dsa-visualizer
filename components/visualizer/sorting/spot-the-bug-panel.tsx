"use client"
// components/visualizer/sorting/spot-the-bug-panel.tsx
// "Spot the Bug": the user watches a REAL execution of a subtly-broken
// implementation and tries to flag the exact step where it first goes
// wrong. Reuses the same fixed-width step trace the main visualizer
// already produces — the "bug" is a genuinely different code path, not a
// scripted animation, so the wrong output actually emerges from running it.

import { useMemo, useState, useEffect, useRef } from "react"
import { Bug, Flag, RotateCcw, CheckCircle2, XCircle } from "lucide-react"
import type { SortingProblem, VisStep } from "./sorting-problems-data"
import { findDivergenceIndex, type SortingBugVariant } from "./sorting-bug-types"
import { useProgress } from "@/hooks/use-progress"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const PANEL = "rounded-[24px] border border-violet-500/12 bg-white/70 dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"

function boxStyle(isHighlighted: boolean, isSwapped: boolean, isSorted: boolean) {
  if (isSwapped) return "border-rose-500/60 bg-rose-500/10 text-rose-500"
  if (isSorted) return "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
  if (isHighlighted) return "border-amber-400/60 bg-amber-400/10 text-amber-500"
  return "border-violet-500/15 bg-white/60 text-foreground dark:bg-white/[0.03]"
}

function MiniArrayViz({ step }: { step: VisStep }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-5 min-h-[100px]">
      {step.array.map((val, idx) => {
        const isHighlighted = step.highlighted.includes(idx)
        const isSwapped = step.swapped.includes(idx)
        const isSorted = step.sorted.includes(idx)
        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border-2 font-mono text-sm font-bold transition-all duration-200",
                boxStyle(isHighlighted, isSwapped, isSorted)
              )}
            >
              {val}
            </div>
            <span className="text-[9px] font-mono text-muted-foreground/50">{idx}</span>
          </div>
        )
      })}
    </div>
  )
}

function firstDiffLine(a: string, b: string): number {
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const len = Math.max(linesA.length, linesB.length)
  for (let i = 0; i < len; i++) {
    if (linesA[i] !== linesB[i]) return i + 1
  }
  return -1
}

export function SpotTheBugPanel({
  problem,
  variant,
}: {
  problem: SortingProblem
  variant: SortingBugVariant
}) {
  const { spotBug, getBugSpotResult } = useProgress()
  const correctSteps = useMemo(() => problem.generateSteps(), [problem])
  const buggySteps = useMemo(() => variant.generateBuggySteps(), [variant])
  const divergenceIndex = useMemo(
    () => findDivergenceIndex(correctSteps, buggySteps),
    [correctSteps, buggySteps]
  )
  const buggyLine = useMemo(() => firstDiffLine(problem.code, variant.buggyCode), [problem.code, variant.buggyCode])

  const previousResult = getBugSpotResult(problem.slug)

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<"watching" | "revealed">(previousResult ? "revealed" : "watching")
  const [guessIndex, setGuessIndex] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const step = buggySteps[currentStep]
  const codeLines = variant.buggyCode.split("\n")

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying || phase !== "watching") return
    intervalRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= buggySteps.length - 1) {
          setIsPlaying(false)
          return s
        }
        return s + 1
      })
    }, 750)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, phase, buggySteps.length])

  useEffect(() => {
    if (!codeRef.current || !step) return
    const el = codeRef.current.querySelector(`[data-line="${step.codeLine}"]`)
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [currentStep, step])

  const isGuessCorrect = (guess: number) => Math.abs(guess - divergenceIndex) <= 1

  const submitGuess = (guess: number) => {
    setIsPlaying(false)
    setGuessIndex(guess)
    setPhase("revealed")
    void spotBug({ slug: problem.slug, topic: "sorting", correct: isGuessCorrect(guess) })
  }

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setGuessIndex(null)
    setPhase("watching")
  }

  const correctFinal = correctSteps[correctSteps.length - 1]
  const buggyFinal = buggySteps[buggySteps.length - 1]
  const finalMismatch = JSON.stringify(correctFinal.array) !== JSON.stringify(buggyFinal.array)

  return (
    <div className="space-y-5">
      <div className={cn(PANEL, "p-5")}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500">
            <Bug className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">This implementation has one bug in it.</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Step through the trace below. The moment you think it starts behaving differently from a
              correct run, hit <span className="font-semibold text-foreground">Flag this step</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <div className={cn(PANEL, "overflow-hidden")}>
            <div className="border-b border-violet-500/10 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                    Buggy Execution
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground min-h-[1.5rem]">
                    {step?.message}
                  </p>
                </div>
                <div className="shrink-0 rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 text-xs font-mono text-violet-500 dark:text-violet-300">
                  {currentStep + 1} / {buggySteps.length}
                </div>
              </div>
            </div>

            {step && (
              <div className="rounded-2xl mx-4 my-4 border border-violet-500/8 bg-white/45 dark:bg-white/[0.02]">
                <MiniArrayViz step={step} />
              </div>
            )}

            <div className="h-1 bg-violet-500/8">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${buggySteps.length > 1 ? (currentStep / (buggySteps.length - 1)) * 100 : 0}%` }}
              />
            </div>
          </div>

          {phase === "watching" ? (
            <div className={cn(PANEL, "p-5 space-y-4")}>
              <input
                type="range"
                min={0}
                max={Math.max(buggySteps.length - 1, 0)}
                value={currentStep}
                onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)) }}
                className="w-full accent-rose-500"
              />
              <div className="grid grid-cols-[48px_1fr_1fr] gap-2">
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStep(0) }}
                  className="flex h-11 items-center justify-center rounded-xl border border-violet-500/12 bg-white/70 transition-all hover:bg-violet-500/5 dark:bg-white/[0.03]"
                  title="Restart"
                  aria-label="Restart"
                >
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.max(0, s - 1)) }}
                  disabled={currentStep === 0}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]"
                >
                  ‹ Prev
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  disabled={currentStep >= buggySteps.length - 1}
                  className="h-11 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(244,63,94,0.2)] transition-all disabled:opacity-50"
                >
                  {isPlaying ? "⏸ Pause" : currentStep === 0 ? "▶ Play" : "▶ Continue"}
                </button>
              </div>
              <button
                onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.min(buggySteps.length - 1, s + 1)) }}
                disabled={currentStep >= buggySteps.length - 1}
                className="w-full h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]"
              >
                Next step ›
              </button>

              <button
                onClick={() => submitGuess(currentStep)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(244,63,94,0.28)] transition-all hover:shadow-[0_12px_32px_rgba(244,63,94,0.36)]"
              >
                <Flag className="h-4 w-4" />
                Flag this step — this is where it breaks
              </button>
            </div>
          ) : (
            <ResultCard
              guessIndex={guessIndex !== null ? guessIndex : divergenceIndex}
              divergenceIndex={divergenceIndex}
              isCorrect={guessIndex !== null ? isGuessCorrect(guessIndex) : !!previousResult?.correct}
              alreadyAttempted={guessIndex === null && !!previousResult}
              bugTitle={variant.bugTitle}
              bugExplanation={variant.bugExplanation}
              onReset={reset}
              onJumpTo={(i) => { setCurrentStep(i); }}
            />
          )}

          {phase === "revealed" && (
            <div className={cn(PANEL, "p-5")}>
              <h4 className="text-sm font-semibold mb-3">Final output</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500 mb-2">Correct</p>
                  <p className="font-mono text-sm">[{correctFinal.array.join(", ")}]</p>
                </div>
                <div className={cn(
                  "rounded-2xl border p-3",
                  finalMismatch ? "border-rose-500/25 bg-rose-500/5" : "border-violet-500/12 bg-white/40 dark:bg-white/[0.02]"
                )}>
                  <p className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.16em] mb-2",
                    finalMismatch ? "text-rose-500" : "text-muted-foreground"
                  )}>
                    Buggy
                  </p>
                  <p className="font-mono text-sm">[{buggyFinal.array.join(", ")}]</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-violet-500/12 bg-[#0c0d11] shadow-[0_24px_70px_rgba(0,0,0,0.35)] self-start sticky top-4">
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-neutral-500">{problem.slug}-buggy.js</span>
            <span className="rounded-full border border-rose-400/25 bg-rose-500/12 px-2.5 py-1 text-[10px] text-rose-300">
              Contains a bug
            </span>
          </div>
          <div ref={codeRef} className="max-h-[calc(100vh-160px)] overflow-y-auto font-mono text-sm leading-7">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1
              const isActive = step?.codeLine === lineNum
              const isBugLine = phase === "revealed" && lineNum === buggyLine
              return (
                <div
                  key={lineNum}
                  data-line={lineNum}
                  className={cn(
                    "flex border-l-2 transition-colors duration-200",
                    isBugLine ? "bg-rose-500/10 border-rose-500" : isActive ? "border-violet-500 bg-violet-500/[0.08]" : "border-transparent"
                  )}
                >
                  <span className={cn("w-12 shrink-0 select-none pr-4 text-right text-xs leading-7", isBugLine ? "text-rose-400 font-bold" : isActive ? "text-violet-400 font-bold" : "text-neutral-700")}>
                    {lineNum}
                  </span>
                  <span className={cn("whitespace-pre pr-4", isBugLine ? "text-rose-300" : isActive ? "text-white" : "text-neutral-400")}>
                    {line || " "}
                  </span>
                  {isBugLine && <span className="pr-4 text-xs text-rose-400/70 shrink-0">← bug</span>}
                </div>
              )
            })}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultCard({
  guessIndex,
  divergenceIndex,
  isCorrect,
  alreadyAttempted,
  bugTitle,
  bugExplanation,
  onReset,
  onJumpTo,
}: {
  guessIndex: number
  divergenceIndex: number
  isCorrect: boolean
  alreadyAttempted: boolean
  bugTitle: string
  bugExplanation: string
  onReset: () => void
  onJumpTo: (i: number) => void
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5",
        isCorrect ? "border-emerald-500/25 bg-emerald-500/5" : "border-amber-500/25 bg-amber-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
        ) : (
          <XCircle className="h-6 w-6 shrink-0 text-amber-500" />
        )}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold">
            {alreadyAttempted ? "You already tried this one" : isCorrect ? "Nice catch!" : "Not quite — here's where it actually breaks"}
          </h4>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{bugTitle}</p>
          {!alreadyAttempted && (
            <p className="mt-1 text-xs text-muted-foreground/80">
              You flagged step {guessIndex + 1} · it actually diverges at step {divergenceIndex + 1}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{bugExplanation}</p>

      {!isCorrect && (
        <button
          onClick={() => onJumpTo(divergenceIndex)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-300 transition-all hover:bg-amber-500/15"
        >
          Jump to step {divergenceIndex + 1}
        </button>
      )}

      <button
        onClick={onReset}
        className="mt-4 flex items-center gap-2 text-xs font-semibold text-violet-500 hover:text-violet-600"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Watch again
      </button>
    </div>
  )
}
