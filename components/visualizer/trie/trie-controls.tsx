"use client"

import { useState } from "react"
import { Play, Search, RotateCcw, Volume2, VolumeX, ListFilter } from "lucide-react"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface TrieControlsProps {
  words: string[]
  isAnimating: boolean
  onInsert: (word: string) => void
  onSearch: (word: string) => void
  onPrefix: (word: string) => void
  onClear: () => void
  voiceEnabled: boolean
  onSetVoiceEnabled: (v: boolean) => void
  speed: number
  onSetSpeed: (speed: number) => void
}

export function TrieControls({
  words, isAnimating, onInsert, onSearch, onPrefix, onClear,
  voiceEnabled, onSetVoiceEnabled, speed, onSetSpeed,
}: TrieControlsProps) {
  const [value, setValue] = useState("")

  const submit = (fn: (w: string) => void) => {
    if (!value.trim() || isAnimating) return
    fn(value)
    setValue("")
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Word
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(onInsert)}
          disabled={isAnimating}
          placeholder="e.g. cat"
          className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => submit(onInsert)}
          disabled={isAnimating || !value.trim()}
          className="flex flex-col items-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-2 py-2.5 text-xs font-semibold text-white shadow transition-opacity disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" /> Insert
        </button>
        <button
          onClick={() => submit(onSearch)}
          disabled={isAnimating || !value.trim()}
          className="flex flex-col items-center gap-1 rounded-xl border border-violet-500/20 px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <Search className="h-3.5 w-3.5" /> Search
        </button>
        <button
          onClick={() => submit(onPrefix)}
          disabled={isAnimating || !value.trim()}
          className="flex flex-col items-center gap-1 rounded-xl border border-violet-500/20 px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <ListFilter className="h-3.5 w-3.5" /> Prefix
        </button>
      </div>

      <SpeedControl speed={speed} onSetSpeed={onSetSpeed} disabled={isAnimating} />

      <div className="flex gap-2">
        <button
          onClick={onClear}
          disabled={isAnimating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-500/20 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear
        </button>
        <button
          onClick={() => onSetVoiceEnabled(!voiceEnabled)}
          className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>
      </div>

      {words.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Words in trie ({words.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {words.map((w) => (
              <span
                key={w}
                className="rounded-full border border-violet-500/15 bg-violet-500/5 px-2.5 py-1 font-mono text-[11px] text-violet-700 dark:text-violet-300"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
