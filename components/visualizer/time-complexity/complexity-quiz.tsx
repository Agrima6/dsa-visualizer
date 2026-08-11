"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { COMPLEXITIES, ComplexityId } from "./complexity-data"
import { QUIZ_QUESTIONS } from "./quiz-data"

export function ComplexityQuiz() {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<ComplexityId | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const question = QUIZ_QUESTIONS[qIdx]
  const isCorrect = selected === question.answer

  function choose(id: ComplexityId) {
    if (selected) return
    setSelected(id)
    if (id === question.answer) setScore((s) => s + 1)
  }

  function next() {
    if (qIdx === QUIZ_QUESTIONS.length - 1) {
      setDone(true)
      return
    }
    setQIdx((i) => i + 1)
    setSelected(null)
  }

  function restart() {
    setQIdx(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="rounded-[24px] border border-violet-500/12 bg-white/70 p-8 text-center shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03]">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quiz complete</p>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          <span className="hero-gradient-text">{score}</span> / {QUIZ_QUESTIONS.length}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {score === QUIZ_QUESTIONS.length
            ? "Perfect score — you can spot complexity on sight."
            : score >= QUIZ_QUESTIONS.length / 2
            ? "Solid grasp — review the ones you missed and try again."
            : "Keep going — try the walkthrough above again, then retake this."}
        </p>
        <Button onClick={restart} className="mt-5 gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Question {qIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-3 text-sm text-muted-foreground">What's the time complexity of this function?</p>
          <pre className="overflow-x-auto rounded-2xl bg-neutral-950 p-4 font-mono text-[13px] leading-6 text-neutral-200">
            {question.code}
          </pre>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {COMPLEXITIES.map((c) => {
              const isSelected = selected === c.id
              const isTheAnswer = c.id === question.answer
              const showState = selected !== null
              return (
                <button
                  key={c.id}
                  onClick={() => choose(c.id)}
                  disabled={selected !== null}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 font-mono text-sm font-semibold transition-all",
                    !showState && "border-violet-500/15 bg-white/50 hover:border-violet-500/30 dark:bg-white/[0.02]",
                    showState && isTheAnswer && "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    showState && isSelected && !isTheAnswer && "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                    showState && !isSelected && !isTheAnswer && "border-transparent opacity-40"
                  )}
                >
                  {c.notation}
                  {showState && isTheAnswer && <Check className="h-4 w-4" />}
                  {showState && isSelected && !isTheAnswer && <X className="h-4 w-4" />}
                </button>
              )
            })}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 rounded-xl border px-4 py-3 text-sm",
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                  : "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300"
              )}
            >
              <p className="font-semibold">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-muted-foreground">{question.explanation}</p>
            </motion.div>
          )}

          {selected && (
            <Button onClick={next} className="mt-4 gap-2">
              {qIdx === QUIZ_QUESTIONS.length - 1 ? "See results" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
