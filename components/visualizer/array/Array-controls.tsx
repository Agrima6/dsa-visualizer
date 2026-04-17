"use client"
// components/visualizer/array/array-controls.tsx

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ArrayOperation } from "./types"
import {
  Search, RotateCcw, ChevronLeft, ChevronRight,
  Trash2, Plus, RefreshCw, ArrowLeftRight,
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
  isAnimating: boolean
  operations: ArrayOperation[]
  arrayLength: number
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }

const PANEL = "rounded-2xl border border-violet-500/15 bg-white/70 backdrop-blur-xl dark:bg-white/[0.04] shadow-[0_10px_40px_rgba(139,92,246,0.08)]"

export function ArrayControls({
  onLoad, onInsertAt, onDeleteAt, onSearch,
  onReverse, onRotateLeft, onRotateRight, onUpdateAt,
  onClear, onRandom, isAnimating, operations, arrayLength,
}: ArrayControlsProps) {
  const [inputStr, setInputStr] = useState("3,7,1,9,4,6,2,8,5")
  const [insertIdx, setInsertIdx] = useState("")
  const [insertVal, setInsertVal] = useState("")
  const [deleteIdx, setDeleteIdx] = useState("")
  const [searchVal, setSearchVal] = useState("")
  const [updateIdx, setUpdateIdx] = useState("")
  const [updateVal, setUpdateVal] = useState("")

  const parseAndLoad = () => {
    const nums = inputStr.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length > 0) onLoad(nums)
  }

  const handleInsert = () => {
    const idx = Number(insertIdx), val = Number(insertVal)
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

  const btn = cn(
    "h-10 rounded-xl text-sm font-medium transition-all",
    isAnimating && "opacity-50 pointer-events-none"
  )

  const opLabel = (op: ArrayOperation) => {
    switch (op.type) {
      case "insert":    return `Insert ${op.value} at [${op.index}]`
      case "delete":    return `Delete at [${op.index}]`
      case "search":    return `Search for ${op.value}`
      case "reverse":   return "Reverse"
      case "rotate-left": return "Rotate Left"
      case "rotate-right": return "Rotate Right"
      case "update":    return `Update [${op.index}] = ${op.value}`
      case "set":       return "Set Array"
    }
  }

  return (
    <div className="space-y-5">
      {/* Load array */}
      <Card className={cn(PANEL, "p-5")}>
        <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Array Controls
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Array Input</label>
          <Input
            value={inputStr}
            onChange={e => setInputStr(e.target.value)}
            placeholder="e.g. 3, 7, 1, 9, 4"
            className="rounded-xl border-violet-500/20 focus:ring-violet-500"
            disabled={isAnimating}
            onKeyDown={e => e.key === "Enter" && parseAndLoad()}
          />
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
          <div className="flex gap-2">
            <Input value={insertIdx} onChange={e => setInsertIdx(e.target.value)} placeholder="Index" type="number"
              className="rounded-xl border-violet-500/20 w-20 shrink-0" disabled={isAnimating} />
            <Input value={insertVal} onChange={e => setInsertVal(e.target.value)} placeholder="Value" type="number"
              className="rounded-xl border-violet-500/20 flex-1" disabled={isAnimating} />
            <button onClick={handleInsert} disabled={isAnimating}
              className={cn(btn, "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 px-3")}>
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

        {/* Transform operations */}
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
      </Card>

      {/* Operation history */}
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