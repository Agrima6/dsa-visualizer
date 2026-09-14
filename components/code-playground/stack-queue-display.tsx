"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { StackQueueSnapshotItem } from "@/lib/code-playground/stack-queue-runner"

interface StackQueueDisplayProps {
  kind: "stack" | "queue"
  items: StackQueueSnapshotItem[]
  highlightedIds: string[]
}

// Stacks render as a vertical tower (top = most recently pushed, drawn at
// the top) and queues render horizontally (front on the left) — matching
// the mental model each structure's own dedicated visualizer already uses.
export function StackQueueDisplay({ kind, items, highlightedIds }: StackQueueDisplayProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-muted-foreground">
        Empty {kind}
      </div>
    )
  }

  if (kind === "stack") {
    const topDown = [...items].reverse()
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-end gap-1 p-4">
        <span className="mb-1 text-[11px] font-medium text-muted-foreground">top</span>
        <AnimatePresence initial={false}>
          {topDown.map((item) => {
            const isHighlighted = highlightedIds.includes(item.id)
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex h-12 w-28 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-colors ${
                  isHighlighted
                    ? "border-violet-500 bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)]"
                    : "border-violet-500/20 bg-white/70 text-foreground dark:bg-white/[0.05]"
                }`}
              >
                {typeof item.value === "string" ? `"${item.value}"` : item.value}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 p-4">
      <div className="flex w-full justify-between px-2 text-[11px] font-medium text-muted-foreground">
        <span>front</span>
        <span>back</span>
      </div>
      <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isHighlighted = highlightedIds.includes(item.id)
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-sm font-semibold transition-colors ${
                  isHighlighted
                    ? "border-violet-500 bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)]"
                    : "border-violet-500/20 bg-white/70 text-foreground dark:bg-white/[0.05]"
                }`}
              >
                {typeof item.value === "string" ? `"${item.value}"` : item.value}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
