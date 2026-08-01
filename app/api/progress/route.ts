import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const authData = await auth()
  if (!authData.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { userId, progress } = body as { userId?: string; progress?: unknown }

  if (!userId || userId !== authData.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!progress || typeof progress !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 })
  }

  const client = await clerkClient()
  const existingUser = await client.users.getUser(userId)
  const unsafeMetadata = { ...existingUser.unsafeMetadata, progress }

  await client.users.updateUser(userId, { unsafeMetadata })

  return NextResponse.json({ success: true })
}
