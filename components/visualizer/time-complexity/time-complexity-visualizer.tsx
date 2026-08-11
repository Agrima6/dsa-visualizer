"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Code2, Lightbulb, HelpCircle, Scale } from "lucide-react"
import { GrowthExplorer } from "./growth-explorer"
import { CodeWalkthrough } from "./code-walkthrough"
import { AnalogyCards } from "./analogy-cards"
import { ComplexityQuiz } from "./complexity-quiz"
import { BestAvgWorst } from "./best-avg-worst"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "why", label: "Why it matters", icon: Sparkles },
  { id: "growth", label: "Watch it grow", icon: TrendingUp },
  { id: "code", label: "Spot it in code", icon: Code2 },
  { id: "analogies", label: "Real-world analogies", icon: Lightbulb },
  { id: "quiz", label: "Test yourself", icon: HelpCircle },
  { id: "cases", label: "Best / worst case", icon: Scale },
]

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-6 max-w-2xl">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}

export function TimeComplexityVisualizer() {
  const [active, setActive] = useState("why")

  function scrollTo(id: string) {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="container mx-auto space-y-10 pb-16">
      {/* Hero header — matches the rest of the visualizer suite */}
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Learn by experimenting
          </div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent md:text-4xl">
            Time Complexity, Actually Understood
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Not another wall of Big-O definitions. Drag sliders, watch real code execute operation by operation,
            and build an intuition for why some algorithms fall apart as input grows — and others barely notice.
          </p>
        </div>
      </div>

      {/* Section nav */}
      <div className="sticky top-[72px] z-30 -mx-1 overflow-x-auto px-1 py-1">
        <div className="flex w-max gap-2 rounded-2xl border border-violet-500/12 bg-white/80 p-1.5 shadow-[0_10px_30px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-neutral-950/80">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all sm:text-sm",
                  active === s.id
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-violet-500/8"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 1. Why it matters */}
      <motion.section
        id="why"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="1 · The idea"
          title="Why should you care how an algorithm scales?"
          description="Time complexity isn't about counting seconds on a stopwatch — it's about predicting how the AMOUNT OF WORK grows as your input grows, before you ever run the code."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Two algorithms, same job</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Searching a phone book by reading every name (O(n)) vs. jumping to the middle each time (O(log n)) both find
              the name eventually. For 10 names, barely any difference. For 10 million names, one finishes instantly and the other doesn't.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Hardware can't save you</p>
            <p className="mt-2 text-sm text-muted-foreground">
              A faster computer makes a slow algorithm run faster — but it doesn't change its SHAPE. An O(n²) algorithm
              on a 100× faster machine still eventually loses to an O(n log n) algorithm as n keeps growing.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">It's about the shape, not the exact count</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Big-O describes how operations grow, ignoring constants — "roughly proportional to n", "roughly proportional
              to n²". Scroll down and you'll watch that shape emerge from real, counted operations.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 2 & 3-ish. Growth */}
      <motion.section
        id="growth"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="2 · Growth"
          title="Drag the slider. Watch the gap explode."
          description="Every number below is computed live from the actual Big-O formula for that class — nothing is pre-baked. Click a row to highlight it on the graph."
        />
        <GrowthExplorer />
      </motion.section>

      {/* 4. Code walkthrough */}
      <motion.section
        id="code"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="3 · Identify it from code"
          title="Watch the real algorithm run, line by line"
          description="This isn't a formula — it's the actual algorithm executing. The operation counter only increments when a real comparison or swap happens, and the highlighted line is exactly where the code is at that moment."
        />
        <CodeWalkthrough />
      </motion.section>

      {/* Real-world analogies */}
      <motion.section
        id="analogies"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="4 · Intuition"
          title="If it's not clicking yet, think of it like this"
          description="Every complexity class has an everyday equivalent. Once one of these clicks, the notation stops feeling abstract."
        />
        <AnalogyCards />
      </motion.section>

      {/* Quiz */}
      <motion.section
        id="quiz"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="5 · Practice"
          title="Which complexity is this?"
          description="Eight short snippets, increasing in difficulty — including a couple of common traps. Instant feedback with a real explanation, not just right/wrong."
        />
        <ComplexityQuiz />
      </motion.section>

      {/* Best/avg/worst */}
      <motion.section
        id="cases"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="scroll-mt-32"
      >
        <SectionHeading
          eyebrow="6 · Nuance"
          title="One algorithm, multiple complexities"
          description="Big-O usually describes the WORST case, but the same algorithm can behave very differently depending on the input it's given."
        />
        <BestAvgWorst />
      </motion.section>
    </div>
  )
}
