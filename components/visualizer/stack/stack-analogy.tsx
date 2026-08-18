"use client"
// components/visualizer/stack/stack-analogy.tsx
// "Understand" step: connects the abstract LIFO rule to something every
// user has already used thousands of times — the browser Back button —
// before they ever see push/pop terminology.

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, Layers, Sparkles } from "lucide-react"

const PAGES = ["Google", "YouTube", "GitHub", "AlgoMaitri"]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function StackAnalogy() {
  const [visited, setVisited] = useState<string[]>([])
  const [justPopped, setJustPopped] = useState<string | null>(null)

  const canVisit = visited.length < PAGES.length
  const nextPage = PAGES[visited.length]
  const top = visited[visited.length - 1]

  const visit = () => {
    if (!canVisit) return
    setJustPopped(null)
    setVisited((v) => [...v, nextPage])
  }

  const goBack = () => {
    if (visited.length === 0) return
    setJustPopped(top)
    setVisited((v) => v.slice(0, -1))
  }

  const reset = () => {
    setVisited([])
    setJustPopped(null)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">You already use a stack every day</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your browser&apos;s <span className="font-semibold text-foreground">Back button</span> is a stack.
              Visit a page, and it gets pushed on top of your history. Press Back, and the most recently
              visited page — the one on top — is the first one you return to. That&apos;s LIFO: Last In, First Out.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-white/70 p-6 dark:bg-white/[0.04]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">Try it</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Browser chrome mockup */}
          <div className="overflow-hidden rounded-2xl border border-violet-500/12 bg-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-3 py-2.5">
              <button
                onClick={goBack}
                disabled={visited.length === 0}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                  visited.length === 0 ? "text-neutral-700" : "text-neutral-300 hover:bg-white/10 hover:text-white"
                )}
                aria-label="Go back"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <div className="flex-1 truncate rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-neutral-400">
                {top ? `algomaitri.com/${top.toLowerCase()}` : "algomaitri.com"}
              </div>
            </div>
            <div className="flex min-h-[220px] items-center justify-center p-6">
              {top ? (
                <p className="text-lg font-semibold text-white">{top}</p>
              ) : (
                <p className="text-sm text-neutral-500">No pages visited yet</p>
              )}
            </div>
          </div>

          {/* Stack visualization */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">History stack</p>
            </div>
            <div className="flex min-h-[190px] flex-col-reverse gap-2 rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] p-3">
              {visited.length === 0 && (
                <p className="text-center text-xs text-muted-foreground/70 py-6">Empty — visit a page to push it here</p>
              )}
              {visited.map((page, i) => {
                const isTop = i === visited.length - 1
                return (
                  <div
                    key={`${page}-${i}`}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                      isTop
                        ? "border-violet-500/50 bg-violet-500/15 text-violet-600 dark:text-violet-300 shadow-[0_0_0_1px_rgba(139,92,246,0.3)]"
                        : "border-border/60 bg-white/60 text-muted-foreground dark:bg-white/[0.03]"
                    )}
                  >
                    <span>{page}</span>
                    {isTop && <span className="text-[10px] font-mono uppercase tracking-wide text-violet-500">top ← next back</span>}
                  </div>
                )
              })}
            </div>
            {justPopped && (
              <p className="mt-2 text-xs text-rose-500">
                ← <span className="font-semibold">{justPopped}</span> removed — it was on top, so it came off first.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={visit}
            disabled={!canVisit}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] transition-all disabled:opacity-40"
          >
            {canVisit ? `Visit ${nextPage}` : "All pages visited"}
          </button>
          <button
            onClick={goBack}
            disabled={visited.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-violet-500/5 disabled:opacity-40 dark:bg-white/[0.03]"
          >
            <ArrowLeft className="h-4 w-4" /> Press Back
          </button>
          <button
            onClick={reset}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] to-blue-500/[0.06] p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-violet-500" />
          <div>
            <h3 className="text-sm font-semibold">The same idea runs your code</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Undo/redo, backtracking algorithms, and — most importantly — the{" "}
              <span className="font-semibold text-foreground">function call stack</span> that runs every
              program you write all follow this exact same rule: the last thing pushed is the first thing
              that comes back off.
            </p>
            <Link
              href="/visualizer/functions"
              className="mt-3 inline-flex text-sm font-semibold text-violet-500 hover:text-violet-600"
            >
              Watch a real call stack push and pop →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
