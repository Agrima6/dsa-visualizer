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
      className={[
        "relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-300",
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

function NextArrow({
  isHighlighted,
  isCurved = false,
}: {
  isHighlighted: boolean
  isCurved?: boolean
}) {
  if (isCurved) {
    return (
      <motion.div
        className="flex-shrink-0 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className={`h-16 w-[2px] ${
            isHighlighted ? "bg-violet-500" : "bg-muted-foreground/70"
          }`}
        />
        <div className="relative w-32 h-8">
          <div
            className={`absolute inset-0 border-t-2 border-r-2 rounded-tr-2xl ${
              isHighlighted ? "border-violet-500" : "border-muted-foreground/70"
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

  return (
    <motion.div
      className="flex-shrink-0 w-12 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
      className="absolute pointer-events-none z-20"
      style={{
        left: position.x,
        top: position.y,
        color: color,
      }}
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

export function LinkedListDisplay({
  list,
  highlightedNodes,
  message,
  pointers = [],
  format,
}: LinkedListDisplayProps & { pointers?: Pointer[] }) {
  const getNodeChain = () => {
    const chain: string[] = []
    let current = list.head
    const visited = new Set<string>()

    while (current) {
      const node = list.nodes.get(current)
      if (!node) break

      chain.push(current)
      visited.add(current)

      if (node.next && visited.has(node.next)) {
        break
      }

      current = node.next
    }

    return chain
  }

  const nodeChain = getNodeChain()
  const isCircular = list.type === "CSLL" || list.type === "CDLL"
  const isDoubly = list.type === "DLL" || list.type === "CDLL"

  const getNodePosition = (nodeId: string): { x: number; y: number } | null => {
    const element = document.querySelector(`[data-id="${nodeId}"]`)
    if (!element) return null
    const rect = element.getBoundingClientRect()
    const container = document.querySelector(".list-container")
    if (!container) return null
    const containerRect = container.getBoundingClientRect()
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 40,
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
      <div className="absolute -top-10 left-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        {message && (
          <div className="absolute top-0 left-0 rounded-full border border-violet-500/15 bg-white/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
            {message}
          </div>
        )}

        <div className="mt-14 flex items-center justify-center min-h-[360px]">
          <div className="list-container relative w-full">
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

            {nodeChain.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="rounded-2xl border border-violet-500/10 bg-white/75 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm dark:bg-white/[0.04]">
                  Linked list is empty
                  <div className="mt-1 text-xs">Insert nodes to begin</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-0 items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {nodeChain.map((nodeId, index) => (
                    <div key={nodeId} className="flex items-center">
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
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {isCircular && list.head && list.tail && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <NextArrow
                isHighlighted={
                  highlightedNodes.includes(list.tail) &&
                  highlightedNodes.includes(list.head)
                }
                isCurved
              />
              <span className="mt-2 rounded-full border border-violet-500/15 bg-white/80 px-3 py-1 text-xs text-muted-foreground shadow-sm dark:bg-white/[0.04]">
                Circular Connection
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}