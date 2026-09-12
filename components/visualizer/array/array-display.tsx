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
  // ── Result array props (shown after any operation) ──
  resultArray: number[]
  resultHighlighted: number[]
  resultSwapped: number[]
  resultSorted: number[]
  resultFound: number | null
  hasResult: boolean          // true once an operation has been run
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

function cellDims(len: number) {
  return len <= 8 ? { wh: 64, cls: "text-xl" } : len <= 12 ? { wh: 52, cls: "text-base" } : { wh: 40, cls: "text-sm" }
}

// ── Reusable row of animated cells ────────────────────────────
function ArrayRow({
  arr, highlighted, swapped, sorted, found,
  label, accentDot,
}: {
  arr: number[]
  highlighted: number[]
  swapped: number[]
  sorted: number[]
  found: number | null
  label: string
  accentDot: string   // tailwind bg class for the dot beside the label
}) {
  const dims = cellDims(arr.length)

  return (
    <div className="space-y-3">
      {/* Row label */}
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", accentDot)} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <div className="rounded-full border border-violet-500/12 bg-violet-500/8 px-2 py-0.5 text-[10px] font-mono text-violet-500 dark:text-violet-300">
          len={arr.length}
        </div>
      </div>

      {/* Cells */}
      <div className="min-h-[88px] flex items-center">
        {arr.length === 0 ? (
          <div className="rounded-xl border border-violet-500/10 bg-white/60 px-4 py-3 text-xs text-muted-foreground dark:bg-white/[0.03]">
            Empty
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 py-1">
            <AnimatePresence mode="popLayout">
              {arr.map((val, idx) => {
                const s = getCellStyle(idx, highlighted, swapped, sorted, found)
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
                        s.border, s.bg, s.text, s.shadow, dims.cls
                      )}
                      style={{ width: dims.wh, height: dims.wh }}
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
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────
export function ArrayDisplay({
  array,
  highlightedIndices,
  swappedIndices,
  sortedIndices,
  foundIndex,
  message,
  resultArray,
  resultHighlighted,
  resultSwapped,
  resultSorted,
  resultFound,
  hasResult,
}: ArrayDisplayProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Array Visualization
          </h3>
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-violet-500/15 bg-white/70 px-4 py-2.5 text-sm text-muted-foreground dark:bg-white/[0.04] flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0 animate-pulse" />
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Array ── */}
        {array.length === 0 && !hasResult ? (
          <div className="rounded-2xl border border-violet-500/10 bg-white/70 px-6 py-5 text-center text-sm text-muted-foreground dark:bg-white/[0.03]">
            Array is empty. Enter values and click Set Array.
          </div>
        ) : (
          <ArrayRow
            arr={array}
            highlighted={highlightedIndices}
            swapped={swappedIndices}
            sorted={sortedIndices}
            found={foundIndex}
            label="Input Array"
            accentDot="bg-blue-500"
          />
        )}

        {/* ── Divider + Result Array (shown once an op has run) ── */}
        <AnimatePresence>
          {hasResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent" />
                <span className="rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-500/70">
                  ↓ result
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent" />
              </div>

              {/* Result row */}
              <ArrayRow
                arr={resultArray}
                highlighted={resultHighlighted}
                swapped={resultSwapped}
                sorted={resultSorted}
                found={resultFound}
                label="Result Array"
                accentDot="bg-emerald-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 border-t border-violet-500/10 pt-4">
          {[
            { cls: "border-violet-500/20 bg-white/80 dark:bg-white/[0.06]", label: "Default" },
            { cls: "border-amber-400 bg-amber-400/15",                       label: "Active"  },
            { cls: "border-rose-400 bg-rose-500/20",                          label: "Moving"  },
            { cls: "border-emerald-400 bg-emerald-500/15",                    label: "Done"    },
            { cls: "bg-violet-600 border-violet-500",                         label: "Found"   },
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