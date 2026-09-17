"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { pageFade } from "@/lib/motion/transitions"

// Used inside app/(app)/layout.tsx's <main>, scoped to just the page
// content — the sidebar and breadcrumbs live outside this wrapper and
// stay put, so moving between visualizer topics feels like turning a
// page in the same book rather than reloading a new app.
export function AppContentTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={pageFade.initial}
        animate={pageFade.animate}
        exit={pageFade.exit}
        transition={pageFade.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
