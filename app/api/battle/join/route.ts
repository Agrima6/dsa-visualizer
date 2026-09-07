import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { joinRoom, toRoomView } from "@/lib/battle/store"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Sign in to join a battle." }, { status: 401 })

  const body = await req.json().catch(() => null)
  const roomId = typeof body?.roomId === "string" ? body.roomId.trim().toUpperCase() : ""
  if (!roomId) return NextResponse.json({ error: "A room code is required." }, { status: 400 })

  const user = await currentUser()
  const name = user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress.split("@")[0] || "Player"

  const result = await joinRoom(roomId, userId, name)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  return NextResponse.json({ room: toRoomView(result.room, userId) })
}
