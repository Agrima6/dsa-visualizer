"use client"

import { motion, useScroll, useSpring } from "framer-motion"

// A thin gradient bar pinned to the top of the viewport that fills as the
// visitor scrolls — a small, persistent sense of "how far through this
// page/chapter am I", consistent everywhere since it lives in the root
// layout rather than being re-implemented per page.
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500"
    />
  )
}
