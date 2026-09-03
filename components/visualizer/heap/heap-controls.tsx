"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { HeapType } from "./types"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface HeapControlsProps {
  title: string
  onInsert: (value: number) => void
  onInsertMany: (values: string) => void
  onExtract: () => void
  onClear: () => void
  heapType: HeapType
  speed?: number
  onSetSpeed?: (speed: number) => void
}

export function HeapControls({
  title,
  onInsert,
  onInsertMany,
  onExtract,
  onClear,
  heapType,
  speed,
  onSetSpeed,
}: HeapControlsProps) {
  const [value, setValue] = useState("")
  const [bulkInput, setBulkInput] = useState("")

  const handleInsert = () => {
    const num = Number(value)
    if (value.trim() !== "" && !isNaN(num)) {
      onInsert(num)
      setValue("")
    }
  }

  const handleBulkInsert = () => {
    if (bulkInput.trim()) {
      onInsertMany(bulkInput)
      setBulkInput("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">{title} Controls</CardTitle>
          <div className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            {heapType === 'max' ? 'Max Heap' : 'Min Heap'}
          </div>
        </div>
      </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Single Insert</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                className="flex-1"
              />
              <Button onClick={handleInsert}>Insert</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bulk Insert (comma-separated)</Label>
            <div className="flex gap-2">
              <Input
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="e.g., 1, 2, 3, 4"
                onKeyDown={(e) => e.key === 'Enter' && handleBulkInsert()}
                className="flex-1"
              />
              <Button onClick={handleBulkInsert}>Insert All</Button>
            </div>
          </div>

          {typeof speed === "number" && onSetSpeed && (
            <SpeedControl speed={speed} onSetSpeed={onSetSpeed} />
          )}

          <Button
            onClick={onExtract}
            variant="secondary"
            className="w-full"
          >
            Extract {heapType === "max" ? "Max" : "Min"}
          </Button>

          <Button
            variant="destructive"
            onClick={onClear}
            className="w-full"
          >
            Clear Heap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 