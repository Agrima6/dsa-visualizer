"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface LinkedListControlsProps {
  onInsertFront: (value: number) => void
  onInsertBack: (value: number) => void
  onDeleteFront: () => void
  onDeleteBack: () => void
  onReverse: () => void
  isAnimating: boolean
  isEmpty: boolean
  isFull: boolean
}

export function LinkedListControls({
  onInsertFront,
  onInsertBack,
  onDeleteFront,
  onDeleteBack,
  onReverse,
  isAnimating,
  isEmpty,
  isFull,
}: LinkedListControlsProps) {
  const [value, setValue] = useState("")
  const [insertAtFront, setInsertAtFront] = useState(true)

  const handleInsert = () => {
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== "") {
      if (insertAtFront) {
        onInsertFront(num)
      } else {
        onInsertBack(num)
      }
      setValue("")
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">List Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Insert Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="insert-position">Insert at Front</Label>
            <Switch
              id="insert-position"
              checked={insertAtFront}
              onCheckedChange={setInsertAtFront}
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              disabled={isAnimating || isFull}
              className="flex-1"
            />
            <Button
              onClick={handleInsert}
              disabled={isAnimating || !value.trim() || isFull}
            >
              Insert
            </Button>
          </div>

          {/* Full warning */}
          {isFull && (
            <p className="text-xs text-muted-foreground text-center rounded-xl border border-violet-500/15 bg-white/60 dark:bg-white/[0.04] px-3 py-2">
              Maximum size of <span className="font-semibold text-violet-500">5</span> nodes reached
            </p>
          )}
        </div>

        {/* Delete Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onDeleteFront}
            disabled={isAnimating || isEmpty}
            variant="secondary"
          >
            Delete Front
          </Button>
          <Button
            onClick={onDeleteBack}
            disabled={isAnimating || isEmpty}
            variant="secondary"
          >
            Delete Back
          </Button>
        </div>

        {/* Reverse Control */}
        <Button
          onClick={onReverse}
          disabled={isAnimating || isEmpty}
          className="w-full"
          variant="outline"
        >
          Reverse List
        </Button>
      </CardContent>
    </Card>
  )
}