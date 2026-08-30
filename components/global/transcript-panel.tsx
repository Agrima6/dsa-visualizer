"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, X } from "lucide-react"
import { subscribeTranscript, type TranscriptEntry } from "@/lib/narration"
import { useAccessibility } from "@/hooks/use-accessibility"

/**
 * A floating, dismissible log of every narration line spoken anywhere on
 * the current page — for accessibility-mode users, or anyone who wants a
 * scrollback of what a visualizer just said instead of replaying audio.
 * Only mounts its subscription when transcriptsEnabled is on.
 */
export function TranscriptPanel() {
  const { transcriptsEnabled } = useAccessibility()
  const [entries, setEntries] = useState<TranscriptEntry[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!transcriptsEnabled) return
    return subscribeTranscript((entry) => {
      setEntries((prev) => [...prev.slice(-49), entry])
    })
  }, [transcriptsEnabled])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [entries])

  if (!transcriptsEnabled || entries.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-sm">
      <div className="rounded-2xl border border-violet-500/20 bg-card/95 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> Narration transcript
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {collapsed ? "Show" : "Hide"}
            </button>
            <button
              onClick={() => setEntries([])}
              aria-label="Clear transcript"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {!collapsed && (
          <div ref={scrollRef} className="max-h-40 space-y-1.5 overflow-y-auto p-3 text-sm">
            {entries.map((e) => (
              <p key={e.id} className="text-muted-foreground">{e.text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
