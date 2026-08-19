"use client"

import { QueueNode } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function DequeDisplay({
  queue,
  highlightedIndex,
}: {
  queue: QueueNode[]
  highlightedIndex: number | null
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />

      <div className="relative flex min-h-[280px] w-full flex-col justify-center">
        <div className="mb-5 flex justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            <ArrowLeft className="h-4 w-4" />
            Front (add / remove)
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
            Rear (add / remove)
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="relative flex h-36 items-center overflow-hidden rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="w-full overflow-x-auto px-4">
            {queue.length === 0 ? (
              <div className="flex h-20 w-full items-center justify-center text-sm text-muted-foreground">
                Deque is empty
              </div>
            ) : (
              <motion.div layout="position" className="flex min-w-max items-center gap-3 py-2">
                <AnimatePresence initial={false}>
                  {queue.map((node, i) => {
                    const isActive = highlightedIndex === i
                    return (
                      <motion.div
                        key={node.id}
                        layout="position"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: isActive ? 1.06 : 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className={`relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border will-change-transform ${
                          isActive
                            ? "border-transparent bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
                            : "border-violet-500/15 bg-white/80 dark:bg-white/[0.05]"
                        }`}
                      >
                        <span className="text-lg font-mono font-semibold">{node.value}</span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <span className="inline-flex items-center rounded-full border border-violet-500/15 bg-white/75 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm dark:bg-white/[0.04]">
            Size: {queue.length}
          </span>
        </div>
      </div>
    </div>
  )
}
