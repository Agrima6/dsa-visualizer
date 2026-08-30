"use client"

import { useState } from "react"
import { Accessibility } from "lucide-react"
import { useAccessibility, type AccessibilitySettings } from "@/hooks/use-accessibility"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const TOGGLES: { key: keyof AccessibilitySettings; label: string; description: string }[] = [
  {
    key: "reducedMotion",
    label: "Reduced motion",
    description: "Cuts every animation and transition down to effectively instant.",
  },
  {
    key: "highContrast",
    label: "High contrast",
    description: "Stronger borders and text contrast across the whole site.",
  },
  {
    key: "keyboardMode",
    label: "Keyboard-first focus rings",
    description: "Always shows a visible focus outline, even for elements that normally hide it for mouse users.",
  },
  {
    key: "transcriptsEnabled",
    label: "Narration transcripts",
    description: "Shows a text log of narration as it plays, in a panel at the bottom of the screen.",
  },
]

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const settings = useAccessibility()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Accessibility settings"
        title="Accessibility settings"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/15 bg-muted/30 text-muted-foreground transition-colors hover:border-violet-500/30 hover:text-foreground"
      >
        <Accessibility className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle>Accessibility</DialogTitle>
          <DialogDescription>Settings apply immediately and are remembered on this device.</DialogDescription>
          <div className="mt-2 space-y-4">
            {TOGGLES.map((t) => (
              <label key={t.key} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                <input
                  type="checkbox"
                  checked={settings[t.key]}
                  onChange={(e) => settings.setSetting(t.key, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-600"
                />
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
