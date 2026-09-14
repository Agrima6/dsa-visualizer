import { getRedis } from "@/lib/redis"

// Simple Redis-backed feedback inbox — the "no visible way for a confused
// or frustrated user to reach you" gap from the pre-launch audit. No new
// third-party account needed (unlike a real support-email service): this
// reuses the same Redis already used for pre-registrations, and surfaces
// submissions in /superadmin instead of emailing them.
const LIST_KEY = "feedback:entries"
const MAX_ENTRIES = 500 // bounded so this can't grow forever

export interface FeedbackEntry {
  id: string
  message: string
  email: string | null
  userId: string | null
  page: string | null
  createdAt: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE_LENGTH = 2000

export function isValidFeedbackMessage(message: unknown): message is string {
  return typeof message === "string" && message.trim().length > 0 && message.length <= MAX_MESSAGE_LENGTH
}

export function isValidOptionalEmail(email: unknown): email is string | null {
  if (email === null || email === undefined || email === "") return true
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email)
}

export async function addFeedback(entry: {
  message: string
  email: string | null
  userId: string | null
  page: string | null
}): Promise<FeedbackEntry> {
  const redis = getRedis()
  const full: FeedbackEntry = {
    id: crypto.randomUUID(),
    message: entry.message.trim(),
    email: entry.email?.trim().toLowerCase() || null,
    userId: entry.userId,
    page: entry.page?.slice(0, 200) || null,
    createdAt: Date.now(),
  }
  await redis.lpush(LIST_KEY, JSON.stringify(full))
  await redis.ltrim(LIST_KEY, 0, MAX_ENTRIES - 1) // newest first — trims the oldest off the tail
  return full
}

/** Most recent feedback first. */
export async function listFeedback(): Promise<FeedbackEntry[]> {
  const redis = getRedis()
  const raw = await redis.lrange(LIST_KEY, 0, -1)
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r)) as FeedbackEntry[]
}
