"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts"
import { COMPLEXITIES, ComplexityId } from "./complexity-data"

interface ComplexityChartProps {
  maxN: number
  currentN: number
  logScale: boolean
  activeIds?: ComplexityId[]
  highlightId?: ComplexityId | null
}

export function ComplexityChart({ maxN, currentN, logScale, activeIds, highlightId }: ComplexityChartProps) {
  const visible = activeIds ? COMPLEXITIES.filter((c) => activeIds.includes(c.id)) : COMPLEXITIES

  const data = useMemo(() => {
    const points: Record<string, number>[] = []
    for (let n = 1; n <= maxN; n++) {
      const row: Record<string, number> = { n }
      for (const c of visible) row[c.id] = c.ops(n)
      points.push(row)
    }
    return points
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxN, visible.map((c) => c.id).join(",")])

  return (
    <div className="h-[280px] w-full sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="n"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            label={{ value: "input size (n)", position: "insideBottom", offset: -2, fontSize: 11 }}
          />
          <YAxis
            scale={logScale ? "log" : "linear"}
            domain={logScale ? [1, "auto"] : [0, "auto"]}
            allowDataOverflow
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            width={54}
            label={{ value: "operations", angle: -90, position: "insideLeft", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const info = COMPLEXITIES.find((c) => c.id === name)
              return [Math.round(Number(value)).toLocaleString(), info?.notation ?? String(name)]
            }}
            labelFormatter={(n) => `n = ${n}`}
          />
          <ReferenceLine x={currentN} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeOpacity={0.4} />
          {visible.map((c) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.id}
              stroke={c.color}
              strokeWidth={highlightId === c.id ? 3.5 : 2}
              strokeOpacity={highlightId && highlightId !== c.id ? 0.25 : 1}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
