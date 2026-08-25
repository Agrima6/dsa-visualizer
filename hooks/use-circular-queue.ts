import { useState, useRef } from "react"
import { QueueNode, QueueOperation } from "@/components/visualizer/queue/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

let nodeIdCounter = 0

/**
 * A circular queue is a FIXED-size ring buffer: front and rear pointers
 * wrap around with modulo arithmetic instead of the array just growing.
 * That wraparound — reusing slots a plain queue would leave "used up" —
 * is the entire point of a circular queue over a simple one.
 */
export function useCircularQueue(size: number = 6) {
  const [slots, setSlots] = useState<(QueueNode | null)[]>(Array(size).fill(null))
  const [front, setFront] = useState(-1)
  const [rear, setRear] = useState(-1)
  const [count, setCount] = useState(0)
  const [operations, setOperations] = useState<QueueOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Stale-closure guard: bulk operations call enqueue/dequeue several times
  // in a row from one captured closure, so state vars read directly would
  // keep seeing the render they were captured in. Refs always read fresh.
  const stateRef = useRef({ slots, front, rear, count })
  stateRef.current = { slots, front, rear, count }

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()
  const [speed, setSpeedState] = useState(1)
  const speedRef = useRef(1)
  const setSpeed = (v: number) => { speedRef.current = v; setSpeedState(v) }
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speedRef.current))

  const isFull = count >= size
  const isEmpty = count === 0

  const enqueue = async (value: number) => {
    const s = stateRef.current
    if (s.count >= size || isAnimating) return
    setIsAnimating(true)

    if (voiceEnabled) await playNarration(`Enqueuing value ${value} into the circular queue.`)

    const nextRear = s.count === 0 ? 0 : (s.rear + 1) % size
    setActiveIndex(nextRear)
    stepSound()
    await sleep(500)

    const newNode: QueueNode = { id: `node-${nodeIdCounter++}`, value, index: nextRear }
    const nextSlots = [...s.slots]
    nextSlots[nextRear] = newNode
    const nextFront = s.count === 0 ? 0 : s.front

    setSlots(nextSlots)
    setRear(nextRear)
    setFront(nextFront)
    setCount(s.count + 1)
    stateRef.current = { slots: nextSlots, front: nextFront, rear: nextRear, count: s.count + 1 }

    setOperations((prev) => [...prev, { type: "enqueue", value, timestamp: Date.now() }])
    stepSound()
    await sleep(400)

    setActiveIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `Inserted at slot ${nextRear}.`)
  }

  const dequeue = async () => {
    const s = stateRef.current
    if (s.count === 0 || isAnimating) return
    setIsAnimating(true)

    const removed = s.slots[s.front]!
    if (voiceEnabled) await playNarration(`Dequeuing value ${removed.value} from the circular queue.`)

    setActiveIndex(s.front)
    stepSound()
    await sleep(500)

    const nextSlots = [...s.slots]
    nextSlots[s.front] = null
    const nextCount = s.count - 1
    const nextFront = nextCount === 0 ? -1 : (s.front + 1) % size
    const nextRear = nextCount === 0 ? -1 : s.rear

    setSlots(nextSlots)
    setFront(nextFront)
    setRear(nextRear)
    setCount(nextCount)
    stateRef.current = { slots: nextSlots, front: nextFront, rear: nextRear, count: nextCount }

    setOperations((prev) => [...prev, { type: "dequeue", value: removed.value, timestamp: Date.now() }])
    stepSound()
    await sleep(400)

    setActiveIndex(null)
    setIsAnimating(false)
    endSound()
    showEndMessage("Algorithm ended", `Removed ${removed.value} from the front.`)
  }

  const clear = () => {
    const empty = Array(size).fill(null)
    setSlots(empty)
    setFront(-1)
    setRear(-1)
    setCount(0)
    setOperations([])
    setActiveIndex(null)
    setIsAnimating(false)
    stateRef.current = { slots: empty, front: -1, rear: -1, count: 0 }
    nodeIdCounter = 0
  }

  return {
    slots, front, rear, count, size,
    operations, isAnimating, activeIndex,
    enqueue, dequeue, clear,
    isFull, isEmpty,
    voiceEnabled, setVoiceEnabled,
    speed, setSpeed,
  }
}
