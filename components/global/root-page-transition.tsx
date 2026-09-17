"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { pageFade } from "@/lib/motion/transitions"

// Routes below have their own persistent chrome (a sidebar, breadcrumbs)
// managed by app/(app)/layout.tsx, which animates only its inner content
// via AppContentTransition — fading this outer wrapper too would also
// fade/remount that sidebar on every click inside the app shell, which
// reads as a flicker rather than a transition. Everything else (the
// marketing/dashboard/legal pages, which don't share a persistent layout)
// gets the full-page fade here instead.
const APP_SHELL_PREFIXES = ["/visualizer", "/learning-paths", "/company-questions"]

export function RootPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAppShell = APP_SHELL_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  if (isAppShell) {
    return <>{children}</>
  }

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
