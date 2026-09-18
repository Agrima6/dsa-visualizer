"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Loader2, Swords, Sparkles } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { ConstellationBackground } from "@/components/visualizer/shared/constellation-background"

const TOPICS = [
  "Array",
  "String",
  "Recursion",
  "Hashing",
  "Stack",
  "Dynamic Programming",
  "Two Pointers",
  "Sorting",
]
const DIFFICULTIES = ["Mixed", "Easy", "Medium", "Hard"] as const
const QUESTION_COUNTS = [1, 2, 3, 5, 7]
const TIME_LIMITS = [
  { label: "5 min", seconds: 5 * 60 },
  { label: "10 min", seconds: 10 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "20 min", seconds: 20 * 60 },
  { label: "30 min", seconds: 30 * 60 },
]

export default function BattleLobbyPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("Mixed")
  const [topics, setTopics] = useState<string[]>([])
  const [numQuestions, setNumQuestions] = useState(3)
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(10 * 60)
  const [joinCode, setJoinCode] = useState("")
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTopic = (t: string) => {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const create = async () => {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/battle/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, topics, numQuestions, timeLimitSeconds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Could not create battle.")
      router.push(`/visualizer/battle/${data.roomId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setCreating(false)
    }
  }

  const join = async () => {
    if (!joinCode.trim()) return
    setJoining(true)
    setError(null)
    try {
      const res = await fetch("/api/battle/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: joinCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Could not join battle.")
      router.push(`/visualizer/battle/${data.room.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setJoining(false)
    }
  }

  return (
    <div className="relative z-0 container mx-auto max-w-3xl space-y-8">
      <ConstellationBackground />
      <Reveal className="relative overflow-hidden rounded-[32px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm dark:bg-white/[0.05] dark:text-violet-300">
            <Swords className="h-3.5 w-3.5" />
            Code Battle — Two Coders, One Universe
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Duel for the Universe
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Pick a difficulty, topic, question count, and time limit — invite someone with the link
            you get, and whoever solves everything correctly first (or has more solved when time
            runs out) wins.
          </p>
        </div>
      </Reveal>

      <Reveal className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-violet-500" /> Configure a Battle
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                    difficulty === d
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "border-violet-500/15 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Topics <span className="normal-case font-normal">(none selected = any topic)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                    topics.includes(t)
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "border-violet-500/15 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Number of questions</label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`h-9 w-9 rounded-xl border text-sm font-semibold transition ${
                      numQuestions === n
                        ? "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                        : "border-violet-500/15 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time limit</label>
              <div className="flex flex-wrap gap-2">
                {TIME_LIMITS.map((t) => (
                  <button
                    key={t.seconds}
                    onClick={() => setTimeLimitSeconds(t.seconds)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                      timeLimitSeconds === t.seconds
                        ? "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                        : "border-violet-500/15 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={create}
            disabled={creating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
            {creating ? "Creating..." : "Create Battle & Get Invite Link"}
          </button>
        </div>
      </Reveal>

      <Reveal className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]" delay={0.1}>
        <h2 className="mb-3 font-semibold">Have an invite code?</h2>
        <div className="flex gap-3">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="e.g. 7F3K9A"
            className="flex-1 rounded-xl border border-violet-500/15 bg-white/70 px-3 py-2 text-sm font-mono uppercase tracking-widest outline-none focus:border-violet-500/40 dark:bg-white/[0.04]"
          />
          <button
            onClick={join}
            disabled={joining || !joinCode.trim()}
            className="flex items-center gap-2 rounded-xl border border-violet-500/20 px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-60"
          >
            {joining && <Loader2 className="h-4 w-4 animate-spin" />}
            Join
          </button>
        </div>
      </Reveal>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
