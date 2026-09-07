import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { getRoom, recordSubmission, toRoomView } from "@/lib/battle/store"
import { getBattleProblem } from "@/lib/battle/problems"
import { judgeSubmission, toSubmission } from "@/lib/battle/judge"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 })

  const ip = getClientIp(req)
  // Judging shells out to a third-party service per call — rate-limit
  // per player so one person can't hammer Piston (or run up the other
  // rate limits it has) by spamming Submit.
  const { allowed } = await rateLimit(`battle-submit:${userId}:${ip}`, 15, 60_000)
  if (!allowed) return NextResponse.json({ error: "Slow down — too many submissions." }, { status: 429 })

  const body = await req.json().catch(() => null)
  const roomId = typeof body?.roomId === "string" ? body.roomId.toUpperCase() : ""
  const code = typeof body?.code === "string" ? body.code : ""
  if (!roomId || !code) return NextResponse.json({ error: "roomId and code are required." }, { status: 400 })

  const room = await getRoom(roomId)
  if (!room) return NextResponse.json({ error: "Battle not found." }, { status: 404 })
  const player = room.players[userId]
  if (!player) return NextResponse.json({ error: "You're not a player in this battle." }, { status: 403 })
  if (room.status !== "active") return NextResponse.json({ error: "This battle isn't active." }, { status: 400 })

  const slug = room.questionSlugs[player.currentQuestion]
  const problem = slug ? getBattleProblem(slug) : undefined
  if (!problem) return NextResponse.json({ error: "No current question." }, { status: 400 })

  // The judge call (a network round-trip to Piston) happens before we
  // touch room state at all, so a slow/failed judge call can't leave the
  // room half-updated.
  const judged = await judgeSubmission(problem, code)
  const submission = toSubmission(player.currentQuestion, judged, code)

  const result = await recordSubmission(roomId, userId, player.currentQuestion, submission)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  return NextResponse.json({
    submission,
    room: toRoomView(result.room, userId),
  })
}
