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
import { HuffmanNode } from "./types"
import TreeNode from "./tree-node"
import { useTheme } from "next-themes"
import { useEffect, useCallback, useState } from "react"

interface HuffmanDisplayProps {
  tree: HuffmanNode | null
  highlightedNodes: string[]
  message: string
}

const nodeTypes = {
  huffman: TreeNode,
}

export function HuffmanDisplay({
  tree,
  highlightedNodes,
  message,
}: HuffmanDisplayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)
  const { theme } = useTheme()

  const onInit = useCallback((flowInstance: ReactFlowInstance) => {
    setReactFlowInstance(flowInstance)
  }, [])

  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.2,
          duration: 400,
          maxZoom: 1.5,
        })
      }, 50)
    }
  }, [reactFlowInstance])

  useEffect(() => {
    if (!tree) {
      setNodes([])
      setEdges([])
      return
    }

    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    const processNode = (
      node: HuffmanNode,
      x: number = 0,
      y: number = 0,
      level: number = 0,
      parentId?: string,
      edgeLabel?: "0" | "1"
    ) => {
      const baseSpacing = 100
      const spacing = Math.pow(1.8, level) * baseSpacing
      const verticalSpacing = 120

      newNodes.push({
        id: node.id,
        type: "huffman",
        position: { x, y },
        data: {
          value: node.value,
          frequency: node.frequency,
          code: node.code,
          highlighted: highlightedNodes.includes(node.id),
        },
      })

      if (parentId) {
        newEdges.push({
          id: `${parentId}->${node.id}`,
          source: parentId,
          target: node.id,
          type: "default",
          style: {
            stroke:
              theme === "dark"
                ? highlightedNodes.includes(node.id)
                  ? "rgba(192,132,252,0.95)"
                  : "rgba(255,255,255,0.45)"
                : highlightedNodes.includes(node.id)
                ? "rgba(124,58,237,0.95)"
                : "rgba(99,102,241,0.35)",
            strokeWidth: highlightedNodes.includes(node.id) ? 2.4 : 1.8,
            opacity: highlightedNodes.includes(node.id) ? 1 : 0.9,
          },
          animated: highlightedNodes.includes(node.id),
          label: edgeLabel,
          labelStyle: {
            fill: theme === "dark" ? "#c4b5fd" : "#7c3aed",
            fontWeight: "bold",
            fontSize: 13,
          },
          labelBgStyle: {
            fill:
              theme === "dark"
                ? "rgba(15,23,42,0.72)"
                : "rgba(255,255,255,0.85)",
            fillOpacity: 1,
          },
          labelBgBorderRadius: 10,
          labelBgPadding: [6, 3],
        })
      }

      if (node.left) {
        processNode(
          node.left,
          x - spacing,
          y + verticalSpacing,
          level + 1,
          node.id,
          "0"
        )
      }

      if (node.right) {
        processNode(
          node.right,
          x + spacing,
          y + verticalSpacing,
          level + 1,
          node.id,
          "1"
        )
      }
    }

    processNode(tree)
    setNodes(newNodes)
    setEdges(newEdges)
    fitView()
  }, [tree, highlightedNodes, setNodes, setEdges, theme, fitView])

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative h-[600px] w-full overflow-hidden rounded-[28px]">
        {message && (
          <div className="absolute left-4 top-4 z-10 max-w-[320px] rounded-2xl border border-violet-500/15 bg-white/85 px-4 py-3 text-sm text-foreground shadow-[0_10px_30px_rgba(139,92,246,0.08)] backdrop-blur-md dark:bg-slate-900/75">
            {message}
          </div>
        )}

        {!tree ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border border-violet-500/10 bg-white/75 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
              Huffman tree is empty
              <div className="mt-1 text-xs">Enter text and build the tree</div>
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
            fitViewOptions={{
              padding: 0.2,
              maxZoom: 1.5,
            }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            proOptions={{ hideAttribution: true }}
            className="transition-all duration-300"
          >
            <Background
              color={
                theme === "dark"
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(124,58,237,0.18)"
              }
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