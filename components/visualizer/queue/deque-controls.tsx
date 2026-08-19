"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface DequeControlsProps {
  onAddFront: (value: number) => Promise<void>
  onAddRear: (value: number) => Promise<void>
  onRemoveFront: () => void
  onRemoveRear: () => void
  onClear: () => void
  isAnimating: boolean
  isFull: boolean
  isEmpty: boolean
}

export function DequeControls({
  onAddFront,
  onAddRear,
  onRemoveFront,
  onRemoveRear,
  onClear,
  isAnimating,
  isFull,
  isEmpty,
}: DequeControlsProps) {
  const [value, setValue] = useState("")

  const parsed = () => {
    const num = Number(value)
    return !isNaN(num) && value.trim() !== "" ? num : null
  }

  const handleAddFront = () => {
    const num = parsed()
    if (num !== null) { onAddFront(num); setValue("") }
  }
  const handleAddRear = () => {
    const num = parsed()
    if (num !== null) { onAddRear(num); setValue("") }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Deque Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          disabled={isAnimating || isFull}
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleAddFront} disabled={isAnimating || isFull || !value.trim()} variant="secondary">
            + Front
          </Button>
          <Button onClick={handleAddRear} disabled={isAnimating || isFull || !value.trim()} variant="secondary">
            + Rear
          </Button>
          <Button onClick={onRemoveFront} disabled={isAnimating || isEmpty} variant="secondary">
            − Front
          </Button>
          <Button onClick={onRemoveRear} disabled={isAnimating || isEmpty} variant="secondary">
            − Rear
          </Button>
        </div>

        <Button onClick={onClear} disabled={isAnimating || isEmpty} variant="destructive" className="w-full">
          Clear
        </Button>
      </CardContent>
    </Card>
  )
}
