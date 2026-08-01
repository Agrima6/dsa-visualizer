"use client"
// hooks/Use graph.ts

import { useState, useCallback, useEffect } from "react"
import { playNarration, stopNarration } from "@/lib/narration"
import type {
  GraphNode, GraphEdge, GraphOperation, GraphAlgorithm,
} from "@/components/visualizer/graph/types"

function sleep(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms))
}

let _nodeCounter = 1

export function useGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: "A", label: "A", x: 260, y: 100 },
    { id: "B", label: "B", x: 130, y: 230 },
    { id: "C", label: "C", x: 390, y: 230 },
    { id: "D", label: "D", x: 80,  y: 370 },
    { id: "E", label: "E", x: 200, y: 370 },
    { id: "F", label: "F", x: 340, y: 370 },
  ])
  const [edges, setEdges] = useState<GraphEdge[]>([
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "A", to: "C" },
    { id: "e3", from: "B", to: "D" },
    { id: "e4", from: "B", to: "E" },
    { id: "e5", from: "C", to: "F" },
  ])
  const [highlighted, setHighlighted] = useState<string[]>([])
  const [visited,     setVisited]     = useState<string[]>([])
  const [inQueue,     setInQueue]     = useState<string[]>([])
  const [path,        setPath]        = useState<string[]>([])
  const [message,     setMessage]     = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [operations,  setOperations]  = useState<GraphOperation[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [startNode,   setStartNode]   = useState<string>("A")
  const [algorithm,   setAlgorithm]   = useState<GraphAlgorithm>("bfs")
  const [speed, setSpeed] = useState(650)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  useEffect(() => { if (!voiceEnabled) stopNarration() }, [voiceEnabled])

  const addOp = (op: Omit<GraphOperation, "timestamp">) =>
    setOperations(prev => [{ ...op, timestamp: Date.now() }, ...prev].slice(0, 15))

  const resetViz = () => {
    setHighlighted([]); setVisited([]); setInQueue([]); setPath([]); setMessage("")
  }

  const buildAdj = (ns: GraphNode[], es: GraphEdge[]) => {
    const adj: Record<string, string[]> = {}
    ns.forEach(n => { adj[n.id] = [] })
    es.forEach(e => {
      adj[e.from]?.push(e.to)
      if (!e.directed) adj[e.to]?.push(e.from)
    })
    return adj
  }

  const addNode = useCallback((x: number, y: number) => {
    if (isAnimating) return
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const usedLabels = new Set(nodes.map(n => n.label))
    let label = ""
    for (const l of labels) { if (!usedLabels.has(l)) { label = l; break } }
    if (!label) label = `N${_nodeCounter++}`
    const id = label
    setNodes(prev => [...prev, { id, label, x, y }])
    addOp({ type: "add-node", label })
    resetViz()
  }, [nodes, isAnimating])

  const removeNode = useCallback((id: string) => {
    if (isAnimating) return
    setNodes(prev => prev.filter(n => n.id !== id))
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id))
    if (selectedNode === id) setSelectedNode(null)
    if (startNode === id) setStartNode(nodes.find(n => n.id !== id)?.id ?? "")
    addOp({ type: "remove-node", label: id })
    resetViz()
  }, [isAnimating, selectedNode, startNode, nodes])

  const addEdge = useCallback((fromId: string, toId: string) => {
    if (isAnimating || fromId === toId) return
    const exists = edges.some(e =>
      (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    )
    if (exists) return
    const id = `e${Date.now()}`
    setEdges(prev => [...prev, { id, from: fromId, to: toId }])
    addOp({ type: "add-edge", label: `${fromId}—${toId}` })
    resetViz()
  }, [edges, isAnimating])

  const moveNode = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n))
  }, [])

  const clear = useCallback(() => {
    if (isAnimating) return
    setNodes([]); setEdges([]); resetViz()
    setSelectedNode(null); setStartNode("")
    addOp({ type: "clear" })
    _nodeCounter = 1
  }, [isAnimating])

  const runBFS = useCallback(async () => {
    if (isAnimating || !startNode || !nodes.find(n => n.id === startNode)) return
    setIsAnimating(true); resetViz()
    addOp({ type: "run-bfs", label: `from ${startNode}` })

    const adj = buildAdj(nodes, edges)
    const visitedSet = new Set<string>()
    const queue: string[] = [startNode]
    const order: string[] = []
    visitedSet.add(startNode)

    setInQueue([startNode])
    setMessage(`BFS from ${startNode}. Queue: [${startNode}]`)
    if (voiceEnabled) await playNarration(`Starting breadth first search from ${startNode}.`)
    await sleep(speed)

    while (queue.length > 0) {
      const curr = queue.shift()!
      order.push(curr)
      setInQueue([...queue])
      setHighlighted([curr])
      setVisited([...order])
      setMessage(`Visiting ${curr}. Queue: [${queue.join(",")}]`)
      if (voiceEnabled) await playNarration(`Visiting ${curr}.`)
      await sleep(speed)

      for (const nb of (adj[curr] ?? [])) {
        if (!visitedSet.has(nb)) {
          visitedSet.add(nb)
          queue.push(nb)
          setInQueue([...queue])
          setMessage(`${curr} → ${nb} discovered. Queue: [${queue.join(",")}]`)
          await sleep(speed / 2)
        }
      }
    }

    setHighlighted([])
    setPath([...order])
    setMessage(`BFS complete: ${order.join(" → ")}`)
    setIsAnimating(false)
  }, [nodes, edges, startNode, isAnimating, speed, voiceEnabled])

  const runDFS = useCallback(async () => {
    if (isAnimating || !startNode || !nodes.find(n => n.id === startNode)) return
    setIsAnimating(true); resetViz()
    addOp({ type: "run-dfs", label: `from ${startNode}` })

    const adj = buildAdj(nodes, edges)
    const visitedSet = new Set<string>()
    const order: string[] = []

    const dfs = async (node: string) => {
      visitedSet.add(node)
      order.push(node)
      setHighlighted([node])
      setVisited([...order])
      setMessage(`DFS visiting ${node}. Stack depth: ${order.length}`)
      if (voiceEnabled) await playNarration(`Visiting ${node} in depth first search.`)
      await sleep(speed)

      for (const nb of (adj[node] ?? [])) {
        if (!visitedSet.has(nb)) {
          setInQueue([nb])
          setMessage(`${node} → recurse into ${nb}`)
          await sleep(speed / 2)
          await dfs(nb)
          setHighlighted([node])
          await sleep(speed / 3)
        }
      }
    }

    await dfs(startNode)
    setHighlighted([])
    setInQueue([])
    setPath([...order])
    setMessage(`DFS complete: ${order.join(" → ")}`)
    setIsAnimating(false)
  }, [nodes, edges, startNode, isAnimating, speed, voiceEnabled])

  const run = useCallback(() => {
    if (algorithm === "bfs") return runBFS()
    return runDFS()
  }, [algorithm, runBFS, runDFS])

  return {
    nodes, edges, highlighted, visited, inQueue, path,
    message, isAnimating, operations, selectedNode, startNode, algorithm,
    setSelectedNode, setStartNode, setAlgorithm,
    speed, setSpeed, voiceEnabled, setVoiceEnabled,
    addNode, removeNode, addEdge, moveNode, clear, run, resetViz,
  }
}
