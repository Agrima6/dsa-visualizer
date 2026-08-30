import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { addPreregistration, listPreregistrations, isValidEmail } from "@/lib/preregister"
import { isCurrentUserAdmin } from "@/lib/admin"

/**
 * POST /api/prereg — public. Anyone can join the pre-registration waitlist
 * with just an email, no password or account required. Rate-limited per IP
 * to keep it from being used to spam the Redis store.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed: withinLimit } = rateLimit(`prereg:${ip}`, 5, 60_000)
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const email = body?.email

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  try {
    const { created } = await addPreregistration(email)
    return NextResponse.json({ ok: true, alreadyRegistered: !created })
  } catch (err) {
    console.error("prereg POST failed:", err)
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 500 })
  }
}

/**
 * GET /api/prereg — admin-only. Returns every pre-registered email, newest
 * first, for the /superadmin dashboard.
 */
export async function GET() {
  const admin = await isCurrentUserAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await listPreregistrations()
    return NextResponse.json({ users })
  } catch (err) {
    console.error("prereg GET failed:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
