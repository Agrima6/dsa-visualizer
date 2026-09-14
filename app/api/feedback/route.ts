import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { addFeedback, isValidFeedbackMessage, isValidOptionalEmail, listFeedback } from "@/lib/feedback"
import { isCurrentUserAdmin } from "@/lib/admin"

/**
 * POST /api/feedback — public (works whether signed in or not; a visitor
 * frustrated enough to leave feedback shouldn't have to sign in first).
 * Rate-limited per IP like /api/prereg.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed } = await rateLimit(`feedback:${ip}`, 5, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Try again shortly." }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const message = body?.message
  const email = body?.email ?? null
  const page = typeof body?.page === "string" ? body.page : null

  if (!isValidFeedbackMessage(message)) {
    return NextResponse.json({ error: "Enter a message first." }, { status: 400 })
  }
  if (!isValidOptionalEmail(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 })
  }

  const { userId } = await auth()

  try {
    await addFeedback({ message, email, userId: userId ?? null, page })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("feedback POST failed:", err)
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 500 })
  }
}

/** GET /api/feedback — admin-only, for the /superadmin dashboard. */
export async function GET() {
  const admin = await isCurrentUserAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const entries = await listFeedback()
    return NextResponse.json({ entries })
  } catch (err) {
    console.error("feedback GET failed:", err)
    return NextResponse.json({ error: "Failed to load feedback." }, { status: 500 })
  }
}
