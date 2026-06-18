// app/disclaimer/page.tsx
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Disclaimer | AlgoMaitri",
  description: "Disclaimer for AlgoMaitri — understand the limitations and scope of our educational platform.",
}

const LAST_UPDATED = "April 2026"

const LEGAL_LINKS = [
  { href: "/terms",      label: "Terms & Conditions", key: "terms"      },
  { href: "/privacy",    label: "Privacy Policy",      key: "privacy"    },
  { href: "/disclaimer", label: "Disclaimer",           key: "disclaimer" },
]

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_50%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#0d0916_50%,#09090b_100%)]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Back */}
        <Link href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/70 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.04] dark:hover:text-violet-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to AlgoMaitri
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
            Legal
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent md:text-5xl">
            Disclaimer
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">{LAST_UPDATED}</span>
          </p>
          <p className="mt-3 text-muted-foreground leading-7">
            Please read this disclaimer carefully before using <span className="font-semibold text-foreground">AlgoMaitri</span>. By using our platform, you acknowledge and agree to the terms described below.
          </p>
        </div>

        {/* Highlight box */}
        <div className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-6 py-5">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
            </svg>
            <p className="text-sm leading-7 text-amber-800 dark:text-amber-300">
              AlgoMaitri is an <strong>educational platform</strong> designed to help users learn data structures and algorithms through interactive visualizations and curated problem sets. All content is intended solely for learning purposes.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">

          <Section number="1" title="Educational Purpose Only">
            <p>All content available on AlgoMaitri — including visualizations, problem walkthroughs, code examples, complexity analyses, and explanations — is provided <strong>for educational and informational purposes only</strong>.</p>
            <p>While we strive for accuracy, the content should not be treated as a substitute for professional instruction, certified courses, or official documentation. AlgoMaitri does not guarantee that its content is complete, up-to-date, or error-free at all times.</p>
          </Section>

          <Section number="2" title="No Guarantee of Interview or Job Outcomes">
            <p>Using AlgoMaitri's content, problem sets, or visualizations does not guarantee success in technical interviews, competitive programming contests, academic assessments, or job placements.</p>
            <p>Outcomes depend on a wide range of individual factors including prior knowledge, preparation effort, and the specific requirements of each opportunity. AlgoMaitri makes no representations or warranties regarding interview results or employment outcomes.</p>
          </Section>

          <Section number="3" title="Code & Algorithm Accuracy">
            <ul className="space-y-2 list-none">
              <Li>Code examples and algorithm implementations provided on AlgoMaitri are intended for illustrative and learning purposes. They may not represent the most optimized, production-ready, or universally accepted solution.</Li>
              <Li>Users should independently verify code before using it in production environments or submitting it in competitive contexts.</Li>
              <Li>AlgoMaitri is not responsible for any errors, bugs, or unintended behavior arising from the use of code provided on the platform.</Li>
            </ul>
          </Section>

          <Section number="4" title="Third-Party Problem Sets & References">
            <p>AlgoMaitri references problems and concepts from third-party platforms including LeetCode, NeetCode, and other algorithmic resources. These references are made purely for educational purposes. AlgoMaitri is not affiliated with, endorsed by, or officially associated with any third-party platform unless explicitly stated.</p>
            <p>Trademarks and brand names mentioned are the property of their respective owners.</p>
          </Section>

          <Section number="5" title="No Professional or Financial Advice">
            <p>AlgoMaitri does not provide professional advice of any kind — including but not limited to legal, financial, investment, career, or medical advice. Any content that may appear related to these domains is strictly for general informational and educational discussion.</p>
            <p>AlgoMaitri is not responsible for any decisions made based on information found on this platform. Users should consult qualified professionals for advice specific to their individual circumstances.</p>
          </Section>

          <Section number="6" title="Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, AlgoMaitri and its team shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from:</p>
            <ul className="mt-3 space-y-2 list-none">
              <Li>Use of or inability to use the platform or its content.</Li>
              <Li>Errors, inaccuracies, or omissions in any content.</Li>
              <Li>Unauthorized access to or alteration of your data.</Li>
              <Li>Any other matter relating to the platform.</Li>
            </ul>
          </Section>

          <Section number="7" title="External Links">
            <p>AlgoMaitri may contain links to external websites, tools, or resources. These links are provided for convenience and reference only. We do not endorse, control, or take responsibility for the content, accuracy, or practices of any external sites. Accessing external links is at your own risk.</p>
          </Section>

          <Section number="8" title="Changes to This Disclaimer">
            <p>AlgoMaitri reserves the right to update or modify this Disclaimer at any time without prior notice. Changes will be reflected by updating the "Last updated" date at the top of this page. We encourage you to review this page periodically.</p>
          </Section>

          <Section number="9" title="Contact">
            <p>If you have any questions about this Disclaimer, please contact us at:</p>
            <div className="mt-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
              <p className="font-semibold text-foreground">AlgoMaitri</p>
              <p className="mt-1">
                <a href="mailto:support@algomaitri.com" className="text-violet-600 hover:underline dark:text-violet-400">
                  support@algomaitri.com
                </a>
              </p>
            </div>
          </Section>

        </div>

        <LegalFooterLinks active="disclaimer" />
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
          {number}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="ml-11 text-sm leading-7 text-muted-foreground space-y-3">
        {children}
      </div>
      <div className="mt-10 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
    </section>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500/60" />
      <span>{children}</span>
    </li>
  )
}

function LegalFooterLinks({ active }: { active: "terms" | "privacy" | "disclaimer" }) {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-violet-500/10 pt-8">
      {LEGAL_LINKS.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm transition-colors ${
            active === l.key
              ? "font-semibold text-violet-600 dark:text-violet-400"
              : "text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  )
}