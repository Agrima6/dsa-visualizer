"use client"

import { motion, type Variants } from "framer-motion"
import { EASE_OUT, REVEAL_DURATION } from "@/lib/motion/transitions"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Horizontal offset instead of the default rise-from-below, for side-by-side story beats. */
  direction?: "up" | "left" | "right"
  as?: "div" | "section"
  onClick?: () => void
}

const OFFSETS: Record<NonNullable<RevealProps["direction"]>, { x?: number; y?: number }> = {
  up: { y: 28 },
  left: { x: -28 },
  right: { x: 28 },
}

// The one scroll-reveal primitive every page should use, so "the site
// tells a story as you scroll" means the same rhythm everywhere instead
// of each page inventing its own reveal timing. Animates once, the first
// time it enters the viewport — re-scrolling past it doesn't re-trigger,
// which reads as calmer than a reveal that fires every time.
export function Reveal({ children, className, delay = 0, direction = "up", as = "div", onClick }: RevealProps) {
  const offset = OFFSETS[direction]
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0 },
  }

  const Component = motion[as]

  return (
    <Component
      className={className}
      onClick={onClick}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: REVEAL_DURATION, delay, ease: EASE_OUT }}
    >
      {children}
    </Component>
  )
}
