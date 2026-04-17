"use client"
// hooks/use-array.ts

import { useState, useRef, useCallback } from "react"
import type { ArrayOperation, ArrayStep } from "@/components/visualizer/array/types"

const DELAY_MS = 600

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms))
}

export function useArray() {
  const [array, setArray]               = useState<number[]>([3, 7, 1, 9, 4, 6, 2, 8, 5])
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const [swappedIndices, setSwappedIndices]         = useState<number[]>([])
  const [sortedIndices, setSortedIndices]           = useState<number[]>([])
  const [message, setMessage]           = useState("")
  const [isAnimating, setIsAnimating]   = useState(false)
  const [operations, setOperations]     = useState<ArrayOperation[]>([])
  const [foundIndex, setFoundIndex]     = useState<number | null>(null)

  const addOp = (op: Omit<ArrayOperation, "timestamp">) =>
    setOperations((prev) => [{ ...op, timestamp: Date.now() }, ...prev].slice(0, 20))

  const resetHighlights = () => {
    setHighlightedIndices([])
    setSwappedIndices([])
    setSortedIndices([])
    setFoundIndex(null)
  }

  const loadArray = useCallback((nums: number[]) => {
    if (isAnimating) return
    resetHighlights()
    setMessage("")
    setArray(nums)
    addOp({ type: "set" })
  }, [isAnimating])

  const insertAt = useCallback(async (index: number, value: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()

    const arr = [...array]
    setMessage(`Inserting ${value} at index ${index}. Shifting elements right...`)

    // Highlight elements to shift
    for (let i = arr.length - 1; i >= index; i--) {
      setHighlightedIndices([i])
      await sleep(DELAY_MS / 2)
    }

    arr.splice(index, 0, value)
    setArray([...arr])
    setHighlightedIndices([index])
    setSwappedIndices([index])
    setMessage(`✓ Inserted ${value} at index ${index}`)
    await sleep(DELAY_MS)
    resetHighlights()
    setMessage("")
    addOp({ type: "insert", value, index })
    setIsAnimating(false)
  }, [array, isAnimating])

  const deleteAt = useCallback(async (index: number) => {
    if (isAnimating || index < 0 || index >= array.length) return
    setIsAnimating(true)
    resetHighlights()

    const arr = [...array]
    const removed = arr[index]
    setHighlightedIndices([index])
    setMessage(`Deleting element ${removed} at index ${index}...`)
    await sleep(DELAY_MS)

    setSwappedIndices([index])
    await sleep(DELAY_MS / 2)

    arr.splice(index, 1)
    setArray([...arr])
    setMessage(`✓ Deleted ${removed} from index ${index}. Elements shifted left.`)
    resetHighlights()
    await sleep(DELAY_MS)
    setMessage("")
    addOp({ type: "delete", index })
    setIsAnimating(false)
  }, [array, isAnimating])

  const search = useCallback(async (value: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()
    setMessage(`Searching for ${value}...`)

    for (let i = 0; i < array.length; i++) {
      setHighlightedIndices([i])
      setMessage(`Checking index ${i}: array[${i}] = ${array[i]}${array[i] === value ? " ✓ Found!" : " ✗"}`)
      await sleep(DELAY_MS)

      if (array[i] === value) {
        setSortedIndices([i])
        setHighlightedIndices([])
        setFoundIndex(i)
        setMessage(`✓ Found ${value} at index ${i}`)
        setIsAnimating(false)
        addOp({ type: "search", value })
        return
      }
    }

    setHighlightedIndices([])
    setMessage(`✗ ${value} not found in array`)
    setIsAnimating(false)
    addOp({ type: "search", value })
  }, [array, isAnimating])

  const reverse = useCallback(async () => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()

    const arr = [...array]
    let left = 0, right = arr.length - 1
    setMessage("Reversing array with two pointers...")

    while (left < right) {
      setHighlightedIndices([left, right])
      setMessage(`Swapping arr[${left}]=${arr[left]} and arr[${right}]=${arr[right]}`)
      await sleep(DELAY_MS)

      ;[arr[left], arr[right]] = [arr[right], arr[left]]
      setArray([...arr])
      setSwappedIndices([left, right])
      await sleep(DELAY_MS / 2)
      setSwappedIndices([])
      setSortedIndices((prev) => [...prev, left, right])
      left++; right--
    }

    if (left === right) setSortedIndices((prev) => [...prev, left])
    setHighlightedIndices([])
    setMessage("✓ Array reversed!")
    await sleep(DELAY_MS)
    resetHighlights()
    setMessage("")
    addOp({ type: "reverse" })
    setIsAnimating(false)
  }, [array, isAnimating])

  const rotateLeft = useCallback(async () => {
    if (isAnimating || array.length === 0) return
    setIsAnimating(true)
    resetHighlights()

    setHighlightedIndices([0])
    setMessage(`Rotating left: ${array[0]} moves to the end`)
    await sleep(DELAY_MS)

    const arr = [...array]
    const first = arr.shift()!
    arr.push(first)
    setArray(arr)
    setSwappedIndices([arr.length - 1])
    setMessage(`✓ Rotated left. ${first} is now at the end.`)
    await sleep(DELAY_MS)
    resetHighlights()
    setMessage("")
    addOp({ type: "rotate-left" })
    setIsAnimating(false)
  }, [array, isAnimating])

  const rotateRight = useCallback(async () => {
    if (isAnimating || array.length === 0) return
    setIsAnimating(true)
    resetHighlights()

    setHighlightedIndices([array.length - 1])
    setMessage(`Rotating right: ${array[array.length - 1]} moves to the front`)
    await sleep(DELAY_MS)

    const arr = [...array]
    const last = arr.pop()!
    arr.unshift(last)
    setArray(arr)
    setSwappedIndices([0])
    setMessage(`✓ Rotated right. ${last} is now at the front.`)
    await sleep(DELAY_MS)
    resetHighlights()
    setMessage("")
    addOp({ type: "rotate-right" })
    setIsAnimating(false)
  }, [array, isAnimating])

  const updateAt = useCallback(async (index: number, value: number) => {
    if (isAnimating || index < 0 || index >= array.length) return
    setIsAnimating(true)
    resetHighlights()

    const old = array[index]
    setHighlightedIndices([index])
    setMessage(`Updating index ${index}: ${old} → ${value}`)
    await sleep(DELAY_MS)

    const arr = [...array]
    arr[index] = value
    setArray(arr)
    setSwappedIndices([index])
    setMessage(`✓ Updated arr[${index}] to ${value}`)
    await sleep(DELAY_MS)
    resetHighlights()
    setMessage("")
    addOp({ type: "update", index, value })
    setIsAnimating(false)
  }, [array, isAnimating])

  const clear = useCallback(() => {
    if (isAnimating) return
    resetHighlights()
    setArray([])
    setMessage("")
    setOperations([])
  }, [isAnimating])

  return {
    array,
    highlightedIndices,
    swappedIndices,
    sortedIndices,
    message,
    isAnimating,
    operations,
    foundIndex,
    loadArray,
    insertAt,
    deleteAt,
    search,
    reverse,
    rotateLeft,
    rotateRight,
    updateAt,
    clear,
  }
}