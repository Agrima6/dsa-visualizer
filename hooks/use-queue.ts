import { useState } from "react"
import { QueueNode, QueueOperation } from "@/components/visualizer/queue/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

let nodeIdCounter = 0

export function useQueue(maxSize: number = 8) {
  const [queue, setQueue] = useState<QueueNode[]>([])
  const [operations, setOperations] = useState<QueueOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const enqueue = async (value: number) => {
    if (queue.length >= maxSize || isAnimating) return

    setIsAnimating(true)

    setOperations((prev) => [
      ...prev,
      { type: "enqueue", value, timestamp: Date.now() },
    ])

    // highlight new position
    setHighlightedIndex(queue.length)
    stepSound()

    // wait before inserting
    await new Promise((resolve) => setTimeout(resolve, 500))

    setQueue((prev) => [
      ...prev,
      {
        id: `node-${nodeIdCounter++}`,
        value,
        index: prev.length,
      },
    ])

    // optional second step sound after actual insertion
    stepSound()

    await new Promise((resolve) => setTimeout(resolve, 500))

    setHighlightedIndex(null)
    setIsAnimating(false)

    endSound()
    showEndMessage("Algorithm ended", "Element enqueued successfully.")
  }

  const dequeue = async () => {
    if (queue.length === 0 || isAnimating) return

    setIsAnimating(true)

    setOperations((prev) => [
      ...prev,
      {
        type: "dequeue",
        value: queue[0].value,
        timestamp: Date.now(),
      },
    ])

    // highlight front element
    setHighlightedIndex(0)
    stepSound()

    await new Promise((resolve) => setTimeout(resolve, 500))

    setQueue((prev) => {
      const newQueue = prev.slice(1)
      return newQueue.map((node, i) => ({
        ...node,
        index: i,
      }))
    })

    // sound after removal
    stepSound()

    await new Promise((resolve) => setTimeout(resolve, 500))

    setHighlightedIndex(null)
    setIsAnimating(false)

    endSound()
    showEndMessage("Algorithm ended", "Element dequeued successfully.")
  }

  const clear = () => {
    setQueue([])
    setOperations([])
    setHighlightedIndex(null)
    setIsAnimating(false)
    nodeIdCounter = 0
  }

  return {
    queue,
    operations,
    isAnimating,
    highlightedIndex,
    enqueue,
    dequeue,
    clear,
    isFull: queue.length >= maxSize,
    isEmpty: queue.length === 0,
  }
}