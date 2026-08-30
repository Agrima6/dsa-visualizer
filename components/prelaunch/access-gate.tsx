"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { MoveRight, Sparkles, Lock, Zap, Eye, Users } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/global/mode-toggle"
import InteractiveDots from "@/components/interactive-dots"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { GatePanel } from "@/components/prelaunch/gate-panel"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { TOPICS } from "@/lib/visualizer-topics"

const topics = TOPICS.map((t) => t.name)
const marqueeTopics = [...topics, ...topics]

const features = [
  {
    icon: Eye,
    title: "See it happen",
    desc: "Every insert, rotation, and traversal animated frame by frame — not just diagrams in a slide deck.",
  },
  {
    icon: Zap,
    title: "Learn at speed",
    desc: "Step through operations, rewind, replay. Build the intuition that sticks before an interview.",
  },
  {
    icon: Users,
    title: "Built for interviews",
    desc: "The exact DSA topics asked at Google, Amazon, and Microsoft — visualized end to end.",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

export function AccessGate() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("redirect_url")) setOpen(true)
  }, [searchParams])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <InteractiveDots />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pb-6 pt-4 sm:px-10 sm:pb-10 sm:pt-6">
        {/* Minimal top bar */}
        <header className="sticky top-5 z-50 mx-auto flex w-full max-w-[1600px] items-center justify-between rounded-2xl border border-violet-500/10 bg-background/70 px-5 py-3 backdrop-blur-xl">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight hero-gradient-text">AlgoMaitri</span>
            <span className="hidden md:block text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              Pre-Launch
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-xl border-violet-500/20"
            >
              Enter
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="hero-orb hero-orb-one" />
            <div className="hero-orb hero-orb-two" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hero-badge"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Invite-only pre-launch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
            className="hero-title-glow hero-gradient-text max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl"
          >
            DSA, visualized.
            <br />
            Coming Soon.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: "easeOut" }}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            AlgoMaitri turns data structures and algorithms into animations you actually remember.
            We&apos;re opening the doors to a handful of people before anyone else gets in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 pt-2 sm:flex-row"
          >
            <RainbowButton
              onClick={() => setOpen(true)}
              className="min-w-[200px] gap-3 rounded-2xl px-7 py-6 text-base shadow-[0_10px_30px_rgba(139,92,246,0.18)]"
            >
              Get Early Access <MoveRight className="h-4 w-4" />
            </RainbowButton>
            <a
              href="#inside"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              See what&apos;s inside ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="topics-marquee-wrap mt-6 w-full max-w-3xl"
          >
            <div className="topics-marquee-track" style={{ animation: "marquee 20s linear infinite" }}>
              {marqueeTopics.map((topic, i) => (
                <div key={`${topic}-${i}`} className="topics-marquee-pill">
                  <span className="topics-marquee-dot" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Feature strip */}
        <section id="inside" className="mx-auto w-full max-w-5xl py-16 md:py-24">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              What&apos;s inside
            </div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Not a demo. The real product.
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="topic-chip group flex flex-col gap-3 rounded-2xl !p-6 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 transition group-hover:scale-110">
                  <f.icon className="h-5 w-5 text-violet-500" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Exclusivity strip */}
        <section className="mx-auto w-full max-w-4xl py-8 md:py-16">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl border border-violet-500/10 bg-gradient-to-b from-muted/60 to-muted p-10 text-center md:p-16"
          >
            <div className="absolute -left-1/4 -top-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
            <div className="absolute -right-1/4 -bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl" />

            <div className="relative flex flex-col items-center gap-5">
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Ready when you are.
              </h2>
              <p className="max-w-lg text-muted-foreground">
                Access is invite-only for now. Have a password? Enter it below — otherwise join the waitlist and we&apos;ll email you when you're in.
              </p>
              <RainbowButton
                onClick={() => setOpen(true)}
                className="mt-2 min-w-[200px] gap-3 rounded-2xl px-7 py-6 text-base"
              >
                Get Early Access <MoveRight className="h-4 w-4" />
              </RainbowButton>
              <p className="text-xs text-muted-foreground">No spam. Just a heads-up the moment early access opens.</p>
            </div>
          </motion.div>
        </section>

        <footer className="mx-auto mt-4 w-full max-w-5xl py-6 text-center text-xs text-muted-foreground">
          © 2026 AlgoMaitri — invite-only pre-launch
        </footer>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl border-violet-500/10 bg-background/90 p-8 backdrop-blur-2xl">
          <VisuallyHidden>
            <DialogTitle>Early access</DialogTitle>
            <DialogDescription>Verify your email to enter AlgoMaitri.</DialogDescription>
          </VisuallyHidden>
          <GatePanel onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  )
}
