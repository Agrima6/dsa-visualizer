// components/shared/Footer.tsx

import Link from "next/link"

const LEGAL_LINKS = [
  { href: "/terms",      label: "Terms & Conditions" },
  { href: "/privacy",    label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
]

const NAV_LINKS = [
  { href: "/",                        label: "Home" },
  { href: "/#features",               label: "Features" },
  { href: "/visualizer/array",        label: "Arrays" },
  { href: "/visualizer/sorting",      label: "Sorting" },
  { href: "/visualizer/linked-list",  label: "Linked Lists" },
  { href: "/visualizer/binary-tree",  label: "Binary Trees" },
  { href: "/visualizer/graph",        label: "Graphs" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 border-t border-violet-500/10 bg-white/60 backdrop-blur-xl dark:bg-white/[0.02]">
      {/* top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto_auto]">

          {/* Brand column */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_4px_12px_rgba(139,92,246,0.35)]">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                AlgoMaitri
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Master data structures and algorithms through interactive visualizations and curated practice problems.
            </p>
            <p className="mt-4 text-xs text-muted-foreground/60">
              Built for students, by developers. 🇮🇳
            </p>
          </div>

          {/* Visualizers column */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Visualizers
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-violet-500/10 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/70">
            © {year} AlgoMaitri. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {LEGAL_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted-foreground/60 transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}