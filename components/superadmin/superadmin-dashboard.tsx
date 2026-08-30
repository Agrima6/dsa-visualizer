"use client"

import { useEffect, useMemo, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Mail, RefreshCw, Search, Download, Users } from "lucide-react"

interface PreregisteredUser {
  email: string
  registeredAt: number
}

export function SuperadminDashboard() {
  const [users, setUsers] = useState<PreregisteredUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/prereg", { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? "Failed to load pre-registered users.")
        return
      }
      setUsers(data.users ?? [])
    } catch {
      setError("Failed to load pre-registered users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!users) return []
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.email.toLowerCase().includes(q))
  }, [users, query])

  const exportCsv = () => {
    if (!users || users.length === 0) return
    const rows = ["email,registered_at", ...users.map((u) => `${u.email},${new Date(u.registeredAt).toISOString()}`)]
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prereg-users-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Superadmin</h1>
            <p className="mt-1 text-sm text-muted-foreground">Pre-registered users waiting for early access.</p>
          </div>
          <UserButton />
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/15 bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Total pre-registered
            </div>
            <p className="mt-2 text-3xl font-bold hero-gradient-text">{users?.length ?? "—"}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-violet-500/15 bg-card">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email..."
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
                disabled={!users || users.length === 0}
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

          {!error && !loading && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center text-sm text-muted-foreground">
              <Mail className="h-6 w-6 opacity-50" />
              {users && users.length > 0 ? "No emails match your search." : "No one has pre-registered yet."}
            </div>
          )}

          {!error && !loading && filtered.length > 0 && (
            <div className="divide-y divide-border/60">
              {filtered.map((u) => (
                <div key={u.email} className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-sm">{u.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(u.registeredAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
