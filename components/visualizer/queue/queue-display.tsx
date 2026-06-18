"use client"

import { QueueNode } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface QueueDisplayProps {
  queue: QueueNode[]
  highlightedIndex: number | null
}

export function QueueDisplay({ queue, highlightedIndex }: QueueDisplayProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />

      <div className="relative flex min-h-[360px] w-full flex-col justify-center">
        {/* FRONT / REAR LABELS */}
        <div className="mb-5 flex justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            <ArrowRight className="h-4 w-4" />
            Front
          </div>

          {queue.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
              Rear
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* QUEUE CONTAINER */}
        <div className="relative flex h-36 items-center overflow-hidden rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04]">
          <div className="w-full overflow-x-auto px-4">
            {queue.length === 0 ? (
              <div className="flex h-20 w-full items-center justify-center text-sm text-muted-foreground">
                Queue is empty
              </div>
            ) : (
              <motion.div
                layout="position"
                className="flex min-w-max items-center gap-3 py-2"
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                  },
                }}
              >
                <AnimatePresence initial={false}>
                  {queue.map((node) => {
                    const isActive = highlightedIndex === node.index

                    return (
                      <motion.div
                        key={node.id}
                        layout="position"
                        initial={{ opacity: 0, x: 40, scale: 0.96 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: isActive ? 1.04 : 1,
                        }}
                        exit={{
                          opacity: 0,
                          x: -40,
                          scale: 0.96,
                        }}
                        transition={{
                          x: { type: "spring", stiffness: 320, damping: 26 },
                          scale: { type: "spring", stiffness: 320, damping: 24 },
                          opacity: { duration: 0.18 },
                          layout: { type: "spring", stiffness: 260, damping: 28 },
                        }}
                        className={`
                          relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl
                          border will-change-transform
                          ${isActive
                            ? "border-transparent bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
                            : "border-violet-500/15 bg-white/80 dark:bg-white/[0.05]"
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 blur-xl opacity-60" />
                        )}

                        <span className="relative text-lg font-mono font-semibold">
                          {node.value}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* SIZE + INFO */}
        <div className="mt-5 text-center">
          <span className="inline-flex items-center rounded-full border border-violet-500/15 bg-white/75 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm dark:bg-white/[0.04]">
            Queue Size: {queue.length}
          </span>
        </div>
      </div>
    </div>
  )
}