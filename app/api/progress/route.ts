import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {
  EMPTY_PROGRESS,
  applyMarkSolved,
  applyMarkMultipleSolved,
  applyUnmarkSolved,
  applySetDailyGoal,
  applyUpdateNotes,
  type UserProgress,
  type ProblemEntry,
} from "@/lib/user-progress"
import { TOPIC_SLUGS } from "@/lib/topics"

const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"])

async function loadProgress(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const raw = user.privateMetadata?.progress as UserProgress | undefined
  const progress: UserProgress = raw
    ? { ...EMPTY_PROGRESS, ...raw }
    : { ...EMPTY_PROGRESS, joinedAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString() }
  return { client, user, progress }
}

async function saveProgress(client: Awaited<ReturnType<typeof clerkClient>>, userId: string, existingMetadata: Record<string, unknown>, progress: UserProgress) {
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...existingMetadata, progress },
  })
}

function isValidEntry(entry: unknown): entry is Omit<ProblemEntry, "solvedAt"> {
  if (!entry || typeof entry !== "object") return false
  const e = entry as Record<string, unknown>
  return (
    typeof e.slug === "string" && e.slug.length > 0 && e.slug.length < 200 &&
    typeof e.title === "string" && e.title.length > 0 && e.title.length < 300 &&
    typeof e.difficulty === "string" && DIFFICULTIES.has(e.difficulty) &&
    typeof e.topic === "string" && TOPIC_SLUGS.has(e.topic)
  )
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { progress } = await loadProgress(userId)
  return NextResponse.json({ progress })
}

/**
 * Every mutation is a small, named action applied server-side to the
 * server's own copy of progress — the client never sends a full "next
 * progress" blob, and xp/streak are always recomputed here, never trusted
 * from the request body. This is what makes progress tamper-resistant:
 * short of a compromised Clerk account, a user cannot set their own XP.
 */
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const action = body?.action

  const { client, user, progress } = await loadProgress(userId)
  let next: UserProgress

  switch (action) {
    case "markSolved": {
      if (!isValidEntry(body?.entry)) {
        return NextResponse.json({ error: "Invalid entry" }, { status: 400 })
      }
      next = applyMarkSolved(progress, body.entry)
      break
    }
    case "markMultipleSolved": {
      const entries = body?.entries
      if (!Array.isArray(entries) || entries.length === 0 || entries.length > 200 || !entries.every(isValidEntry)) {
        return NextResponse.json({ error: "Invalid entries" }, { status: 400 })
      }
      next = applyMarkMultipleSolved(progress, entries)
      break
    }
    case "unmarkSolved": {
      const slug = body?.slug
      if (typeof slug !== "string" || !slug) {
        return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
      }
      next = applyUnmarkSolved(progress, slug)
      break
    }
    case "setDailyGoal": {
      const n = Number(body?.dailyGoal)
      if (!Number.isFinite(n)) {
        return NextResponse.json({ error: "Invalid dailyGoal" }, { status: 400 })
      }
      next = applySetDailyGoal(progress, n)
      break
    }
    case "updateNotes": {
      const slug = body?.slug
      const notes = body?.notes
      if (typeof slug !== "string" || !slug || typeof notes !== "string") {
        return NextResponse.json({ error: "Invalid notes payload" }, { status: 400 })
      }
      next = applyUpdateNotes(progress, slug, notes)
      break
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }

  await saveProgress(client, userId, user.privateMetadata ?? {}, next)
  return NextResponse.json({ progress: next })
}
