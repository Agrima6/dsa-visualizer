"use client"

import { Zap } from "lucide-react"

interface SpeedControlProps {
  speed: number
  onSetSpeed: (speed: number) => void
  disabled?: boolean
  className?: string
}

const SPEED_OPTIONS = [
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
]

export function SpeedControl({ speed, onSetSpeed, disabled, className }: SpeedControlProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        Animation Speed
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {SPEED_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => onSetSpeed(value)}
            className={`h-9 rounded-xl border text-xs font-semibold transition-all disabled:opacity-50 ${
              speed === value
                ? "border-amber-400/50 bg-amber-400/15 text-amber-600 dark:text-amber-300"
                : "border-violet-500/10 bg-white/60 text-muted-foreground hover:bg-amber-400/5 dark:bg-white/[0.03]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
