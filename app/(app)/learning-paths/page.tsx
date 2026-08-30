"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Clock, MapPin, Sparkles } from "lucide-react"
import { LEARNING_PATHS, getTotalMinutes } from "@/lib/learning-paths"
import { TOPICS } from "@/lib/visualizer-topics"
import { useLearningPathProgress } from "@/hooks/use-learning-path-progress"

function topicFor(slug: string) {
  return TOPICS.find((t) => t.slug === slug)
}

export default function LearningPathsPage() {
  const { hydrated, isComplete, toggleComplete, completedCount, continueStep } = useLearningPathProgress()
  const [activePathId, setActivePathId] = useState(LEARNING_PATHS[0].id)
  const activePath = LEARNING_PATHS.find((p) => p.id === activePathId)!

  const { path: continuePath, step: continueStepData } = continueStep()
  const continueTopic = continueStepData ? topicFor(continueStepData.topicSlug) : null

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Guided Learning
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Learning Paths
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Ordered routes through the topics that build on each other, each with an estimated time
            and a "continue where you left off" — instead of guessing what to open next.
          </p>

          {hydrated && continueTopic && (
            <Link
              href={continueTopic.href}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.25)]"
            >
              <MapPin className="h-4 w-4" />
              Continue: {continueTopic.name} ({continuePath.title})
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEARNING_PATHS.map((p) => {
          const done = completedCount(p.id)
          const active = p.id === activePathId
          return (
            <button
              key={p.id}
              onClick={() => setActivePathId(p.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-transparent bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow"
                  : "border-violet-500/15 bg-white/60 text-muted-foreground hover:border-violet-500/30 dark:bg-white/[0.03]"
              }`}
            >
              {p.title}
              {hydrated && done > 0 && (
                <span className={`ml-2 text-xs ${active ? "text-white/80" : "text-muted-foreground/70"}`}>
                  {done}/{p.steps.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rounded-[28px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-white/[0.04]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{activePath.title}</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{activePath.description}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
            <Clock className="h-3.5 w-3.5" />
            ~{getTotalMinutes(activePath)} min total
          </div>
        </div>

        <ol className="relative mt-8 space-y-1">
          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-violet-500/20" aria-hidden />
          {activePath.steps.map((step, i) => {
            const topic = topicFor(step.topicSlug)
            const done = hydrated && isComplete(activePath.id, step.topicSlug)
            if (!topic) return null
            return (
              <li key={step.topicSlug} className="relative flex items-start gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-violet-500/[0.04]">
                <button
                  onClick={() => toggleComplete(activePath.id, step.topicSlug)}
                  aria-label={done ? `Mark ${topic.name} as not complete` : `Mark ${topic.name} as complete`}
                  className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold transition-colors ${
                    done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-violet-500/25 bg-background text-violet-500 hover:border-violet-500"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </button>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={topic.href} className="text-sm font-semibold hover:text-violet-600 dark:hover:text-violet-300">
                      {topic.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">~{step.estimatedMinutes} min</span>
                  </div>
                  {step.note && <p className="mt-0.5 text-xs text-muted-foreground">{step.note}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
