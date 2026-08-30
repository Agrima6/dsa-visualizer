"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { COMPLEXITIES, ComplexityId, formatOps } from "./complexity-data"

// Recharts' ResponsiveContainer measures its parent via a real DOM layout
// pass, which doesn't exist during `next build`'s server-side prerender —
// that mismatch is what produces the harmless but noisy "width(-1) and
// height(-1)" warning in build logs. Loading it client-only sidesteps the
// SSR pass for this component entirely instead of just resizing after the
// fact.
const ComplexityChart = dynamic(
  () => import("./complexity-chart").then((m) => m.ComplexityChart),
  { ssr: false, loading: () => <div className="h-[280px] w-full sm:h-[340px]" /> }
)

const MAX_N = 40

export function GrowthExplorer() {
  const [n, setN] = useState(10)
  const [logScale, setLogScale] = useState(true)
  const [highlight, setHighlight] = useState<ComplexityId | null>(null)

  const rows = useMemo(() => COMPLEXITIES.map((c) => ({ ...c, value: c.ops(n) })), [n])
  const maxLog = useMemo(() => Math.max(...rows.map((r) => Math.log10(r.value + 1))), [rows])

  const slowest = rows[rows.length - 1]
  const fastest = rows[0]
  const ratio = fastest.value > 0 ? Math.round(slowest.value / fastest.value) : 0

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input size
            </Label>
            <div className="mt-1 text-3xl font-bold tracking-tight">
              n = <span className="hero-gradient-text">{n}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Switch checked={logScale} onCheckedChange={setLogScale} id="log-scale" />
            <Label htmlFor="log-scale" className="cursor-pointer text-muted-foreground">
              Log scale (see the full picture)
            </Label>
          </div>
        </div>

        <div className="mt-4">
          <Slider value={n} onChange={setN} min={1} max={MAX_N} />
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>{MAX_N}</span>
          </div>
        </div>

        {ratio > 1 && (
          <motion.p
            key={n}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground"
          >
            At <span className="font-semibold text-foreground">n = {n}</span>,{" "}
            <span className="font-semibold" style={{ color: slowest.color }}>{slowest.notation}</span> needs{" "}
            <span className="font-semibold text-foreground">{formatOps(slowest.value)}</span> operations while{" "}
            <span className="font-semibold" style={{ color: fastest.color }}>{fastest.notation}</span> needs just{" "}
            <span className="font-semibold text-foreground">{formatOps(fastest.value)}</span> —{" "}
            that's <span className="font-semibold text-foreground">{formatOps(ratio)}×</span> more work.
          </motion.p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {rows.map((r) => {
            const barPercent = Math.max(3, (Math.log10(r.value + 1) / (maxLog || 1)) * 100)
            return (
              <button
                key={r.id}
                onClick={() => setHighlight(highlight === r.id ? null : r.id)}
                className="group flex items-center gap-3 rounded-xl border border-violet-500/10 bg-white/50 px-3 py-2.5 text-left transition hover:border-violet-500/25 dark:bg-white/[0.02]"
                style={{ outline: highlight === r.id ? `2px solid ${r.color}` : undefined }}
              >
                <span
                  className="w-[74px] shrink-0 font-mono text-sm font-semibold"
                  style={{ color: r.color }}
                >
                  {r.notation}
                </span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: r.color }}
                    animate={{ width: `${barPercent}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </span>
                <span className="w-[72px] shrink-0 whitespace-nowrap text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {formatOps(r.value)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6">
        <ComplexityChart maxN={MAX_N} currentN={n} logScale={logScale} highlightId={highlight} />
      </div>
    </div>
  )
}
