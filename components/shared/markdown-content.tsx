"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import { MDXProvider } from "@mdx-js/react"

interface MarkdownContentProps {
  content: React.ReactNode | string
}

type TopicTheme = {
  id: string
  label: string
  accent: string
  border: string
  surface: string
  badge: string
  chip: string
  hint: string
  match: RegExp
}

const topicThemes: TopicTheme[] = [
  {
    id: "stack",
    label: "Stack",
    accent: "from-violet-500 via-fuchsia-500 to-sky-500",
    border: "border-violet-500/15",
    surface: "from-white/90 via-violet-50/70 to-sky-50/80 dark:from-slate-950/70 dark:via-violet-950/35 dark:to-slate-900/70",
    badge: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    chip: "border-violet-500/15 bg-white/70 text-violet-700 dark:bg-slate-900/40 dark:text-violet-200",
    hint: "LIFO • Last in, first out",
    match: /stack/i,
  },
  {
    id: "queue",
    label: "Queue",
    accent: "from-sky-500 via-cyan-500 to-blue-500",
    border: "border-sky-500/15",
    surface: "from-white/90 via-sky-50/70 to-blue-50/80 dark:from-slate-950/70 dark:via-sky-950/35 dark:to-slate-900/70",
    badge: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    chip: "border-sky-500/15 bg-white/70 text-sky-700 dark:bg-slate-900/40 dark:text-sky-200",
    hint: "FIFO • First in, first out",
    match: /queue|deque|priority/i,
  },
  {
    id: "tree",
    label: "Tree",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    border: "border-emerald-500/15",
    surface: "from-white/90 via-emerald-50/70 to-cyan-50/80 dark:from-slate-950/70 dark:via-emerald-950/35 dark:to-slate-900/70",
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    chip: "border-emerald-500/15 bg-white/70 text-emerald-700 dark:bg-slate-900/40 dark:text-emerald-200",
    hint: "Branching paths and hierarchy",
    match: /tree|node|binary/i,
  },
  {
    id: "graph",
    label: "Graph",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    border: "border-amber-500/15",
    surface: "from-white/90 via-amber-50/70 to-rose-50/80 dark:from-slate-950/70 dark:via-amber-950/35 dark:to-slate-900/70",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    chip: "border-amber-500/15 bg-white/70 text-amber-700 dark:bg-slate-900/40 dark:text-amber-200",
    hint: "Connections and traversal",
    match: /graph|dfs|bfs|dijkstra/i,
  },
  {
    id: "sorting",
    label: "Sorting",
    accent: "from-pink-500 via-rose-500 to-orange-500",
    border: "border-pink-500/15",
    surface: "from-white/90 via-pink-50/70 to-orange-50/80 dark:from-slate-950/70 dark:via-pink-950/35 dark:to-slate-900/70",
    badge: "border-pink-500/20 bg-pink-500/10 text-pink-700 dark:text-pink-300",
    chip: "border-pink-500/15 bg-white/70 text-pink-700 dark:bg-slate-900/40 dark:text-pink-200",
    hint: "Order, comparison, and swaps",
    match: /sort|sorting/i,
  },
  {
    id: "huffman",
    label: "Compression",
    accent: "from-indigo-500 via-violet-500 to-fuchsia-500",
    border: "border-indigo-500/15",
    surface: "from-white/90 via-indigo-50/70 to-fuchsia-50/80 dark:from-slate-950/70 dark:via-indigo-950/35 dark:to-slate-900/70",
    badge: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    chip: "border-indigo-500/15 bg-white/70 text-indigo-700 dark:bg-slate-900/40 dark:text-indigo-200",
    hint: "Efficiency through encoding",
    match: /huffman|compression|code/i,
  },
]

const defaultTheme: TopicTheme = {
  id: "default",
  label: "Concept guide",
  accent: "from-violet-500 via-fuchsia-500 to-sky-500",
  border: "border-violet-500/15",
  surface: "from-white/90 via-violet-50/70 to-sky-50/80 dark:from-slate-950/70 dark:via-violet-950/35 dark:to-slate-900/70",
  badge: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  chip: "border-violet-500/15 bg-white/70 text-violet-700 dark:bg-slate-900/40 dark:text-violet-200",
  hint: "Clear explanations designed to match the interactive experience.",
  match: /./,
}

function getTopicTheme(content: React.ReactNode | string): TopicTheme {
  if (typeof content !== "string") return defaultTheme

  const normalized = content.toLowerCase()
  const match = topicThemes.find((theme) => theme.match.test(normalized))
  return match ?? defaultTheme
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-5 mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-8 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-sm leading-7 text-muted-foreground sm:text-[15px]">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 text-sm leading-7 text-muted-foreground sm:text-[15px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2 text-sm leading-7 text-muted-foreground sm:text-[15px]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="mb-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm italic leading-7 text-foreground/90 shadow-sm">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-t border-violet-500/10" />,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-violet-600 underline decoration-violet-500/30 underline-offset-4 transition hover:text-violet-500 dark:text-violet-400"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isInline = !className

    if (isInline) {
      return (
        <code className="rounded-md border border-violet-500/15 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-700 shadow-sm dark:text-violet-300">
          {children}
        </code>
      )
    }

    return (
      <div className="mb-5 overflow-hidden rounded-2xl border border-violet-500/15 bg-slate-950/95 shadow-[0_14px_40px_rgba(2,6,23,0.28)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          <span>Code</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px]">Snippet</span>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-7 text-slate-100">
          <code className={className}>{children}</code>
        </pre>
      </div>
    )
  },
  table: ({ children }) => (
    <div className="mb-5 overflow-hidden rounded-2xl border border-violet-500/15">
      <table className="min-w-full divide-y divide-violet-500/10 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-violet-500/10">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-violet-500/10">{children}</tbody>,
  tr: ({ children }) => <tr className="bg-background/70">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-muted-foreground">{children}</td>,
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const theme = getTopicTheme(content)

  return (
    <div className={`relative overflow-hidden rounded-[24px] border ${theme.border} bg-gradient-to-br ${theme.surface} p-6 shadow-[0_16px_50px_rgba(139,92,246,0.08)] backdrop-blur-xl`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.accent}`} />
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.badge}`}>
          {theme.label}
        </span>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.chip}`}>
          Quick insight • {theme.hint}
        </span>
      </div>
      <div className="max-w-none">
        <MDXProvider components={components}>
          {typeof content === "string" ? <ReactMarkdown components={components}>{content}</ReactMarkdown> : content}
        </MDXProvider>
      </div>
    </div>
  )
}