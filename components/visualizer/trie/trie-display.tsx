"use client"

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import type { TrieNode } from "./types"
import TrieFlowNode from "./trie-node"
import { useEffect, useCallback, useState } from "react"
import { useTheme } from "next-themes"

interface TrieDisplayProps {
  root: TrieNode
  highlightedNodes: string[]
  matchedNodes: string[]
  missNode: string | null
}

const nodeTypes = { trieNode: TrieFlowNode }

export function TrieDisplay({ root, highlightedNodes, matchedNodes, missNode }: TrieDisplayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const { theme } = useTheme()

  const onInit = useCallback((flowInstance: ReactFlowInstance) => {
    setReactFlowInstance(flowInstance)
  }, [])

  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 400, maxZoom: 1.5 })
      }, 50)
    }
  }, [reactFlowInstance])

  const isEmpty = Object.keys(root.children).length === 0

  useEffect(() => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    const processNode = (
      node: TrieNode,
      x: number,
      y: number,
      level: number,
      parentId?: string
    ) => {
      const childKeys = Object.keys(node.children).sort()
      const isRoot = level === 0
      const active = highlightedNodes.includes(node.id) || matchedNodes.includes(node.id)

      newNodes.push({
        id: node.id,
        type: "trieNode",
        position: { x, y },
        data: {
          char: node.char,
          isEndOfWord: node.isEndOfWord,
          highlighted: highlightedNodes.includes(node.id),
          matched: matchedNodes.includes(node.id),
          isRoot,
        },
      })

      if (parentId) {
        newEdges.push({
          id: `${parentId}->${node.id}`,
          source: parentId,
          target: node.id,
          type: "default",
          style: {
            stroke: active
              ? "rgba(139,92,246,0.9)"
              : theme === "dark" ? "rgba(192, 132, 252, 0.65)" : "rgba(124, 58, 237, 0.5)",
            strokeWidth: 2,
            opacity: 0.95,
          },
          animated: active,
        })
      }

      const spacing = Math.pow(1.5, Math.max(0, 3 - level)) * 55
      const totalWidth = (childKeys.length - 1) * spacing
      childKeys.forEach((key, idx) => {
        const childX = x - totalWidth / 2 + idx * spacing
        processNode(node.children[key], childX, y + 90, level + 1, node.id)
      })

      // synthetic "miss" node — the character that was searched for but doesn't exist
      if (missNode && missNode.startsWith(`${node.id}-`) && missNode.split("-").length === node.id.split("-").length + 1) {
        const missChar = missNode.slice(node.id.length + 1)
        const missIdx = childKeys.length
        newNodes.push({
          id: missNode,
          type: "trieNode",
          position: { x: x - totalWidth / 2 + missIdx * spacing, y: y + 90 },
          data: { char: missChar, isEndOfWord: false, highlighted: false, matched: false, isRoot: false, isMiss: true },
        })
        newEdges.push({
          id: `${node.id}->${missNode}`,
          source: node.id,
          target: missNode,
          style: { stroke: "rgba(244,63,94,0.7)", strokeWidth: 2, strokeDasharray: "4 4" },
        })
      }
    }

    processNode(root, 0, 0, 0)
    setNodes(newNodes)
    setEdges(newEdges)
    fitView()
  }, [root, highlightedNodes, matchedNodes, missNode, setNodes, setEdges, fitView, theme])

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative w-full h-[600px] overflow-hidden rounded-[28px]">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border border-violet-500/10 bg-white/75 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
              Trie is empty
              <div className="mt-1 text-xs">Insert a word to begin</div>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            proOptions={{ hideAttribution: true }}
            className="transition-all duration-300"
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
                background: theme === "dark" ? "rgba(17, 24, 39, 0.72)" : "rgba(255, 255, 255, 0.72)",
                backdropFilter: "blur(14px)",
                borderRadius: "1rem",
                border: theme === "dark" ? "1px solid rgba(167, 139, 250, 0.16)" : "1px solid rgba(139, 92, 246, 0.14)",
                boxShadow: theme === "dark" ? "0 12px 30px rgba(0,0,0,0.24)" : "0 10px 30px rgba(139,92,246,0.08)",
              }}
            />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
