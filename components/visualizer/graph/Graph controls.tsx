"use client"
// components/visualizer/graph/graph-controls.tsx

import { useState } from "react"
import { Card } from "@/components/ui/card"
import type { GraphNode, GraphEdge, GraphOperation, GraphAlgorithm } from "./types"
import { Play, Trash2, RotateCcw, GitBranch } from "lucide-react"

interface GraphControlsProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  algorithm: GraphAlgorithm
  startNode: string
  selectedNode: string | null
  isAnimating: boolean
  operations: GraphOperation[]
  onSetAlgorithm: (a: GraphAlgorithm) => void
  onSetStartNode: (id: string) => void
  onSetSelectedNode: (id: string | null) => void
  onAddEdge: (from: string, to: string) => void
  onRemoveNode: (id: string) => void
  onClear: () => void
  onRun: () => void
  onReset: () => void
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }

const PANEL = "rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]"

export function GraphControls({
  nodes, edges, algorithm, startNode, selectedNode, isAnimating, operations,
  onSetAlgorithm, onSetStartNode, onSetSelectedNode,
  onAddEdge, onRemoveNode, onClear, onRun, onReset,
}: GraphControlsProps) {
  const [edgeFrom, setEdgeFrom] = useState("")
  const [edgeTo,   setEdgeTo]   = useState("")

  const disabled = cn(isAnimating && "opacity-50 pointer-events-none")

  const handleAddEdge = () => {
    if (edgeFrom && edgeTo && edgeFrom !== edgeTo) {
      onAddEdge(edgeFrom, edgeTo)
      setEdgeFrom(""); setEdgeTo("")
    }
  }

  const opLabel = (op: GraphOperation) => {
    switch (op.type) {
      case "add-node":   return `Add node ${op.label}`
      case "add-edge":   return `Add edge ${op.label}`
      case "remove-node":return `Remove node ${op.label}`
      case "clear":      return "Clear graph"
      case "run-bfs":    return `BFS ${op.label}`
      case "run-dfs":    return `DFS ${op.label}`
      default:           return op.type
    }
  }

  return (
    <div className="space-y-5">
      <Card className={cn(PANEL, "p-5")}>
        <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Graph Controls
        </h3>

        {/* Instruction */}
        <div className="mb-4 rounded-xl border border-violet-500/10 bg-violet-500/5 px-3 py-2.5 text-xs text-muted-foreground leading-5">
          <span className="font-semibold text-violet-600 dark:text-violet-300">Tip:</span> Click the canvas to add nodes. Use the form below to add edges, then run BFS or DFS.
        </div>

        {/* Algorithm picker */}
        <div className="mb-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Algorithm</label>
          <div className="flex gap-2">
            {(["bfs", "dfs"] as const).map(a => (
              <button key={a} onClick={() => onSetAlgorithm(a)} disabled={isAnimating}
                className={cn("flex-1 h-10 rounded-xl text-sm font-semibold border transition-all",
                  algorithm === a
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-[0_6px_20px_rgba(139,92,246,0.22)]"
                    : "border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5",
                  disabled)}>
                {a.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Start node */}
        <div className="mb-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Node</label>
          <select value={startNode} onChange={e => onSetStartNode(e.target.value)} disabled={isAnimating || nodes.length === 0}
            className="w-full h-10 rounded-xl border border-violet-500/15 bg-white/80 dark:bg-white/[0.04] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">Select start node</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        {/* Add edge */}
        <div className="mb-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Edge</label>
          <div className="flex gap-2">
            <select value={edgeFrom} onChange={e => setEdgeFrom(e.target.value)} disabled={isAnimating}
              className="flex-1 h-10 rounded-xl border border-violet-500/15 bg-white/80 dark:bg-white/[0.04] px-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="">From</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <select value={edgeTo} onChange={e => setEdgeTo(e.target.value)} disabled={isAnimating}
              className="flex-1 h-10 rounded-xl border border-violet-500/15 bg-white/80 dark:bg-white/[0.04] px-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="">To</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <button onClick={handleAddEdge} disabled={isAnimating || !edgeFrom || !edgeTo || edgeFrom === edgeTo}
              className={cn("h-10 w-10 rounded-xl border border-violet-500/15 bg-violet-500/10 text-violet-600 dark:text-violet-300 flex items-center justify-center hover:bg-violet-500/15 disabled:opacity-40 transition-all")}>
              <GitBranch className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Remove node */}
        {nodes.length > 0 && (
          <div className="mb-4 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remove Node</label>
            <div className="flex gap-2 flex-wrap">
              {nodes.map(n => (
                <button key={n.id} onClick={() => onRemoveNode(n.id)} disabled={isAnimating}
                  className={cn("h-8 min-w-[32px] rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs font-mono font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 disabled:opacity-40 px-2 transition-all")}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 border-t border-violet-500/10 pt-4">
          <button onClick={onRun} disabled={isAnimating || nodes.length === 0 || !startNode}
            className={cn("h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold shadow-[0_6px_20px_rgba(139,92,246,0.22)] flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all")}>
            <Play className="h-3.5 w-3.5" /> Run
          </button>
          <button onClick={onReset} disabled={isAnimating}
            className={cn("h-11 rounded-xl border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-sm text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1.5 transition-all")}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button onClick={onClear} disabled={isAnimating}
            className={cn("h-11 rounded-xl border border-rose-500/15 bg-rose-500/5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1.5 transition-all")}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </Card>

      {/* Complexity info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border border-sky-400/15 bg-sky-500/[0.05] p-4">
          <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky-400/70">Time</p>
          <p className="font-mono text-lg font-bold text-sky-500 dark:text-sky-300">O(V + E)</p>
        </div>
        <div className="rounded-[22px] border border-violet-400/15 bg-violet-500/[0.05] p-4">
          <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-violet-400/70">Space</p>
          <p className="font-mono text-lg font-bold text-violet-500 dark:text-violet-300">O(V)</p>
        </div>
      </div>

      {/* History */}
      {operations.length > 0 && (
        <Card className={cn(PANEL, "p-5")}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">History</h3>
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {operations.map((op, i) => (
              <div key={op.timestamp} className={cn("rounded-lg px-3 py-2 text-xs", i === 0 ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "text-muted-foreground")}>
                {opLabel(op)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}