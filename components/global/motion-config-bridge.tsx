"use client"

import { MotionConfig } from "framer-motion"
import { useAccessibility } from "@/hooks/use-accessibility"

/**
 * The CSS override in globals.css (animation-duration: 0.001ms) only
 * catches plain CSS transitions/animations — framer-motion drives most of
 * this codebase's animations via JS (requestAnimationFrame), which that
 * override never touches. MotionConfig's reducedMotion prop is
 * framer-motion's own equivalent, so this bridges our accessibility
 * setting into it for every motion.* component in the tree.
 */
export function MotionConfigBridge({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useAccessibility()
  return <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>{children}</MotionConfig>
}
