"use client"

import { useRef } from "react"

/** A plain textarea with a highlighted `<pre>` twin behind it, so
 * `//` and `/* *\/` comments render in a muted color distinct from
 * code while the text stays a real, editable textarea (no editor
 * library — this only needs to color one thing, not full JS syntax). */
function highlight(code: string) {
  const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const parts: string[] = []
  const regex = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(escaped))) {
    parts.push(escaped.slice(lastIndex, match.index))
    parts.push(`<span class="text-sky-400/80 italic">${match[0]}</span>`)
    lastIndex = match.index + match[0].length
  }
  parts.push(escaped.slice(lastIndex))
  return parts.join("")
}

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CodeEditor({ value, onChange, className = "" }: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null)

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!preRef.current) return
    preRef.current.scrollTop = e.currentTarget.scrollTop
    preRef.current.scrollLeft = e.currentTarget.scrollLeft
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-violet-500/15 bg-neutral-950 ${className}`}>
      <pre
        ref={preRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed text-emerald-300"
        dangerouslySetInnerHTML={{ __html: highlight(value) + "\n" }}
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        className="relative h-full w-full resize-none whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-[13px] leading-relaxed text-transparent caret-emerald-300 outline-none focus:border-violet-500/40"
      />
    </div>
  )
}
