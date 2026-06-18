import { useState } from "react"
import { HeapNode, HeapType } from "@/components/visualizer/heap/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

let nodeIdCounter = 0

export function useHeap() {
  const [heap, setHeap] = useState<HeapNode | null>(null)
  const [heapArray, setHeapArray] = useState<number[]>([])
  const [heapType, setHeapType] = useState<HeapType>("max")
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
      id: `node-${nodeIdCounter++}`,
      value: array[index],
      left: arrayToTree(array, 2 * index + 1),
      right: arrayToTree(array, 2 * index + 2),
    }
  }

  const rebuildHeapTree = (array: number[]) => {
    nodeIdCounter = 0
    setHeap(arrayToTree(array))
  }

  const insert = async (value: number) => {
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

  const toggleHeapType = async () => {
    const newType: HeapType = heapType === "max" ? "min" : "max"
    const newArray = [...heapArray]

    setHeapType(newType)

    const shouldSwapForType = (parent: number, child: number): boolean => {
      if (newType === "max") {
        return parent < child
      }
      return parent > child
    }

    const heapifyDownForType = async (array: number[], index: number) => {
      const length = array.length
      let currentIndex = index

      while (true) {
        let selected = currentIndex
        const left = 2 * currentIndex + 1
        const right = 2 * currentIndex + 2

        if (left < length) {
          setHighlightedNodes([`array-${currentIndex}`, `array-${left}`])
          stepSound()
          await sleep(350)

          if (shouldSwapForType(array[selected], array[left])) {
            selected = left
          }
        }

        if (right < length) {
          setHighlightedNodes([`array-${selected}`, `array-${right}`])
          stepSound()
          await sleep(350)

          if (shouldSwapForType(array[selected], array[right])) {
            selected = right
          }
        }

        if (selected !== currentIndex) {
          ;[array[currentIndex], array[selected]] = [array[selected], array[currentIndex]]
          setHighlightedNodes([`array-${currentIndex}`, `array-${selected}`])
          stepSound()
          await sleep(450)
          currentIndex = selected
        } else {
          break
        }
      }
    }

    for (let i = Math.floor(newArray.length / 2) - 1; i >= 0; i--) {
      await heapifyDownForType(newArray, i)
    }

    setHeapArray(newArray)
    rebuildHeapTree(newArray)
    setHighlightedNodes([])

    endSound()
    showEndMessage("Algorithm ended", `Heap changed to ${newType} heap successfully.`)
  }

  const clear = () => {
    setHeap(null)
    setHeapArray([])
    setHighlightedNodes([])
    nodeIdCounter = 0
  }

  return {
    heap,
    heapArray,
    heapType,
    highlightedNodes,
    insert,
    insertMany,
    toggleHeapType,
    clear,
  }
}