import { useState, useRef } from "react"
import { QueueNode, QueueOperation } from "@/components/visualizer/queue/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

let nodeIdCounter = 0

/**
 * A deque (double-ended queue) allows insertion and removal at BOTH ends —
 * it's a strict generalization of a simple queue (front-only removal,
 * rear-only insertion) and a stack (both ops at one end).
 */
export function useDeque(maxSize: number = 8) {
  const [queue, setQueue] = useState<QueueNode[]>([])
  const [operations, setOperations] = useState<QueueOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const queueRef = useRef<QueueNode[]>([])
  queueRef.current = queue

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const reindex = (arr: QueueNode[]) => arr.map((n, i) => ({ ...n, index: i }))

  const addFront = async (value: number) => {
    const current = queueRef.current
    if (current.length >= maxSize || isAnimating) return
    setIsAnimating(true)
    if (voiceEnabled) await playNarration(`Adding ${value} to the front of the deque.`)

    setHighlightedIndex(0)
    stepSound()
    await new Promise((r) => setTimeout(r, 500))

    const next = reindex([{ id: `node-${nodeIdCounter++}`, value, index: 0 }, ...current])
    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "enqueue", value, timestamp: Date.now() }])
    stepSound()
    await new Promise((r) => setTimeout(r, 350))

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `${value} added to the front.`)
  }

  const addRear = async (value: number) => {
    const current = queueRef.current
    if (current.length >= maxSize || isAnimating) return
    setIsAnimating(true)
    if (voiceEnabled) await playNarration(`Adding ${value} to the rear of the deque.`)

    setHighlightedIndex(current.length)
    stepSound()
    await new Promise((r) => setTimeout(r, 500))

    const next = reindex([...current, { id: `node-${nodeIdCounter++}`, value, index: current.length }])
    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "enqueue", value, timestamp: Date.now() }])
    stepSound()
    await new Promise((r) => setTimeout(r, 350))

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `${value} added to the rear.`)
  }

  const removeFront = async () => {
    const current = queueRef.current
    if (current.length === 0 || isAnimating) return
    setIsAnimating(true)

    const removed = current[0]
    if (voiceEnabled) await playNarration(`Removing ${removed.value} from the front of the deque.`)

    setHighlightedIndex(0)
    stepSound()
    await new Promise((r) => setTimeout(r, 500))

    const next = reindex(current.slice(1))
    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "dequeue", value: removed.value, timestamp: Date.now() }])
    stepSound()
    await new Promise((r) => setTimeout(r, 350))

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `${removed.value} removed from the front.`)
  }

  const removeRear = async () => {
    const current = queueRef.current
    if (current.length === 0 || isAnimating) return
    setIsAnimating(true)

    const removed = current[current.length - 1]
    if (voiceEnabled) await playNarration(`Removing ${removed.value} from the rear of the deque.`)

    setHighlightedIndex(current.length - 1)
    stepSound()
    await new Promise((r) => setTimeout(r, 500))

    const next = reindex(current.slice(0, -1))
    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "dequeue", value: removed.value, timestamp: Date.now() }])
    stepSound()
    await new Promise((r) => setTimeout(r, 350))

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `${removed.value} removed from the rear.`)
  }

  const clear = () => {
    setQueue([])
    queueRef.current = []
    setOperations([])
    setHighlightedIndex(null)
    setIsAnimating(false)
    nodeIdCounter = 0
  }

  return {
    queue, operations, isAnimating, highlightedIndex,
    addFront, addRear, removeFront, removeRear, clear,
    isFull: queue.length >= maxSize,
    isEmpty: queue.length === 0,
    voiceEnabled, setVoiceEnabled,
  }
}
