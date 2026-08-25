"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { SpeedControl } from "@/components/visualizer/shared/speed-control"

interface PriorityQueueControlsProps {
  onInsert: (value: number) => Promise<void>
  onExtractMin: () => void
  onClear: () => void
  isAnimating: boolean
  isEmpty: boolean
  speed?: number
  onSetSpeed?: (speed: number) => void
}

export function PriorityQueueControls({
  onInsert,
  onExtractMin,
  onClear,
  isAnimating,
  isEmpty,
  speed,
  onSetSpeed,
}: PriorityQueueControlsProps) {
  const [value, setValue] = useState("")

  const handleInsert = () => {
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== "") {
      onInsert(num)
      setValue("")
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Priority Queue Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          The value you enter IS its priority — lower value means higher priority,
          so it gets inserted closer to the front.
        </p>

        <div className="flex gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value (= priority)"
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            disabled={isAnimating}
            className="flex-1"
          />
          <Button onClick={handleInsert} disabled={isAnimating || !value.trim()}>
            Insert
          </Button>
        </div>

        {typeof speed === "number" && onSetSpeed && (
          <SpeedControl speed={speed} onSetSpeed={onSetSpeed} disabled={isAnimating} />
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onExtractMin} disabled={isAnimating || isEmpty} variant="secondary">
            Extract Highest
          </Button>
          <Button onClick={onClear} disabled={isAnimating || isEmpty} variant="destructive">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
