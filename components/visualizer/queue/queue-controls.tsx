"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const MAX_QUEUE_SIZE = 6

interface QueueControlsProps {
  onEnqueue: (value: number) => void
  onDequeue: () => void
  onClear: () => void
  isAnimating: boolean
  isFull: boolean
  isEmpty: boolean
}

export function QueueControls({
  onEnqueue,
  onDequeue,
  onClear,
  isAnimating,
  isFull,
  isEmpty,
}: QueueControlsProps) {
  const [value, setValue] = useState("")
  const [count, setCount] = useState(0) // track queue size locally

  const handleEnqueue = () => {
    if (count >= MAX_QUEUE_SIZE) return

    const num = Number(value)
    if (!isNaN(num)) {
      onEnqueue(num)
      setValue("")
      setCount((prev) => prev + 1)
    }
  }

  const handleDequeue = () => {
    if (count > 0) {
      onDequeue()
      setCount((prev) => prev - 1)
    }
  }

  const handleClear = () => {
    onClear()
    setCount(0)
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Queue Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            onKeyDown={(e) => e.key === 'Enter' && !isFull && handleEnqueue()}
            disabled={isAnimating || isFull || count >= MAX_QUEUE_SIZE}
            className="flex-1"
          />
          <Button 
            onClick={handleEnqueue}
            disabled={isAnimating || isFull || count >= MAX_QUEUE_SIZE}
          >
            Enqueue
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleDequeue}
            disabled={isAnimating || isEmpty}
            variant="secondary"
          >
            Dequeue
          </Button>
          <Button 
            onClick={handleClear}
            disabled={isAnimating || isEmpty}
            variant="destructive"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}