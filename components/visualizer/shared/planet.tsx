"use client"

import { motion } from "framer-motion"

export type PlanetTheme = "violet" | "blue" | "amber"

// Each topic's icon badge is styled as a small planet — a shaded sphere,
// a tilted ring, and a tiny orbiting moon — instead of a plain rounded
// square, to carry the "DSA universe, one world per topic" framing down
// into the smallest recurring UI piece rather than just the page copy.
const THEMES: Record<PlanetTheme, { sphere: string; ring: string; glow: string; moon: string }> = {
  violet: {
    sphere: "bg-[radial-gradient(circle_at_32%_28%,#c4b5fd,#8b5cf6_55%,#5b21b6_100%)]",
    ring: "border-violet-300/50",
    glow: "bg-violet-500/30",
    moon: "bg-violet-200",
  },
  blue: {
    sphere: "bg-[radial-gradient(circle_at_32%_28%,#bae6fd,#3b82f6_55%,#1e3a8a_100%)]",
    ring: "border-blue-300/50",
    glow: "bg-blue-500/30",
    moon: "bg-blue-200",
  },
  amber: {
    sphere: "bg-[radial-gradient(circle_at_32%_28%,#fde68a,#f59e0b_55%,#92400e_100%)]",
    ring: "border-amber-300/50",
    glow: "bg-amber-500/30",
    moon: "bg-amber-200",
  },
}

const SIZES = {
  md: { wrap: "h-12 w-12", ring: "h-[46px] w-[46px]", sphere: "h-9 w-9", moon: "h-1.5 w-1.5" },
  sm: { wrap: "h-8 w-8", ring: "h-[31px] w-[31px]", sphere: "h-6 w-6", moon: "h-1 w-1" },
} as const

interface PlanetProps {
  theme: PlanetTheme
  children: React.ReactNode
  size?: keyof typeof SIZES
}

export function Planet({ theme, children, size = "md" }: PlanetProps) {
  const t = THEMES[theme]
  const s = SIZES[size]

  return (
    <div className={`relative flex shrink-0 items-center justify-center ${s.wrap}`}>
      {/* Glow */}
      <div className={`absolute inset-0 -z-10 rounded-full blur-md transition-opacity duration-300 ${t.glow} opacity-60 group-hover:opacity-100`} />

      {/* Tilted ring — a static ellipse, purely decorative */}
      <div className={`absolute ${s.ring}`} style={{ transform: "scaleY(0.42) rotate(-18deg)" }}>
        <div className={`h-full w-full rounded-full border ${t.ring}`} />
      </div>

      {/* A tiny moon sweeping around the planet. Its own wrapper carries
          only the rotate animation — keeping the static ellipse tilt above
          on a separate, unanimated element avoids framer-motion dropping
          one of the two transforms if they were combined on one node. */}
      <motion.div
        className={`absolute ${s.ring}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      >
        <span className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-full shadow-sm ${t.moon} ${s.moon}`} />
      </motion.div>

      {/* The planet itself */}
      <div className={`relative flex items-center justify-center rounded-full text-white shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 ${t.sphere} ${s.sphere}`}>
        {children}
      </div>
    </div>
  )
}
