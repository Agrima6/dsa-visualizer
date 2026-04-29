"use client"
// components/visualizer/array/array-controls.tsx

import { useState } from "react"
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
  onSpeedChange: (speed: number) => void   // ← new
  isAnimating: boolean
  operations: ArrayOperation[]
  arrayLength: number
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }

const PANEL = "rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]"

const SPEED_OPTIONS: { label: string; ms: number }[] = [
  { label: "0.5×", ms: 900 },
  { label: "1×",   ms: 500 },
  { label: "1.5×", ms: 320 },
  { label: "2×",   ms: 180 },
]

const MAX_ELEMENTS = 10

export function ArrayControls({
  onLoad, onInsertAt, onDeleteAt, onSearch,
  onReverse, onRotateLeft, onRotateRight, onUpdateAt,
  onClear, onRandom, onSpeedChange,
  isAnimating, operations, arrayLength,
}: ArrayControlsProps) {
  const [inputStr,  setInputStr]  = useState("3,7,1,9,4,6,2,8,5")
  const [inputError,setInputError]= useState("")
  const [insertIdx, setInsertIdx] = useState("")
  const [insertVal, setInsertVal] = useState("")
  const [deleteIdx, setDeleteIdx] = useState("")
  const [searchVal, setSearchVal] = useState("")
  const [updateIdx, setUpdateIdx] = useState("")
  const [updateVal, setUpdateVal] = useState("")
  const [activeSpeed, setActiveSpeed] = useState(500)   // default 1×

  const parseAndLoad = () => {
    const nums = inputStr.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length === 0) { setInputError("Enter at least 1 number."); return }
    if (nums.length > MAX_ELEMENTS) { setInputError(`Max ${MAX_ELEMENTS} elements allowed.`); return }
    setInputError("")
    onLoad(nums)
  }

  const handleInsert = () => {
    const idx = Number(insertIdx), val = Number(insertVal)
    if (arrayLength >= MAX_ELEMENTS) { return } // silently blocked; button is disabled too
    if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx <= arrayLength) {
      onInsertAt(idx, val)
      setInsertIdx(""); setInsertVal("")
    }
  }
  const handleDelete = () => {
    const idx = Number(deleteIdx)
    if (!isNaN(idx) && idx >= 0 && idx < arrayLength) {
      onDeleteAt(idx); setDeleteIdx("")
    }
  }
  const handleSearch = () => {
    const val = Number(searchVal)
    if (!isNaN(val)) { onSearch(val); setSearchVal("") }
  }
  const handleUpdate = () => {
    const idx = Number(updateIdx), val = Number(updateVal)
    if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx < arrayLength) {
      onUpdateAt(idx, val); setUpdateIdx(""); setUpdateVal("")
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
            Array Input <span className="normal-case text-muted-foreground/50">(max {MAX_ELEMENTS})</span>
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
            <button onClick={parseAndLoad} disabled={isAnimating}
              className={cn(btn, "bg-gradient-to-r from-violet-600 to-blue-600 text-white px-3 shadow-[0_6px_20px_rgba(139,92,246,0.22)]")}>
              Set Array
            </button>
            <button onClick={onRandom} disabled={isAnimating}
              className={cn(btn, "border border-violet-500/20 bg-white/70 dark:bg-white/[0.04] text-muted-foreground hover:bg-violet-500/5 px-3")}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 inline" />Random
            </button>
          </div>
        </div>

        {/* Insert */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insert At Index</label>
          {arrayLength >= MAX_ELEMENTS && (
            <p className="text-[11px] text-amber-500">Array is full ({MAX_ELEMENTS}/{MAX_ELEMENTS}).</p>
          )}
          <div className="flex gap-2">
            <Input value={insertIdx} onChange={e => setInsertIdx(e.target.value)} placeholder="Index" type="number"
              className="rounded-xl border-violet-500/20 w-20 shrink-0" disabled={isAnimating || arrayLength >= MAX_ELEMENTS} />
            <Input value={insertVal} onChange={e => setInsertVal(e.target.value)} placeholder="Value" type="number"
              className="rounded-xl border-violet-500/20 flex-1" disabled={isAnimating || arrayLength >= MAX_ELEMENTS} />
            <button onClick={handleInsert} disabled={isAnimating || arrayLength >= MAX_ELEMENTS}
              className={cn(btn, "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 px-3 disabled:opacity-40")}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Delete */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delete At Index</label>
          <div className="flex gap-2">
            <Input value={deleteIdx} onChange={e => setDeleteIdx(e.target.value)} placeholder="Index" type="number"
              className="rounded-xl border-violet-500/20 flex-1" disabled={isAnimating} />
            <button onClick={handleDelete} disabled={isAnimating || arrayLength === 0}
              className={cn(btn, "border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/15 px-3")}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Linear Search</label>
          <div className="flex gap-2">
            <Input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Value" type="number"
              className="rounded-xl border-violet-500/20 flex-1" disabled={isAnimating} />
            <button onClick={handleSearch} disabled={isAnimating}
              className={cn(btn, "border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 px-3")}>
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Update */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update At Index</label>
          <div className="flex gap-2">
            <Input value={updateIdx} onChange={e => setUpdateIdx(e.target.value)} placeholder="Index" type="number"
              className="rounded-xl border-violet-500/20 w-20 shrink-0" disabled={isAnimating} />
            <Input value={updateVal} onChange={e => setUpdateVal(e.target.value)} placeholder="New value" type="number"
              className="rounded-xl border-violet-500/20 flex-1" disabled={isAnimating} />
            <button onClick={handleUpdate} disabled={isAnimating}
              className={cn(btn, "border border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/15 px-3")}>
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Transforms */}
        <div className="mt-5 border-t border-violet-500/10 pt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transforms</label>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={onReverse} disabled={isAnimating || arrayLength === 0}
              className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}>
              <RotateCcw className="h-3.5 w-3.5" />Reverse
            </button>
            <button onClick={onRotateLeft} disabled={isAnimating || arrayLength === 0}
              className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}>
              <ChevronLeft className="h-3.5 w-3.5" />Rotate L
            </button>
            <button onClick={onRotateRight} disabled={isAnimating || arrayLength === 0}
              className={cn(btn, "border border-violet-500/15 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:bg-violet-500/5 flex items-center justify-center gap-1")}>
              Rotate R<ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <button onClick={onClear} disabled={isAnimating}
            className={cn(btn, "w-full border border-rose-500/15 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10")}>
            Clear Array
          </button>
        </div>

        {/* ── Speed control ── */}
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

      {/* ── Operation history ── */}
      {operations.length > 0 && (
        <Card className={cn(PANEL, "p-5")}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">History</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {operations.map((op, i) => (
              <div key={op.timestamp} className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                i === 0 ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "text-muted-foreground"
              )}>
                <span className="font-mono">{opLabel(op)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}