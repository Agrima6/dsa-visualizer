"use client"

import { Token } from "./types"

interface TokenDisplayProps {
  token: Token
  highlighted?: boolean
}

export function TokenDisplay({ token, highlighted = false }: TokenDisplayProps) {
  const getColor = () => {
    switch (token.type) {
      case "operator":
        return highlighted
          ? "border-blue-400/30 bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.25)]"
          : "border-blue-400/20 bg-blue-500/10 text-blue-700 dark:text-blue-300"

      case "operand":
        return highlighted
          ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.22)]"
          : "border-emerald-400/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"

      case "parenthesis":
        return highlighted
          ? "border-amber-400/30 bg-amber-400/20 text-amber-700 dark:text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.22)]"
          : "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300"

      default:
        return "border-violet-500/15 bg-white/70 text-foreground dark:bg-white/[0.04]"
    }
  }

  return (
    <div
      className={`px-3 py-1.5 rounded-xl border font-mono text-sm font-medium backdrop-blur-sm transition-all ${getColor()}`}
    >
      {token.value}
    </div>
  )
}