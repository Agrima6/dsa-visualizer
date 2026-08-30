"use client"

import { motion } from "framer-motion"
import { Loader2, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePreregister } from "@/hooks/use-preregister"

const fadeStep = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" as const },
}

export function PreregisterPanel({ onBack }: { onBack?: () => void }) {
  const pre = usePreregister()

  if (pre.success) {
    return (
      <motion.div key="success" {...fadeStep} className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <Check className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold">
          {pre.alreadyRegistered ? "You're already on the list" : "You're on the list"}
        </h3>
        <p className="max-w-[30ch] text-sm text-muted-foreground">
          We'll email you the moment early access opens up.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div {...fadeStep} className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">Join the waitlist</h3>
        <p className="max-w-[28ch] text-sm text-muted-foreground">
          Don't have an access password yet? Leave your email and we'll let you know when you're in.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          pre.submit()
        }}
        className="flex flex-col gap-3"
      >
        <Input
          type="email"
          required
          autoFocus
          placeholder="you@example.com"
          value={pre.email}
          onChange={(e) => pre.setEmail(e.target.value)}
          disabled={pre.submitting}
          className="h-12 rounded-xl text-center"
        />
        {pre.error && <p className="text-center text-sm text-destructive">{pre.error}</p>}
        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base"
          disabled={pre.submitting || !pre.email}
        >
          {pre.submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Notify me
        </Button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-center text-sm text-muted-foreground transition hover:text-foreground"
          >
            I have a password
          </button>
        )}
      </form>
    </motion.div>
  )
}
