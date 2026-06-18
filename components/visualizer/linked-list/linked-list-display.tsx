"use client"

import { Card } from "@/components/ui/card"
import { LinkedList } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface LinkedListDisplayProps {
  list: LinkedList
  highlightedNodes: string[]
  message: string
  format?: (value: string) => React.ReactNode
}

interface Pointer {
  name: string
  nodeId: string | null
  color: string
}

interface ListNodeProps {
  id: string
  value: string
  isHighlighted: boolean
  showPrevArrow: boolean
  format?: (value: string) => React.ReactNode
}

function ListNode({
  id,
  value,
  isHighlighted,
  showPrevArrow,
  format,
}: ListNodeProps) {
  const displayValue = format ? format(value) : value.toString()

  return (
    <motion.div
      layout
      data-id={id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale:   { type: "spring", stiffness: 300, damping: 25 },
      }}
      className={[
        "relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border shadow-sm",
        isHighlighted
          ? "border-transparent bg-gradient-to-br from-violet-600 via-fuchsia-500 to-blue-500 text-white shadow-[0_0_28px_rgba(139,92,246,0.35)]"
          : "border-violet-500/15 bg-white/75 dark:bg-white/[0.04]",
      ].join(" ")}
    >
      {showPrevArrow && (
        <motion.div
          className="absolute -left-12 top-[60%] w-12 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full">
            <div
              className={`h-[2px] w-full ${
                isHighlighted ? "bg-violet-500" : "bg-muted-foreground/70"
              }`}
            />
            <ArrowLeft
              className={`h-4 w-4 absolute left-0 -translate-x-[2px] top-1/2 -translate-y-1/2 ${
                isHighlighted ? "text-violet-500" : "text-muted-foreground"
              }`}
            />
          </div>
        </motion.div>
      )}

      {isHighlighted && (
        <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-[2px]" />
      )}

      <span
        className={`relative z-10 text-lg font-mono font-semibold ${
          isHighlighted ? "text-white" : ""
        }`}
      >
        {displayValue}
      </span>
    </motion.div>
  )
}

function NextArrow({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <motion.div
      className="flex-shrink-0 w-12 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full -translate-y-2">
        <div
          className={`h-[2px] w-full ${
            isHighlighted ? "bg-violet-500" : "bg-muted-foreground/70"
          }`}
        />
        <ArrowRight
          className={`h-4 w-4 absolute right-0 translate-x-[2px] top-1/2 -translate-y-1/2 ${
            isHighlighted ? "text-violet-500" : "text-muted-foreground"
          }`}
        />
      </div>
    </motion.div>
  )
}

function PointerLabel({
  name,
  position,
  color,
}: {
  name: string
  position: { x: number; y: number }
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute pointer-events-none z-20"
      style={{ left: position.x, top: position.y, color }}
    >
      <div className="flex flex-col items-center">
        <div className="rounded-full border border-violet-500/15 bg-white/85 px-2.5 py-1 text-xs font-mono shadow-sm dark:bg-zinc-900/80">
          {name}
        </div>
        <div
          className="h-6 w-[2px] mt-1 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  )
}

// ─── Constants matching Tailwind sizes ────────────────────────────────────────
const NODE_W  = 80  // w-20
const ARROW_W = 48  // w-12

function getViewBoxWidth(nodeCount: number) {
  return nodeCount * NODE_W + (nodeCount - 1) * ARROW_W
}

function getRowWidth(nodeCount: number) {
  return nodeCount * NODE_W + (nodeCount - 1) * ARROW_W
}

// ─── Tail → Head arc (CSLL + CDLL) ───────────────────────────────────────────
function CircularBackArrow({
  isHighlighted,
  nodeCount,
}: {
  isHighlighted: boolean
  nodeCount: number
}) {
  const color = isHighlighted ? "#8b5cf6" : "rgb(161 161 170 / 0.7)"
  const vbW  = getViewBoxWidth(nodeCount)
  const arcH = 52
  const lx   = 40
  const rx   = vbW - 40
  const r    = 18

  const d = [
    `M ${rx} 0`,
    `L ${rx} ${arcH - r}`,
    `Q ${rx} ${arcH} ${rx - r} ${arcH}`,
    `L ${lx + r} ${arcH}`,
    `Q ${lx} ${arcH} ${lx} ${arcH - r}`,
    `L ${lx} 0`,
  ].join(" ")

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <svg
        viewBox={`0 0 ${vbW} ${arcH + 2}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: arcH + 2, display: "block" }}
        aria-hidden
      >
        <path d={d} fill="none" stroke={color} strokeWidth="2" />
        <polygon
          points={`${lx},0 ${lx - 5},12 ${lx + 5},12`}
          fill={color}
        />
      </svg>
      <span className="mt-1 rounded-full border border-violet-500/15 bg-white/80 px-3 py-1 text-xs text-muted-foreground shadow-sm dark:bg-white/[0.04] select-none">
        Circular Connection
      </span>
    </div>
  )
}

// ─── Head → Tail reverse arc (CDLL only) ─────────────────────────────────────
function CircularBackArrowReverse({
  isHighlighted,
  nodeCount,
}: {
  isHighlighted: boolean
  nodeCount: number
}) {
  const color = isHighlighted ? "#8b5cf6" : "rgb(161 161 170 / 0.7)"
  const vbW  = getViewBoxWidth(nodeCount)
  const arcH = 36
  const lx   = 40
  const rx   = vbW - 40
  const r    = 14

  const d = [
    `M ${lx} 0`,
    `L ${lx} ${arcH - r}`,
    `Q ${lx} ${arcH} ${lx + r} ${arcH}`,
    `L ${rx - r} ${arcH}`,
    `Q ${rx} ${arcH} ${rx} ${arcH - r}`,
    `L ${rx} 0`,
  ].join(" ")

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <svg
        viewBox={`0 0 ${vbW} ${arcH + 2}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: arcH + 2, display: "block" }}
        aria-hidden
      >
        <path d={d} fill="none" stroke={color} strokeWidth="2" />
        <polygon
          points={`${rx},0 ${rx - 5},12 ${rx + 5},12`}
          fill={color}
        />
      </svg>
    </div>
  )
}

