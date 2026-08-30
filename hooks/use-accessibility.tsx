"use client"
// hooks/use-accessibility.tsx
//
// Site-wide accessibility preferences: reduced motion, high contrast,
// keyboard-first focus rings, and narration transcripts. Persisted to
// localStorage (per-browser, not per-account — these are viewing
// preferences, not user data) and applied as data-* attributes on <html>,
// which app/globals.css hooks into.

import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react"

export interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  keyboardMode: boolean
  transcriptsEnabled: boolean
}

const DEFAULTS: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  keyboardMode: false,
  transcriptsEnabled: false,
}

const STORAGE_KEY = "algomaitri-a11y-settings"

interface Ctx extends AccessibilitySettings {
  setSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
}

const AccessibilityContext = createContext<Ctx | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted settings, and default reducedMotion on for anyone whose
  // OS already asks for it — never override an explicit stored preference.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
      } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setSettings((prev) => ({ ...prev, reducedMotion: true }))
      }
    } catch {
      // localStorage can throw in private-browsing contexts — settings just
      // fall back to defaults for that session.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Non-fatal — the preference just won't survive a reload.
    }
    const root = document.documentElement
    root.setAttribute("data-reduced-motion", String(settings.reducedMotion))
    root.setAttribute("data-high-contrast", String(settings.highContrast))
    root.setAttribute("data-keyboard-mode", String(settings.keyboardMode))
  }, [settings, hydrated])

  const setSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <AccessibilityContext.Provider value={{ ...settings, setSetting }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider")
  return ctx
}
