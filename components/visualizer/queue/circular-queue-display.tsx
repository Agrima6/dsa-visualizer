"use client"

import { QueueNode } from "./types"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function CircularQueueDisplay({
  slots,
  front,
  rear,
  activeIndex,
}: {
  slots: (QueueNode | null)[]
  front: number
  rear: number
  activeIndex: number | null
}) {
  const size = slots.length
  const radius = 110
  const center = 140

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />

      <div className="relative flex flex-col items-center">
        <svg width={center * 2} height={center * 2} className="max-w-full">
          {/* connecting ring */}
          <circle cx={center} cy={center} r={radius} fill="none" strokeDasharray="4 6" className="stroke-violet-500/20" strokeWidth={1.5} />

          {slots.map((slot, i) => {
            const angle = (i / size) * 2 * Math.PI - Math.PI / 2
            const x = center + radius * Math.cos(angle)
            const y = center + radius * Math.sin(angle)
            const isFront = i === front
            const isRear = i === rear
            const isActive = i === activeIndex

            return (
              <g key={i}>
                <foreignObject x={x - 30} y={y - 30} width={60} height={60}>
                  <div
                    className={cn(
                      "flex h-[60px] w-[60px] flex-col items-center justify-center rounded-xl border-2 font-mono text-sm font-semibold transition-all",
                      isActive
                        ? "border-transparent bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_8px_24px_rgba(139,92,246,0.4)] scale-110"
                        : slot
                        ? "border-violet-500/40 bg-white/85 text-foreground dark:bg-white/[0.06]"
                        : "border-dashed border-violet-500/15 bg-white/40 text-muted-foreground/40 dark:bg-white/[0.02]"
                    )}
                  >
                    <span>{slot ? slot.value : "–"}</span>
                    <span className="text-[9px] font-normal text-muted-foreground/70">#{i}</span>
                  </div>
                </foreignObject>
                {(isFront || isRear) && (
                  <foreignObject x={x - 40} y={y + (y > center ? 32 : -54)} width={80} height={20}>
                    <div className="flex items-center justify-center gap-1">
                      {isFront && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                          Front
                        </span>
                      )}
                      {isRear && (
                        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          Rear
                        </span>
                      )}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>

        <span className="mt-2 inline-flex items-center rounded-full border border-violet-500/15 bg-white/75 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm dark:bg-white/[0.04]">
          {slots.filter(Boolean).length} / {size} slots used
        </span>
      </div>
    </div>
  )
}
