const audioCache = new Map<string, string>()

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
  try {
    const audioUrl =
      await generateNarration(text)

    if (!audioUrl) return

    return new Promise<void>((resolve) => {
      const audio = new Audio(audioUrl)

      audio.volume = 1

      audio.onended = () => {
        resolve()
      }

      audio.onerror = (e) => {
        console.error(
          "Audio playback failed:",
          e
        )

        resolve()
      }

      audio.play().catch((err) => {
        console.error(
          "Audio play failed:",
          err
        )

        resolve()
      })
    })
  } catch (error) {
    console.error(error)
  }
}