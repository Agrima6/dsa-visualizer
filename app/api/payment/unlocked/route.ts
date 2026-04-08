import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ unlockedTopics: [] })

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const unlockedTopics = (user.privateMetadata?.unlockedTopics as string[]) || []

  return NextResponse.json({ unlockedTopics })
}