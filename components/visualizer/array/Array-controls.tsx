"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ArrayOperation } from "./types"
import {
  Search, RotateCcw, ChevronLeft, ChevronRight,
  Trash2, Plus, RefreshCw, ArrowLeftRight, Zap,
} from "lucide-react"

interface ArrayControlsProps {
  onLoad: (nums: number[]) => void
  onInsertAt: (index: number, value: number) => void
  onDeleteAt: (index: number) => void
  onSearch: (value: number) => void
  onReverse: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onUpdateAt: (index: number, value: number) => void
  onClear: () => void
  onRandom: () => void
  onSpeedChange: (speed: number) => void
  isAnimating: boolean
  operations: ArrayOperation[]
  arrayLength: number
}

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ")
}

const PANEL =
  "rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]"

const SPEED_OPTIONS: { label: string; ms: number }[] = [
  { label: "0.5×", ms: 900 },
  { label: "1×",   ms: 500 },
  { label: "1.5×", ms: 320 },
  { label: "2×",   ms: 180 },
]

const MAX_ELEMENTS = 10

// ── Reusable index-error message ─────────────────────────────────────────────
function IndexError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-rose-500 font-medium">
      <span className="inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-[9px] font-bold">
        !
      </span>
      {message}
    </p>
  )
}

export function ArrayControls({
  onLoad, onInsertAt, onDeleteAt, onSearch,
  onReverse, onRotateLeft, onRotateRight, onUpdateAt,
  onClear, onRandom, onSpeedChange,
  isAnimating, operations, arrayLength,
}: ArrayControlsProps) {
  const [inputStr,   setInputStr]   = useState("3,7,1,9,4,6,2,8,5")
  const [inputError, setInputError] = useState("")

  const [insertIdx,      setInsertIdx]      = useState("")
  const [insertVal,      setInsertVal]      = useState("")
  const [insertIdxError, setInsertIdxError] = useState<string | null>(null)

  const [deleteIdx,      setDeleteIdx]      = useState("")
  const [deleteIdxError, setDeleteIdxError] = useState<string | null>(null)

  const [searchVal, setSearchVal] = useState("")

  const [updateIdx,      setUpdateIdx]      = useState("")
  const [updateVal,      setUpdateVal]      = useState("")
  const [updateIdxError, setUpdateIdxError] = useState<string | null>(null)

  const [activeSpeed, setActiveSpeed] = useState(500)

  // ── Timer refs for auto-clearing errors ──────────────────────────────────
  const insertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flashError = (
    setter: (v: string | null) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    message: string
  ) => {
    setter(message)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setter(null), 3000)
  }

  // ── Index input handlers — block negatives immediately ───────────────────
  const makeIndexHandler = (
    setter: (v: string) => void,
    errorSetter: (v: string | null) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Allow empty so user can clear the field
    if (raw === "") {
      setter("")
      errorSetter(null)
      return
    }

    // Catch minus sign or any negative value immediately
    if (raw === "-" || Number(raw) < 0) {
      flashError(errorSetter, timerRef, "Negative index is not allowed")
      // Don't update the field — keep it at last valid value
      return
    }

    setter(raw)
    errorSetter(null)
  }

  const handleInsertIdxChange = makeIndexHandler(setInsertIdx, setInsertIdxError, insertTimer)
  const handleDeleteIdxChange = makeIndexHandler(setDeleteIdx, setDeleteIdxError, deleteTimer)
  const handleUpdateIdxChange = makeIndexHandler(setUpdateIdx, setUpdateIdxError, updateTimer)

  // ── Actions ───────────────────────────────────────────────────────────────
  const parseAndLoad = () => {
    const nums = inputStr.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length === 0) { setInputError("Enter at least 1 number."); return }
    if (nums.length > MAX_ELEMENTS) { setInputError(`Max ${MAX_ELEMENTS} elements allowed.`); return }
    setInputError("")
    onLoad(nums)
  }

  const handleInsert = () => {
    const idx = Number(insertIdx)
    const val = Number(insertVal)
    if (arrayLength >= MAX_ELEMENTS) return
    if (insertIdx === "" || isNaN(idx) || idx < 0) {
      flashError(setInsertIdxError, insertTimer, "Negative index is not allowed")
      return
    }
    if (idx > arrayLength) {
      flashError(setInsertIdxError, insertTimer, `Index must be ≤ ${arrayLength}`)
      return
    }
    if (!isNaN(val)) {
      onInsertAt(idx, val)
      setInsertIdx("")
      setInsertVal("")
      setInsertIdxError(null)
    }
  }

  const handleDelete = () => {
    const idx = Number(deleteIdx)
    if (deleteIdx === "" || isNaN(idx) || idx < 0) {
      flashError(setDeleteIdxError, deleteTimer, "Negative index is not allowed")
      return
    }
    if (idx >= arrayLength) {
      flashError(setDeleteIdxError, deleteTimer, `Index must be < ${arrayLength}`)
      return
    }
    onDeleteAt(idx)
    setDeleteIdx("")
    setDeleteIdxError(null)
  }

  const handleSearch = () => {
    const val = Number(searchVal)
    if (!isNaN(val)) { onSearch(val); setSearchVal("") }
  }

  const handleUpdate = () => {
    const idx = Number(updateIdx)
    const val = Number(updateVal)
    if (updateIdx === "" || isNaN(idx) || idx < 0) {
      flashError(setUpdateIdxError, updateTimer, "Negative index is not allowed")
      return
    }
    if (idx >= arrayLength) {
      flashError(setUpdateIdxError, updateTimer, `Index must be < ${arrayLength}`)
      return
    }
    if (!isNaN(val)) {
      onUpdateAt(idx, val)
      setUpdateIdx("")
      setUpdateVal("")
      setUpdateIdxError(null)
    }
  }

  const handleSpeedSelect = (ms: number) => {
    setActiveSpeed(ms)
    onSpeedChange(ms)
  }

  const btn = cn(
    "h-10 rounded-xl text-sm font-medium transition-all",
    isAnimating && "opacity-50 pointer-events-none"
  )

  const opLabel = (op: ArrayOperation) => {
    switch (op.type) {
      case "insert":       return `Insert ${op.value} at [${op.index}]`
      case "delete":       return `Delete at [${op.index}]`
      case "search":       return `Search for ${op.value}`
      case "reverse":      return "Reverse"
      case "rotate-left":  return "Rotate Left"
      case "rotate-right": return "Rotate Right"
      case "update":       return `Update [${op.index}] = ${op.value}`
      case "set":          return "Set Array"
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Main controls card ── */}
      <Card className={cn(PANEL, "p-5")}>
        <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Array Controls
        </h3>

        {/* Load */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Array Input{" "}
            <span className="normal-case text-muted-foreground/50">
              (max {MAX_ELEMENTS})
            </span>
          </label>
          <Input
            value={inputStr}
            onChange={e => { setInputStr(e.target.value); setInputError("") }}
            placeholder="e.g. 3, 7, 1, 9, 4"
            className="rounded-xl border-violet-500/20 focus:ring-violet-500"
            disabled={isAnimating}
            onKeyDown={e => e.key === "Enter" && parseAndLoad()}
          />
          {inputError && (
            <p className="text-[11px] text-rose-500 font-medium">{inputError}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={parseAndLoad}
              disabled={isAnimating}
              className={cn(btn, "bg-gradient-to-r from-violet-600 to-blue-600 text-white px-3 shadow-[0_6px_20px_rgba(139,92,246,0.22)]")}
            >
              Set Array
            </button>
            <button
              onClick={onRandom}
              disabled={isAnimating}
              className={cn(btn, "border border-violet-500/20 bg-white/70 dark:bg-white/[0.04] text-muted-foreground hover:bg-violet-500/5 px-3")}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 inline" />Random
            </button>
          </div>
        </div>

        {/* Speed */}
        <div className="mt-5 border-t border-violet-500/10 pt-4 space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Animation Speed
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {SPEED_OPTIONS.map(({ label, ms }) => (
              <button
                key={ms}
                onClick={() => handleSpeedSelect(ms)}
                className={cn(
                  "h-9 rounded-xl border text-xs font-semibold transition-all",
                  activeSpeed === ms
                    ? "border-amber-400/50 bg-amber-400/15 text-amber-600 dark:text-amber-300"
                    : "border-violet-500/10 bg-white/60 text-muted-foreground hover:bg-amber-400/5 dark:bg-white/[0.03]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Insert ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Insert At Index
        </label>
        {arrayLength >= MAX_ELEMENTS && (
          <p className="text-[11px] text-amber-500">
            Array is full ({MAX_ELEMENTS}/{MAX_ELEMENTS}).
          </p>
        )}
        <div className="flex gap-2">
          <Input
            value={insertIdx}
            onChange={handleInsertIdxChange}
            placeholder="Index"
            type="number"
            min={0}
            className={cn(
              "rounded-xl border-violet-500/20 w-20 shrink-0",
              insertIdxError && "border-rose-500 focus-visible:ring-rose-500"
            )}
            disabled={isAnimating || arrayLength >= MAX_ELEMENTS}
          />
          <Input
            value={insertVal}
            onChange={e => setInsertVal(e.target.value)}
            placeholder="Value"
            type="number"
            className="rounded-xl border-violet-500/20 flex-1"
            disabled={isAnimating || arrayLength >= MAX_ELEMENTS}
          />
          <button
            onClick={handleInsert}
            disabled={isAnimating || arrayLength >= MAX_ELEMENTS}
            className={cn(btn, "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 px-3 disabled:opacity-40")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <IndexError message={insertIdxError} />
      </div>

      {/* ── Delete ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Delete At Index
        </label>
        <div className="flex gap-2">
          <Input
            value={deleteIdx}
            onChange={handleDeleteIdxChange}
            placeholder="Index"
            type="number"
            min={0}
            className={cn(
              "rounded-xl border-violet-500/20 flex-1",
              deleteIdxError && "border-rose-500 focus-visible:ring-rose-500"
            )}
            disabled={isAnimating}
          />
          <button
            onClick={handleDelete}
            disabled={isAnimating || arrayLength === 0}
            className={cn(btn, "border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/15 px-3")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <IndexError message={deleteIdxError} />
      </div>

      {/* ── Search ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Linear Search
        </label>
        <div className="flex gap-2">
          <Input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Value"
            type="number"
            className="rounded-xl border-violet-500/20 flex-1"
            disabled={isAnimating}
          />
          <button
            onClick={handleSearch}
            disabled={isAnimating}
            className={cn(btn, "border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 px-3")}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Update ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Update At Index
        </label>
        <div className="flex gap-2">
          <Input
            value={updateIdx}
            onChange={handleUpdateIdxChange}
            placeholder="Index"
            type="number"
            min={0}
            className={cn(
              "rounded-xl border-violet-500/20 w-20 shrink-0",
              updateIdxError && "border-rose-500 focus-visible:ring-rose-500"
            )}
            disabled={isAnimating}
          />
          <Input
            value={updateVal}
            onChange={e => setUpdateVal(e.target.value)}
            placeholder="New value"
            type="number"
            className="rounded-xl border-violet-500/20 flex-1"
            disabled={isAnimating}
          />
          <button
            onClick={handleUpdate}
            disabled={isAnimating}
            className={cn(btn, "border border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/15 px-3")}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
        <IndexError message={updateIdxError} />
      </div>

      {/* ── Transforms ── */}
      <div className="border-t border-violet-500/10 pt-4 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Transforms
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onReverse}
            disabled={isAnimating || arrayLength === 0}
            className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}
          >
            <RotateCcw className="h-3.5 w-3.5" />Reverse
          </button>
          <button
            onClick={onRotateLeft}
            disabled={isAnimating || arrayLength === 0}
            className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />Rotate L
          </button>
          <button
            onClick={onRotateRight}
            disabled={isAnimating || arrayLength === 0}
            className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}
          >
            Rotate R<ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={onClear}
          disabled={isAnimating}
          className={cn(btn, "w-full border border-rose-500/15 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10")}
        >
          Clear Array
        </button>
      </div>

      {/* ── Operation history ── */}
      {operations.length > 0 && (
        <Card className={cn(PANEL, "p-5")}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            History
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {operations.map((op, i) => (
              <div
                key={op.timestamp}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                  i === 0
                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-300"
                    : "text-muted-foreground"
                )}
              >
                <span className="font-mono">{opLabel(op)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}