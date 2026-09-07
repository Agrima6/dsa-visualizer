import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { createRoom } from "@/lib/battle/store"
import { BATTLE_PROBLEMS } from "@/lib/battle/problems"
import type { BattleConfig, BattleDifficulty } from "@/lib/battle/types"

const DIFFICULTIES = new Set(["Easy", "Medium", "Hard", "Mixed"])
const VALID_TOPICS = new Set(BATTLE_PROBLEMS.map((p) => p.topic))
const MIN_QUESTIONS = 1
const MAX_QUESTIONS = 10
const MIN_TIME_SECONDS = 60
const MAX_TIME_SECONDS = 60 * 60

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in to start a battle." }, { status: 401 })

  const ip = getClientIp(req)
  const { allowed } = await rateLimit(`battle-create:${ip}`, 10, 60_000)
  if (!allowed) return NextResponse.json({ error: "Too many battles created. Try again shortly." }, { status: 429 })

  const body = await req.json().catch(() => null)
  const difficulty = body?.difficulty
  const topics = Array.isArray(body?.topics) ? body.topics : []
  const numQuestions = Number(body?.numQuestions)
  const timeLimitSeconds = Number(body?.timeLimitSeconds)

  if (!DIFFICULTIES.has(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 })
  }
  if (!topics.every((t: unknown) => typeof t === "string" && VALID_TOPICS.has(t))) {
    return NextResponse.json({ error: "Invalid topic selection." }, { status: 400 })
  }
  if (!Number.isInteger(numQuestions) || numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
    return NextResponse.json({ error: `Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.` }, { status: 400 })
  }
  if (!Number.isInteger(timeLimitSeconds) || timeLimitSeconds < MIN_TIME_SECONDS || timeLimitSeconds > MAX_TIME_SECONDS) {
    return NextResponse.json({ error: "Time limit must be between 1 and 60 minutes." }, { status: 400 })
  }

  const user = await currentUser()
  const hostName = user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress.split("@")[0] || "Player"

  const config: BattleConfig = { difficulty: difficulty as BattleDifficulty, topics, numQuestions, timeLimitSeconds }
  const room = await createRoom(userId, hostName, config)

  return NextResponse.json({ roomId: room.id })
}
