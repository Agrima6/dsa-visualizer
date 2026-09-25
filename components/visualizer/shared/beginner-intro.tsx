"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { BookOpen, ChevronDown, Lightbulb, MousePointerClick, Target } from "lucide-react"
import { BEGINNER_INTROS } from "@/lib/beginner-intros"
import { TOPICS } from "@/lib/visualizer-topics"

const storageKey = (slug: string) => `beginner-intro-collapsed:${slug}`

export function BeginnerIntro() {
  const pathname = usePathname()
  const slug = pathname.split("/")[2] ?? ""
  const intro = BEGINNER_INTROS[slug]
  const [open, setOpen] = useState(true)
  const name = TOPICS.find((t) => t.slug === slug)?.name ?? "this"

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(storageKey(slug)) !== "1")
    } catch {
      setOpen(true)
    }
  }, [slug])

  if (!intro || pathname.split("/").length > 3) return null

  const toggle = () => {
    const next = !open
    setOpen(next)
    try {
      localStorage.setItem(storageKey(slug), next ? "0" : "1")
    } catch {
      // Storage unavailable — the toggle still works for this visit.
    }
  }

  return (
    <section className="container mx-auto mb-6 rounded-2xl border border-border bg-card">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-violet-500" />
          New to {name}? Start here
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-5 border-t border-border px-5 py-5">
          <p className="text-base leading-relaxed">{intro.oneLine}</p>

          <div className="rounded-xl bg-muted/50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {intro.analogy.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{intro.analogy.text}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Words you&apos;ll see</p>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {intro.keyTerms.map((k) => (
                <div key={k.term} className="text-sm">
                  <dt className="inline font-semibold">{k.term}</dt>
                  <dd className="inline text-muted-foreground"> — {k.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-sm">
              <p className="mb-1 flex items-center gap-1.5 font-semibold">
                <Target className="h-4 w-4 text-violet-500" /> When would I use this?
              </p>
              <p className="text-muted-foreground">{intro.useWhen}</p>
            </div>
            <div className="text-sm">
              <p className="mb-1 flex items-center gap-1.5 font-semibold">
                <MousePointerClick className="h-4 w-4 text-violet-500" /> Try this first
              </p>
              <p className="text-muted-foreground">{intro.tryThis}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
