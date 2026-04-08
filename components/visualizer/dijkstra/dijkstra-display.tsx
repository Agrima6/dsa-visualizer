"use client"

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Graph } from "@/hooks/use-dijkstra"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import GraphNode from "@/components/visualizer/dijkstra/graph-node"

interface DijkstraDisplayProps {
  graph: Graph
  distances: Map<string, number>
  path: string[]
  currentNode: string | null
  visitedNodes: Set<string>
}

const nodeTypes = {
  graph: GraphNode,
}

const defaultEdgeOptions = {
  type: "straight",
  animated: false,
  style: { strokeWidth: 2 },
}

export function DijkstraDisplay({
  graph,
  distances,
  path,
  currentNode,
  visitedNodes,
}: DijkstraDisplayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { theme } = useTheme()

  useEffect(() => {
    const flowNodes: Node[] = graph.nodes.map((node) => ({
      id: node.id,
      type: "graph",
      position: { x: node.x, y: node.y },
      data: {
        id: node.id,
        distance: distances.get(node.id) || Infinity,
        isVisited: visitedNodes.has(node.id),
        isCurrent: node.id === currentNode,
        isPath: path.includes(node.id),
      },
    }))

    const flowEdges: Edge[] = graph.edges.map((edge) => {
      const isPathEdge = path.some((node, index) => {
        const nextNode = path[index + 1]
        return (
          nextNode &&
          ((edge.source === node && edge.target === nextNode) ||
            (edge.target === node && edge.source === nextNode))
        )
      })

      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.weight.toString(),
        type: "straight",
        animated: isPathEdge,
        style: {
          strokeWidth: isPathEdge ? 3 : 2,
          stroke: isPathEdge
            ? "#10b981"
            : theme === "dark"
            ? "rgba(192,132,252,0.7)"
            : "rgba(124,58,237,0.55)",
          opacity: isPathEdge ? 1 : 0.95,
        },
        labelStyle: {
          fill: theme === "dark" ? "#e9d5ff" : "#6d28d9",
          fontWeight: "700",
          fontSize: "13px",
        },
        labelBgStyle: {
          fill: theme === "dark" ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.88)",
          fillOpacity: 1,
          rx: 10,
          stroke: theme === "dark" ? "rgba(167,139,250,0.18)" : "rgba(139,92,246,0.18)",
          strokeWidth: 1,
          padding: 4,
        },
        labelShowBg: true,
      }
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [graph, distances, path, currentNode, visitedNodes, theme, setNodes, setEdges])

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative h-[800px] overflow-hidden rounded-[28px]">
        {graph.nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border border-violet-500/10 bg-white/75 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
              Graph is empty
              <div className="mt-1 text-xs">Add nodes and edges or load example</div>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.Straight}
            fitView
            fitViewOptions={{
              padding: 0.2,
              maxZoom: 1.5,
            }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              color={theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(124,58,237,0.18)"}
              gap={18}
              size={1}
            />
            <Controls
              position="bottom-right"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
                margin: "1rem",
                padding: "0.5rem",
                background:
                  theme === "dark"
                    ? "rgba(17, 24, 39, 0.72)"
                    : "rgba(255, 255, 255, 0.72)",
                backdropFilter: "blur(14px)",
                borderRadius: "1rem",
                border:
                  theme === "dark"
                    ? "1px solid rgba(167, 139, 250, 0.16)"
                    : "1px solid rgba(139, 92, 246, 0.14)",
                boxShadow:
                  theme === "dark"
                    ? "0 12px 30px rgba(0,0,0,0.24)"
                    : "0 10px 30px rgba(139,92,246,0.08)",
              }}
            />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}