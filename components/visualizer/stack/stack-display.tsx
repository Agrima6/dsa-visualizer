"use client"

import { StackNode } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown } from "lucide-react"

interface StackDisplayProps {
  stack: StackNode[]
  highlightedIndex: number | null
}

export function StackDisplay({ stack, highlightedIndex }: StackDisplayProps) {
  return (
    <div className="relative h-[600px] overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex h-full w-full items-center justify-center">
        <div className="relative w-52 h-full rounded-[24px] border border-violet-500/20 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:bg-white/[0.03]">
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />

          {/* Stack pointer */}
          <motion.div
            className="absolute right-full mr-5 flex items-center text-violet-700 dark:text-violet-300"
            animate={{
              top: stack.length > 0 ? `${64 * (8 - stack.length)}px` : "calc(100% - 64px)",
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="mr-2 rounded-full border border-violet-500/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] shadow-sm dark:bg-white/[0.06]">
              Top
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-blue-500/10">
              <ArrowDown className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Stack elements */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse">
            <AnimatePresence mode="popLayout">
              {stack.map((node, idx) => {
                const isHighlighted = highlightedIndex === node.index
                const isTop = idx === stack.length - 1

                return (
                  <motion.div
                    key={node.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-16 border-t border-violet-500/10 flex items-center justify-center px-3"
                  >
                    <div
                      className={[
                        "absolute inset-x-3 inset-y-1 rounded-2xl transition-all duration-300",
                        isHighlighted
                          ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 shadow-[0_0_25px_rgba(139,92,246,0.35)]"
                          : isTop
                          ? "bg-gradient-to-r from-violet-500/25 to-blue-500/20 border border-violet-500/15"
                          : "bg-white/70 border border-violet-500/10 dark:bg-white/[0.04]",
                      ].join(" ")}
                    />

                    <span
                      className={[
                        "relative z-10 text-lg font-mono font-semibold transition-colors",
                        isHighlighted
                          ? "text-white"
                          : "text-foreground",
                      ].join(" ")}
                    >
                      {node.value}
                    </span>

                    {isTop && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <span className="rounded-full border border-amber-400/25 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                          Peek
                        </span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {stack.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl border border-violet-500/10 bg-white/70 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
                Stack is empty
                <div className="mt-1 text-xs">Push elements to begin</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}