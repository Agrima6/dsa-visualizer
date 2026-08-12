import { useState, useEffect } from 'react'
import { exampleGraphs } from "@/components/visualizer/dijkstra/example-graphs"
import { playNarration, stopNarration } from "@/lib/narration"

export interface Node {
  id: string
  x: number
  y: number
}

export interface Edge {
  source: string
  target: string
  weight: number
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

interface Step {
  currentNode: string | null
  distances: Map<string, number>
  visited: Set<string>
  path: string[]
  message: string
  narration?: string
}

export function useDijkstra() {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })
  const [startNodeId, setStartNodeId] = useState<string | null>(null)
  const [endNodeId, setEndNodeId] = useState<string | null>(null)
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [distances, setDistances] = useState<Map<string, number>>(new Map())
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set())
  const [path, setPath] = useState<string[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speed, setSpeed] = useState(900)
  useEffect(() => { if (!voiceEnabled) stopNarration() }, [voiceEnabled])

  const addNode = (x: number, y: number) => {
    const id = `node-${graph.nodes.length}`
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, { id, x, y }]
    }))
  }

  const addEdge = (source: string, target: string, weight: number) => {
    setGraph(prev => ({
      ...prev,
      edges: [
        ...prev.edges,
        { source, target, weight },
        // Add reverse edge automatically
        { source: target, target: source, weight }
      ]
    }))
  }

  const setStartNode = (nodeId: string) => {
    if (graph.nodes.find(n => n.id === nodeId)) {
      setStartNodeId(nodeId)
    }
  }

  const setEndNode = (nodeId: string) => {
    if (graph.nodes.find(n => n.id === nodeId)) {
      setEndNodeId(nodeId)
    }
  }

  const findShortestPath = async () => {
    if (!startNodeId || !endNodeId || isAnimating) {
      return
    }

    setIsAnimating(true)
    
    // Initialize
    const distances = new Map<string, number>()
    const previous = new Map<string, string>()
    const unvisited = new Set(graph.nodes.map(n => n.id))
    
    // IMPORTANT: Set start node distance to 0 first!
    distances.set(startNodeId, 0)
    
    // Then set all other distances to Infinity
    graph.nodes.forEach(node => {
      if (node.id !== startNodeId) {
        distances.set(node.id, Infinity)
      }
    })

    const steps: Step[] = []
    
    // Add initial step
    steps.push({
      currentNode: startNodeId,
      distances: new Map(distances),
      visited: new Set([startNodeId]),
      path: [startNodeId],
      message: `Starting from node ${startNodeId}`
    })

    let current: string | null = startNodeId
    
    while (unvisited.size > 0 && current) {
      // Mark as visited
      unvisited.delete(current)
      const visited = new Set(graph.nodes.map(n => n.id).filter(id => !unvisited.has(id)))

      if (current === endNodeId) {
        break
      }

      // Update distances to all unvisited neighbors
      const neighbors = graph.edges
        .filter(e => e.source === current || e.target === current)
        .map(e => ({
          node: e.source === current ? e.target : e.source,
          weight: e.weight
        }))

      for (const { node: neighbor, weight } of neighbors) {
        if (unvisited.has(neighbor)) {
          const newDistance = (distances.get(current) || 0) + weight
          const currentDistance = distances.get(neighbor) || Infinity

          if (newDistance < currentDistance) {
            distances.set(neighbor, newDistance)
            previous.set(neighbor, current)
          }
        }
      }

      // Find next unvisited node with minimum distance
      let minDistance = Infinity
      let nextNode: string | null = null
      
      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId) || Infinity
        if (distance < minDistance) {
          minDistance = distance
          nextNode = nodeId
        }
      }

      // Record this step
      const currentPath: string[] = []
      let pathNode: string | null = current
      while (pathNode) {
        currentPath.unshift(pathNode)
        pathNode = previous.get(pathNode) || null
      }

      steps.push({
        currentNode: current,
        distances: new Map(distances),
        visited,
        path: currentPath,
        message: `Visited ${current}, updated distances to neighbors`
      })

      current = nextNode // Move to next node
    }

    // Add final path step if we found the end node
    if (distances.get(endNodeId) !== Infinity) {
      const finalPath: string[] = []
      let pathNode: string | null = endNodeId
      while (pathNode) {
        finalPath.unshift(pathNode)
        pathNode = previous.get(pathNode) || null
      }

      steps.push({
        currentNode: endNodeId,
        distances: new Map(distances),
        visited: new Set(graph.nodes.map(n => n.id).filter(id => !unvisited.has(id))),
        path: finalPath,
        message: `Found shortest path with distance ${distances.get(endNodeId)}`
      })
    }

    setSteps(steps)
    setCurrentStep(0)
    
    // Apply the first step immediately
    if (steps.length > 0) {
      const firstStep = steps[0]
      setCurrentNode(firstStep.currentNode)
      setDistances(firstStep.distances)
      setVisitedNodes(firstStep.visited)
      setPath(firstStep.path)
    }
    
    setIsAnimating(false)
  }

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1]
      setCurrentNode(nextStep.currentNode)
      setDistances(nextStep.distances)
      setVisitedNodes(nextStep.visited)
      setPath(nextStep.path)
      if (voiceEnabled) await playNarration(nextStep.message)
      setCurrentStep(prev => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      const prevStep = steps[currentStep - 1]
      setCurrentStep(prev => prev - 1)
      setCurrentNode(prevStep.currentNode)
      setDistances(prevStep.distances)
      setVisitedNodes(prevStep.visited)
      setPath(prevStep.path)
    }
  }

  const clear = () => {
    setGraph({ nodes: [], edges: [] })
    setStartNodeId(null)
    setEndNodeId(null)
    setCurrentNode(null)
    setDistances(new Map())
    setVisitedNodes(new Set())
    setPath([])
    setSteps([])
    setCurrentStep(-1)
    setIsAnimating(false)
  }

  const loadExample = (index: number) => {
    const example = exampleGraphs[index]
    if (!example) return

    // Set up the graph
    setGraph({
      nodes: example.nodes,
      edges: example.edges,
    })

    // Set up initial distances
    const initialDistances = new Map<string, number>()
    example.nodes.forEach(node => {
      initialDistances.set(node.id, node.id === example.startNode ? 0 : Infinity)
    })

    // Set up initial state
    setStartNodeId(example.startNode)
    setEndNodeId(example.endNode)
    setCurrentNode(example.startNode) // Set current node to start node
    setDistances(initialDistances)
    setVisitedNodes(new Set([example.startNode])) // Add start node to visited
    setPath([example.startNode]) // Initialize path with start node
    
    // Create initial step
    const initialStep: Step = {
      currentNode: example.startNode,
      distances: initialDistances,
      visited: new Set([example.startNode]),
      path: [example.startNode],
      message: `Starting from node ${example.startNode}`
    }
    
    setSteps([initialStep])
    setCurrentStep(0)
    setIsAnimating(false)
  }

  useEffect(() => {
    if (!isAutoPlaying || steps.length === 0) return
    if (currentStep >= steps.length - 1) { setIsAutoPlaying(false); return }
    let cancelled = false
    const timer = window.setTimeout(async () => {
      const next = steps[currentStep + 1]
      if (!next || cancelled) return
      setCurrentNode(next.currentNode); setDistances(next.distances)
      setVisitedNodes(next.visited); setPath(next.path)
      if (voiceEnabled) await playNarration(next.message)
      if (!cancelled) setCurrentStep(currentStep + 1)
    }, speed)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [isAutoPlaying, currentStep, steps, speed, voiceEnabled])

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
    } else {
      if (currentStep >= steps.length - 1) setCurrentStep(0)
      setIsAutoPlaying(true)
    }
  }

  return {
    graph,
    distances,
    path,
    currentNode,
    visitedNodes,
    isAnimating,
    addNode,
    addEdge,
    setStartNode,
    setEndNode,
    findShortestPath,
    clear,
    nextStep,
    previousStep,
    currentStep,
    totalSteps: steps.length,
    loadExample,
    startNodeId,
    endNodeId,
    isAutoPlaying,
    toggleAutoPlay,
    speed,
    setSpeed,
    voiceEnabled,
    setVoiceEnabled,
  }
} 
