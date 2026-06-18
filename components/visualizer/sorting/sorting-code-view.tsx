"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import {
  SORTING_PROBLEMS,
  type SortingProblem,
  type Difficulty,
  type Company,
} from "./sorting-problems-data"

declare global {
  interface Window {
    Razorpay: any
  }
}

// ─────────────────────────────────────────────────────────────
// Lock config
// ─────────────────────────────────────────────────────────────
const LOCKED_IDS = new Set(
  SORTING_PROBLEMS.slice(-5).map((p) => p.slug)
)

const LOCK_PRICE = 19

// ─────────────────────────────────────────────────────────────
// UI styles
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


function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function isProblemLocked(problem: SortingProblem, unlockedTopics: string[]) {
  return LOCKED_IDS.has(problem.slug) && !unlockedTopics.includes(problem.slug)
}

function CompanyLogoBadge({
  company,
  compact = false,
}: {
  company: Company
  compact?: boolean
}) {
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
          className={cn(
            "block w-auto object-contain",
            compact ? "h-3.5 max-w-[14px]" : "h-4 max-w-[16px]"
          )}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      ) : (
        <span
          className={cn(
            "font-medium text-muted-foreground",
            compact ? "text-[7px]" : "text-[8px]"
          )}
        >
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
        className="flex w-max items-center gap-2.5 will-change-transform"
        style={{
          animation: `companyLoop ${speed}s linear infinite`,
        }}
      >
        {items.map((company, idx) => (
          <CompanyLogoBadge
            key={`${company}-${idx}`}
            company={company}
            compact={compact}
          />
        ))}
      </div>
    </div>
  )
}
function LockPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      </svg>
      ₹{LOCK_PRICE}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// Problem row
// ─────────────────────────────────────────────────────────────
function ProblemRow({
  problem,
  idx,
  onSelect,
  isSignedIn,
  onLockedClick,
  unlockedTopics,
  payingSlug,
}: {
  problem: SortingProblem
  idx: number
  onSelect: (p: SortingProblem) => void
  isSignedIn: boolean
  onLockedClick: (slug: string) => void
  unlockedTopics: string[]
  payingSlug: string | null
}) {
  const locked = isProblemLocked(problem, unlockedTopics)
  const isPayingThis = payingSlug === problem.slug

  const rowContent = (
    <div
      style={{
        opacity: 0,
        animation: `fadeSlideIn 0.35s ease forwards`,
        animationDelay: `${idx * 40}ms`,
      }}
      className={cn(
        "group relative w-full text-left px-5 py-4 md:px-6 md:py-5 transition-all duration-200",
        locked ? "cursor-pointer hover:bg-amber-500/[0.04]" : "hover:bg-violet-500/[0.035]"
      )}
    >
      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent group-last:hidden" />
<div className="grid grid-cols-1 gap-4 xl:grid-cols-[56px_minmax(260px,1.55fr)_minmax(220px,1.15fr)_100px_96px] xl:items-center">   <div className="hidden xl:block">
          <span className="text-xs font-mono text-muted-foreground/50">#{problem.id}</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="xl:hidden text-[11px] font-mono text-muted-foreground/50">
              #{problem.id}
            </span>
            <h3
              className={cn(
                "truncate text-sm md:text-[15px] font-semibold transition-colors",
                locked
                  ? "text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-300"
                  : "text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-300"
              )}
            >
              {problem.title}
            </h3>
            {locked && <LockPill />}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={TAG_STYLE}>
                {tag}
              </span>
            ))}
          </div>

          {locked && (
            <p className="mt-2 text-[11px] text-amber-600/80 dark:text-amber-300/80">
              {!isSignedIn
                ? "Locked · Sign in required"
                : isPayingThis
                ? "Opening Razorpay..."
                : `Locked · Pay ₹${LOCK_PRICE} to view`}
            </p>
          )}
        </div>
