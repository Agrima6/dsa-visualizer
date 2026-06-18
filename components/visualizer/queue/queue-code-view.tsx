"use client"
// components/visualizer/queue/queue-code-view.tsx

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  QUEUE_PROBLEMS,
  type QueueProblem,
  type Difficulty,
  type Company,
  type QueueVisStep,
} from "./queue-problems-data"

// ─────────────────────────────────────────────────────────────
// UI styles — same as sorting / stack
// ─────────────────────────────────────────────────────────────
const DIFF_STYLE: Record<Difficulty, string> = {
  Easy: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  Medium: "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  Hard: "text-rose-500 bg-rose-500/10 border border-rose-500/20",
}

const TAG_STYLE =
  "text-[10px] font-medium px-2.5 py-1 rounded-full bg-violet-500/8 text-violet-500/80 border border-violet-500/10 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-400/10"

const PANEL =
  "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035] dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"

const SOFT_PANEL =
  "rounded-[20px] border border-violet-500/10 bg-white/55 backdrop-blur-xl dark:bg-white/[0.025]"

  function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
const COMPANY_LOGO_MAP: Record<Company, { src: string; label: string }> = {
  Google: { src: "/company-logos/google.svg", label: "Google" },
  Amazon: { src: "/company-logos/amazon.svg", label: "Amazon" },
  Apple: { src: "/company-logos/apple.svg", label: "Apple" },
  Meta: { src: "/company-logos/meta.svg", label: "Meta" },
  Microsoft: { src: "/company-logos/microsoft.svg", label: "Microsoft" },
  Netflix: { src: "/company-logos/netflix.svg", label: "Netflix" },
  Adobe: { src: "/company-logos/adobe.svg", label: "Adobe" },
  Uber: { src: "/company-logos/uber.svg", label: "Uber" },
  LinkedIn: { src: "/company-logos/linkedin.svg", label: "LinkedIn" },
  Twitter: { src: "/company-logos/twitter.svg", label: "Twitter" },

  ServiceNow: { src: "/company-logos/servicenow.svg", label: "ServiceNow" },
  Salesforce: { src: "/company-logos/salesforce.svg", label: "Salesforce" },
  Oracle: { src: "/company-logos/oracle.svg", label: "Oracle" },
  SAP: { src: "/company-logos/sap.svg", label: "SAP" },
  Intuit: { src: "/company-logos/intuit.svg", label: "Intuit" },
  PayPal: { src: "/company-logos/paypal.svg", label: "PayPal" },
  Stripe: { src: "/company-logos/stripe.svg", label: "Stripe" },
  Atlassian: { src: "/company-logos/atlassian.svg", label: "Atlassian" },
  Airbnb: { src: "/company-logos/airbnb.svg", label: "Airbnb" },
  Dropbox: { src: "/company-logos/dropbox.svg", label: "Dropbox" },
  Pinterest: { src: "/company-logos/pinterest.svg", label: "Pinterest" },
  Snap: { src: "/company-logos/snap.svg", label: "Snap" },
  Spotify: { src: "/company-logos/spotify.svg", label: "Spotify" },
  Walmart: { src: "/company-logos/walmart.svg", label: "Walmart" },
  Cisco: { src: "/company-logos/cisco.svg", label: "Cisco" },
  VMware: { src: "/company-logos/vmware.svg", label: "VMware" },
  Nvidia: { src: "/company-logos/nvidia.svg", label: "Nvidia" },
  GoldmanSachs: { src: "/company-logos/goldmansachs.svg", label: "Goldman Sachs" },
  MorganStanley: { src: "/company-logos/morganstanley.svg", label: "Morgan Stanley" },
  Bloomberg: { src: "/company-logos/bloomberg.svg", label: "Bloomberg" },
  Zomato: { src: "/company-logos/zomato.svg", label: "Zomato" },
  Swiggy: { src: "/company-logos/swiggy.svg", label: "Swiggy" },
  Flipkart: { src: "/company-logos/flipkart.svg", label: "Flipkart" },
  Meesho: { src: "/company-logos/meesho.svg", label: "Meesho" },
  PhonePe: { src: "/company-logos/phonepe.svg", label: "PhonePe" },
}
const SPEED_OPTIONS = [
  { label: "0.5x", interval: 1500 },
  { label: "1x", interval: 800 },
  { label: "1.5x", interval: 550 },
  { label: "2x", interval: 400 },
] as const

