"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePasswordGate } from "@/hooks/use-password-gate"

const fadeStep = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" as const },
}

export function GatePanel({ onClose }: { onClose?: () => void }) {
  const gate = usePasswordGate()
  const inputRef = useRef<HTMLInputElement>(null)

  if (gate.success) {
    return (
      <motion.div key="success" {...fadeStep} className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <Check className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold">Access granted</h3>
        <p className="text-sm text-muted-foreground">Taking you inside...</p>
      </motion.div>
    )
  }

  return (
    <motion.div {...fadeStep} className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">Enter early access</h3>
        <p className="max-w-[26ch] text-sm text-muted-foreground">
          This build is invite-only. Enter the access password to continue.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          gate.submit()
        }}
        className="flex flex-col gap-3"
      >
        <Input
          ref={inputRef}
          type="password"
          required
          autoFocus
          placeholder="Access password"
          value={gate.password}
          onChange={(e) => gate.setPassword(e.target.value)}
          disabled={gate.submitting}
          className="h-12 rounded-xl text-center"
        />
        {gate.error && <p className="text-center text-sm text-destructive">{gate.error}</p>}
        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base"
          disabled={gate.submitting || !gate.password}
        >
          {gate.submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Unlock access
        </Button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-center text-sm text-muted-foreground transition hover:text-foreground"
          >
            Not now
          </button>
        )}
      </form>
    </motion.div>
  )
}
