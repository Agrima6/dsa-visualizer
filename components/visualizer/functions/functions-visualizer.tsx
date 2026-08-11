"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Code2, Lightbulb, HelpCircle, Scale } from "lucide-react"
import { RecursionDepthExplorer } from "./recursion-depth-explorer"
import { CallStackWalkthrough } from "./call-stack-walkthrough"
import { ConceptAnalogyCards } from "./concept-analogy-cards"
import { ConceptQuiz } from "./concept-quiz"
import { FunctionStylesComparison } from "./function-styles-comparison"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "why", label: "Why it matters", icon: Sparkles },
  { id: "growth", label: "Recursion depth", icon: TrendingUp },
  { id: "code", label: "Watch it execute", icon: Code2 },
  { id: "analogies", label: "Real-world analogies", icon: Lightbulb },
  { id: "quiz", label: "Test yourself", icon: HelpCircle },
  { id: "cases", label: "Style comparisons", icon: Scale },
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

export function FunctionsVisualizer() {
  const [active, setActive] = useState("why")

  function scrollTo(id: string) {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="container mx-auto space-y-10 pb-16">
      {/* Hero header */}
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
            Functions, Actually Understood
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Not another wall of syntax rules. Watch real function calls push and pop off the call stack,
            see closures hold onto variables that should be long gone, and build the intuition that "it just works"
            never gives you.
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
          title="Why do functions matter at all?"
          description="A function is a named, reusable block of behavior — write the logic once, then call it as many times as you need with different inputs."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Stop repeating yourself</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Without functions, "calculate tax" logic gets copy-pasted everywhere it's needed. Fix a bug in one copy,
              and the other nine still have it. Wrap it in a function once, and every call site benefits from the fix.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Hide the complexity</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't need to know HOW Math.sqrt() computes a square root to use it — the function gives it a name
              and hides the messy implementation behind that name. That's abstraction.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Every call is a real event</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Calling a function isn't just "running some code" — it pushes a real frame onto the call stack, binds
              your arguments to its parameters, and eventually pops back off. Scroll down and you'll watch it happen.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 2. Recursion depth explorer */}
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
          title="Every recursive call is a real stack frame"
          description="Drag n and watch how many times each function actually calls itself — computed by really running the code, not a formula. This is also where recursion connects back to time complexity."
        />
        <RecursionDepthExplorer />
      </motion.section>

      {/* 3. Call stack walkthrough */}
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
          title="Watch the call stack, frame by frame"
          description="Five real function patterns — basic calls, default parameters, recursion, higher-order functions, and closures — each actually executed with the exact frames it pushes and pops."
        />
        <CallStackWalkthrough />
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
          description="Six core concepts, each with an everyday equivalent — once one of these clicks, the terminology stops feeling abstract."
        />
        <ConceptAnalogyCards />
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
          title="What does this log?"
          description="Eight short snippets to trace through by hand, including the classic gotchas — the missing return, the shadowed variable, the mutated array. Instant feedback with a real explanation."
        />
        <ConceptQuiz />
      </motion.section>

      {/* Style comparisons */}
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
          title="Same result, different tradeoffs"
          description="The same problem can be solved with functions written in very different styles — each with its own cost."
        />
        <FunctionStylesComparison />
      </motion.section>
    </div>
  )
}
