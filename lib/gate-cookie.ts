export const GATE_COOKIE = "algomaitri_gate"
export const GATE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function getKey() {
  const secret = process.env.GATE_PASSWORD
  if (!secret) throw new Error("GATE_PASSWORD is not set")
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Signs a short-lived-by-expiry token proving the correct gate password was
 * entered, without storing the password itself in the cookie. Keyed off
 * GATE_PASSWORD, so rotating the password invalidates every existing cookie.
 */
export async function signGateToken() {
  const expires = Date.now() + GATE_MAX_AGE * 1000
  const payload = `granted.${expires}`
  const key = await getKey()
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return `${payload}.${toHex(signature)}`
}

export async function verifyGateToken(token: string | undefined | null) {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [marker, expiresRaw, signatureHex] = parts
  if (marker !== "granted") return false

  const expires = Number(expiresRaw)
  if (!Number.isFinite(expires) || Date.now() > expires) return false

  try {
    const key = await getKey()
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${marker}.${expiresRaw}`)
    )
    return timingSafeEqual(toHex(expectedSignature), signatureHex)
  } catch {
    return false
  }
}
