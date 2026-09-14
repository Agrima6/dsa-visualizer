"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquarePlus, X, Loader2, Check } from "lucide-react"

// The "no visible way for a confused or frustrated user to reach you" gap
// from the pre-launch audit. A floating button beats silence — submissions
// land in Redis (lib/feedback.ts) and surface in /superadmin, no email
// service required to ship this.
export function FeedbackWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const reset = () => {
    setOpen(false)
    setTimeout(() => {
      setMessage("")
      setEmail("")
      setError(null)
      setSent(false)
    }, 200) // let the close animation finish before wiping the form
  }

  const submit = async () => {
    if (!message.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email: email.trim() || null, page: pathname }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.")
        return
      }
      setSent(true)
    } catch {
      setError("Couldn't reach the server. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Deliberately shown everywhere, including on the pre-launch gate page
  // itself (there's only one root layout) — a visitor stuck on the
  // waitlist form is exactly the kind of person worth hearing from too.
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Send feedback"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition-transform hover:scale-105"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-violet-500/15 bg-background/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Send feedback</h3>
            <button onClick={reset} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium">Thanks — we'll take a look.</p>
              <button onClick={reset} className="mt-1 text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300">
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Found a bug? Confused by something? Tell us."
                maxLength={2000}
                className="h-24 w-full resize-none rounded-xl border border-violet-500/15 bg-white/70 p-2.5 text-sm outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional, if you want a reply)"
                className="w-full rounded-xl border border-violet-500/15 bg-white/70 px-2.5 py-2 text-sm outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
              />
              {error && <p className="text-xs text-rose-600 dark:text-rose-300">{error}</p>}
              <button
                onClick={submit}
                disabled={!message.trim() || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
