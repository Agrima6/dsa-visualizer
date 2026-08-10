"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function getSafeRedirect(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/home"
  return raw
}

export function usePasswordGate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = getSafeRedirect(searchParams.get("redirect_url"))

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit() {
    if (!password) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/access/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({ allowed: false }))

      if (!res.ok || !data.allowed) {
        setError(data.error ?? "Incorrect password.")
        return
      }

      setSuccess(true)
      setTimeout(() => router.replace(redirectUrl), 700)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return { password, setPassword, error, submitting, success, submit }
}
