"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Check, RotateCcw, X } from "lucide-react"
import { TOPIC_QUIZZES } from "@/lib/topic-quizzes"
import { GlossaryText } from "@/components/shared/glossary-text"

const bestKey = (slug: string) => `topic-quiz-best:${slug}`

export function TopicQuiz() {
  const pathname = usePathname()
  const parts = pathname.split("/")
  const slug = parts[2] ?? ""
  const questions = TOPIC_QUIZZES[slug]

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState<number | null>(null)

  useEffect(() => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    try {
      const saved = localStorage.getItem(bestKey(slug))
      setBest(saved === null ? null : Number(saved))
    } catch {
      setBest(null)
    }
  }, [slug])

  if (!questions || parts.length > 3) return null

  const q = questions[index]
  const answered = selected !== null

  const choose = (i: number) => {
    if (answered) return
    setSelected(i)
    if (i === q.answerIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (index === questions.length - 1) {
      setDone(true)
      try {
        const prev = best ?? -1
        if (score > prev) {
          localStorage.setItem(bestKey(slug), String(score))
          setBest(score)
        }
      } catch {
        // Storage unavailable — the score just isn't remembered.
      }
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  const restart = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  return (
    <section className="container mx-auto mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Check your understanding</h2>
        {best !== null && (
          <span className="text-xs text-muted-foreground">
            Best: {best}/{questions.length}
          </span>
        )}
      </div>

      {done ? (
        <div className="mt-4">
          <p className="text-2xl font-semibold">
            {score}/{questions.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score === questions.length
              ? "Perfect. You've got the core ideas of this topic."
              : score >= Math.ceil(questions.length / 2)
                ? "Good start. Re-read the intro at the top for the ones you missed, then try again."
                : "This one's still fuzzy — that's normal. Read the intro card and play with the visualizer, then retry."}
          </p>
          <button
            onClick={restart}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Question {index + 1} of {questions.length}
          </p>
          <p className="mt-1 font-medium">{q.question}</p>

          <div className="mt-3 grid gap-2">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answerIndex
              const isPicked = i === selected
              const state = !answered
                ? "border-border hover:bg-muted"
                : isAnswer
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : isPicked
                    ? "border-rose-500/50 bg-rose-500/10"
                    : "border-border opacity-60"
              return (
                <button
                  key={opt}
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${state}`}
                >
                  <span>{opt}</span>
                  {answered && isAnswer && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                  {answered && isPicked && !isAnswer && <X className="h-4 w-4 shrink-0 text-rose-600" />}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="mt-3 rounded-xl bg-muted/50 p-3 text-sm">
              <p className="font-semibold">{selected === q.answerIndex ? "Correct" : "Not quite"}</p>
              <p className="mt-0.5 text-muted-foreground">
                <GlossaryText>{q.explanation}</GlossaryText>
              </p>
              <button
                onClick={next}
                className="mt-3 rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                {index === questions.length - 1 ? "See my score" : "Next question"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
