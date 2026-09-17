// Shared motion constants so every page transition, scroll reveal, and
// micro-interaction across the site reads as one consistent "voice"
// rather than a pile of one-off tweens. Any new animation should pull
// from here instead of inventing its own easing/duration.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const PAGE_TRANSITION_DURATION = 0.4
export const REVEAL_DURATION = 0.6

export const pageFade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: PAGE_TRANSITION_DURATION, ease: EASE_OUT },
}

export const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}
