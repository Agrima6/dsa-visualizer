/**
 * Encodes a small JSON-serializable object into a URL-safe string (and
 * back), for visualizers that want a "Share" button — e.g. "send someone
 * the exact array/graph/tree you built" as a link that reproduces the
 * same starting state when opened.
 *
 * Deliberately not signed or size-limited beyond what a URL bar tolerates
 * comfortably — this only ever holds the same values a user could type
 * into that visualizer's own inputs (an array, an algorithm choice, graph
 * nodes/edges), so there's no trust boundary being crossed by trusting it.
 */
export function encodeState(value: unknown): string {
  const json = JSON.stringify(value)
  const base64 = typeof window !== "undefined"
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json, "utf-8").toString("base64")
  // URL-safe base64: swap the two characters that aren't allowed unescaped.
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function decodeState<T>(encoded: string): T | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const json = typeof window !== "undefined"
      ? decodeURIComponent(escape(atob(base64)))
      : Buffer.from(base64, "base64").toString("utf-8")
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
