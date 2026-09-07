import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { checkAndFinishIfTimeUp, currentPublicQuestion, toRoomView } from "@/lib/battle/store"

// Polled every ~1.5s by the battle page (see the "Realtime layer" choice
// for this feature: Redis + polling, not a live socket connection — no
// new infrastructure needed, and a couple seconds of lag is fine for a
// game paced in minutes, not milliseconds).
export async function GET(_req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 })

  const { roomId } = await params
  const room = await checkAndFinishIfTimeUp(roomId.toUpperCase())
  if (!room) return NextResponse.json({ error: "Battle not found." }, { status: 404 })

  if (!room.players[userId]) {
    return NextResponse.json({ error: "You're not a player in this battle." }, { status: 403 })
  }

  return NextResponse.json({
    room: toRoomView(room, userId),
    question: currentPublicQuestion(room, userId),
  })
}
