"use client"
// components/visualizer/array/array-display.tsx

import { motion, AnimatePresence } from "framer-motion"

interface ArrayDisplayProps {
  array: number[]
  highlightedIndices: number[]
  swappedIndices: number[]
  sortedIndices: number[]
  foundIndex: number | null
  message: string
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function getCellStyle(
  idx: number,
  highlighted: number[],
  swapped: number[],
  sorted: number[],
  found: number | null
) {
  if (found === idx) return {
    border: "border-violet-500",
    bg: "bg-violet-600",
    text: "text-white",
    label: "text-violet-500",
    shadow: "shadow-[0_0_16px_rgba(139,92,246,0.5)]",
  }
  if (swapped.includes(idx)) return {
    border: "border-rose-400",
    bg: "bg-rose-500/20 dark:bg-rose-500/25",
    text: "text-rose-600 dark:text-rose-300",
    label: "text-rose-400",
    shadow: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
  }
  if (sorted.includes(idx)) return {
    border: "border-emerald-400",
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-300",
    label: "text-emerald-400",
    shadow: "shadow-[0_0_10px_rgba(52,211,153,0.25)]",
  }
  if (highlighted.includes(idx)) return {
    border: "border-amber-400",
    bg: "bg-amber-400/15 dark:bg-amber-400/20",
    text: "text-amber-600 dark:text-amber-300",
    label: "text-amber-400",
    shadow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
  }
  return {
    border: "border-violet-500/20",
    bg: "bg-white/80 dark:bg-white/[0.06]",
    text: "text-foreground",
    label: "text-muted-foreground/50",
    shadow: "",
  }
}

export function ArrayDisplay({
  array,
  highlightedIndices,
  swappedIndices,
  sortedIndices,
  foundIndex,
  message,
}: ArrayDisplayProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Array Visualization
          </h3>
          <div className="rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 text-xs font-mono text-violet-500 dark:text-violet-300">
            length = {array.length}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 rounded-xl border border-violet-500/15 bg-white/70 px-4 py-2.5 text-sm text-muted-foreground dark:bg-white/[0.04]">
            {message}
          </div>
        )}

        {/* Array cells */}
        <div className="min-h-[160px] flex items-center justify-center">
          {array.length === 0 ? (
            <div className="rounded-2xl border border-violet-500/10 bg-white/70 px-6 py-5 text-center text-sm text-muted-foreground dark:bg-white/[0.03]">
              Array is empty. Enter values and click Set Array.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 py-2">
              <AnimatePresence mode="popLayout">
                {array.map((val, idx) => {
                  const s = getCellStyle(idx, highlightedIndices, swappedIndices, sortedIndices, foundIndex)
                  return (
                    <motion.div
                      key={`${idx}-${val}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.25, ease: "backOut" }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-2xl border-2 font-mono font-bold transition-all duration-300",
                          s.border, s.bg, s.text, s.shadow,
                          array.length <= 8  ? "w-16 h-16 text-xl" :
                          array.length <= 12 ? "w-13 h-13 text-base" : "w-10 h-10 text-sm"
                        )}
                        style={{ width: array.length <= 8 ? 64 : array.length <= 12 ? 52 : 40,
                                 height: array.length <= 8 ? 64 : array.length <= 12 ? 52 : 40 }}
                      >
                        {val}
                      </div>
                      <span className={cn("text-[10px] font-mono", s.label)}>{idx}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-3 border-t border-violet-500/10 pt-4">
          {[
            { cls: "border-violet-500/20 bg-white/80 dark:bg-white/[0.06]", label: "Default" },
            { cls: "border-amber-400 bg-amber-400/15",                       label: "Active" },
            { cls: "border-rose-400 bg-rose-500/20",                          label: "Moving" },
            { cls: "border-emerald-400 bg-emerald-500/15",                    label: "Done" },
            { cls: "bg-violet-600 border-violet-500",                         label: "Found" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-sm border-2", cls)} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}