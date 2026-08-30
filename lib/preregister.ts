import { getRedis } from "@/lib/redis"

const SORTED_SET_KEY = "prereg:emails" // member = lowercased email, score = registeredAt (ms)

export interface PreregisteredUser {
  email: string
  registeredAt: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email)
}

/**
 * Adds an email to the pre-registration list. Idempotent — re-registering
 * the same (lowercased) email is a no-op rather than an error, and reports
 * back which happened so the caller can show the right message.
 */
export async function addPreregistration(rawEmail: string): Promise<{ created: boolean }> {
  const email = rawEmail.trim().toLowerCase()
  const redis = getRedis()

  const existingScore = await redis.zscore(SORTED_SET_KEY, email)
  if (existingScore !== null && existingScore !== undefined) {
    return { created: false }
  }

  await redis.zadd(SORTED_SET_KEY, { score: Date.now(), member: email })
  return { created: true }
}

/** All pre-registered emails, most recent first. */
export async function listPreregistrations(): Promise<PreregisteredUser[]> {
  const redis = getRedis()
  // withScores + rev: newest (highest score) first
  const raw = await redis.zrange(SORTED_SET_KEY, 0, -1, { withScores: true, rev: true })

  const users: PreregisteredUser[] = []
  for (let i = 0; i < raw.length; i += 2) {
    const email = raw[i] as string
    const registeredAt = Number(raw[i + 1])
    users.push({ email, registeredAt })
  }
  return users
}

export async function countPreregistrations(): Promise<number> {
  const redis = getRedis()
  return redis.zcard(SORTED_SET_KEY)
}
