import { Redis } from "@upstash/redis"

/**
 * Shared Upstash Redis client, used as the durable store for data that
 * doesn't belong to any Clerk user yet — pre-registration emails, most
 * notably, since those people haven't created an account (and therefore
 * have no Clerk user metadata to attach data to).
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (from the
 * Upstash console: Database -> REST API section). Throws lazily on first
 * use rather than at import time, so the rest of the app doesn't crash
 * just because this file was imported.
 */
let client: Redis | null = null

export function getRedis(): Redis {
  if (client) return client

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. Create a free database at upstash.com and add both to .env.local."
    )
  }

  client = new Redis({ url, token })
  return client
}