// ─── Animated arc wrapper — smoothly resizes width ───────────────────────────
function AnimatedArcContainer({
  nodeCount,
  isCircular,
  isDoubly,
  circularHighlighted,
}: {
  nodeCount: number
  isCircular: boolean
  isDoubly: boolean
  circularHighlighted: boolean
}) {
  if (!isCircular || nodeCount === 0) return null

  const targetWidth = getRowWidth(nodeCount)

  return (
    <motion.div
      // Key stays constant — we animate width, not remount
      layout
      animate={{ width: targetWidth, opacity: 1 }}
      initial={{ width: targetWidth, opacity: 0 }}
      transition={{
        width:   { type: "spring", stiffness: 280, damping: 30 },
        opacity: { duration: 0.25 },
        layout:  { type: "spring", stiffness: 280, damping: 30 },
      }}
      style={{ overflow: "visible" }}
    >
      {isDoubly && (
        <CircularBackArrowReverse
          isHighlighted={circularHighlighted}
          nodeCount={nodeCount}
        />
      )}
      <CircularBackArrow
        isHighlighted={circularHighlighted}
        nodeCount={nodeCount}
      />
    </motion.div>
  )
}

export function LinkedListDisplay({
  list,
  highlightedNodes,
  message,
  pointers = [],
  format,
}: LinkedListDisplayProps & { pointers?: Pointer[] }) {

  // ── Build chain (stop before circular revisit) ────────────────────────────
  const getNodeChain = () => {
    const chain: string[] = []
    let current = list.head
    const visited = new Set<string>()

    while (current) {
      if (visited.has(current)) break
      const node = list.nodes.get(current)
      if (!node) break
      chain.push(current)
      visited.add(current)
      current = node.next ?? null
    }

    return chain
  }

  const nodeChain      = getNodeChain()
  const isCircular     = list.type === "CSLL" || list.type === "CDLL"
  const isDoubly       = list.type === "DLL"  || list.type === "CDLL"
  const tailHighlighted = list.tail ? highlightedNodes.includes(list.tail) : false
  const headHighlighted = list.head ? highlightedNodes.includes(list.head) : false
  const circularHighlighted = tailHighlighted && headHighlighted

  const getNodePosition = (nodeId: string): { x: number; y: number } | null => {
    const element = document.querySelector(`[data-id="${nodeId}"]`)
    if (!element) return null
    const rect = element.getBoundingClientRect()
    const container = document.querySelector(".list-container")
    if (!container) return null
    const containerRect = container.getBoundingClientRect()
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top  - containerRect.top  - 40,
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">

      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        {/* Message badge */}
        {message && (
          <div className="absolute top-0 left-0 rounded-full border border-violet-500/15 bg-white/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
            {message}
          </div>
        )}

        <div className="mt-14 flex items-center justify-center min-h-[360px]">
          <div className="list-container relative w-full">

            {/* Pointer labels */}
            <AnimatePresence>
              {pointers.map(
                (pointer) =>
                  pointer.nodeId && (
                    <PointerLabel
                      key={pointer.name}
                      name={pointer.name}
                      color={pointer.color}
                      position={getNodePosition(pointer.nodeId) || { x: 0, y: 0 }}
                    />
                  )
              )}
            </AnimatePresence>

            {/* Empty state */}
            {nodeChain.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[260px] items-center justify-center"
              >
                <div className="rounded-2xl border border-violet-500/10 bg-white/75 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
                  Linked list is empty
                  <div className="mt-1 text-xs">Insert nodes to begin</div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center w-full">

                {/* ── Node row ── */}
                <motion.div
                  layout
                  className="flex items-center justify-center"
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                >
                  <AnimatePresence mode="sync">
                    {nodeChain.map((nodeId, index) => (
                      <motion.div
                        key={nodeId}
                        layout
                        className="flex items-center"
                        transition={{
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                        }}
                      >
                        <ListNode
                          id={nodeId}
                          value={list.nodes.get(nodeId)!.value}
                          isHighlighted={highlightedNodes.includes(nodeId)}
                          showPrevArrow={isDoubly && index > 0}
                          format={format}
                        />

                        {index < nodeChain.length - 1 && (
                          <NextArrow
                            isHighlighted={
                              highlightedNodes.includes(nodeId) &&
                              highlightedNodes.includes(nodeChain[index + 1])
                            }
                          />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* ── Circular arcs — animated width ── */}
                <AnimatedArcContainer
                  nodeCount={nodeChain.length}
                  isCircular={isCircular}
                  isDoubly={isDoubly}
                  circularHighlighted={circularHighlighted}
                />

              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}