<div className="hidden xl:block min-w-0">
  <CompanyMarquee companies={problem.companies} compact speed={18} />
</div>

        <div className="text-xs font-mono text-muted-foreground xl:text-right">
          {problem.timeComplexity}
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold",
              DIFF_STYLE[problem.difficulty]
            )}
          >
            {problem.difficulty}
          </span>

          {locked ? (
            <svg
              className="h-4 w-4 text-amber-500/80 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-muted-foreground/35 group-hover:text-violet-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )

  if (locked) {
    if (isSignedIn) {
      return (
        <button
          onClick={() => onLockedClick(problem.slug)}
          className="w-full text-left"
          disabled={isPayingThis}
        >
          {rowContent}
        </button>
      )
    }

    return (
      <SignInButton mode="modal">
        <button className="w-full text-left">{rowContent}</button>
      </SignInButton>
    )
  }

  return (
    <button onClick={() => onSelect(problem)} className="w-full text-left">
      {rowContent}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function SortingCodeView() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  const [selectedProblem, setSelectedProblem] = useState<SortingProblem | null>(null)
  const [filterDiff, setFilterDiff] = useState<Difficulty | "All">("All")
  const [search, setSearch] = useState("")
  const [unlockedTopics, setUnlockedTopics] = useState<string[]>([])
  const [payingSlug, setPayingSlug] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnlocked = async () => {
      try {
        if (!isSignedIn) {
          setUnlockedTopics([])
          return
        }

        const res = await fetch("/api/payment/unlocked", {
          method: "GET",
          cache: "no-store",
        })

        const data = await res.json()
        setUnlockedTopics(Array.isArray(data.unlockedTopics) ? data.unlockedTopics : [])
      } catch (error) {
        console.error("Failed to fetch unlocked topics:", error)
        setUnlockedTopics([])
      }
    }

    fetchUnlocked()
  }, [isSignedIn])

  const filtered = SORTING_PROBLEMS.filter((p) => {
    const matchDiff = filterDiff === "All" || p.difficulty === filterDiff
    const q = search.toLowerCase()
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.companies.some((c) => c.toLowerCase().includes(q))
    return matchDiff && matchSearch
  })

  const counts = {
    Easy: SORTING_PROBLEMS.filter((p) => p.difficulty === "Easy").length,
    Medium: SORTING_PROBLEMS.filter((p) => p.difficulty === "Medium").length,
    Hard: SORTING_PROBLEMS.filter((p) => p.difficulty === "Hard").length,
  }

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true)
        return
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )

      if (existingScript) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleLockedClick = async (topicSlug: string) => {
    if (!isSignedIn) return

    try {
      setPayingSlug(topicSlug)

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert("Razorpay SDK failed to load.")
        return
      }

      const createOrderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicSlug }),
      })

      const createOrderData = await createOrderRes.json()

      if (!createOrderRes.ok) {
        alert(createOrderData.error || "Failed to create order.")
        return
      }

      const options = {
        key: createOrderData.key,
        amount: createOrderData.amount,
        currency: createOrderData.currency || "INR",
        name: "AlgoMaitri",
        description: `Unlock ${topicSlug}`,
        order_id: createOrderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              topicSlug,
            }),
          })

          const verifyData = await verifyRes.json()

          if (!verifyRes.ok) {
            alert(verifyData.error || "Payment verification failed.")
            return
          }

          setUnlockedTopics((prev) =>
            prev.includes(topicSlug) ? prev : [...prev, topicSlug]
          )

          if (selectedProblem?.slug === topicSlug) {
            setSelectedProblem({ ...selectedProblem })
          }

          alert("Payment successful. Problem unlocked.")
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: function () {
            setPayingSlug(null)
          },
        },
        prefill: {},
        notes: {
          topicSlug,
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert("Something went wrong while starting payment.")
    } finally {
      setPayingSlug(null)
    }
  }

  if (selectedProblem) {
    return (
      <ProblemDetail
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
        onPay={handleLockedClick}
        unlockedTopics={unlockedTopics}
        payingSlug={payingSlug}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
                  Practice Problems
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                Sorting Problems
              </h1>

              <p className="mt-3 max-w-xl text-sm md:text-[15px] leading-7 text-muted-foreground">
                Curated sorting questions with cleaner walkthroughs, company tags, and visual step-by-step execution.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                </svg>
                Last 5 problems are locked for ₹{LOCK_PRICE}
              </div>
            </div>

            <button
              onClick={() => router.push("/visualizer/sorting")}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Visualizer
            </button>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-violet-500/10 pt-6 sm:grid-cols-4">
            <StatCard label="Problems" value={SORTING_PROBLEMS.length.toString()} accent="default" />
            <StatCard label="Easy" value={counts.Easy.toString()} accent="easy" />
            <StatCard label="Medium" value={counts.Medium.toString()} accent="medium" />
            <StatCard label="Hard" value={counts.Hard.toString()} accent="hard" />
          </div>
        </div>

        <div className={cn(SOFT_PANEL, "p-4 md:p-5")}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
<div className="hidden xl:grid xl:grid-cols-[56px_minmax(260px,1.55fr)_minmax(220px,1.15fr)_100px_96px] items-center gap-4 px-6 py-4 border-b border-violet-500/8 bg-violet-500/[0.03]">          <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">#</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">Problem</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">Companies</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55 text-right">Complexity</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55 text-right">Difficulty</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <svg className="mb-3 h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                isSignedIn={!!isSignedIn}
                onLockedClick={handleLockedClick}
                unlockedTopics={unlockedTopics}
                payingSlug={payingSlug}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Stat card
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
    accent === "easy" ? "text-emerald-500" :
    accent === "medium" ? "text-amber-500" :
    accent === "hard" ? "text-rose-500" : "text-foreground"

  return (
    <div className="rounded-2xl border border-violet-500/10 bg-white/65 px-4 py-4 dark:bg-white/[0.03]">
      <div className={cn("text-2xl font-bold", accentClass)}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Color helpers for viz elements
// ─────────────────────────────────────────────────────────────
function getBarGradient(isPivot: boolean, isSorted: boolean, isSwapped: boolean, isHighlighted: boolean) {
  if (isPivot) return "from-fuchsia-500 to-purple-400"
  if (isSorted) return "from-emerald-500 to-green-400"
  if (isSwapped) return "from-rose-500 to-red-400"
  if (isHighlighted) return "from-amber-400 to-yellow-300"
  return "from-violet-600 to-blue-500"
}

function getBoxStyle(isPivot: boolean, isSorted: boolean, isSwapped: boolean, isHighlighted: boolean) {
  if (isPivot) return {
    border: "border-fuchsia-400",
    bg: "bg-fuchsia-500/15 dark:bg-fuchsia-500/20",
    text: "text-fuchsia-500",
    shadow: "shadow-[0_0_12px_rgba(217,70,239,0.3)]",
    label: "text-fuchsia-400",
  }
  if (isSorted) return {
    border: "border-emerald-400",
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    text: "text-emerald-500",
    shadow: "shadow-[0_0_10px_rgba(52,211,153,0.25)]",
    label: "text-emerald-400",
  }
  if (isSwapped) return {
    border: "border-rose-400",
    bg: "bg-rose-500/15 dark:bg-rose-500/20",
    text: "text-rose-500",
    shadow: "shadow-[0_0_10px_rgba(244,63,94,0.25)]",
    label: "text-rose-400",
  }
  if (isHighlighted) return {
    border: "border-amber-400",
    bg: "bg-amber-400/15 dark:bg-amber-400/20",
    text: "text-amber-500",
    shadow: "shadow-[0_0_10px_rgba(251,191,36,0.25)]",
    label: "text-amber-400",
  }
  return {
    border: "border-violet-500/30",
    bg: "bg-white/80 dark:bg-white/[0.06]",
    text: "text-foreground",
    shadow: "",
    label: "text-muted-foreground/50",
  }
}

// ─────────────────────────────────────────────────────────────
// Array Boxes Visualization (NeetCode style)
// ─────────────────────────────────────────────────────────────
function ArrayBoxesViz({
  array,
  highlighted,
  swapped,
  sorted,
  pivot,
  currentStep,
}: {
  array: number[]
  highlighted: number[]
  swapped: number[]
  sorted: number[]
  pivot?: number
  currentStep: number
}) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-2 px-2 py-4 min-h-[120px]">
      {array.map((val, idx) => {
        const isHighlighted = highlighted.includes(idx)
        const isSwapped = swapped.includes(idx)
        const isSorted = sorted.includes(idx)
        const isPivot = pivot === idx
        const s = getBoxStyle(isPivot, isSorted, isSwapped, isHighlighted)

        return (
          <div
            key={`box-${idx}-${currentStep}`}
            className="flex flex-col items-center gap-1"
            style={{
              animation: `boxPop 0.25s ease forwards`,
              animationDelay: `${idx * 20}ms`,
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-xl border-2 font-mono font-bold transition-all duration-300",
                s.border, s.bg, s.text, s.shadow,
                array.length <= 8 ? "w-14 h-14 text-lg" :
                array.length <= 12 ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs"
              )}
            >
              {val}
            </div>
            <span className={cn("text-[10px] font-mono", s.label)}>{idx}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Bar Chart Visualization
// ─────────────────────────────────────────────────────────────
function BarChartViz({
  array,
  highlighted,
  swapped,
  sorted,
  pivot,
  currentStep,
}: {
  array: number[]
  highlighted: number[]
  swapped: number[]
  sorted: number[]
  pivot?: number
  currentStep: number
}) {
  const maxVal = Math.max(...array, 1)

  return (
    <div className="flex h-[140px] items-end gap-1.5 overflow-x-auto px-2 pb-1">
      {array.map((val, idx) => {
        const isHighlighted = highlighted.includes(idx)
        const isSwapped = swapped.includes(idx)
        const isSorted = sorted.includes(idx)
        const isPivot = pivot === idx
        const gradient = getBarGradient(isPivot, isSorted, isSwapped, isHighlighted)
        const heightPx = Math.max((val / maxVal) * 120, 10)

        return (
          <div
            key={`bar-${idx}-${currentStep}`}
            className="flex flex-1 min-w-[20px] max-w-[48px] flex-col items-center gap-1"
          >
            <span className="text-[9px] font-mono text-muted-foreground/60">{val}</span>
            <div
              className={cn(
                "w-full rounded-t-[8px] bg-gradient-to-t transition-all duration-300",
                gradient,
                isPivot ? "shadow-[0_0_10px_rgba(217,70,239,0.4)]" :
                isSorted ? "shadow-[0_0_8px_rgba(52,211,153,0.3)]" :
                isSwapped ? "shadow-[0_0_8px_rgba(244,63,94,0.3)]" :
                isHighlighted ? "shadow-[0_0_8px_rgba(251,191,36,0.25)]" : ""
              )}
              style={{
                height: `${heightPx}px`,
                animation: `barGrow 0.25s ease forwards`,
              }}
            />
            <span className="text-[9px] font-mono text-muted-foreground/40">{idx}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Legend
// ─────────────────────────────────────────────────────────────
function VizLegend() {
  return (
    <div className="flex flex-wrap gap-3 pt-3 border-t border-violet-500/10">
      {[
        { gradient: "from-violet-600 to-blue-500", label: "Default" },
        { gradient: "from-amber-400 to-yellow-300", label: "Comparing" },
        { gradient: "from-rose-500 to-red-400", label: "Swapping" },
        { gradient: "from-emerald-500 to-green-400", label: "Sorted" },
        { gradient: "from-fuchsia-500 to-purple-400", label: "Pivot" },
      ].map(({ gradient, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn("h-3 w-3 rounded-sm bg-gradient-to-t", gradient)} />
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Detail page
// ─────────────────────────────────────────────────────────────
function ProblemDetail({
  problem,
  onBack,
  onPay,
  unlockedTopics,
  payingSlug,
}: {
  problem: SortingProblem
  onBack: () => void
  onPay: (slug: string) => void
  unlockedTopics: string[]
  payingSlug: string | null
}) {
  const { isSignedIn } = useUser()
  const [steps] = useState(() => problem.generateSteps())
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)
  const [activeTab, setActiveTab] = useState<"description" | "approaches" | "pitfalls">("description")
  const [vizMode, setVizMode] = useState<"both" | "boxes" | "bars">("both")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const locked = isProblemLocked(problem, unlockedTopics)
  const current = steps[currentStep]
  const codeLines = problem.code.split("\n")
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0
  const isPayingThis = payingSlug === problem.slug

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

  if (locked) {
    return (
      <div className="container mx-auto space-y-5">
        <div className={cn(PANEL, "p-8 md:p-10 text-center")}>
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Problems
          </button>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-500/20 bg-amber-500/10">
            <svg className="h-9 w-9 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-foreground">{problem.title}</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            This problem is locked. Sign in first, then pay ₹{LOCK_PRICE} using Razorpay to access it.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {isSignedIn ? (
              <button
                onClick={() => onPay(problem.slug)}
                disabled={isPayingThis}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] transition-all hover:shadow-[0_10px_28px_rgba(139,92,246,0.32)] disabled:opacity-70"
              >
                {isPayingThis ? "Opening Razorpay..." : `Pay ₹${LOCK_PRICE} on Razorpay`}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] transition-all hover:shadow-[0_10px_28px_rgba(139,92,246,0.32)]">
                  Sign in to Continue
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); opacity: 0.3; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        @keyframes boxPop {
          from { transform: scale(0.85); opacity: 0.4; }
          to   { transform: scale(1); opacity: 1; }
        }
        .active-line {
          background: linear-gradient(90deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.05) 55%, transparent 100%);
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
              <h1 className="truncate text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                {problem.title}
              </h1>
              <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", DIFF_STYLE[problem.difficulty])}>
                {problem.difficulty}
              </span>
            </div>
<div className="mt-4 min-w-0">
  <CompanyMarquee companies={problem.companies} speed={22} />
</div>         </div>

          <div className="flex items-center gap-1 rounded-xl border border-violet-500/15 bg-white/70 p-1 dark:bg-white/[0.03]">
            {(["both", "boxes", "bars"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setVizMode(m)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all capitalize",
                  vizMode === m
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "both" ? "Both" : m === "boxes" ? "Cells" : "Bars"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <div className={cn(PANEL, "overflow-hidden")}>
              <div className="border-b border-violet-500/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                      Step-by-Step Visualization
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground min-h-[1.5rem]">
                      {current?.message ?? "Press Play to start"}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full border border-violet-500/12 bg-violet-500/8 px-3 py-1 text-xs font-mono text-violet-500 dark:text-violet-300">
                    {currentStep + 1} / {steps.length}
                  </div>
                </div>
              </div>

              <div className="px-4 py-4 space-y-4">
                {(vizMode === "both" || vizMode === "boxes") && current && (
                  <div>
                    {vizMode === "both" && (
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-400">
                        Array Cells
                      </p>
                    )}
                    <div className="rounded-2xl border border-violet-500/8 bg-white/45 dark:bg-white/[0.02] overflow-x-auto">
                      <ArrayBoxesViz
                        array={current.array}
                        highlighted={current.highlighted}
                        swapped={current.swapped}
                        sorted={current.sorted}
                        pivot={current.pivot}
                        currentStep={currentStep}
                      />
                    </div>
                  </div>
                )}

                {(vizMode === "both" || vizMode === "bars") && current && (
                  <div>
                    {vizMode === "both" && (
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-400">
                        Bar Chart
                      </p>
                    )}
                    <div className="rounded-2xl border border-violet-500/8 bg-white/45 dark:bg-white/[0.02] px-3 pt-3 pb-2">
                      <BarChartViz
                        array={current.array}
                        highlighted={current.highlighted}
                        swapped={current.swapped}
                        sorted={current.sorted}
                        pivot={current.pivot}
                        currentStep={currentStep}
                      />
                    </div>
                  </div>
                )}

                <VizLegend />
              </div>

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
                  onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)) }}
                  className="w-full accent-violet-600"
                />
              </div>

              <div className="grid grid-cols-[48px_1fr_1.2fr_1fr] gap-2">
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStep(0) }}
                  className="flex h-11 items-center justify-center rounded-xl border border-violet-500/12 bg-white/70 transition-all hover:bg-violet-500/5 dark:bg-white/[0.03]"
                  title="Restart"
                >
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.max(0, s - 1)) }}
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
                  onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.min(steps.length - 1, s + 1)) }}
                  disabled={currentStep >= steps.length - 1}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]"
                >
                  Next ›
                </button>
              </div>

              <div className="mt-5 border-t border-violet-500/10 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Animation Speed</span>
                  <span className="text-xs font-mono text-violet-500 dark:text-violet-300">{speed}ms</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1500}
                  step={50}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-sky-400/15 bg-sky-500/[0.05] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky-400/70">Time Complexity</p>
                <p className="font-mono text-lg font-bold text-sky-500 dark:text-sky-300">{problem.timeComplexity}</p>
              </div>
              <div className="rounded-[22px] border border-violet-400/15 bg-violet-500/[0.05] p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-violet-400/70">Space Complexity</p>
                <p className="font-mono text-lg font-bold text-violet-500 dark:text-violet-300">{problem.spaceComplexity}</p>
              </div>
            </div>
          </div>
          
          

          <div className="overflow-hidden rounded-[24px] border border-violet-500/12 bg-[#0c0d11] shadow-[0_24px_70px_rgba(0,0,0,0.35)] self-start sticky top-4">
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
                        isActive ? "text-violet-400 font-bold" : "text-neutral-700"
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
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Problem</p>
                  <p className="text-sm leading-7 text-muted-foreground">{problem.description}</p>

                  <div className="mt-6 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Examples</p>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="rounded-2xl border border-violet-500/10 bg-black/10 dark:bg-black/30 p-4 font-mono text-xs">
                        <div><span className="text-neutral-500">Input: </span><span className="text-sky-400">{ex.input}</span></div>
                        <div className="mt-1"><span className="text-neutral-500">Output: </span><span className="text-emerald-400">{ex.output}</span></div>
                        {ex.explanation && <div className="mt-2 text-[10px] leading-5 text-neutral-500">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Constraints</p>
                  <div className="space-y-2">
                    {problem.constraints.map((c, i) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-violet-500 shrink-0">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-500">Hints</p>
                  <div className="space-y-2">
                    {problem.hints.map((h, i) => (
                      <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="font-semibold text-amber-500 shrink-0">{i + 1}.</span>
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
                  <div key={i} className="rounded-2xl border border-violet-500/10 bg-white/45 p-5 dark:bg-white/[0.03]">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{approach.name}</div>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="rounded-full border border-sky-400/15 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400">
                          ⏱ {approach.complexity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{approach.description}</p>
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
                  <div key={i} className="flex gap-3 rounded-2xl border border-rose-500/12 bg-rose-500/[0.04] p-4">
                    <span className="text-rose-500 shrink-0">⚠</span>
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