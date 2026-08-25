"use client"

import { useCallback, useRef, useState } from "react"
import { playNarration, stopNarration } from "@/lib/narration"

export type DPProblem = "knapsack" | "lcs"
export type CellStatus = "idle" | "active" | "filled" | "path"

export interface DPItem {
  weight: number
  value: number
}

interface DPState {
  table: number[][]
  status: CellStatus[][]
  rowLabels: string[]
  colLabels: string[]
  message: string
  isAnimating: boolean
  result: number
  resultLabel: string
  voiceEnabled: boolean
}

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms))
}

function emptyTable(rows: number, cols: number, fill: number): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill))
}

function emptyStatus(rows: number, cols: number): CellStatus[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => "idle" as CellStatus))
}

const defaultItems: DPItem[] = [
  { weight: 2, value: 3 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
  { weight: 5, value: 6 },
]
const defaultCapacity = 8

const defaultA = "ABCBDAB"
const defaultB = "BDCABA"

export function useDP() {
  const [problem, setProblem] = useState<DPProblem>("knapsack")
  const [items, setItems] = useState<DPItem[]>(defaultItems)
  const [capacity, setCapacity] = useState(defaultCapacity)
  const [strA, setStrA] = useState(defaultA)
  const [strB, setStrB] = useState(defaultB)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const speed = 280 / speedMultiplier
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const [table, setTable] = useState<number[][]>([])
  const [status, setStatus] = useState<CellStatus[][]>([])
  const [rowLabels, setRowLabels] = useState<string[]>([])
  const [colLabels, setColLabels] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [resultLabel, setResultLabel] = useState("")

  const tableRef = useRef<number[][]>([])
  const statusRef = useRef<CellStatus[][]>([])

  const commitTable = useCallback((t: number[][]) => {
    tableRef.current = t.map((row) => [...row])
    setTable(tableRef.current.map((row) => [...row]))
  }, [])

  const commitStatus = useCallback((s: CellStatus[][]) => {
    statusRef.current = s.map((row) => [...row])
    setStatus(statusRef.current.map((row) => [...row]))
  }, [])

  const setCell = useCallback((i: number, j: number, value: number, cellStatus: CellStatus) => {
    tableRef.current[i][j] = value
    statusRef.current[i][j] = cellStatus
    commitTable(tableRef.current)
    commitStatus(statusRef.current)
  }, [commitTable, commitStatus])

  const markStatus = useCallback((i: number, j: number, cellStatus: CellStatus) => {
    statusRef.current[i][j] = cellStatus
    commitStatus(statusRef.current)
  }, [commitStatus])

  const runKnapsack = useCallback(async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setResult(null)
    setResultLabel("")

    const n = items.length
    const cap = capacity
    const rows = n + 1
    const cols = cap + 1
    const t = emptyTable(rows, cols, 0)
    const s = emptyStatus(rows, cols)
    commitTable(t)
    commitStatus(s)
    setRowLabels(["∅", ...items.map((_, idx) => `item ${idx + 1} (w${items[idx].weight}, v${items[idx].value})`)])
    setColLabels(Array.from({ length: cols }, (_, w) => String(w)))

    for (let j = 0; j < cols; j++) markStatus(0, j, "filled")
    for (let i = 0; i < rows; i++) markStatus(i, 0, "filled")

    setMessage("Base case: 0 items or 0 capacity → value is always 0.")
    if (voiceEnabled) await playNarration("With zero items or zero capacity, the best value is always zero.")
    await sleep(speed)

    for (let i = 1; i <= n; i++) {
      const { weight, value } = items[i - 1]
      for (let w = 0; w <= cap; w++) {
        markStatus(i, w, "active")
        setMessage(`Item ${i} (weight ${weight}, value ${value}) at capacity ${w}...`)
        await sleep(speed)

        const without = tableRef.current[i - 1][w]
        if (weight > w) {
          setCell(i, w, without, "filled")
          setMessage(`Item ${i} doesn't fit in capacity ${w} → carry forward dp[${i - 1}][${w}] = ${without}.`)
        } else {
          const withIt = value + tableRef.current[i - 1][w - weight]
          const best = Math.max(without, withIt)
          setCell(i, w, best, "filled")
          setMessage(
            `dp[${i}][${w}] = max(skip=${without}, take=${value}+dp[${i - 1}][${w - weight}]=${withIt}) = ${best}`
          )
        }
        await sleep(speed / 2)
      }
    }

    // backtrack chosen items
    let w = cap
    const chosen: number[] = []
    for (let i = n; i > 0; i--) {
      if (tableRef.current[i][w] !== tableRef.current[i - 1][w]) {
        chosen.push(i - 1)
        markStatus(i, w, "path")
        w -= items[i - 1].weight
        markStatus(i - 1, w, "path")
      }
    }

    const finalValue = tableRef.current[n][cap]
    setResult(finalValue)
    setResultLabel(
      chosen.length
        ? `Take items: ${chosen.reverse().map((idx) => `#${idx + 1}`).join(", ")} → total value ${finalValue}`
        : `No items fit → total value ${finalValue}`
    )
    setMessage(`Done. Maximum value with capacity ${cap} is ${finalValue}.`)
    if (voiceEnabled) await playNarration(`The maximum value achievable is ${finalValue}.`)
    setIsAnimating(false)
  }, [items, capacity, isAnimating, speed, voiceEnabled, commitTable, commitStatus, setCell, markStatus])

  const runLCS = useCallback(async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setResult(null)
    setResultLabel("")

    const a = strA
    const b = strB
    const rows = a.length + 1
    const cols = b.length + 1
    const t = emptyTable(rows, cols, 0)
    const s = emptyStatus(rows, cols)
    commitTable(t)
    commitStatus(s)
    setRowLabels(["∅", ...a.split("")])
    setColLabels(["∅", ...b.split("")])

    for (let j = 0; j < cols; j++) markStatus(0, j, "filled")
    for (let i = 0; i < rows; i++) markStatus(i, 0, "filled")

    setMessage("Base case: an empty string shares 0 characters with anything.")
    if (voiceEnabled) await playNarration("An empty string has no common subsequence with anything.")
    await sleep(speed)

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        markStatus(i, j, "active")
        const match = a[i - 1] === b[j - 1]
        setMessage(`Comparing '${a[i - 1]}' and '${b[j - 1]}'...`)
        await sleep(speed)

        if (match) {
          const val = tableRef.current[i - 1][j - 1] + 1
          setCell(i, j, val, "filled")
          setMessage(`'${a[i - 1]}' == '${b[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${val}`)
        } else {
          const val = Math.max(tableRef.current[i - 1][j], tableRef.current[i][j - 1])
          setCell(i, j, val, "filled")
          setMessage(`'${a[i - 1]}' != '${b[j - 1]}' → dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${val}`)
        }
        await sleep(speed / 2)
      }
    }

    // backtrack the LCS string
    let i = a.length
    let j = b.length
    const chars: string[] = []
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        chars.push(a[i - 1])
        markStatus(i, j, "path")
        i--
        j--
      } else if (tableRef.current[i - 1][j] >= tableRef.current[i][j - 1]) {
        i--
      } else {
        j--
      }
    }

    const lcsLength = tableRef.current[a.length][b.length]
    const lcsString = chars.reverse().join("")
    setResult(lcsLength)
    setResultLabel(`Longest common subsequence: "${lcsString}" (length ${lcsLength})`)
    setMessage(`Done. LCS length is ${lcsLength}.`)
    if (voiceEnabled) await playNarration(`The longest common subsequence has length ${lcsLength}.`)
    setIsAnimating(false)
  }, [strA, strB, isAnimating, speed, voiceEnabled, commitTable, commitStatus, setCell, markStatus])

  const run = useCallback(() => {
    if (problem === "knapsack") return runKnapsack()
    return runLCS()
  }, [problem, runKnapsack, runLCS])

  const reset = useCallback(() => {
    if (isAnimating) return
    stopNarration()
    commitTable([])
    commitStatus([])
    setRowLabels([])
    setColLabels([])
    setMessage("")
    setResult(null)
    setResultLabel("")
  }, [isAnimating, commitTable, commitStatus])

  return {
    problem, setProblem,
    items, setItems,
    capacity, setCapacity,
    strA, setStrA,
    strB, setStrB,
    speed: speedMultiplier, setSpeed: setSpeedMultiplier,
    voiceEnabled, setVoiceEnabled,
    table, status, rowLabels, colLabels,
    message, isAnimating, result, resultLabel,
    run, reset,
  }
}
