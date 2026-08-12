import { NextRequest } from "next/server"

// Auth here is the pre-launch gate-password cookie enforced globally by
// middleware.ts for every non-public route — not Clerk. Narration is used
// by anyone who's passed the gate, whether or not they have a Clerk
// account, so this route intentionally doesn't require a Clerk session.
const MAX_TEXT_LENGTH = 500

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text = body.text

    if (!text || typeof text !== "string") {
      return Response.json(
        {
          error: "Text is required",
        },
        {
          status: 400,
        }
      )
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return Response.json(
        {
          error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`,
        },
        {
          status: 400,
        }
      )
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key":
            process.env.ELEVENLABS_API_KEY || "",

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
      }
    )

    // ✅ HANDLE API ERRORS
    if (!response.ok) {
      const errText = await response.text()

      console.error(
        "ELEVENLABS API ERROR:",
        errText
      )

      return Response.json(
        {
          error: errText,
        },
        {
          status: 500,
        }
      )
    }

    const audioBuffer =
      await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("TTS ROUTE ERROR:", error)

    return Response.json(
      {
        error: "Failed to generate narration",
      },
      {
        status: 500,
      }
    )
  }
}