import { NextRequest } from "next/server"
import { rateLimit, consumeQuota, getClientIp } from "@/lib/rate-limit"

// Auth here is the pre-launch gate-password cookie enforced globally by
// middleware.ts for every non-public route — not Clerk. Narration is used
// by anyone who's passed the gate, whether or not they have a Clerk
// account, so this route intentionally doesn't require a Clerk session.
//
// Because of that shared-password model there's no per-user identity to
// quota against, so this endpoint is rate-limited per IP (a normal user
// narrating visualizations will never come close to these numbers) plus a
// site-wide daily cap, since ElevenLabs billing is per character regardless
// of who's calling it — a single abusive IP or a leaked gate password could
// otherwise run up real cost with no ceiling at all.
const MAX_TEXT_LENGTH = 500
const PER_IP_LIMIT = 30 // requests per minute
const PER_IP_WINDOW_MS = 60_000
const GLOBAL_DAILY_CHAR_BUDGET = 200_000 // ElevenLabs is billed per character
const FETCH_TIMEOUT_MS = 15_000

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { allowed: withinIpLimit } = await rateLimit(`tts:${ip}`, PER_IP_LIMIT, PER_IP_WINDOW_MS)
    if (!withinIpLimit) {
      return Response.json({ error: "Too many narration requests. Try again in a minute." }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    const text = body?.text

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return Response.json(
        { error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.` },
        { status: 400 }
      )
    }

    // Site-wide daily character budget, shared across every visitor behind
    // the gate password — ElevenLabs bills per character regardless of who
    // triggered it, so this caps worst-case daily spend independent of the
    // per-IP request limit above.
    const dailyKey = `tts-global:${new Date().toISOString().slice(0, 10)}`
    const { allowed: withinDailyBudget } = await consumeQuota(dailyKey, text.length, GLOBAL_DAILY_CHAR_BUDGET, 24 * 60 * 60 * 1000)
    if (!withinDailyBudget) {
      return Response.json(
        { error: "Narration is temporarily unavailable — daily limit reached. Try again tomorrow." },
        { status: 429 }
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.15,
              use_speaker_boost: true,
            },
          }),
          signal: controller.signal,
        }
      )
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return Response.json({ error: "Narration timed out. Try again." }, { status: 504 })
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      // Log the real provider error server-side for debugging, but never
      // forward it to the client — it can leak account/quota details.
      const errText = await response.text().catch(() => "")
      console.error("ELEVENLABS API ERROR:", response.status, errText)

      return Response.json({ error: "Narration is temporarily unavailable." }, { status: 502 })
    }

    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    })
  } catch (error) {
    console.error("TTS ROUTE ERROR:", error)
    return Response.json({ error: "Failed to generate narration" }, { status: 500 })
  }
}
