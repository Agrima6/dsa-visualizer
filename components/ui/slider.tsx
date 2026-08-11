"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onChange, min, max, step = 1, ...props }, ref) => {
    const percent = ((value - min) / (max - min)) * 100
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted outline-none",
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(139,92,246,0.15)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-violet-600",
          className
        )}
        style={{
          background: `linear-gradient(to right, rgb(124 58 237) 0%, rgb(124 58 237) ${percent}%, hsl(var(--muted)) ${percent}%, hsl(var(--muted)) 100%)`,
        }}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
