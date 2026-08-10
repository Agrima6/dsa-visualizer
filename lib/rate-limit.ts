const buckets = new Map<string, number[]>()

/**
 * In-memory sliding-window limiter, scoped to a single server instance.
 * Fine for a low-traffic single-deployment app; swap for a shared store
 * (e.g. Upstash Redis) if this ever runs across multiple instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  hits.push(now)
  buckets.set(key, hits)
  return { allowed: hits.length <= limit, remaining: Math.max(0, limit - hits.length) }
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
}
