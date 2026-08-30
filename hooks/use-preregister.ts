"use client"

import { useState } from "react"

export function usePreregister() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  async function submit() {
    if (!email) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/prereg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.")
        return
      }

      setAlreadyRegistered(Boolean(data.alreadyRegistered))
      setSuccess(true)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return { email, setEmail, error, submitting, success, alreadyRegistered, submit }
}
