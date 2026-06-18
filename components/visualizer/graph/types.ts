// components/visualizer/graph/types.ts

export type GraphAlgorithm = "bfs" | "dfs"

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  directed?: boolean
}

export interface GraphStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  highlighted: string[]   // violet — currently visiting
  visited: string[]       // emerald — done
  inQueue: string[]       // amber — queued/scheduled
  path: string[]          // rose — final path/result
  message: string
  auxiliary?: { label: string; value: string | number }[]
}

export interface GraphOperation {
  type: "add-node" | "add-edge" | "remove-node" | "clear" | "run-bfs" | "run-dfs"
  label?: string
  timestamp: number
}