"use client"
// components/visualizer/graph/Graph visualizer.tsx

import { useState } from "react"
import { GraphDisplay } from "./Graph display"
import { GraphControls } from "./Graph controls"
import { useGraph } from "@/hooks/Use graph"
import GraphCodeView from "./Graph code view"

export function GraphVisualizer() {
  const [mode, setMode] = useState<"visualizer" | "code">("visualizer")

  if (mode === "code") {
    return <GraphCodeView onBack={() => setMode("visualizer")} />
  }

  return <GraphVisualizerOriginal onSwitchToCode={() => setMode("code")} />
}

function GraphVisualizerOriginal({ onSwitchToCode }: { onSwitchToCode: () => void }) {
  const {
    nodes, edges, highlighted, visited, inQueue, path,
    message, isAnimating, operations, selectedNode, startNode, algorithm,
    setSelectedNode, setStartNode, setAlgorithm,
    addNode, removeNode, addEdge, moveNode, clear, run, resetViz,
  } = useGraph()

  const handleNodeClick = (id: string) => {
    if (selectedNode === null) {
      setSelectedNode(id)
    } else if (selectedNode === id) {
      setSelectedNode(null)
    } else {
      addEdge(selectedNode, id)
      setSelectedNode(null)
    }
  }

  const handleCanvasClick = (x: number, y: number) => {
    if (selectedNode !== null) { setSelectedNode(null); return }
    addNode(x, y)
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/>
                <line x1="7" y1="11" x2="17" y2="6" strokeWidth="2"/><line x1="7" y1="13" x2="17" y2="18" strokeWidth="2"/>
              </svg>
              Graph Structure
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Graph Visualization
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              Build graphs interactively and watch BFS and DFS animate step by step across nodes and edges.
            </p>

            {selectedNode && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
                <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                Node <span className="font-mono">{selectedNode}</span> selected — click another node to add an edge, or click canvas to cancel
              </div>
            )}
          </div>

          <button
            onClick={onSwitchToCode}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-blue-600/10 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:from-violet-600/20 hover:to-blue-600/20 hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)] dark:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            Try with Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <GraphControls
          nodes={nodes}
          edges={edges}
          algorithm={algorithm}
          startNode={startNode}
          selectedNode={selectedNode}
          isAnimating={isAnimating}
          operations={operations}
          onSetAlgorithm={setAlgorithm}
          onSetStartNode={setStartNode}
          onSetSelectedNode={setSelectedNode}
          onAddEdge={addEdge}
          onRemoveNode={removeNode}
          onClear={clear}
          onRun={run}
          onReset={resetViz}
        />

        <GraphDisplay
          nodes={nodes}
          edges={edges}
          highlighted={highlighted}
          visited={visited}
          inQueue={inQueue}
          path={path}
          message={message}
          selectedNode={selectedNode}
          onNodeClick={handleNodeClick}
          onCanvasClick={handleCanvasClick}
          onNodeMove={moveNode}
        />
      </div>
    </div>
  )
}