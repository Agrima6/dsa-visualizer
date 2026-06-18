"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const MAX_STACK_SIZE = 10

interface StackControlsProps {
  onPush: (value: number) => void
  onPop: () => void
  onClear: () => void
  isAnimating: boolean
  isFull: boolean
  isEmpty: boolean
}

export function StackControls({
  onPush,
  onPop,
  onClear,
  isAnimating,
  isFull,
  isEmpty,
}: StackControlsProps) {
  const [value, setValue] = useState("")
  const [count, setCount] = useState(0) // track pushes locally

  const handlePush = () => {
    if (count >= MAX_STACK_SIZE) return

    const num = Number(value)
    if (!isNaN(num)) {
      onPush(num)
      setValue("")
      setCount((prev) => prev + 1)
    }
  }

  const handlePop = () => {
    if (count > 0) {
      onPop()
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
        <CardTitle className="text-lg">Stack Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex gap-2">
          <Input
            type="text" /* ✅ removes spinner */
            value={value}
            onChange={(e) => {
              // allow only numbers (optional but safe)
              const val = e.target.value
              if (/^-?\d*$/.test(val)) setValue(val)
            }}
            placeholder="Enter value"
            onKeyDown={(e) => e.key === 'Enter' && !isFull && handlePush()}
            disabled={isAnimating || isFull || count >= MAX_STACK_SIZE}
            className="flex-1"
          />

          <Button 
            onClick={handlePush}
            disabled={isAnimating || isFull || count >= MAX_STACK_SIZE}
          >
            Push
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handlePop}
            disabled={isAnimating || isEmpty}
            variant="secondary"
          >
            Pop
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