const audioCache = new Map<string, string>()
let activeAudio: HTMLAudioElement | null = null
let resolveActivePlayback: (() => void) | null = null
let narrationRequestId = 0

// ── Transcript pub-sub ───────────────────────────────────────────
// Every narration line played anywhere in the app gets pushed here too, so
// a <TranscriptPanel /> (or anything else) can subscribe and show a running
// text log — for accessibility-mode users who have narration muted or
// can't rely on audio, and for anyone who wants a scrollback of what a
// visualizer just said.
export interface TranscriptEntry {
  id: number
  text: string
  at: number
}

let transcriptIdCounter = 0
const transcriptSubscribers = new Set<(entry: TranscriptEntry) => void>()

export function subscribeTranscript(fn: (entry: TranscriptEntry) => void) {
  transcriptSubscribers.add(fn)
  return () => {
    transcriptSubscribers.delete(fn)
  }
}

function pushTranscript(text: string) {
  const entry: TranscriptEntry = { id: ++transcriptIdCounter, text, at: Date.now() }
  transcriptSubscribers.forEach((fn) => fn(entry))
}

export function stopNarration() {
  narrationRequestId += 1
  activeAudio?.pause()
  activeAudio = null
  resolveActivePlayback?.()
  resolveActivePlayback = null
}

export async function generateNarration(
  text: string
) {
  if (audioCache.has(text)) {
    return audioCache.get(text)!
  }

  const response = await fetch("/api/tts", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ text }),
  })

  // ✅ HANDLE FAILED RESPONSE
  if (!response.ok) {
    const err = await response.text()

    console.error("TTS ERROR:", err)

    return null
  }

  const blob = await response.blob()

  // ✅ VERIFY AUDIO
  if (!blob.type.includes("audio")) {
    console.error(
      "Invalid audio response:",
      blob.type
    )

    return null
  }

  const audioUrl =
    URL.createObjectURL(blob)

  audioCache.set(text, audioUrl)

  return audioUrl
}

export async function playNarration(
  text: string
) {
  pushTranscript(text)
  try {
    const requestId = ++narrationRequestId
    const audioUrl =
      await generateNarration(text)

    // Ignore an out-of-date fetch if the visualizer has already advanced.
    if (!audioUrl || requestId !== narrationRequestId) return

    return new Promise<void>((resolve) => {
      // A visualizer can move to a new step before a previous clip finishes.
      // Stop and resolve that clip so narration never overlaps or multiplies.
      if (activeAudio) stopNarration()
      const audio = new Audio(audioUrl)
      activeAudio = audio
      resolveActivePlayback = resolve

      audio.volume = 1

      audio.onended = () => {
        if (activeAudio === audio) { activeAudio = null; resolveActivePlayback = null }
        resolve()
      }

      audio.onerror = (e) => {
        console.error(
          "Audio playback failed:",
          e
        )

        if (activeAudio === audio) { activeAudio = null; resolveActivePlayback = null }
        resolve()
      }

      audio.play().catch((err) => {
        console.error(
          "Audio play failed:",
          err
        )

        if (activeAudio === audio) { activeAudio = null; resolveActivePlayback = null }
        resolve()
      })
    })
  } catch (error) {
    console.error(error)
  }
}
