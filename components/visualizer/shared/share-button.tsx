"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { encodeState } from "@/lib/share-state"

interface ShareButtonProps {
  /** Small, JSON-serializable object fully describing the state to share. */
  state: unknown
  /** Query param name this visualizer reads the encoded state back from. */
  paramName?: string
  className?: string
}

/** Copies a link that reproduces the given state when opened, via `?<paramName>=<encoded>`. */
export function ShareButton({ state, paramName = "s", className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const encoded = encodeState(state)
    const url = new URL(window.location.href)
    url.searchParams.set(paramName, encoded)

    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API can be blocked (permissions, insecure context) — fall
      // back to updating the address bar so the link is at least visible
      // and copyable manually.
      window.history.replaceState(null, "", url.toString())
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "Link copied!" : "Share"}
    </button>
  )
}
