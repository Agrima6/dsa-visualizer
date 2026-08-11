"use client"

import { motion } from "framer-motion"
import { COMPLEXITIES } from "./complexity-data"

export function AnalogyCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPLEXITIES.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="rounded-2xl border border-violet-500/10 bg-white/60 p-5 dark:bg-white/[0.02]"
        >
          <span
            className="inline-block rounded-full px-2.5 py-1 font-mono text-xs font-bold"
            style={{ backgroundColor: `${c.color}1a`, color: c.color }}
          >
            {c.notation}
          </span>
          <h3 className="mt-3 font-semibold leading-snug">{c.analogy.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.analogy.text}</p>
          <p className="mt-3 text-xs text-muted-foreground/80">{c.blurb}</p>
        </motion.div>
      ))}
    </div>
  )
}
