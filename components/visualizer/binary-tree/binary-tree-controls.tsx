"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface BinaryTreeControlsProps {
  onInsert: (value: number) => void
  onClear: () => void
  onTraversal: (type: "inorder" | "preorder" | "postorder") => void
  traversalHistory: number[]
  isAnimating: boolean
}

export function BinaryTreeControls({
  onInsert,
  onClear,
  onTraversal,
  traversalHistory,
  isAnimating,
}: BinaryTreeControlsProps) {
  const [value, setValue] = useState("")

  const handleInsert = () => {
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== "") {
      onInsert(num)
      setValue("")
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Insert Node ── */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Insert Node</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              disabled={isAnimating}
              className="flex-1"
            />
            <Button
              onClick={handleInsert}
              disabled={isAnimating || !value.trim()}
            >
              Insert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Traversal Controls ── */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Traversal Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">

          {/* Traversal buttons — stacked in a 1-col grid so they never squish */}
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => onTraversal("inorder")}
              disabled={isAnimating}
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-violet-500/15 text-violet-500 text-xs font-bold">
                In
              </span>
              In-Order
            </Button>

            <Button
              onClick={() => onTraversal("preorder")}
              disabled={isAnimating}
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-500/15 text-blue-500 text-xs font-bold">
                Pre
              </span>
              Pre-Order
            </Button>

            <Button
              onClick={() => onTraversal("postorder")}
              disabled={isAnimating}
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-fuchsia-500/15 text-fuchsia-500 text-xs font-bold">
                Post
              </span>
              Post-Order
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Clear — full width, separated so it's clearly destructive */}
          <Button
            variant="destructive"
            onClick={onClear}
            disabled={isAnimating}
            className="w-full"
          >
            Clear Tree
          </Button>
        </CardContent>
      </Card>

      {/* ── Traversal History ── */}
      {traversalHistory.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Traversal Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {traversalHistory.map((val, index) => (
                <div
                  key={index}
                  className="relative flex items-center gap-1.5"
                >
                  {/* value badge */}
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium border border-primary/20 shadow-sm">
                    {val}
                  </span>

                  {/* arrow between items */}
                  {index < traversalHistory.length - 1 && (
                    <span className="text-muted-foreground/50 text-xs select-none">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}