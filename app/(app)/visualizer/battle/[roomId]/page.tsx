"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AlertTriangle, Check, ChevronDown, Clock, Copy, Loader2, Swords, Trophy } from "lucide-react"
import { runReplay, type OpCounts } from "@/lib/battle/replay-runner"
import { Planet } from "@/components/visualizer/shared/planet"
import { CodeEditor } from "@/components/visualizer/shared/code-editor"

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?"
}

interface PublicQuestion {
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string
  constraints: string[]
  starterCode: string
  examples: { input: string; output: string }[]
}

interface Submission {
  questionIndex: number
  passed: boolean
  testsPassed: number
  testsTotal: number
  submittedAt: number
  error: string | null
  code: string
}

interface ReplayData {
  submissions: { userId: string; name: string; questionIndex: number; passed: boolean; code: string }[]
  sampleInputs: { questionIndex: number; slug: string; title: string; input: unknown[] }[]
}

interface RoomView {
  id: string
  config: { difficulty: string; topics: string[]; numQuestions: number; timeLimitSeconds: number }
  status: "waiting" | "active" | "finished"
  hostUserId: string
  startedAt: number | null
  finishedAt: number | null
  winnerUserId: string | null
  totalQuestions: number
  me: { userId: string; name: string; currentQuestion: number; solvedCount: number; totalTimeMs: number; lastSubmission: Submission | null } | null
  opponent: { userId: string; name: string; currentQuestion: number; solvedCount: number; totalTimeMs: number; lastTestsPassed: number | null; lastTestsTotal: number | null } | null
  replay: ReplayData | null
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

function formatDuration(ms: number): string {
  return formatClock(ms / 1000)
}

export default function BattleRoomPage() {
  const params = useParams<{ roomId: string }>()
  const roomId = (params.roomId ?? "").toUpperCase()
  const router = useRouter()

  const [room, setRoom] = useState<RoomView | null>(null)
  const [question, setQuestion] = useState<PublicQuestion | null>(null)
  const [code, setCode] = useState("")
  const [loadedQuestionSlug, setLoadedQuestionSlug] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Submission | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const applyRoom = useCallback((data: { room: RoomView; question?: PublicQuestion | null }) => {
    setRoom(data.room)
    if (data.question !== undefined) {
      setQuestion(data.question)
      if (data.question && data.question.slug !== loadedQuestionSlug) {
        setCode(data.question.starterCode)
        setLoadedQuestionSlug(data.question.slug)
        setFeedback(null) // a new question loaded — the old feedback banner no longer applies to what's on screen
      }
    }
  }, [loadedQuestionSlug])

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/battle/room/${roomId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Could not load this battle.")
        return
      }
      applyRoom(data)
    } catch {
      // Transient network hiccup on a poll — don't surface an error for one missed tick.
    }
  }, [roomId, applyRoom])

  // Join (idempotent — a no-op if already a player) then start polling.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/battle/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Could not join this battle.")
          return
        }
        if (cancelled) return
        await fetchRoom()
      } catch {
        if (!cancelled) setError("Could not reach the battle server.")
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  useEffect(() => {
    if (!room || room.status === "finished" || error) {
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }
    pollRef.current = setInterval(fetchRoom, 1500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    // Depending on the full `room` object would restart this interval on
    // every single poll response (a new object every ~1.5s) instead of
    // only when it actually needs to start/stop — room?.status is the
    // only field that determines that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status, error, fetchRoom])

  // Local per-second countdown, seeded from the server's startedAt — the
  // server (not this timer) is what actually ends the battle on time-up;
  // this is just for display so it doesn't jump every 1.5s poll tick.
  useEffect(() => {
    if (!room?.startedAt) return
    const tick = () => {
      const elapsed = (Date.now() - (room.startedAt as number)) / 1000
      setTimeLeft(Math.max(0, room.config.timeLimitSeconds - elapsed))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
    // Deliberately depending on the two primitive fields this reads, not
    // the whole `room` object — `room` gets a new reference on every
    // ~1.5s poll tick, and depending on it here would tear down and
    // restart this 1-second interval that often, causing the countdown
    // to visibly stutter instead of ticking smoothly.
  }, [room?.startedAt, room?.config.timeLimitSeconds])

  const submit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/battle/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Could not submit.")
        return
      }
      setFeedback(data.submission)
      applyRoom(data)
      // On a wrong answer, pull the (unchanged) question state right away so
      // there's no lag. On a pass, deliberately wait — an immediate refetch
      // would load the next question and wipe this "Passed!" banner before
      // the player ever saw it; the regular ~1.5s poll picks it up instead.
      if (!data.submission.passed) await fetchRoom()
    } catch {
      setError("Could not reach the battle server.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${origin}/visualizer/battle/${roomId}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access denied — the link is still visible to select manually.
    }
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-xl">
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
        <button onClick={() => router.push("/visualizer/battle")} className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300">
          ← Back to Battle Lobby
        </button>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="container mx-auto flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  if (room.status === "waiting") {
    return (
      <div className="container mx-auto max-w-xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-violet-500" />
          <h1 className="text-xl font-semibold">Waiting for your opponent...</h1>
          <p className="mt-2 text-sm text-muted-foreground">Send them this invite link or room code:</p>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <code className="flex-1 truncate text-left text-xs">{origin ? `${origin}/visualizer/battle/${roomId}` : "…"}</code>
            <button onClick={copyInvite} className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 text-2xl font-mono font-bold tracking-[0.3em] text-violet-600 dark:text-violet-300">{roomId}</div>
        </div>
      </div>
    )
  }

  if (room.status === "finished") {
    const won = room.winnerUserId === room.me?.userId
    const lost = room.winnerUserId !== null && !won
    return (
      <div className="container mx-auto max-w-xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Trophy className={`mx-auto mb-4 h-10 w-10 ${won ? "text-amber-500" : "text-muted-foreground"}`} />
          <h1 className="text-2xl font-semibold">
            {room.winnerUserId === null ? "It's a draw!" : won ? "You won!" : lost ? "You lost this one." : "Battle finished."}
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-4 text-left">
            <div className="rounded-xl border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Planet theme="violet" size="sm">
                  <span className="text-[10px] font-bold">{initials(room.me?.name ?? "You")}</span>
                </Planet>
                <p className="text-xs font-semibold uppercase text-muted-foreground">{room.me?.name} (you)</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{room.me?.solvedCount}/{room.totalQuestions}</p>
              <p className="text-xs text-muted-foreground">solved in {formatDuration(room.me?.totalTimeMs ?? 0)}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Planet theme="amber" size="sm">
                  <span className="text-[10px] font-bold">{initials(room.opponent?.name ?? "Opponent")}</span>
                </Planet>
                <p className="text-xs font-semibold uppercase text-muted-foreground">{room.opponent?.name ?? "Opponent"}</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{room.opponent?.solvedCount ?? 0}/{room.totalQuestions}</p>
              <p className="text-xs text-muted-foreground">solved in {formatDuration(room.opponent?.totalTimeMs ?? 0)}</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/visualizer/battle")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Swords className="h-4 w-4" /> Battle Again
          </button>
        </div>

        {room.replay && room.me && <CompareApproaches replay={room.replay} myUserId={room.me.userId} />}
      </div>
    )
  }

  // status === "active"
  const finishedAllQuestions = (room.me?.currentQuestion ?? 0) >= room.totalQuestions

  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Swords className="h-4 w-4 text-violet-500" />
          Question {(room.me?.currentQuestion ?? 0) + (finishedAllQuestions ? 0 : 1)}/{room.totalQuestions}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-mono font-semibold">
          <Clock className="h-4 w-4 text-violet-500" />
          {timeLeft !== null ? formatClock(timeLeft) : "--:--"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {finishedAllQuestions ? (
            <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">You've solved every question!</p>
              <p className="mt-1 text-sm text-muted-foreground">Waiting for the clock to run out or your opponent to finish...</p>
            </div>
          ) : question ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-300">{question.difficulty}</span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{question.topic}</span>
              </div>
              <h2 className="text-lg font-semibold">{question.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question.description}</p>

              {question.examples.length > 0 && (
                <div className="mt-3 space-y-1 rounded-xl bg-muted/50 p-3 text-xs font-mono">
                  {question.examples.map((ex, i) => (
                    <p key={i}>
                      <span className="text-muted-foreground">in:</span> {ex.input} <span className="text-muted-foreground">→ out:</span> {ex.output}
                    </p>
                  ))}
                </div>
              )}

              {question.constraints.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                  {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              )}

              <CodeEditor value={code} onChange={setCode} className="mt-4 h-56" />

              <button
                onClick={submit}
                disabled={submitting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
                {submitting ? "Judging..." : "Submit"}
              </button>

              {feedback && (
                <div
                  className={`mt-3 rounded-xl border p-3 text-sm ${
                    feedback.passed
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                      : "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {feedback.passed
                    ? `Passed all ${feedback.testsTotal} tests! Moving to the next question.`
                    : `${feedback.testsPassed}/${feedback.testsTotal} tests passed. ${feedback.error ?? ""}`}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Planet theme="violet" size="sm">
                <span className="text-[10px] font-bold">{initials(room.me?.name ?? "You")}</span>
              </Planet>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You</p>
                <p className="text-lg font-semibold">{room.me?.name}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Solved {room.me?.solvedCount}/{room.totalQuestions}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Planet theme="amber" size="sm">
                <span className="text-[10px] font-bold">{initials(room.opponent?.name ?? "Opponent")}</span>
              </Planet>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opponent</p>
                <p className="text-lg font-semibold">{room.opponent?.name ?? "Waiting..."}</p>
              </div>
            </div>
            {room.opponent && (
              <>
                <p className="mt-2 text-sm text-muted-foreground">Solved {room.opponent.solvedCount}/{room.totalQuestions}</p>
                {room.opponent.lastTestsTotal !== null && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last attempt: {room.opponent.lastTestsPassed}/{room.opponent.lastTestsTotal} tests passed
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Compare Approaches ──────────────────────────────────────────────
// Post-match only (room.replay is null until status === "finished").
// Reruns both players' final code against the same sample input, client-
// side, and shows how much actual work each one did — the differentiator
// this feature was built around: not just who passed, but *how*.

function CompareApproaches({ replay, myUserId }: { replay: ReplayData; myUserId: string }) {
  const byQuestion = new Map<number, { title: string; input: unknown[]; mine?: ReplayData["submissions"][number]; theirs?: ReplayData["submissions"][number] }>()
  for (const sample of replay.sampleInputs) {
    byQuestion.set(sample.questionIndex, { title: sample.title, input: sample.input })
  }
  for (const sub of replay.submissions) {
    const entry = byQuestion.get(sub.questionIndex)
    if (!entry) continue
    if (sub.userId === myUserId) entry.mine = sub
    else entry.theirs = sub
  }

  const comparable = Array.from(byQuestion.entries()).filter(([, v]) => v.mine && v.theirs)
  if (comparable.length === 0) return null

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold">Compare Approaches</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Both of you attempted these — see how much work each solution actually does on the same input, not just whether it passed.
      </p>
      <div className="mt-4 space-y-3">
        {comparable.map(([questionIndex, entry]) => (
          <QuestionCompareCard key={questionIndex} title={entry.title} input={entry.input} mine={entry.mine!} theirs={entry.theirs!} />
        ))}
      </div>
    </div>
  )
}

function QuestionCompareCard({
  title,
  input,
  mine,
  theirs,
}: {
  title: string
  input: unknown[]
  mine: ReplayData["submissions"][number]
  theirs: ReplayData["submissions"][number]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mineResult, setMineResult] = useState<{ ops: OpCounts; output: string | null; error: string | null } | null>(null)
  const [theirsResult, setTheirsResult] = useState<{ ops: OpCounts; output: string | null; error: string | null } | null>(null)
  const [showCode, setShowCode] = useState<"mine" | "theirs" | null>(null)

  const runComparison = async () => {
    if (mineResult && theirsResult) return // already ran once — don't re-run on every expand
    setLoading(true)
    try {
      const [a, b] = await Promise.all([runReplay(mine.code, input), runReplay(theirs.code, input)])
      setMineResult(a)
      setTheirsResult(b)
    } finally {
      setLoading(false)
    }
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) void runComparison()
  }

  const totalOps = (o: OpCounts) => o.comparisons + o.loopIterations
  const moreEfficient =
    mineResult && theirsResult && !mineResult.error && !theirsResult.error
      ? totalOps(mineResult.ops) === totalOps(theirsResult.ops)
        ? "tie"
        : totalOps(mineResult.ops) < totalOps(theirsResult.ops)
          ? "mine"
          : "theirs"
      : null

  return (
    <div className="rounded-xl border border-violet-500/15">
      <button onClick={toggle} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold">
        {title}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-violet-500/10 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            </div>
          ) : mineResult && theirsResult ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "You", result: mineResult, key: "mine" as const },
                  { label: "Opponent", result: theirsResult, key: "theirs" as const },
                ].map(({ label, result, key }) => (
                  <div
                    key={key}
                    className={`rounded-lg border p-3 text-xs ${
                      moreEfficient === key ? "border-emerald-500/30 bg-emerald-500/5" : "border-violet-500/10"
                    }`}
                  >
                    <p className="font-semibold">{label}</p>
                    {result.error ? (
                      <p className="mt-1 text-rose-600 dark:text-rose-300">{result.error}</p>
                    ) : (
                      <ul className="mt-1 space-y-0.5 text-muted-foreground">
                        <li>Comparisons: <strong className="text-foreground">{result.ops.comparisons}</strong></li>
                        <li>Loop iterations: <strong className="text-foreground">{result.ops.loopIterations}</strong></li>
                        {result.ops.calls > 0 && <li>Recursive calls: <strong className="text-foreground">{result.ops.calls}</strong></li>}
                      </ul>
                    )}
                    <button
                      onClick={() => setShowCode(showCode === key ? null : key)}
                      className="mt-2 text-[11px] font-semibold text-violet-600 hover:underline dark:text-violet-300"
                    >
                      {showCode === key ? "Hide code" : "View code"}
                    </button>
                    {showCode === key && (
                      <pre className="mt-2 max-h-40 overflow-auto rounded bg-neutral-950 p-2 text-[11px] text-emerald-300">{key === "mine" ? mine.code : theirs.code}</pre>
                    )}
                  </div>
                ))}
              </div>
              {moreEfficient && moreEfficient !== "tie" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {moreEfficient === "mine" ? "Your" : "Their"} approach did less work on this input — that's a hint about algorithmic
                  efficiency, not a formal proof (one input can't confirm Big-O), but a wide gap like this usually means a real
                  difference in approach (e.g. a hashmap vs. nested loops).
                </p>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
