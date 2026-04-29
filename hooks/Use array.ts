"use client"
// hooks/use-array.ts

import { useState, useRef, useCallback } from "react"
import type { ArrayOperation, ArrayStep } from "@/components/visualizer/array/types"

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms))
}

export function useArray() {
  // ── inputArray: the user's original — NEVER mutated during an operation
  const [inputArray, setInputArray] = useState<number[]>([3, 7, 1, 9, 4, 6, 2, 8, 5])

  // ── array: drives the animated cells; restored to inputArray after every op
  const [array, setArray] = useState<number[]>([3, 7, 1, 9, 4, 6, 2, 8, 5])

  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const [swappedIndices,     setSwappedIndices]     = useState<number[]>([])
  const [sortedIndices,      setSortedIndices]       = useState<number[]>([])
  const [message,            setMessage]             = useState("")
  const [isAnimating,        setIsAnimating]         = useState(false)
  const [operations,         setOperations]          = useState<ArrayOperation[]>([])
  const [foundIndex,         setFoundIndex]          = useState<number | null>(null)

  // ── Speed ─────────────────────────────────────────────────
  const delayRef = useRef<number>(500)
  const setAnimationSpeed = useCallback((ms: number) => {
    delayRef.current = ms
  }, [])

  // ── Result array ──────────────────────────────────────────
  const [resultArray,       setResultArray]       = useState<number[]>([])
  const [resultHighlighted, setResultHighlighted] = useState<number[]>([])
  const [resultSwapped,     setResultSwapped]     = useState<number[]>([])
  const [resultSorted,      setResultSorted]      = useState<number[]>([])
  const [resultFound,       setResultFound]       = useState<number | null>(null)
  const [hasResult,         setHasResult]         = useState(false)

  const finalizeResult = (
    finalArr: number[],
    opts: {
      highlighted?: number[]
      swapped?: number[]
      sorted?: number[]
      found?: number | null
    } = {}
  ) => {
    setResultArray(finalArr)
    setResultHighlighted(opts.highlighted ?? [])
    setResultSwapped(opts.swapped         ?? [])
    setResultSorted(opts.sorted           ?? [])
    setResultFound(opts.found             ?? null)
    setHasResult(true)
  }

  // ── Internal helpers ──────────────────────────────────────
  const addOp = (op: Omit<ArrayOperation, "timestamp">) =>
    setOperations((prev) => [{ ...op, timestamp: Date.now() }, ...prev].slice(0, 20))

  const resetHighlights = () => {
    setHighlightedIndices([])
    setSwappedIndices([])
    setSortedIndices([])
    setFoundIndex(null)
  }

  // Restore the animated display back to the original input after an op
  const restoreInputDisplay = (snap: number[]) => setArray(snap)

  const delay     = () => sleep(delayRef.current)
  const halfDelay = () => sleep(delayRef.current / 2)

  // ── Actions ───────────────────────────────────────────────

  const loadArray = useCallback((nums: number[]) => {
    if (isAnimating) return
    resetHighlights()
    setMessage("")
    setInputArray(nums)
    setArray(nums)
    setHasResult(false)
    setResultArray([])
    addOp({ type: "set" })
  }, [isAnimating])

  const insertAt = useCallback(async (index: number, value: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()

    const snap = [...inputArray]
    const arr  = [...snap]

    setMessage(`Inserting ${value} at index ${index}. Shifting elements right...`)
    for (let i = arr.length - 1; i >= index; i--) {
      setHighlightedIndices([i])
      await halfDelay()
    }

    arr.splice(index, 0, value)
    setArray([...arr])
    setHighlightedIndices([index])
    setSwappedIndices([index])
    setMessage(`✓ Inserted ${value} at index ${index}`)
    await delay()

    finalizeResult([...arr], { sorted: [index] })
    resetHighlights()
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "insert", value, index })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const deleteAt = useCallback(async (index: number) => {
    if (isAnimating || index < 0 || index >= inputArray.length) return
    setIsAnimating(true)
    resetHighlights()

    const snap    = [...inputArray]
    const arr     = [...snap]
    const removed = arr[index]

    setHighlightedIndices([index])
    setMessage(`Deleting element ${removed} at index ${index}...`)
    await delay()

    setSwappedIndices([index])
    await halfDelay()

    arr.splice(index, 1)
    setArray([...arr])
    setMessage(`✓ Deleted ${removed} from index ${index}. Elements shifted left.`)
    resetHighlights()
    await delay()

    finalizeResult([...arr])
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "delete", index })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const search = useCallback(async (value: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()

    const snap = [...inputArray]
    setMessage(`Searching for ${value}...`)

    for (let i = 0; i < snap.length; i++) {
      setHighlightedIndices([i])
      setMessage(`Checking index ${i}: array[${i}] = ${snap[i]}${snap[i] === value ? " ✓ Found!" : " ✗"}`)
      await delay()

      if (snap[i] === value) {
        setSortedIndices([i])
        setHighlightedIndices([])
        setFoundIndex(i)
        setMessage(`✓ Found ${value} at index ${i}`)
        finalizeResult([...snap], { found: i })
        restoreInputDisplay(snap)
        setIsAnimating(false)
        addOp({ type: "search", value })
        return
      }
    }

    setHighlightedIndices([])
    setMessage(`✗ ${value} not found in array`)
    finalizeResult([...snap])
    restoreInputDisplay(snap)
    setIsAnimating(false)
    addOp({ type: "search", value })
  }, [inputArray, isAnimating])

  const reverse = useCallback(async () => {
    if (isAnimating) return
    setIsAnimating(true)
    resetHighlights()

    const snap = [...inputArray]
    const arr  = [...snap]
    let left = 0, right = arr.length - 1
    setMessage("Reversing array with two pointers...")

    while (left < right) {
      setHighlightedIndices([left, right])
      setMessage(`Swapping arr[${left}]=${arr[left]} and arr[${right}]=${arr[right]}`)
      await delay()
      ;[arr[left], arr[right]] = [arr[right], arr[left]]
      setArray([...arr])
      setSwappedIndices([left, right])
      await halfDelay()
      setSwappedIndices([])
      setSortedIndices((prev) => [...prev, left, right])
      left++; right--
    }

    if (left === right) setSortedIndices((prev) => [...prev, left])
    setHighlightedIndices([])
    setMessage("✓ Array reversed!")
    await delay()

    finalizeResult([...arr], { sorted: arr.map((_, i) => i) })
    resetHighlights()
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "reverse" })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const rotateLeft = useCallback(async () => {
    if (isAnimating || inputArray.length === 0) return
    setIsAnimating(true)
    resetHighlights()

    const snap  = [...inputArray]
    const arr   = [...snap]
    const first = arr.shift()!
    arr.push(first)

    setHighlightedIndices([0])
    setMessage(`Rotating left: ${snap[0]} moves to the end`)
    await delay()

    setArray(arr)
    setSwappedIndices([arr.length - 1])
    setMessage(`✓ Rotated left. ${first} is now at the end.`)
    await delay()

    finalizeResult([...arr], { sorted: arr.map((_, i) => i) })
    resetHighlights()
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "rotate-left" })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const rotateRight = useCallback(async () => {
    if (isAnimating || inputArray.length === 0) return
    setIsAnimating(true)
    resetHighlights()

    const snap = [...inputArray]
    const arr  = [...snap]
    const last = arr.pop()!
    arr.unshift(last)

    setHighlightedIndices([snap.length - 1])
    setMessage(`Rotating right: ${snap[snap.length - 1]} moves to the front`)
    await delay()

    setArray(arr)
    setSwappedIndices([0])
    setMessage(`✓ Rotated right. ${last} is now at the front.`)
    await delay()

    finalizeResult([...arr], { sorted: arr.map((_, i) => i) })
    resetHighlights()
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "rotate-right" })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const updateAt = useCallback(async (index: number, value: number) => {
    if (isAnimating || index < 0 || index >= inputArray.length) return
    setIsAnimating(true)
    resetHighlights()

    const snap = [...inputArray]
    const old  = snap[index]
    setHighlightedIndices([index])
    setMessage(`Updating index ${index}: ${old} → ${value}`)
    await delay()

    const arr  = [...snap]
    arr[index] = value
    setArray(arr)
    setSwappedIndices([index])
    setMessage(`✓ Updated arr[${index}] to ${value}`)
    await delay()

    finalizeResult([...arr], { sorted: [index] })
    resetHighlights()
    setMessage("")
    restoreInputDisplay(snap)

    addOp({ type: "update", index, value })
    setIsAnimating(false)
  }, [inputArray, isAnimating])

  const clear = useCallback(() => {
    if (isAnimating) return
    resetHighlights()
    setInputArray([])
    setArray([])
    setMessage("")
    setOperations([])
    setHasResult(false)
    setResultArray([])
  }, [isAnimating])

  return {
    array,
    inputArray,
    highlightedIndices,
    swappedIndices,
    sortedIndices,
    message,
    isAnimating,
    operations,
    foundIndex,
    setAnimationSpeed,
    resultArray,
    resultHighlighted,
    resultSwapped,
    resultSorted,
    resultFound,
    hasResult,
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