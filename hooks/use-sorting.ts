"use client"

import { useEffect, useRef, useState } from "react"
import { SortAlgorithm, SortStep } from "@/components/visualizer/sorting/types"
import { useAlgorithmFeedback } from "@/hooks/use-algorithm-feedback"

const DEFAULT_SPEED = 700

export function useSorting() {
  const [input, setInput] = useState("")
  const [array, setArray] = useState<number[]>([])
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble")
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)

  const { stepSound, endSound, showEndMessage } = useAlgorithmFeedback()
  const hasEndedRef = useRef(false)

  const current = steps[currentStep] || {
    array,
    compared: [],
    swapped: [],
    sorted: [],
    message: "Enter numbers and start sorting.",
  }

  const parseInput = (value: string): number[] => {
    return value
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !isNaN(v))
  }

  const loadInputArray = () => {
    const parsed = parseInput(input)
    setArray(parsed)
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    hasEndedRef.current = false
  }

  const generateRandomArray = (size: number = 10) => {
    const randomArr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 90) + 10
    )
    const value = randomArr.join(", ")
    setInput(value)
    setArray(randomArr)
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    hasEndedRef.current = false
  }

  const clear = () => {
    setInput("")
    setArray([])
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    hasEndedRef.current = false
  }

  const addStep = (
    store: SortStep[],
    arr: number[],
    compared: number[] = [],
    swapped: number[] = [],
    sorted: number[] = [],
    message: string = ""
  ) => {
    store.push({
      array: [...arr],
      compared: [...compared],
      swapped: [...swapped],
      sorted: [...sorted],
      message,
    })
  }

  const buildBubbleSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []
    const sortedSet = new Set<number>()

    addStep(generated, arr, [], [], [], "Starting Bubble Sort")

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        addStep(
          generated,
          arr,
          [j, j + 1],
          [],
          Array.from(sortedSet),
          `Comparing ${arr[j]} and ${arr[j + 1]}`
        )

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          addStep(
            generated,
            arr,
            [],
            [j, j + 1],
            Array.from(sortedSet),
            `Swapped ${arr[j + 1]} and ${arr[j]}`
          )
        }
      }
      sortedSet.add(arr.length - 1 - i)
      addStep(
        generated,
        arr,
        [],
        [],
        Array.from(sortedSet),
        `Position ${arr.length - i} fixed`
      )
    }

    if (arr.length > 0) sortedSet.add(0)
    addStep(generated, arr, [], [], Array.from(sortedSet), "Bubble Sort completed")
    return generated
  }

  const buildSelectionSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []
    const sortedSet = new Set<number>()

    addStep(generated, arr, [], [], [], "Starting Selection Sort")

    for (let i = 0; i < arr.length; i++) {
      let minIndex = i

      for (let j = i + 1; j < arr.length; j++) {
        addStep(
          generated,
          arr,
          [minIndex, j],
          [],
          Array.from(sortedSet),
          `Comparing current minimum ${arr[minIndex]} with ${arr[j]}`
        )

        if (arr[j] < arr[minIndex]) {
          minIndex = j
          addStep(
            generated,
            arr,
            [i, minIndex],
            [],
            Array.from(sortedSet),
            `New minimum found: ${arr[minIndex]}`
          )
        }
      }

      if (minIndex !== i) {
        ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        addStep(
          generated,
          arr,
          [],
          [i, minIndex],
          Array.from(sortedSet),
          `Placed ${arr[i]} in correct position`
        )
      }

      sortedSet.add(i)
      addStep(
        generated,
        arr,
        [],
        [],
        Array.from(sortedSet),
        `Index ${i} sorted`
      )
    }

    addStep(generated, arr, [], [], Array.from(sortedSet), "Selection Sort completed")
    return generated
  }

  const buildInsertionSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []
    const sortedSet = new Set<number>()

    addStep(generated, arr, [], [], [0], "Starting Insertion Sort")
    if (arr.length > 0) sortedSet.add(0)

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1

      addStep(
        generated,
        arr,
        [i],
        [],
        Array.from(sortedSet),
        `Picking ${key} for insertion`
      )

      while (j >= 0 && arr[j] > key) {
        addStep(
          generated,
          arr,
          [j, j + 1],
          [],
          Array.from(sortedSet),
          `Comparing ${arr[j]} with ${key}`
        )

        arr[j + 1] = arr[j]
        addStep(
          generated,
          arr,
          [],
          [j, j + 1],
          Array.from(sortedSet),
          `Shifting ${arr[j]} to the right`
        )
        j--
      }

      arr[j + 1] = key
      for (let k = 0; k <= i; k++) sortedSet.add(k)

      addStep(
        generated,
        arr,
        [],
        [j + 1],
        Array.from(sortedSet),
        `${key} inserted in correct position`
      )
    }

    addStep(generated, arr, [], [], Array.from(sortedSet), "Insertion Sort completed")
    return generated
  }

  const buildMergeSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []

    addStep(generated, arr, [], [], [], "Starting Merge Sort")

    const merge = (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1)
      const rightArr = arr.slice(mid + 1, right + 1)

      let i = 0
      let j = 0
      let k = left

      while (i < leftArr.length && j < rightArr.length) {
        addStep(
          generated,
          arr,
          [left + i, mid + 1 + j],
          [],
          [],
          `Comparing ${leftArr[i]} and ${rightArr[j]}`
        )

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i]
          addStep(generated, arr, [], [k], [], `Placed ${leftArr[i]} at index ${k}`)
          i++
        } else {
          arr[k] = rightArr[j]
          addStep(generated, arr, [], [k], [], `Placed ${rightArr[j]} at index ${k}`)
          j++
        }
        k++
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        addStep(generated, arr, [], [k], [], `Copied remaining ${leftArr[i]}`)
        i++
        k++
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        addStep(generated, arr, [], [k], [], `Copied remaining ${rightArr[j]}`)
        j++
        k++
      }
    }

    const mergeSort = (left: number, right: number) => {
      if (left >= right) return
      const mid = Math.floor((left + right) / 2)
      mergeSort(left, mid)
      mergeSort(mid + 1, right)
      merge(left, mid, right)
    }

    mergeSort(0, arr.length - 1)
    addStep(
      generated,
      arr,
      [],
      [],
      arr.map((_, i) => i),
      "Merge Sort completed"
    )
    return generated
  }

  const buildQuickSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []
    const sortedSet = new Set<number>()

    addStep(generated, arr, [], [], [], "Starting Quick Sort")

    const partition = (low: number, high: number) => {
      const pivot = arr[high]
      let i = low - 1

      addStep(generated, arr, [high], [], Array.from(sortedSet), `Pivot selected: ${pivot}`)

      for (let j = low; j < high; j++) {
        addStep(
          generated,
          arr,
          [j, high],
          [],
          Array.from(sortedSet),
          `Comparing ${arr[j]} with pivot ${pivot}`
        )

        if (arr[j] < pivot) {
          i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          addStep(
            generated,
            arr,
            [],
            [i, j],
            Array.from(sortedSet),
            `Swapped ${arr[i]} and ${arr[j]}`
          )
        }
      }

      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      sortedSet.add(i + 1)
      addStep(
        generated,
        arr,
        [],
        [i + 1, high],
        Array.from(sortedSet),
        `Pivot ${pivot} placed correctly`
      )

      return i + 1
    }

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high)
        quickSort(low, pi - 1)
        quickSort(pi + 1, high)
      } else if (low === high) {
        sortedSet.add(low)
        addStep(generated, arr, [], [], Array.from(sortedSet), `Index ${low} sorted`)
      }
    }

    quickSort(0, arr.length - 1)
    addStep(generated, arr, [], [], arr.map((_, i) => i), "Quick Sort completed")
    return generated
  }

  const buildHeapSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []
    const sortedSet = new Set<number>()

    addStep(generated, arr, [], [], [], "Starting Heap Sort")

    const heapify = (n: number, i: number) => {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2

      if (left < n) {
        addStep(generated, arr, [largest, left], [], Array.from(sortedSet), "Comparing parent with left child")
        if (arr[left] > arr[largest]) largest = left
      }

      if (right < n) {
        addStep(generated, arr, [largest, right], [], Array.from(sortedSet), "Comparing current largest with right child")
        if (arr[right] > arr[largest]) largest = right
      }

      if (largest !== i) {
        ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
        addStep(generated, arr, [], [i, largest], Array.from(sortedSet), "Swapped during heapify")
        heapify(n, largest)
      }
    }

    const n = arr.length

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i)
    }

    for (let i = n - 1; i > 0; i--) {
      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      sortedSet.add(i)
      addStep(generated, arr, [], [0, i], Array.from(sortedSet), `Moved max element to index ${i}`)
      heapify(i, 0)
    }

    if (arr.length > 0) sortedSet.add(0)
    addStep(generated, arr, [], [], Array.from(sortedSet), "Heap Sort completed")
    return generated
  }

  const buildShellSteps = (source: number[]) => {
    const arr = [...source]
    const generated: SortStep[] = []

    addStep(generated, arr, [], [], [], "Starting Shell Sort")

    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      addStep(generated, arr, [], [], [], `Current gap: ${gap}`)

      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i]
        let j = i

        addStep(generated, arr, [i], [], [], `Picking ${temp} for gap insertion`)

        while (j >= gap && arr[j - gap] > temp) {
          addStep(
            generated,
            arr,
            [j - gap, j],
            [],
            [],
            `Comparing ${arr[j - gap]} and ${temp}`
          )
          arr[j] = arr[j - gap]
          addStep(generated, arr, [], [j - gap, j], [], "Shifted element")
          j -= gap
        }

        arr[j] = temp
        addStep(generated, arr, [], [j], [], `${temp} inserted`)
      }
    }

    addStep(
      generated,
      arr,
      [],
      [],
      arr.map((_, i) => i),
      "Shell Sort completed"
    )
    return generated
  }

  const generateSteps = (algo: SortAlgorithm, source: number[]) => {
    switch (algo) {
      case "bubble":
        return buildBubbleSteps(source)
      case "selection":
        return buildSelectionSteps(source)
      case "insertion":
        return buildInsertionSteps(source)
      case "merge":
        return buildMergeSteps(source)
      case "quick":
        return buildQuickSteps(source)
      case "heap":
        return buildHeapSteps(source)
      case "shell":
        return buildShellSteps(source)
      default:
        return []
    }
  }

  const startSorting = () => {
    if (array.length === 0) return
    const generated = generateSteps(algorithm, array)
    setSteps(generated)
    setCurrentStep(0)
    setIsPlaying(true)
    hasEndedRef.current = false
  }

  const nextStep = () => {
    if (steps.length === 0) return
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    if (steps.length === 0) return
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    hasEndedRef.current = false
  }

  const togglePlay = () => {
    if (steps.length === 0) return
    setIsPlaying((prev) => !prev)
  }

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps.length, speed])

  useEffect(() => {
    if (steps.length === 0) return

    if (currentStep < steps.length - 1) {
      stepSound()
    }

    if (currentStep === steps.length - 1 && !hasEndedRef.current) {
      hasEndedRef.current = true
      endSound()
      showEndMessage("Algorithm ended", `${algorithm} sort completed successfully.`)
    }
  }, [currentStep, steps, algorithm, stepSound, endSound, showEndMessage])

  return {
    input,
    setInput,
    array,
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    current,
    isPlaying,
    speed,
    setSpeed,
    loadInputArray,
    generateRandomArray,
    clear,
    startSorting,
    nextStep,
    prevStep,
    togglePlay,
  }
}