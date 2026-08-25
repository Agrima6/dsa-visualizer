import { useState, useRef } from "react"
import { QueueNode, QueueOperation } from "@/components/visualizer/queue/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

let nodeIdCounter = 0

/**
 * A priority queue dequeues by priority, not arrival order — the value
 * itself IS the priority here (lower value = higher priority = dequeued
 * first), and the queue is kept sorted on insert so the front is always
 * the current highest-priority element. This is a sorted-array
 * implementation, deliberately simpler than the binary-heap one under
 * the Heap topic — same contract, different (more visual) mechanism.
 */
export function usePriorityQueue() {
  const [queue, setQueue] = useState<QueueNode[]>([])
  const [operations, setOperations] = useState<QueueOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const queueRef = useRef<QueueNode[]>([])
  queueRef.current = queue

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()
  const [speed, setSpeedState] = useState(1)
  const speedRef = useRef(1)
  const setSpeed = (v: number) => { speedRef.current = v; setSpeedState(v) }
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speedRef.current))

  const insert = async (value: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    if (voiceEnabled) await playNarration(`Inserting ${value} into the priority queue.`)

    const current = queueRef.current
    let insertAt = current.length
    for (let i = 0; i < current.length; i++) {
      setHighlightedIndex(i)
      stepSound()
      await sleep(350)
      if (value < current[i].value) {
        insertAt = i
        break
      }
    }

    const newNode: QueueNode = { id: `node-${nodeIdCounter++}`, value, index: insertAt }
    const next = [
      ...current.slice(0, insertAt),
      newNode,
      ...current.slice(insertAt),
    ].map((n, i) => ({ ...n, index: i }))

    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "enqueue", value, timestamp: Date.now() }])
    setHighlightedIndex(insertAt)
    stepSound()
    await sleep(450)

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `Inserted ${value} at priority position ${insertAt}.`)
  }

  const extractMin = async () => {
    const current = queueRef.current
    if (current.length === 0 || isAnimating) return
    setIsAnimating(true)

    const removed = current[0]
    if (voiceEnabled) await playNarration(`Removing highest-priority value ${removed.value}.`)

    setHighlightedIndex(0)
    stepSound()
    await sleep(500)

    const next = current.slice(1).map((n, i) => ({ ...n, index: i }))
    setQueue(next)
    queueRef.current = next
    setOperations((prev) => [...prev, { type: "dequeue", value: removed.value, timestamp: Date.now() }])
    stepSound()
    await sleep(400)

    setHighlightedIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `Removed highest-priority value ${removed.value}.`)
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
    insert, extractMin, clear,
    isEmpty: queue.length === 0,
    voiceEnabled, setVoiceEnabled,
    speed, setSpeed,
  }
}
