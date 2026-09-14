"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { LinkedListNodeSnapshot } from "@/lib/code-playground/linked-list-runner"

interface LinkedListChainDisplayProps {
  list: LinkedListNodeSnapshot[]
  highlightedNodes: string[]
}

// A simple horizontal chain — Code Playground's linked-list nodes don't
// need ReactFlow's graph layout the way the tree/graph visualizers do,
// since a singly-linked list is just a straight line of boxes and arrows.
export function LinkedListChainDisplay({ list, highlightedNodes }: LinkedListChainDisplayProps) {
  if (list.length === 0) {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
        Empty list
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[160px] flex-wrap items-center gap-1 overflow-x-auto p-4">
      <AnimatePresence initial={false}>
        {list.map((node, i) => {
          const isHighlighted = highlightedNodes.includes(node.id)
          return (
            <motion.div key={node.id} layout className="flex items-center gap-1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-sm font-semibold transition-colors ${
                  isHighlighted
                    ? "border-violet-500 bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)]"
                    : "border-violet-500/20 bg-white/70 text-foreground dark:bg-white/[0.05]"
                }`}
              >
                {node.value}
              </div>
              {i < list.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </motion.div>
          )
        })}
      </AnimatePresence>
      <span className="ml-1 shrink-0 text-xs font-medium text-muted-foreground">→ null</span>
    </div>
  )
}
