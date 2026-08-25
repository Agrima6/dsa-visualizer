import { BrainCircuit, Sparkles, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { TOPICS, topicsByCategory } from "@/lib/visualizer-topics"

const sections = {
  concepts: topicsByCategory("concepts").map((t) => ({ name: t.name, description: t.description, href: t.href, icon: t.icon })),
  dataStructures: topicsByCategory("dataStructures").map((t) => ({ name: t.name, description: t.description, href: t.href, icon: t.icon })),
  applications: topicsByCategory("applications").map((t) => ({ name: t.name, description: t.description, href: t.href, icon: t.icon })),
}

const stats = [
  { label: "Topics", value: `${TOPICS.length}` },
  { label: "Practice questions", value: "100+" },
  { label: "Companies covered", value: "10+" },
]

function TopicCard({
  name,
  description,
  href,
  icon: Icon,
  accent = false,
}: {
  name: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-200 ${
        accent
          ? "border-violet-500/20 bg-gradient-to-br from-violet-500/8 via-background to-blue-500/8 hover:border-violet-500/40 hover:from-violet-500/12 hover:to-blue-500/12"
          : "border-border/60 bg-card hover:border-violet-500/30 hover:bg-muted/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/10 text-violet-500 transition-colors group-hover:bg-violet-500/20">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative -mx-3 -mt-3 overflow-hidden px-3 pb-10 pt-8 sm:-mx-10 sm:-mt-10 sm:px-10 sm:pt-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute right-1/4 top-10 h-60 w-60 rounded-full bg-blue-500/10 blur-[80px]" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
          <BrainCircuit className="h-3.5 w-3.5" />
          Interactive DSA Visualizer
        </span>

        <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          <span className="hero-gradient-text">Pick a topic,</span>
          <br />
          <span className="text-foreground">watch it run.</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Every data structure and algorithm here is a real, step-by-step animation —
          not a diagram. Explore concepts, core data structures, and classic applications.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold hero-gradient-text">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-14 pb-4">
        {/* Concepts Section */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <h2 className="text-xl font-semibold tracking-tight">Concepts</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {sections.concepts.map((c) => (
              <TopicCard key={c.href} {...c} accent />
            ))}
          </div>
        </section>

        {/* Data Structures Section */}
        <section>
          <h2 className="mb-6 text-xl font-semibold tracking-tight">Data Structures</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sections.dataStructures.map((ds) => (
              <TopicCard key={ds.href} {...ds} />
            ))}
          </div>
        </section>

        {/* Applications Section */}
        <section>
          <h2 className="mb-6 text-xl font-semibold tracking-tight">Applications</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sections.applications.map((app) => (
              <TopicCard key={app.href} {...app} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
