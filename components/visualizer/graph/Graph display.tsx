"use client"
// components/visualizer/graph/graph-display.tsx

import { useRef, useState, useCallback } from "react"
import type { GraphNode, GraphEdge } from "./types"

interface GraphDisplayProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  highlighted: string[]
  visited: string[]
  inQueue: string[]
  path: string[]
  message: string
  selectedNode: string | null
  onNodeClick: (id: string) => void
  onCanvasClick: (x: number, y: number) => void
  onNodeMove: (id: string, x: number, y: number) => void
}

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ")
}

function getNodeColors(id: string, h: string[], v: string[], q: string[], p: string[], sel: string | null) {
  if (p.includes(id))  return { fill: "#f43f5e", stroke: "#f43f5e", text: "#fff", glow: "drop-shadow(0 0 10px rgba(244,63,94,0.6))", ring: "" }
  if (h.includes(id))  return { fill: "#8b5cf6", stroke: "#8b5cf6", text: "#fff", glow: "drop-shadow(0 0 12px rgba(139,92,246,0.7))", ring: "" }
  if (v.includes(id))  return { fill: "#10b981", stroke: "#10b981", text: "#fff", glow: "drop-shadow(0 0 8px rgba(16,185,129,0.5))", ring: "" }
  if (q.includes(id))  return { fill: "#f59e0b", stroke: "#f59e0b", text: "#fff", glow: "drop-shadow(0 0 8px rgba(245,158,11,0.5))", ring: "" }
  if (sel === id)      return { fill: "rgba(139,92,246,0.15)", stroke: "#8b5cf6", text: "#8b5cf6", glow: "", ring: "stroke-dasharray:6 3" }
  return { fill: "rgba(255,255,255,0.9)", stroke: "rgba(139,92,246,0.3)", text: "#374151", glow: "", ring: "" }
}

function getEdgeColor(fromId: string, toId: string, v: string[], h: string[]) {
  if (h.includes(fromId) && h.includes(toId)) return "#8b5cf6"
  if (v.includes(fromId) && v.includes(toId)) return "#10b981"
  return "rgba(139,92,246,0.2)"
}

export function GraphDisplay({
  nodes, edges, highlighted, visited, inQueue, path,
  message, selectedNode, onNodeClick, onCanvasClick, onNodeMove,
}: GraphDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 })
  const hasMoved = useRef(false)

  const getSVGPoint = (e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    hasMoved.current = false
    const pt = getSVGPoint(e)
    const node = nodes.find(n => n.id === id)
    if (!node) return
    setDragging(id)
    setDragOffset({ dx: pt.x - node.x, dy: pt.y - node.y })
  }, [nodes])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    hasMoved.current = true
    const pt = getSVGPoint(e)
    onNodeMove(dragging, pt.x - dragOffset.dx, pt.y - dragOffset.dy)
  }, [dragging, dragOffset, onNodeMove])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragging && !hasMoved.current) onNodeClick(dragging)
    setDragging(null)
  }, [dragging, onNodeClick])

  const handleSVGClick = useCallback((e: React.MouseEvent) => {
    if (hasMoved.current) return
    const pt = getSVGPoint(e)
    onCanvasClick(pt.x, pt.y)
  }, [onCanvasClick])

  const R = 26

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_28%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

      <div className="relative p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Graph Visualization
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 font-mono">
              {nodes.length} nodes · {edges.length} edges
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-3 rounded-xl border border-violet-500/15 bg-white/70 px-4 py-2.5 text-sm text-muted-foreground dark:bg-white/[0.04]">
            {message}
          </div>
        )}

        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full rounded-2xl border border-violet-500/8 bg-white/40 dark:bg-white/[0.02] cursor-crosshair"
          style={{ height: 420 }}
          onClick={handleSVGClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setDragging(null)}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(139,92,246,0.4)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(edge => {
            const from = nodes.find(n => n.id === edge.from)
            const to   = nodes.find(n => n.id === edge.to)
            if (!from || !to) return null
            const color = getEdgeColor(edge.from, edge.to, visited, highlighted)
            const dx = to.x - from.x, dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy) || 1
            const x1 = from.x + (dx / len) * R
            const y1 = from.y + (dy / len) * R
            const x2 = to.x - (dx / len) * R
            const y2 = to.y - (dy / len) * R
            return (
              <line key={edge.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth="2"
                strokeLinecap="round"
                style={{ transition: "stroke 0.3s" }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const c = getNodeColors(node.id, highlighted, visited, inQueue, path, selectedNode)
            return (
              <g key={node.id}
                onMouseDown={e => handleMouseDown(e, node.id)}
                style={{ cursor: dragging === node.id ? "grabbing" : "grab" }}
              >
                <circle
                  cx={node.x} cy={node.y} r={R}
                  fill={c.fill} stroke={c.stroke} strokeWidth="2.5"
                  filter={c.glow}
                  style={{ transition: "fill 0.3s, stroke 0.3s", ...(c.ring ? { strokeDasharray: "6 3" } : {}) }}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="14" fontWeight="700" fontFamily="monospace"
                  fill={c.text} style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          {/* Empty state */}
          {nodes.length === 0 && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
              fontSize="13" fill="rgba(139,92,246,0.4)" fontFamily="sans-serif">
              Click anywhere to add a node
            </text>
          )}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-violet-500/10 pt-3">
          {[
            { color: "bg-white/80 border-violet-300/50",   label: "Default" },
            { color: "bg-violet-500 border-violet-500",     label: "Visiting" },
            { color: "bg-amber-400 border-amber-400",       label: "Queued" },
            { color: "bg-emerald-500 border-emerald-500",   label: "Visited" },
            { color: "bg-rose-500 border-rose-500",         label: "Result" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-full border-2", color)} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}