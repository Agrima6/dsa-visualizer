"use client"

import { useState } from "react"
import type { DPItem, DPProblem } from "@/hooks/use-dp"
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface DPControlsProps {
  problem: DPProblem
  onSetProblem: (p: DPProblem) => void
  items: DPItem[]
  onSetItems: (items: DPItem[]) => void
  capacity: number
  onSetCapacity: (c: number) => void
  strA: string
  onSetStrA: (s: string) => void
  strB: string
  onSetStrB: (s: string) => void
  isAnimating: boolean
  onRun: () => void
  onReset: () => void
  voiceEnabled: boolean
  onSetVoiceEnabled: (v: boolean) => void
  speed: number
  onSetSpeed: (speed: number) => void
}

export function DPControls({
  problem, onSetProblem,
  items, onSetItems,
  capacity, onSetCapacity,
  strA, onSetStrA,
  strB, onSetStrB,
  isAnimating, onRun, onReset,
  voiceEnabled, onSetVoiceEnabled,
  speed, onSetSpeed,
}: DPControlsProps) {
  const [itemsText, setItemsText] = useState(items.map((it) => `${it.weight},${it.value}`).join(" "))

  const applyItems = (text: string) => {
    setItemsText(text)
    const parsed = text
      .split(/\s+/)
      .filter(Boolean)
      .map((pair) => {
        const [w, v] = pair.split(",").map(Number)
        return { weight: w || 0, value: v || 0 }
      })
      .filter((it) => it.weight > 0)
    if (parsed.length) onSetItems(parsed)
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl border border-violet-500/15 bg-muted/30 p-1">
        {(["knapsack", "lcs"] as DPProblem[]).map((p) => (
          <button
            key={p}
            onClick={() => onSetProblem(p)}
            disabled={isAnimating}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              problem === p
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "knapsack" ? "0/1 Knapsack" : "Longest Common Subseq."}
          </button>
        ))}
      </div>

      {problem === "knapsack" ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Items (weight,value)
            </label>
            <input
              value={itemsText}
              onChange={(e) => applyItems(e.target.value)}
              disabled={isAnimating}
              className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
              placeholder="2,3 3,4 4,5 5,6"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Capacity
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={capacity}
              onChange={(e) => onSetCapacity(Math.max(1, Math.min(15, Number(e.target.value) || 1)))}
              disabled={isAnimating}
              className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              String A
            </label>
            <input
              value={strA}
              onChange={(e) => onSetStrA(e.target.value.toUpperCase().slice(0, 10))}
              disabled={isAnimating}
              className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              String B
            </label>
            <input
              value={strB}
              onChange={(e) => onSetStrB(e.target.value.toUpperCase().slice(0, 10))}
              disabled={isAnimating}
              className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
            />
          </div>
        </div>
      )}

      <SpeedControl speed={speed} onSetSpeed={onSetSpeed} disabled={isAnimating} />

      <div className="flex gap-2">
        <button
          onClick={onRun}
          disabled={isAnimating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition-opacity disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> Run
        </button>
        <button
          onClick={onReset}
          disabled={isAnimating}
          className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => onSetVoiceEnabled(!voiceEnabled)}
          className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
