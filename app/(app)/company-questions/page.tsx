"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Code2, ChevronRight, Flame, Star, Zap } from "lucide-react";

interface Topic {
  title: string;
  questions: number;
  companies: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
  tag?: "Hot" | "Must Do" | "New";
}

interface Company {
  name: string;
  logo: string;
  src?: string;
}

const companies: Company[] = [
  { name: "All", logo: "🌐" },
  { name: "Google", logo: "G", src: "/company-logos/google.svg" },
  { name: "Amazon", logo: "A", src: "/company-logos/amazon.svg" },
  { name: "Microsoft", logo: "M",src: "/company-logos/microsoft.svg" },
  { name: "Meta", logo: "f", src: "/company-logos/meta.svg" },
  { name: "Flipkart", logo: "F",src: "/company-logos/flipkart.svg" },
  { name: "Adobe", logo: "Ai",src: "/company-logos/adobe.svg" },
];

const topics: Topic[] = [
  {
    title: "Arrays",
    questions: 45,
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    difficulty: "Easy",
    url: "/visualizer/array?mode=code",
    tag: "Must Do",
  },
  {
    title: "Sorting",
    questions: 30,
    companies: ["Amazon", "Adobe", "Flipkart"],
    difficulty: "Medium",
    url: "/visualizer/sorting?mode=code",
    tag: "Hot",
  },
  {
    title: "Linked Lists",
    questions: 38,
    companies: ["Google", "Microsoft", "Meta"],
    difficulty: "Medium",
    url: "/visualizer/linked-list?mode=code",
  },
  {
    title: "Stacks",
    questions: 22,
    companies: ["Amazon", "Google", "Flipkart"],
    difficulty: "Easy",
    url: "/visualizer/stack?mode=code",
    tag: "Hot",
  },
  {
    title: "Queues",
    questions: 18,
    companies: ["Microsoft", "Adobe"],
    difficulty: "Easy",
    url: "/visualizer/queue?mode=code",
  },
  {
    title: "Binary Search Trees",
    questions: 40,
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    difficulty: "Hard",
    url: "/visualizer/binary-tree?mode=code",
    tag: "Must Do",
  },
  {
    title: "Heaps",
    questions: 25,
    companies: ["Amazon", "Google"],
    difficulty: "Hard",
    url: "/visualizer/heap?mode=code",
  },
  {
    title: "Graphs",
    questions: 52,
    companies: ["Google", "Meta", "Microsoft", "Amazon"],
    difficulty: "Hard",
    url: "/visualizer/graph?mode=code",
    tag: "Hot",
  },
];

const difficultyConfig = {
  Easy:   { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  Medium: { color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20"   },
  Hard:   { color: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/20"    },
};

const tagConfig = {
  Hot:        { icon: <Flame className="h-3 w-3" />, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  "Must Do":  { icon: <Star  className="h-3 w-3" />, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  New:        { icon: <Zap   className="h-3 w-3" />, color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/20"   },
};

export default function CompanyQuestionsPage() {
  const [activeCompany, setActiveCompany] = useState("All");

  const filtered =
    activeCompany === "All"
      ? topics
      : topics.filter((t) => t.companies.includes(activeCompany));

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-8 pt-0">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute right-1/4 top-10 h-60 w-60 rounded-full bg-indigo-500/15 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-screen-xl px-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
              <Building2 className="h-3.5 w-3.5" />
              Most asked DSA Questions
            </span>
          </div>

          <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            <span className="hero-gradient-text">Crack your</span>
            <br />
            <span className="text-foreground">dream company interview.</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground">
            Curated DSA topics with problems asked at Google, Amazon, Microsoft
            &amp; more — visualized step by step so you actually understand, not
            just memorise.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {[
              { label: "Topics",     value: "8+"   },
              { label: "Questions",  value: "200+" },
              { label: "Companies",  value: "10+"  },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold hero-gradient-text">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Filter ── */}
      <section className="sticky top-[72px] z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-screen-xl px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {companies.map(({ name, logo, src }) => (
              <button
                key={name}
                onClick={() => setActiveCompany(name)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCompany === name
                    ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                    activeCompany === name ? "bg-violet-500/30" : "bg-muted"
                  }`}
                >
                  {/* ✅ Fix: use src for image, fall back to logo text */}
                  {src ? (
                    <img src={src} alt={name} className="h-3.5 w-3.5 object-contain" />
                  ) : (
                    logo
                  )}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topics Grid ── */}
      <section className="mx-auto max-w-screen-xl px-6 py-10">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            topics
            {activeCompany !== "All" && (
              <> for <span className="font-semibold text-violet-400">{activeCompany}</span></>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic, i) => {
            const diff   = difficultyConfig[topic.difficulty];
            const tagCfg = topic.tag ? tagConfig[topic.tag] : null;

            return (
              <div
                key={topic.title}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-card/80 hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.25)]"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* ── Top row — title + tag (no icon container) ── */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground leading-tight">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {topic.questions} questions
                    </p>
                  </div>

                  {tagCfg && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold ${tagCfg.color} ${tagCfg.bg} ${tagCfg.border}`}
                    >
                      {tagCfg.icon}
                      {topic.tag}
                    </span>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${diff.color} ${diff.bg} ${diff.border}`}
                  >
                    {topic.difficulty}
                  </span>
                </div>

                {/* Company pills */}
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {topic.companies.map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Try with Code button */}
                <div className="mt-auto border-t border-border/40 pt-4">
                  <Link
                    href={topic.url}
                    className="group/btn flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-muted-foreground group-hover/btn:text-violet-400 transition-colors" />
                      Try with Code
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/btn:translate-x-1 group-hover/btn:text-violet-400 transition-all" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_60%)]" />
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold">No topics found</h3>
            <p className="text-sm text-muted-foreground">
              No topics available for {activeCompany} yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-screen-xl px-6 py-12 text-center">
          <h2 className="mb-3 text-2xl font-bold">Ready to start practicing?</h2>
          <p className="mb-6 text-muted-foreground">
            Pick a topic above and visualize every step of the solution.
          </p>
          <Link
            href="/visualizer/sorting"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Go to Visualizer
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}