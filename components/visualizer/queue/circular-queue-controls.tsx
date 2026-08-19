"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface CircularQueueControlsProps {
  onEnqueue: (value: number) => Promise<void>
  onDequeue: () => void
  onClear: () => void
  isAnimating: boolean
  isFull: boolean
  isEmpty: boolean
  size: number
  count: number
}

export function CircularQueueControls({
  onEnqueue,
  onDequeue,
  onClear,
  isAnimating,
  isFull,
  isEmpty,
  size,
  count,
}: CircularQueueControlsProps) {
  const [value, setValue] = useState("")

  const handleEnqueue = () => {
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== "") {
      onEnqueue(num)
      setValue("")
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Circular Queue Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Fixed capacity: {size} slots ({count}/{size} used). Once rear reaches the
          last slot, the next insert wraps back around to slot 0 if it&apos;s free.
        </p>

        <div className="flex gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
            disabled={isAnimating || isFull}
            className="flex-1"
          />
          <Button onClick={handleEnqueue} disabled={isAnimating || isFull || !value.trim()}>
            Enqueue
          </Button>
        </div>

        {isFull && (
          <p className="text-xs font-medium text-amber-500">Queue is full — dequeue to free a slot.</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onDequeue} disabled={isAnimating || isEmpty} variant="secondary">
            Dequeue
          </Button>
          <Button onClick={onClear} disabled={isAnimating || isEmpty} variant="destructive">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
