import { useState, useRef } from "react"
import { HeapNode, HeapType } from "@/components/visualizer/heap/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"
import { playNarration } from "@/lib/narration"

export function useHeap(initialType: HeapType = "max") {
  const [heap, setHeap] = useState<HeapNode | null>(null)
  const [heapArray, setHeapArray] = useState<number[]>([])
  const [heapType] = useState<HeapType>(initialType)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const nodeIdRef = useRef(0)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const [speed, setSpeedState] = useState(1)
  const speedRef = useRef(1)
  const setSpeed = (v: number) => { speedRef.current = v; setSpeedState(v) }
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speedRef.current))

  const shouldSwap = (parent: number, child: number): boolean => {
    if (heapType === "max") {
      return parent < child
    }
    return parent > child
  }

  const heapifyUp = async (array: number[], index: number) => {
    let currentIndex = index

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2)

      setHighlightedNodes([`array-${parentIndex}`, `array-${currentIndex}`])
      stepSound()
      await sleep(500)

      if (shouldSwap(array[parentIndex], array[currentIndex])) {
        ;[array[parentIndex], array[currentIndex]] = [array[currentIndex], array[parentIndex]]
        stepSound()
        await sleep(500)
        currentIndex = parentIndex
      } else {
        break
      }
    }
  }

  const heapifyDown = async (array: number[], index: number) => {
    const length = array.length
    let currentIndex = index

    while (true) {
      let selected = currentIndex
      const left = 2 * currentIndex + 1
      const right = 2 * currentIndex + 2

      if (left < length) {
        setHighlightedNodes([`array-${currentIndex}`, `array-${left}`])
        stepSound()
        await sleep(400)

        if (shouldSwap(array[selected], array[left])) {
          selected = left
        }
      }

      if (right < length) {
        setHighlightedNodes([`array-${selected}`, `array-${right}`])
        stepSound()
        await sleep(400)

        if (shouldSwap(array[selected], array[right])) {
          selected = right
        }
      }

      if (selected !== currentIndex) {
        ;[array[currentIndex], array[selected]] = [array[selected], array[currentIndex]]
        setHighlightedNodes([`array-${currentIndex}`, `array-${selected}`])
        stepSound()
        await sleep(500)
        currentIndex = selected
      } else {
        break
      }
    }
  }

  const arrayToTree = (array: number[], index: number = 0): HeapNode | null => {
    if (index >= array.length) return null

    return {
      id: `node-${nodeIdRef.current++}`,
      value: array[index],
      left: arrayToTree(array, 2 * index + 1),
      right: arrayToTree(array, 2 * index + 2),
    }
  }

  const rebuildHeapTree = (array: number[]) => {
    nodeIdRef.current = 0
    setHeap(arrayToTree(array))
  }

  const insert = async (value: number) => {
    if (voiceEnabled) {
      await playNarration(`Inserting value ${value} into the ${heapType} heap.`)
    }

    const newArray = [...heapArray, value]

    setHighlightedNodes([`array-${newArray.length - 1}`])
    stepSound()
    await sleep(500)

    await heapifyUp(newArray, newArray.length - 1)

    setHeapArray(newArray)
    rebuildHeapTree(newArray)

    setHighlightedNodes([])
    endSound()
    showEndMessage("Algorithm ended", `Inserted ${value} into ${heapType} heap successfully.`)
  }

  const insertMany = async (values: string) => {
    const nums = values
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((n) => !isNaN(n))

    if (nums.length === 0) return

    if (voiceEnabled) {
      await playNarration(`Inserting ${nums.length} elements into the ${heapType} heap.`)
    }

    const newArray = [...heapArray]

    for (const value of nums) {
      newArray.push(value)
      setHighlightedNodes([`array-${newArray.length - 1}`])
      stepSound()
      await sleep(400)

      await heapifyUp(newArray, newArray.length - 1)

      setHeapArray([...newArray])
      rebuildHeapTree(newArray)
      await sleep(300)
    }

    setHighlightedNodes([])
    endSound()
    showEndMessage("Algorithm ended", `Inserted ${nums.length} element(s) into ${heapType} heap successfully.`)
  }


  // Extract-root: the other half of a heap's core contract (insert +
  // extract), previously entirely missing from this visualizer even though
  // heapifyDown above was already fully written for it — nothing ever
  // called it. Standard algorithm: swap the root with the last element,
  // shrink the array, then sift the new root down.
  const extractRoot = async () => {
    if (heapArray.length === 0) {
      showEndMessage("Heap is empty", "Nothing to extract.")
      return null
    }

    const label = heapType === "max" ? "maximum" : "minimum"
    if (voiceEnabled) {
      await playNarration(`Extracting the ${label} value from the ${heapType} heap.`)
    }

    const newArray = [...heapArray]
    const root = newArray[0]

    setHighlightedNodes(["array-0"])
    stepSound()
    await sleep(500)

    const last = newArray.pop() as number
    if (newArray.length > 0) {
      newArray[0] = last
      setHeapArray([...newArray])
      rebuildHeapTree(newArray)
      setHighlightedNodes(["array-0"])
      stepSound()
      await sleep(400)
      await heapifyDown(newArray, 0)
    }

    setHeapArray([...newArray])
    rebuildHeapTree(newArray)
    setHighlightedNodes([])
    endSound()
    showEndMessage("Algorithm ended", `Extracted ${root} (the ${label}) from the ${heapType} heap.`)
    return root
  }

  const clear = () => {
    setHeap(null)
    setHeapArray([])
    setHighlightedNodes([])
    nodeIdRef.current = 0
  }

  return {
    heap,
    heapArray,
    heapType,
    highlightedNodes,
    insert,
    insertMany,
    extractRoot,
    clear,
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
  }
}