function CompanyLogoBadge({ company, compact = false }: { company: Company; compact?: boolean }) {
  const logo = COMPANY_LOGO_MAP[company]

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-violet-500/10 bg-white/85 shadow-sm dark:bg-white/[0.04]",
        compact ? "h-7 w-7" : "h-8 w-8"
      )}
      title={logo?.label || company}
    >
      {logo?.src ? (
        <img
          src={logo.src}
          alt={logo.label}
          className={compact ? "h-3.5 max-w-[14px]" : "h-4 max-w-[16px]"}
        />
      ) : (
        <span className={compact ? "text-[7px]" : "text-[8px]"}>
          {company.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

function CompanyMarquee({
  companies,
  compact = false,
  speed = 18,
}: {
  companies: Company[]
  compact?: boolean
  speed?: number
}) {
  const items = [...companies, ...companies]

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="flex w-max items-center gap-1.5"
        style={{ animation: `companyLoop ${speed}s linear infinite` }}
      >
        {items.map((c, i) => (
          <CompanyLogoBadge key={i} company={c} compact={compact} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Problem row — same as sorting
// ─────────────────────────────────────────────────────────────
function ProblemRow({
  problem,
  idx,
  onSelect,
}: {
  problem: QueueProblem
  idx: number
  onSelect: (p: QueueProblem) => void
}) {
  return (
    <button onClick={() => onSelect(problem)} className="w-full text-left">
      <div
        style={{
          opacity: 0,
          animation: `fadeSlideIn 0.35s ease forwards`,
          animationDelay: `${idx * 40}ms`,
        }}
        className="group relative w-full px-5 py-4 text-left transition-all duration-200 hover:bg-violet-500/[0.035] md:px-6 md:py-5"
      >
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent group-last:hidden" />

<div className="hidden items-center gap-4 border-b border-violet-500/8 bg-violet-500/[0.03] px-6 py-4 xl:grid xl:grid-cols-[56px_minmax(260px,1.55fr)_minmax(220px,1.15fr)_100px_96px]">          <div className="hidden xl:block">
            <span className="text-xs font-mono text-muted-foreground/50">#{problem.id}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted-foreground/50 xl:hidden">
                #{problem.id}
              </span>
              <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-300 md:text-[15px]">
                {problem.title}
              </h3>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {problem.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={TAG_STYLE}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden xl:block min-w-0">
            <CompanyMarquee companies={problem.companies} compact speed={20} />
          </div>

          <div className="text-xs font-mono text-muted-foreground xl:text-right">
            {problem.timeComplexity}
          </div>

          <div className="flex items-center justify-between gap-3 xl:justify-end">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold",
                DIFF_STYLE[problem.difficulty]
              )}
            >
              {problem.difficulty}
            </span>

            <svg
              className="h-4 w-4 text-muted-foreground/35 transition-colors group-hover:text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Stat card — same as sorting
// ─────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: "default" | "easy" | "medium" | "hard"
}) {
  const accentClass =
    accent === "easy"
      ? "text-emerald-500"
      : accent === "medium"
      ? "text-amber-500"
      : accent === "hard"
      ? "text-rose-500"
      : "text-foreground"

  return (
    <div className="rounded-2xl border border-violet-500/10 bg-white/65 px-4 py-4 dark:bg-white/[0.03]">
      <div className={cn("text-2xl font-bold", accentClass)}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Queue legend
// ─────────────────────────────────────────────────────────────
function QueueLegend() {
  return (
    <div className="flex flex-wrap gap-3 border-t border-violet-500/10 pt-3">
      {[
        {
          cls: "border-violet-500/30 bg-white/80 dark:bg-white/[0.06]",
          label: "Default",
        },
        {
          cls: "border-emerald-400/30 bg-emerald-500/[0.08]",
          label: "Front",
        },
        {
          cls: "border-violet-500/30 bg-violet-500/[0.08]",
          label: "Rear",
        },
        {
          cls: "border-violet-400/60 bg-gradient-to-r from-violet-600/20 to-blue-500/15",
          label: "Active",
        },
        {
          cls: "border-rose-400/40 bg-rose-500/15",
          label: "Dequeued",
        },
      ].map(({ cls, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn("h-3 w-3 rounded-sm border", cls)} />
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Queue visualization card body
// ─────────────────────────────────────────────────────────────
function QueueViz({
  step,
  currentStep,
}: {
  step: QueueVisStep
  currentStep: number
}) {
  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <div className="rounded-2xl border border-violet-500/8 bg-white/45 dark:bg-white/[0.02]">
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <svg className="h-3 w-3 arrow-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Front
              </div>
              <div className="h-px flex-1 bg-violet-500/10" />
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-400">
                Rear
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex min-h-[110px] min-w-max items-stretch gap-2">
                {step.queue.length === 0 ? (
                  <div className="flex w-full min-w-[220px] items-center justify-center rounded-xl border border-dashed border-violet-500/20 px-10 py-6 text-xs italic text-muted-foreground/50">
                    Queue is empty
                  </div>
                ) : (
                  step.queue.map((item, idx) => {
                    const isFront = idx === 0
                    const isRear = idx === step.queue.length - 1
                    const isHighlighted = step.highlighted.includes(idx)
                    const isDequeued = step.dequeued.includes(idx)

                    return (
                      <div
                        key={`${idx}-${item.value}-${currentStep}`}
                        style={{
                          animation: `queueEnter 0.28s ease forwards`,
                          animationDelay: `${idx * 25}ms`,
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="flex gap-1">
                          {isFront && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                              FRONT
                            </span>
                          )}
                          {isRear && !isFront && (
                            <span className="rounded-full border border-violet-400/20 bg-violet-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">
                              REAR
                            </span>
                          )}
                          {!isFront && !isRear && <div className="h-5" />}
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "relative min-w-[60px] rounded-xl border px-4 py-3 text-center transition-all duration-300",
                              isDequeued
                                ? "scale-95 border-rose-400/40 bg-rose-500/15 opacity-50"
                                : isHighlighted
                                ? "scale-105 border-violet-400/60 bg-gradient-to-r from-violet-600/20 to-blue-500/15 shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                                : isFront
                                ? "border-emerald-400/30 bg-emerald-500/[0.08]"
                                : isRear
                                ? "border-violet-500/30 bg-violet-500/[0.08]"
                                : "border-violet-500/12 bg-white/70 dark:bg-white/[0.04]"
                            )}
                          >
                            <span
                              className={cn(
                                "block font-mono text-sm font-semibold",
                                isHighlighted
                                  ? "text-violet-600 dark:text-violet-200"
                                  : isDequeued
                                  ? "text-rose-500 dark:text-rose-300"
                                  : "text-foreground"
                              )}
                            >
                              {item.value}
                            </span>
                            {item.label && (
                              <span className="mt-0.5 block font-mono text-[9px] text-muted-foreground/60">
                                {item.label}
                              </span>
                            )}
                          </div>

                          {idx < step.queue.length - 1 && (
                            <svg className="h-4 w-4 shrink-0 text-violet-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>

                        <span className="font-mono text-[9px] text-muted-foreground/40">[{idx}]</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {step.auxiliary && step.auxiliary.length > 0 && (
              <div className="mt-5 border-t border-violet-500/10 pt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  State
                </p>

                <div className="flex flex-wrap gap-2">
                  {step.auxiliary.map((item, i) => (
                    <div
                      key={`${item.label}-${i}`}
                      className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-3"
                    >
                      <div className="mb-1 text-[9px] uppercase tracking-[0.16em] text-emerald-600/75 dark:text-emerald-300/75">
                        {item.label}
                      </div>
                      <div className="break-all font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-200">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QueueLegend />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function QueueCodeView() {
  const router = useRouter()

  const [selectedProblem, setSelectedProblem] = useState<QueueProblem | null>(null)
  const [filterDiff, setFilterDiff] = useState<Difficulty | "All">("All")
  const [search, setSearch] = useState("")

  const filtered = QUEUE_PROBLEMS.filter((p) => {
    const matchDiff = filterDiff === "All" || p.difficulty === filterDiff
    const q = search.toLowerCase()
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.companies.some((c) => c.toLowerCase().includes(q))

    return matchDiff && matchSearch
  })

  const counts = {
    Easy: QUEUE_PROBLEMS.filter((p) => p.difficulty === "Easy").length,
    Medium: QUEUE_PROBLEMS.filter((p) => p.difficulty === "Medium").length,
    Hard: QUEUE_PROBLEMS.filter((p) => p.difficulty === "Hard").length,
  }

  if (selectedProblem) {
    return (
      <ProblemDetail
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
      />
    )
  }

  return (
    <>
  <style>{`
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes companyLoop {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`}</style>

      <div className="container mx-auto space-y-6">
        <div className={cn(PANEL, "relative overflow-hidden p-6 md:p-8")}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)]" />
          <div className="absolute -top-10 left-10 h-36 w-36 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-blue-500/8 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-violet-500/10 bg-white/70 px-3 py-2 dark:bg-white/[0.04]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_6px_18px_rgba(139,92,246,0.25)]">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                  Practice Problems
                </span>
              </div>

              <h1 className="bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                Queue Problems
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                Curated queue questions with cleaner walkthroughs, company tags, and visual step-by-step execution.
              </p>
            </div>

            <button
              onClick={() => router.push("/visualizer/queue")}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Visualizer
            </button>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-violet-500/10 pt-6 sm:grid-cols-4">
            <StatCard label="Problems" value={QUEUE_PROBLEMS.length.toString()} accent="default" />
            <StatCard label="Easy" value={counts.Easy.toString()} accent="easy" />
            <StatCard label="Medium" value={counts.Medium.toString()} accent="medium" />
            <StatCard label="Hard" value={counts.Hard.toString()} accent="hard" />
          </div>
        </div>

        <div className={cn(SOFT_PANEL, "p-4 md:p-5")}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by problem, tag, or company"
                className="h-11 w-full rounded-xl border border-violet-500/15 bg-white/80 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/45 focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/15 dark:bg-white/[0.04]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold border transition-all",
                    filterDiff === d
                      ? d === "All"
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-[0_6px_20px_rgba(139,92,246,0.25)]"
                        : d === "Easy"
                        ? "bg-emerald-500/12 text-emerald-600 border-emerald-500/20 dark:text-emerald-300"
                        : d === "Medium"
                        ? "bg-amber-500/12 text-amber-600 border-amber-500/20 dark:text-amber-300"
                        : "bg-rose-500/12 text-rose-600 border-rose-500/20 dark:text-rose-300"
                      : "border-violet-500/12 bg-white/70 text-muted-foreground hover:bg-violet-500/5 dark:bg-white/[0.03]"
                  )}
                >
                  {d}
                  {d !== "All" && (
                    <span className="ml-1 opacity-60">({counts[d as Difficulty]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={cn(PANEL, "overflow-hidden")}>
          <div className="hidden items-center gap-4 border-b border-violet-500/8 bg-violet-500/[0.03] px-6 py-4 xl:grid xl:grid-cols-[56px_1.6fr_220px_100px_96px]">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">#</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">Problem</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">Companies</span>
            <span className="text-[11px] uppercase tracking-wider text-right text-muted-foreground/55">Complexity</span>
            <span className="text-[11px] uppercase tracking-wider text-right text-muted-foreground/55">Difficulty</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <svg className="mb-3 h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">No problems match your filter.</p>
            </div>
          ) : (
            filtered.map((problem, i) => (
              <ProblemRow
                key={problem.slug}
                problem={problem}
                idx={i}
                onSelect={setSelectedProblem}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Detail page — same structure as sorting / stack
// ─────────────────────────────────────────────────────────────
function ProblemDetail({
  problem,
  onBack,
}: {
  problem: QueueProblem
  onBack: () => void
}) {
  const [steps] = useState<QueueVisStep[]>(() => problem.generateSteps())
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]["interval"]>(800)
  const [activeTab, setActiveTab] = useState<"description" | "approaches" | "pitfalls">("description")

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const current = steps[currentStep]
  const codeLines = problem.code.split("\n")
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= steps.length - 1) {
          setIsPlaying(false)
          return s
        }
        return s + 1
      })
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, steps.length])

  useEffect(() => {
    if (!codeRef.current || !current) return
    const el = codeRef.current.querySelector(`[data-line="${current.codeLine}"]`)
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [currentStep, current])

  return (
    <>
      <style>{`
        @keyframes queueEnter {
          from { opacity: 0; transform: translateX(14px) scale(0.94); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .active-line {
          background: linear-gradient(90deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.05) 55%, transparent 100%);
        }
        @keyframes arrowBounce {
          0%,100% { transform: translateX(0); }
          50%     { transform: translateX(4px); }
        }
        .arrow-bounce {
          animation: arrowBounce 1.2s ease infinite;
        }
      `}</style>

      <div className="container mx-auto space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              onClick={onBack}
              className="mb-3 inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Problems
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
                {problem.title}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  DIFF_STYLE[problem.difficulty]
                )}
              >
                {problem.difficulty}
              </span>
            </div>

          <div className="mt-4 min-w-0">
  <CompanyMarquee companies={problem.companies} speed={22} />
</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <div className={cn(PANEL, "overflow-hidden")}>
              <div className="border-b border-violet-500/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-sm font-semibold text-transparent">
                      Step-by-Step Visualization
                    </h3>
                    <p className="mt-1 min-h-[1.5rem] text-sm leading-6 text-muted-foreground">
                      {current?.message ?? "Press Play to start"}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 text-xs font-mono text-violet-500 dark:text-violet-300">
                    {currentStep + 1} / {steps.length}
                  </div>
                </div>
              </div>

              {current && <QueueViz step={current} currentStep={currentStep} />}

              <div className="h-1 bg-violet-500/8">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className={cn(PANEL, "p-5")}>
              <div className="mb-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="mr-2 text-xs font-semibold text-violet-500">
                    Step {currentStep + 1}/{steps.length}
                  </span>
                  {current?.message}
                </p>
              </div>

              <div className="mb-5">
                <input
                  type="range"
                  min={0}
                  max={Math.max(steps.length - 1, 0)}
                  value={currentStep}
                  onChange={(e) => {
                    setIsPlaying(false)
                    setCurrentStep(Number(e.target.value))
                  }}
                  className="w-full accent-violet-600"
                />
              </div>

              <div className="grid grid-cols-[48px_1fr_1.2fr_1fr] gap-2">
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentStep(0)
                  }}
                  className="flex h-11 items-center justify-center rounded-xl border border-violet-500/12 bg-white/70 transition-all hover:bg-violet-500/5 dark:bg-white/[0.03]"
                  title="Restart"
                >
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentStep((s) => Math.max(0, s - 1))
                  }}
                  disabled={currentStep === 0}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]"
                >
                  ‹ Prev
                </button>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] transition-all hover:shadow-[0_10px_28px_rgba(139,92,246,0.32)]"
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
                  }}
                  disabled={currentStep >= steps.length - 1}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]"
                >
                  Next ›
                </button>
              </div>

              <div className="mt-5 border-t border-violet-500/10 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Animation Speed</span>
                  <span className="text-xs font-mono text-violet-500 dark:text-violet-300">
                    {SPEED_OPTIONS.find((opt) => opt.interval === speed)?.label ?? "1x"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSpeed(opt.interval)}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold border transition-all",
                        speed === opt.interval
                          ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-[0_6px_20px_rgba(139,92,246,0.25)]"
                          : "border-violet-500/12 bg-white/70 text-muted-foreground hover:bg-violet-500/5 dark:bg-white/[0.03]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-sky-400/15 bg-sky-500/[0.05] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky-400/70">
                  Time Complexity
                </p>
                <p className="font-mono text-lg font-bold text-sky-500 dark:text-sky-300">
                  {problem.timeComplexity}
                </p>
              </div>

              <div className="rounded-[22px] border border-violet-400/15 bg-violet-500/[0.05] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-violet-400/70">
                  Space Complexity
                </p>
                <p className="font-mono text-lg font-bold text-violet-500 dark:text-violet-300">
                  {problem.spaceComplexity}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-4 self-start overflow-hidden rounded-[24px] border border-violet-500/12 bg-[#0c0d11] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>

              <span className="text-xs font-mono text-neutral-500">{problem.slug}.js</span>

              <span className="rounded-full border border-violet-400/20 bg-violet-500/12 px-2.5 py-1 text-[10px] text-violet-300">
                JavaScript
              </span>
            </div>

            <div
              ref={codeRef}
              className="max-h-[calc(100vh-160px)] overflow-y-auto font-mono text-sm leading-7"
            >
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1
                const isActive = current?.codeLine === lineNum

                return (
                  <div
                    key={lineNum}
                    data-line={lineNum}
                    className={cn(
                      "flex border-l-2 transition-colors duration-200",
                      isActive ? "active-line border-violet-500" : "border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "w-12 shrink-0 select-none pr-4 text-right text-xs leading-7",
                        isActive ? "font-bold text-violet-400" : "text-neutral-700"
                      )}
                    >
                      {lineNum}
                    </span>

                    <span
                      className={cn(
                        "whitespace-pre pr-4",
                        isActive ? "text-white" : "text-neutral-400"
                      )}
                    >
                      {line || " "}
                    </span>
                  </div>
                )
              })}
              <div className="h-4" />
            </div>
          </div>
        </div>

        <div className={cn(PANEL, "overflow-hidden")}>
          <div className="flex border-b border-violet-500/10 px-2">
            {(["description", "approaches", "pitfalls"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                  activeTab === tab
                    ? "text-violet-500 border-b-2 border-violet-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr] xl:grid-cols-[2fr_1fr_1fr]">
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                    Problem
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">{problem.description}</p>

                  <div className="mt-6 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                      Examples
                    </p>

                    {problem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-violet-500/10 bg-black/10 p-4 font-mono text-xs dark:bg-black/30"
                      >
                        <div>
                          <span className="text-neutral-500">Input: </span>
                          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-[14px] font-semibold text-transparent">
                            {ex.input}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-neutral-500">Output: </span>
                          <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-[14px] font-semibold text-transparent">
                            {ex.output}
                          </span>
                        </div>
                        {ex.explanation && (
                          <div className="mt-2 text-[10px] leading-5 text-neutral-500">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                    Constraints
                  </p>

                  <div className="space-y-2">
                    {problem.constraints.map((c, i) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="shrink-0 text-violet-500">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-500">
                    Hints
                  </p>

                  <div className="space-y-2">
                    {problem.hints.map((h, i) => (
                      <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="shrink-0 font-semibold text-amber-500">{i + 1}.</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "approaches" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {problem.approaches.map((approach, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-violet-500/10 bg-white/45 p-5 dark:bg-white/[0.03]"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{approach.name}</div>
                      <div className="flex shrink-0 gap-1.5">
                        <span className="rounded-full border border-sky-400/15 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400">
                          ⏱ {approach.complexity}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {approach.description}
                    </p>

                    <div className="mt-3">
                      <span className="rounded-full border border-violet-400/15 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-400">
                        💾 {approach.space}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pitfalls" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {problem.pitfalls.map((pitfall, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-rose-500/12 bg-rose-500/[0.04] p-4"
                  >
                    <span className="shrink-0 text-rose-500">⚠</span>
                    <p className="text-sm leading-6 text-muted-foreground">{pitfall}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}