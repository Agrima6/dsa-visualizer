import { getRedis } from "@/lib/redis"

const memoryBuckets = new Map<string, number[]>()

function memoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (memoryBuckets.get(key) ?? []).filter((t) => now - t < windowMs)
  hits.push(now)
  memoryBuckets.set(key, hits)
  return { allowed: hits.length <= limit, remaining: Math.max(0, limit - hits.length) }
}

let redisAvailable: boolean | null = null

function hasRedisConfigured() {
  if (redisAvailable !== null) return redisAvailable
  redisAvailable = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  return redisAvailable
}

/**
 * Fixed-window limiter backed by Upstash Redis, so limits actually hold
 * across serverless instances and survive restarts/redeploys — an
 * in-memory Map (the previous implementation) resets per instance, which
 * on a multi-instance deployment means the real limit is `limit * instance
 * count`, not `limit`.
 *
 * Falls back to the old in-memory behavior if Redis isn't configured
 * (e.g. local dev without Upstash env vars set), so nothing breaks —
 * it just loses the cross-instance guarantee in that case.
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  if (!hasRedisConfigured()) {
    return memoryRateLimit(key, limit, windowMs)
  }

  try {
    const redis = getRedis()
    const windowId = Math.floor(Date.now() / windowMs)
    const redisKey = `ratelimit:${key}:${windowId}`

    const count = await redis.incr(redisKey)
    if (count === 1) {
      // Only the first hit in a window needs to set the expiry.
      await redis.expire(redisKey, Math.ceil(windowMs / 1000))
    }

    return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
  } catch (err) {
    // Redis being unreachable shouldn't take down the endpoint it's
    // protecting — fail open via the in-memory fallback instead.
    console.error("rateLimit: Redis error, falling back to in-memory:", err)
    return memoryRateLimit(key, limit, windowMs)
  }
}

function memoryConsumeQuota(key: string, amount: number, limit: number, windowMs: number) {
  const now = Date.now()
  const bucketKey = `quota:${key}:${Math.floor(now / windowMs)}`
  const current = (memoryBuckets.get(bucketKey)?.[0] ?? 0) + amount
  memoryBuckets.set(bucketKey, [current])
  return { allowed: current <= limit, remaining: Math.max(0, limit - current) }
}

/**
 * Like rateLimit, but increments by an arbitrary `amount` instead of always
 * by 1 — for quotas measured in something other than request count (e.g.
 * ElevenLabs characters billed, not requests made).
 */
export async function consumeQuota(key: string, amount: number, limit: number, windowMs: number) {
  if (!hasRedisConfigured()) {
    return memoryConsumeQuota(key, amount, limit, windowMs)
  }

  try {
    const redis = getRedis()
    const windowId = Math.floor(Date.now() / windowMs)
    const redisKey = `quota:${key}:${windowId}`

    const total = await redis.incrby(redisKey, amount)
    if (total === amount) {
      await redis.expire(redisKey, Math.ceil(windowMs / 1000))
    }

    return { allowed: total <= limit, remaining: Math.max(0, limit - total) }
  } catch (err) {
    console.error("consumeQuota: Redis error, falling back to in-memory:", err)
    return memoryConsumeQuota(key, amount, limit, windowMs)
  }
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
}
