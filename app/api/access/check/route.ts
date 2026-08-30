import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { signGateToken, GATE_COOKIE, GATE_MAX_AGE } from "@/lib/gate-cookie"

/**
 * Single-password pre-launch gate. GATE_PASSWORD lives server-side only —
 * never sent to the client. On a correct password we issue a signed,
 * expiring cookie (see lib/gate-cookie.ts) that middleware.ts checks on
 * every request to decide whether the visitor gets past the gate.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed: withinLimit } = await rateLimit(`gate-check:${ip}`, 8, 60_000)
  if (!withinLimit) {
    return NextResponse.json({ allowed: false, error: "Too many attempts. Try again shortly." }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  const expected = process.env.GATE_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ allowed: false, error: "Incorrect password." }, { status: 401 })
  }

  const token = await signGateToken()
  const res = NextResponse.json({ allowed: true })
  res.cookies.set(GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  })
  return res
}
