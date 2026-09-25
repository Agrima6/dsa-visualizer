"use client"

import { Fragment, useState, type ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GLOSSARY, GLOSSARY_REGEX } from "@/lib/glossary"

function Term({ word, definition }: { word: string; definition: string }) {
  const [open, setOpen] = useState(false)
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="cursor-help underline decoration-dotted decoration-violet-500/60 underline-offset-4"
          >
            {word}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">{definition}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function annotate(text: string): ReactNode {
  const parts: ReactNode[] = []
  const seen = new Set<string>()
  let last = 0
  for (const m of text.matchAll(GLOSSARY_REGEX)) {
    const key = m[0].toLowerCase()
    const start = m.index ?? 0
    if (seen.has(key)) continue
    seen.add(key)
    if (start > last) parts.push(text.slice(last, start))
    parts.push(<Term key={start} word={m[0]} definition={GLOSSARY[key]} />)
    last = start + m[0].length
  }
  if (parts.length === 0) return text
  if (last < text.length) parts.push(text.slice(last))
  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)
}

/** Underlines known jargon in plain string children with a hover/tap definition. */
export function GlossaryText({ children }: { children: ReactNode }) {
  if (typeof children === "string") return <>{annotate(children)}</>
  if (Array.isArray(children)) {
    return <>{children.map((c, i) => (typeof c === "string" ? <Fragment key={i}>{annotate(c)}</Fragment> : c))}</>
  }
  return <>{children}</>
}
