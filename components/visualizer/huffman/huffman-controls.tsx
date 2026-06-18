"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef } from "react"

const MAX_LENGTH = 20

// Huffman works on printable ASCII — allow letters, digits, spaces,
// and common punctuation. Block control characters and anything non-printable.
const VALID_CHAR_REGEX = /^[\x20-\x7E]*$/

interface HuffmanControlsProps {
  onEncode: (text: string) => void
  onNext: () => void
  onPrevious: () => void
  onReset: () => void
  isAnimating: boolean
  currentStep: number
  totalSteps: number
}

export function HuffmanControls({
  onEncode,
  onNext,
  onPrevious,
  onReset,
  isAnimating,
  currentStep,
  totalSteps,
}: HuffmanControlsProps) {
  const [text, setText] = useState("")
  const [invalidChar, setInvalidChar] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flashInvalid = (label: string) => {
    setInvalidChar(label)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setInvalidChar(null), 2000)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Find first invalid character
    const badChar = raw.split("").find((ch) => !VALID_CHAR_REGEX.test(ch))
    if (badChar !== undefined) {
      // Show a readable label for non-printable chars
      const label =
        badChar === "\t"
          ? '"tab"'
          : badChar === "\n"
          ? '"newline"'
          : `"${badChar}"`
      flashInvalid(label)

      // Strip invalid chars and apply up to MAX_LENGTH
      const cleaned = raw
        .split("")
        .filter((ch) => VALID_CHAR_REGEX.test(ch))
        .join("")
        .slice(0, MAX_LENGTH)
      setText(cleaned)
      return
    }

    // Valid chars — enforce length (no update at limit = no glow)
    if (raw.length <= MAX_LENGTH) {
      setText(raw)
    }
  }

  const handleEncode = () => {
    if (text.trim()) {
      onEncode(text)
    }
  }

  const isAtLimit = text.length >= MAX_LENGTH

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Huffman Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Input block ── */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text to encode"
              onKeyDown={(e) => e.key === "Enter" && handleEncode()}
              disabled={isAnimating}
              maxLength={MAX_LENGTH}
              className="flex-1"
            />
            <Button
              onClick={handleEncode}
              disabled={isAnimating || !text.trim()}
            >
              Encode
            </Button>
          </div>

          {/* Counter + warnings — only shown once user starts typing */}
          {text.length > 0 && (
            <div className="flex items-center justify-between">
              {/* Left: contextual message */}
              <span className="text-xs">
                {invalidChar ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    <span className="font-mono font-semibold">{invalidChar}</span>{" "}
                    is not allowed
                  </span>
                ) : isAtLimit ? (
                  <span className="text-rose-500">
                    Max {MAX_LENGTH} characters reached
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Any printable character allowed
                  </span>
                )}
              </span>

              {/* Right: character counter */}
              <span
                className={`text-xs tabular-nums ${
                  isAtLimit
                    ? "text-rose-500 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {text.length}/{MAX_LENGTH}
              </span>
            </div>
          )}
        </div>

        {/* ── Step controls ── */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={onPrevious}
            disabled={currentStep <= 0 || isAnimating}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1 || isAnimating}
            variant="outline"
          >
            Next
          </Button>
          <Button
            onClick={onReset}
            disabled={isAnimating}
            variant="destructive"
          >
            Reset
          </Button>
        </div>

        {/* ── Step indicator ── */}
        {totalSteps > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {totalSteps}
          </div>
        )}

      </CardContent>
    </Card>
  )
}