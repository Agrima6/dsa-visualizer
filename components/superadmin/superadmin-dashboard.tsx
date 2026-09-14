"use client"

import { useEffect, useMemo, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Mail, RefreshCw, Search, Download, Users, MessageSquare } from "lucide-react"

interface PreregisteredUser {
  email: string
  registeredAt: number
}

interface FeedbackEntry {
  id: string
  message: string
  email: string | null
  userId: string | null
  page: string | null
  createdAt: number
}

export function SuperadminDashboard() {
  const [tab, setTab] = useState<"prereg" | "feedback">("prereg")
  const [users, setUsers] = useState<PreregisteredUser[] | null>(null)
  const [feedback, setFeedback] = useState<FeedbackEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      if (tab === "prereg") {
        const res = await fetch("/api/prereg", { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error ?? "Failed to load pre-registered users.")
          return
        }
        setUsers(data.users ?? [])
      } else {
        const res = await fetch("/api/feedback", { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error ?? "Failed to load feedback.")
          return
        }
        setFeedback(data.entries ?? [])
      }
    } catch {
      setError(tab === "prereg" ? "Failed to load pre-registered users." : "Failed to load feedback.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setQuery("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const filteredUsers = useMemo(() => {
    if (!users) return []
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.email.toLowerCase().includes(q))
  }, [users, query])

  const filteredFeedback = useMemo(() => {
    if (!feedback) return []
    const q = query.trim().toLowerCase()
    if (!q) return feedback
    return feedback.filter((f) => f.message.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q))
  }, [feedback, query])

  const exportCsv = () => {
    if (tab === "prereg") {
      if (!users || users.length === 0) return
      const rows = ["email,registered_at", ...users.map((u) => `${u.email},${new Date(u.registeredAt).toISOString()}`)]
      const blob = new Blob([rows.join("\n")], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `prereg-users-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      if (!feedback || feedback.length === 0) return
      const escape = (s: string) => `"${s.replace(/"/g, '""')}"`
      const rows = [
        "message,email,page,created_at",
        ...feedback.map((f) => [escape(f.message), f.email ?? "", f.page ?? "", new Date(f.createdAt).toISOString()].join(",")),
      ]
      const blob = new Blob([rows.join("\n")], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `feedback-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Superadmin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "prereg" ? "Pre-registered users waiting for early access." : "Feedback submitted from inside the app."}
            </p>
          </div>
          <UserButton />
        </header>

        <div className="flex rounded-xl border border-border/60 bg-muted/30 p-1">
          <button
            onClick={() => setTab("prereg")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === "prereg" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pre-registrations
          </button>
          <button
            onClick={() => setTab("feedback")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === "feedback" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Feedback
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/15 bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {tab === "prereg" ? <Users className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
              {tab === "prereg" ? "Total pre-registered" : "Total feedback"}
            </div>
            <p className="mt-2 text-3xl font-bold hero-gradient-text">
              {tab === "prereg" ? users?.length ?? "—" : feedback?.length ?? "—"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-violet-500/15 bg-card">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "prereg" ? "Search by email..." : "Search feedback..."}
                className="w-full rounded-xl border border-border/60 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-500/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                onClick={exportCsv}
                disabled={tab === "prereg" ? !users || users.length === 0 : !feedback || feedback.length === 0}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {error && <p className="p-4 text-sm text-destructive">{error}</p>}

          {!error && loading && (
            <div className="flex items-center justify-center py-14 text-sm text-muted-foreground">Loading...</div>
          )}

          {tab === "prereg" && !error && !loading && filteredUsers.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center text-sm text-muted-foreground">
              <Mail className="h-6 w-6 opacity-50" />
              {users && users.length > 0 ? "No emails match your search." : "No one has pre-registered yet."}
            </div>
          )}

          {tab === "prereg" && !error && !loading && filteredUsers.length > 0 && (
            <div className="divide-y divide-border/60">
              {filteredUsers.map((u) => (
                <div key={u.email} className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-sm">{u.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(u.registeredAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "feedback" && !error && !loading && filteredFeedback.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center text-sm text-muted-foreground">
              <MessageSquare className="h-6 w-6 opacity-50" />
              {feedback && feedback.length > 0 ? "No feedback matches your search." : "No feedback submitted yet."}
            </div>
          )}

          {tab === "feedback" && !error && !loading && filteredFeedback.length > 0 && (
            <div className="divide-y divide-border/60">
              {filteredFeedback.map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm">{f.message}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(f.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {(f.email || f.page) && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {f.email && <span className="font-mono">{f.email}</span>}
                      {f.page && <span className="rounded-full border border-border/60 px-2 py-0.5">{f.page}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
