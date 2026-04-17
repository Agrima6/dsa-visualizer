"use client"
// components/visualizer/binary-tree/binary-tree-code-view.tsx

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import {
  BINARY_TREE_PROBLEMS,
  type BinaryTreeProblem,
  type BinaryTreeVisStep,
  type BinaryTreeNodeVis,
  type Difficulty,
  type Company,
} from "./Binary tree problems data"

declare global {
  interface Window { Razorpay: any }
}

// ─────────────────────────────────────────────────────────────
// Lock config
// ─────────────────────────────────────────────────────────────
const LOCKED_IDS = new Set(BINARY_TREE_PROBLEMS.slice(-5).map(p => p.slug))
const LOCK_PRICE = 19

// ─────────────────────────────────────────────────────────────
// UI constants
// ─────────────────────────────────────────────────────────────
const DIFF_STYLE: Record<Difficulty, string> = {
  Easy:   "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  Medium: "text-amber-500  bg-amber-500/10  border border-amber-500/20",
  Hard:   "text-rose-500   bg-rose-500/10   border border-rose-500/20",
}
const TAG_STYLE = "text-[10px] font-medium px-2.5 py-1 rounded-full bg-violet-500/8 text-violet-500/80 border border-violet-500/10 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-400/10"
const PANEL     = "rounded-[24px] border border-violet-500/12 bg-white/75 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.035] dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
const SOFT_PANEL= "rounded-[20px] border border-violet-500/10 bg-white/55 backdrop-blur-xl dark:bg-white/[0.025]"

const COMPANY_LOGO_MAP: Record<Company, { src: string; label: string }> = {
  Google:       { src: "/company-logos/google.svg",       label: "Google" },
  Amazon:       { src: "/company-logos/amazon.svg",       label: "Amazon" },
  Apple:        { src: "/company-logos/apple.svg",        label: "Apple" },
  Meta:         { src: "/company-logos/meta.svg",         label: "Meta" },
  Microsoft:    { src: "/company-logos/microsoft.svg",    label: "Microsoft" },
  Netflix:      { src: "/company-logos/netflix.svg",      label: "Netflix" },
  Adobe:        { src: "/company-logos/adobe.svg",        label: "Adobe" },
  Uber:         { src: "/company-logos/uber.svg",         label: "Uber" },
  LinkedIn:     { src: "/company-logos/linkedin.svg",     label: "LinkedIn" },
  Twitter:      { src: "/company-logos/twitter.svg",      label: "Twitter" },
  ServiceNow:   { src: "/company-logos/servicenow.svg",   label: "ServiceNow" },
  Salesforce:   { src: "/company-logos/salesforce.svg",   label: "Salesforce" },
  Oracle:       { src: "/company-logos/oracle.svg",       label: "Oracle" },
  SAP:          { src: "/company-logos/sap.svg",          label: "SAP" },
  Intuit:       { src: "/company-logos/intuit.svg",       label: "Intuit" },
  PayPal:       { src: "/company-logos/paypal.svg",       label: "PayPal" },
  Stripe:       { src: "/company-logos/stripe.svg",       label: "Stripe" },
  Atlassian:    { src: "/company-logos/atlassian.svg",    label: "Atlassian" },
  Airbnb:       { src: "/company-logos/airbnb.svg",       label: "Airbnb" },
  Dropbox:      { src: "/company-logos/dropbox.svg",      label: "Dropbox" },
  Pinterest:    { src: "/company-logos/pinterest.svg",    label: "Pinterest" },
  Snap:         { src: "/company-logos/snap.svg",         label: "Snap" },
  Spotify:      { src: "/company-logos/spotify.svg",      label: "Spotify" },
  Walmart:      { src: "/company-logos/walmart.svg",      label: "Walmart" },
  Cisco:        { src: "/company-logos/cisco.svg",        label: "Cisco" },
  VMware:       { src: "/company-logos/vmware.svg",       label: "VMware" },
  Nvidia:       { src: "/company-logos/nvidia.svg",       label: "Nvidia" },
  GoldmanSachs: { src: "/company-logos/goldmansachs.svg", label: "Goldman Sachs" },
  MorganStanley:{ src: "/company-logos/morganstanley.svg",label: "Morgan Stanley" },
  Bloomberg:    { src: "/company-logos/bloomberg.svg",    label: "Bloomberg" },
  Zomato:       { src: "/company-logos/zomato.svg",       label: "Zomato" },
  Swiggy:       { src: "/company-logos/swiggy.svg",       label: "Swiggy" },
  Flipkart:     { src: "/company-logos/flipkart.svg",     label: "Flipkart" },
  Meesho:       { src: "/company-logos/meesho.svg",       label: "Meesho" },
  PhonePe:      { src: "/company-logos/phonepe.svg",      label: "PhonePe" },
}

function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" ") }
function isProblemLocked(p: BinaryTreeProblem, unlocked: string[]) {
  return LOCKED_IDS.has(p.slug) && !unlocked.includes(p.slug)
}

// ─────────────────────────────────────────────────────────────
// Company Logo + Marquee (identical to sorting)
// ─────────────────────────────────────────────────────────────
function CompanyLogoBadge({ company, compact = false }: { company: Company; compact?: boolean }) {
  const logo = COMPANY_LOGO_MAP[company]
  return (
    <div
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border border-violet-500/10 bg-white/85 shadow-sm dark:bg-white/[0.04]",
        compact ? "h-7 w-7" : "h-8 w-8")}
      title={logo?.label || company}
    >
      {logo?.src ? (
        <img src={logo.src} alt={logo.label}
          className={cn("block w-auto object-contain", compact ? "h-3.5 max-w-[14px]" : "h-4 max-w-[16px]")}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
      ) : (
        <span className={cn("font-medium text-muted-foreground", compact ? "text-[7px]" : "text-[8px]")}>
          {company.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

function CompanyMarquee({ companies, compact = false, speed = 18 }: { companies: Company[]; compact?: boolean; speed?: number }) {
  const items = [...companies, ...companies]
  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div className="flex w-max items-center gap-2.5 will-change-transform"
        style={{ animation: `companyLoop ${speed}s linear infinite` }}>
        {items.map((c, i) => <CompanyLogoBadge key={`${c}-${i}`} company={c} compact={compact} />)}
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

function StatCard({ label, value, accent }: { label: string; value: string; accent: "default" | "easy" | "medium" | "hard" }) {
  const accentClass = accent === "easy" ? "text-emerald-500" : accent === "medium" ? "text-amber-500" : accent === "hard" ? "text-rose-500" : "text-foreground"
  return (
    <div className="rounded-2xl border border-violet-500/10 bg-white/65 px-4 py-4 dark:bg-white/[0.03]">
      <div className={cn("text-2xl font-bold", accentClass)}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SVG Tree Visualizer
// ─────────────────────────────────────────────────────────────
function computePositions(
  nodeId: string | null,
  nodes: Record<string, BinaryTreeNodeVis>,
  positions: Record<string, { x: number; y: number }>,
  counter: { val: number },
  level: number
) {
  if (!nodeId || !nodes[nodeId]) return
  computePositions(nodes[nodeId].leftId, nodes, positions, counter, level + 1)
  positions[nodeId] = { x: counter.val * 64 + 32, y: level * 72 + 36 }
  counter.val++
  computePositions(nodes[nodeId].rightId, nodes, positions, counter, level + 1)
}

function getNodeColors(id: string, step: BinaryTreeVisStep) {
  if (step.path.includes(id))        return { fill: "rgba(244,63,94,0.18)",  stroke: "#f43f5e", text: "#f43f5e", glow: "drop-shadow(0 0 8px rgba(244,63,94,0.5))" }
  if (step.highlighted.includes(id)) return { fill: "rgba(139,92,246,0.18)", stroke: "#8b5cf6", text: "#8b5cf6", glow: "drop-shadow(0 0 10px rgba(139,92,246,0.5))" }
  if (step.visited.includes(id))     return { fill: "rgba(52,211,153,0.18)", stroke: "#34d399", text: "#34d399", glow: "drop-shadow(0 0 8px rgba(52,211,153,0.4))" }
  if (step.comparing.includes(id))   return { fill: "rgba(251,191,36,0.18)", stroke: "#fbbf24", text: "#f59e0b", glow: "drop-shadow(0 0 8px rgba(251,191,36,0.4))" }
  return { fill: "rgba(255,255,255,0.6)", stroke: "rgba(139,92,246,0.3)", text: "currentColor", glow: "" }
}

function TreeSVG({ step, currentStep }: { step: BinaryTreeVisStep; currentStep: number }) {
  if (!step.rootId || Object.keys(step.nodes).length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs italic text-muted-foreground/50">
        Empty tree
      </div>
    )
  }

  const positions: Record<string, { x: number; y: number }> = {}
  computePositions(step.rootId, step.nodes, positions, { val: 0 }, 0)

  const allX = Object.values(positions).map(p => p.x)
  const allY = Object.values(positions).map(p => p.y)
  const minX = Math.min(...allX) - 36
  const minY = Math.min(...allY) - 36
  const maxX = Math.max(...allX) + 36
  const maxY = Math.max(...allY) + 36
  const vw = maxX - minX
  const vh = maxY - minY

  return (
    <svg
      viewBox={`${minX} ${minY} ${vw} ${vh}`}
      className="w-full"
      style={{ maxHeight: "280px" }}
    >
      {/* edges */}
      {Object.values(step.nodes).map(node => {
        const pos = positions[node.id]
        if (!pos) return null
        return (
          <>
            {node.leftId && positions[node.leftId] && (
              <line key={`e-l-${node.id}`}
                x1={pos.x} y1={pos.y}
                x2={positions[node.leftId].x} y2={positions[node.leftId].y}
                stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" />
            )}
            {node.rightId && positions[node.rightId] && (
              <line key={`e-r-${node.id}`}
                x1={pos.x} y1={pos.y}
                x2={positions[node.rightId].x} y2={positions[node.rightId].y}
                stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" />
            )}
          </>
        )
      })}

      {/* nodes */}
      {Object.values(step.nodes).map((node, idx) => {
        const pos = positions[node.id]
        if (!pos) return null
        const c = getNodeColors(node.id, step)
        const r = 22
        return (
          <g key={`n-${node.id}-${currentStep}`}
            style={{ animation: `treeNodeIn 0.3s ease forwards`, animationDelay: `${idx * 25}ms`, opacity: 0 }}
            filter={c.glow}>
            <circle cx={pos.x} cy={pos.y} r={r}
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth="2"
              style={{ transition: "all 0.3s" }} />
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
              fontSize="12" fontWeight="700" fontFamily="monospace"
              fill={c.text}>
              {String(node.val).length > 3 ? String(node.val).slice(0, 3) : node.val}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function VizLegend() {
  return (
    <div className="flex flex-wrap gap-3 pt-3 border-t border-violet-500/10">
      {[
        { color: "border-violet-500/30 bg-white/80", label: "Default" },
        { color: "border-violet-500 bg-violet-500/18", label: "Visiting" },
        { color: "border-amber-400 bg-amber-400/18", label: "Comparing" },
        { color: "border-emerald-400 bg-emerald-500/18", label: "Done" },
        { color: "border-rose-400 bg-rose-500/18", label: "Path" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn("h-3 w-3 rounded-full border-2", color)} />
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Problem Row
// ─────────────────────────────────────────────────────────────
function ProblemRow({ problem, idx, onSelect, isSignedIn, onLockedClick, unlockedTopics, payingSlug }: {
  problem: BinaryTreeProblem; idx: number
  onSelect: (p: BinaryTreeProblem) => void; isSignedIn: boolean
  onLockedClick: (slug: string) => void; unlockedTopics: string[]; payingSlug: string | null
}) {
  const locked = isProblemLocked(problem, unlockedTopics)
  const isPayingThis = payingSlug === problem.slug

  const rowContent = (
    <div style={{ opacity: 0, animation: `fadeSlideIn 0.35s ease forwards`, animationDelay: `${idx * 40}ms` }}
      className={cn("group relative w-full text-left px-5 py-4 md:px-6 md:py-5 transition-all duration-200",
        locked ? "cursor-pointer hover:bg-amber-500/[0.04]" : "hover:bg-violet-500/[0.035]")}>
      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[56px_minmax(260px,1.55fr)_minmax(220px,1.15fr)_100px_96px] xl:items-center">
        <div className="hidden xl:block">
          <span className="text-xs font-mono text-muted-foreground/50">#{problem.id}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="xl:hidden text-[11px] font-mono text-muted-foreground/50">#{problem.id}</span>
            <h3 className={cn("truncate text-sm md:text-[15px] font-semibold transition-colors",
              locked ? "text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-300"
                     : "text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-300")}>
              {problem.title}
            </h3>
            {locked && <LockPill />}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 3).map(tag => <span key={tag} className={TAG_STYLE}>{tag}</span>)}
          </div>
          {locked && (
            <p className="mt-2 text-[11px] text-amber-600/80 dark:text-amber-300/80">
              {!isSignedIn ? "Locked · Sign in required" : isPayingThis ? "Opening Razorpay..." : `Locked · Pay ₹${LOCK_PRICE} to view`}
            </p>
          )}
        </div>
        <div className="hidden xl:block min-w-0">
          <CompanyMarquee companies={problem.companies} compact speed={18} />
        </div>
        <div className="text-xs font-mono text-muted-foreground xl:text-right">{problem.timeComplexity}</div>
        <div className="flex items-center justify-between xl:justify-end gap-3">
          <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold", DIFF_STYLE[problem.difficulty])}>
            {problem.difficulty}
          </span>
          {locked ? (
            <svg className="h-4 w-4 text-amber-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-muted-foreground/35 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )

  if (locked) {
    if (isSignedIn) return <button onClick={() => onLockedClick(problem.slug)} className="w-full text-left" disabled={isPayingThis}>{rowContent}</button>
    return <SignInButton mode="modal"><button className="w-full text-left">{rowContent}</button></SignInButton>
  }
  return <button onClick={() => onSelect(problem)} className="w-full text-left">{rowContent}</button>
}

// ─────────────────────────────────────────────────────────────
// Main list page
// ─────────────────────────────────────────────────────────────
export default function BinaryTreeCodeView() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [selectedProblem, setSelectedProblem] = useState<BinaryTreeProblem | null>(null)
  const [filterDiff, setFilterDiff] = useState<Difficulty | "All">("All")
  const [search, setSearch] = useState("")
  const [unlockedTopics, setUnlockedTopics] = useState<string[]>([])
  const [payingSlug, setPayingSlug] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnlocked = async () => {
      try {
        if (!isSignedIn) { setUnlockedTopics([]); return }
        const res = await fetch("/api/payment/unlocked", { method: "GET", cache: "no-store" })
        const data = await res.json()
        setUnlockedTopics(Array.isArray(data.unlockedTopics) ? data.unlockedTopics : [])
      } catch { setUnlockedTopics([]) }
    }
    fetchUnlocked()
  }, [isSignedIn])

  const filtered = BINARY_TREE_PROBLEMS.filter(p => {
    const matchDiff = filterDiff === "All" || p.difficulty === filterDiff
    const q = search.toLowerCase()
    return (filterDiff === "All" || matchDiff) &&
      (p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.companies.some(c => c.toLowerCase().includes(q)))
  })

  const counts = {
    Easy:   BINARY_TREE_PROBLEMS.filter(p => p.difficulty === "Easy").length,
    Medium: BINARY_TREE_PROBLEMS.filter(p => p.difficulty === "Medium").length,
    Hard:   BINARY_TREE_PROBLEMS.filter(p => p.difficulty === "Hard").length,
  }

  const loadRazorpay = () => new Promise<boolean>(resolve => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return }
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true; s.onload = () => resolve(true); s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

  const handleLockedClick = async (topicSlug: string) => {
    if (!isSignedIn) return
    try {
      setPayingSlug(topicSlug)
      if (!await loadRazorpay()) { alert("Razorpay SDK failed to load."); return }
      const orderRes = await fetch("/api/payment/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topicSlug }) })
      const orderData = await orderRes.json()
      if (!orderRes.ok) { alert(orderData.error || "Failed to create order."); return }
      new window.Razorpay({
        key: orderData.key, amount: orderData.amount, currency: orderData.currency || "INR",
        name: "AlgoMaitri", description: `Unlock ${topicSlug}`, order_id: orderData.orderId,
        handler: async (response: any) => {
          const vRes = await fetch("/api/payment/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...response, topicSlug }) })
          const vData = await vRes.json()
          if (!vRes.ok) { alert(vData.error || "Payment verification failed."); return }
          setUnlockedTopics(prev => prev.includes(topicSlug) ? prev : [...prev, topicSlug])
          alert("Payment successful. Problem unlocked.")
        },
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setPayingSlug(null) },
      }).open()
    } catch { alert("Something went wrong.") } finally { setPayingSlug(null) }
  }

  if (selectedProblem) {
    return <ProblemDetail problem={selectedProblem} onBack={() => setSelectedProblem(null)}
      onPay={handleLockedClick} unlockedTopics={unlockedTopics} payingSlug={payingSlug} />
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes companyLoop { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes treeNodeIn  { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className={cn(PANEL, "relative overflow-hidden p-6 md:p-8")}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)]" />
          <div className="absolute -top-10 left-10 h-36 w-36 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-blue-500/8 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-violet-500/10 bg-white/70 px-3 py-2 dark:bg-white/[0.04]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_6px_18px_rgba(139,92,246,0.25)]">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h14a1 1 0 010 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h9a1 1 0 010 2H5a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Practice Problems</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                Binary Tree Problems
              </h1>
              <p className="mt-3 max-w-xl text-sm md:text-[15px] leading-7 text-muted-foreground">
                Curated tree questions with animated SVG visualizations, company tags, and step-by-step code execution.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.25a4.25 4.25 0 10-8.5 0v3.25m-.75 0h10a2 2 0 012 2v6a2 2 0 01-2 2h-10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                </svg>
                Last 5 problems are locked for ₹{LOCK_PRICE}
              </div>
            </div>
            <button onClick={() => router.push("/visualizer/binary-tree")}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Visualizer
            </button>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-violet-500/10 pt-6 sm:grid-cols-4">
            <StatCard label="Problems" value={BINARY_TREE_PROBLEMS.length.toString()} accent="default" />
            <StatCard label="Easy"     value={counts.Easy.toString()}                 accent="easy" />
            <StatCard label="Medium"   value={counts.Medium.toString()}               accent="medium" />
            <StatCard label="Hard"     value={counts.Hard.toString()}                 accent="hard" />
          </div>
        </div>

        {/* Filters */}
        <div className={cn(SOFT_PANEL, "p-4 md:p-5")}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by problem, tag, or company"
                className="h-11 w-full rounded-xl border border-violet-500/15 bg-white/80 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/45 focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/15 dark:bg-white/[0.04]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
                <button key={d} onClick={() => setFilterDiff(d)}
                  className={cn("rounded-full px-4 py-2 text-xs font-semibold border transition-all",
                    filterDiff === d
                      ? d === "All" ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-[0_6px_20px_rgba(139,92,246,0.25)]"
                        : d === "Easy" ? "bg-emerald-500/12 text-emerald-600 border-emerald-500/20 dark:text-emerald-300"
                        : d === "Medium" ? "bg-amber-500/12 text-amber-600 border-amber-500/20 dark:text-amber-300"
                        : "bg-rose-500/12 text-rose-600 border-rose-500/20 dark:text-rose-300"
                      : "border-violet-500/12 bg-white/70 text-muted-foreground hover:bg-violet-500/5 dark:bg-white/[0.03]")}>
                  {d}{d !== "All" && <span className="ml-1 opacity-60">({counts[d as Difficulty]})</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={cn(PANEL, "overflow-hidden")}>
          <div className="hidden xl:grid xl:grid-cols-[56px_minmax(260px,1.55fr)_minmax(220px,1.15fr)_100px_96px] items-center gap-4 px-6 py-4 border-b border-violet-500/8 bg-violet-500/[0.03]">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/55">#</span>
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
          ) : filtered.map((p, i) => (
            <ProblemRow key={p.slug} problem={p} idx={i} onSelect={setSelectedProblem}
              isSignedIn={!!isSignedIn} onLockedClick={handleLockedClick}
              unlockedTopics={unlockedTopics} payingSlug={payingSlug} />
          ))}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Problem Detail
// ─────────────────────────────────────────────────────────────
function ProblemDetail({ problem, onBack, onPay, unlockedTopics, payingSlug }: {
  problem: BinaryTreeProblem; onBack: () => void
  onPay: (slug: string) => void; unlockedTopics: string[]; payingSlug: string | null
}) {
  const { isSignedIn } = useUser()
  const [steps]       = useState<BinaryTreeVisStep[]>(() => problem.generateSteps())
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speed, setSpeed]             = useState(700)
  const [activeTab, setActiveTab]     = useState<"description" | "approaches" | "pitfalls">("description")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const codeRef     = useRef<HTMLDivElement>(null)

  const locked       = isProblemLocked(problem, unlockedTopics)
  const current      = steps[currentStep]
  const codeLines    = problem.code.split("\n")
  const progress     = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0
  const isPayingThis = payingSlug === problem.slug

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPlaying) return
    intervalRef.current = setInterval(() => {
      setCurrentStep(s => { if (s >= steps.length - 1) { setIsPlaying(false); return s } return s + 1 })
    }, speed)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])

  useEffect(() => {
    if (!codeRef.current || !current) return
    codeRef.current.querySelector(`[data-line="${current.codeLine}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [currentStep, current])

  if (locked) {
    return (
      <div className="container mx-auto space-y-5">
        <div className={cn(PANEL, "p-8 md:p-10 text-center")}>
          <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
              <button onClick={() => onPay(problem.slug)} disabled={isPayingThis}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)] disabled:opacity-70">
                {isPayingThis ? "Opening Razorpay..." : `Pay ₹${LOCK_PRICE} on Razorpay`}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)]">
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
        @keyframes treeNodeIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes companyLoop { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .active-line { background: linear-gradient(90deg,rgba(139,92,246,0.18) 0%,rgba(139,92,246,0.05) 55%,transparent 100%); }
      `}</style>

      <div className="container mx-auto space-y-5">
        {/* Title */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <button onClick={onBack} className="mb-3 inline-flex items-center gap-2 rounded-xl border border-violet-500/15 bg-white/75 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.035] dark:hover:text-violet-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
            </div>
          </div>
        </div>

        {/* 2-col */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* Viz card */}
            <div className={cn(PANEL, "overflow-hidden")}>
              <div className="border-b border-violet-500/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
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

              <div className="px-4 py-4 space-y-4">
                {current && (
                  <div className="rounded-2xl border border-violet-500/8 bg-white/45 dark:bg-white/[0.02] overflow-x-auto">
                    <TreeSVG step={current} currentStep={currentStep} />
                  </div>
                )}
                {current?.auxiliary && current.auxiliary.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {current.auxiliary.map((a, i) => (
                      <div key={`${a.label}-${i}`} className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-2">
                        <div className="mb-0.5 text-[9px] uppercase tracking-[0.16em] text-emerald-600/75">{a.label}</div>
                        <div className="break-all font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-200">{a.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                <VizLegend />
              </div>

              <div className="h-1 bg-violet-500/8">
                <div className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div className={cn(PANEL, "p-5")}>
              <div className="mb-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="mr-2 text-xs font-semibold text-violet-500">Step {currentStep + 1}/{steps.length}</span>
                  {current?.message}
                </p>
              </div>
              <div className="mb-5">
                <input type="range" min={0} max={Math.max(steps.length - 1, 0)} value={currentStep}
                  onChange={e => { setIsPlaying(false); setCurrentStep(Number(e.target.value)) }}
                  className="w-full accent-violet-600" />
              </div>
              <div className="grid grid-cols-[48px_1fr_1.2fr_1fr] gap-2">
                <button onClick={() => { setIsPlaying(false); setCurrentStep(0) }}
                  className="flex h-11 items-center justify-center rounded-xl border border-violet-500/12 bg-white/70 transition-all hover:bg-violet-500/5 dark:bg-white/[0.03]">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s - 1)) }} disabled={currentStep === 0}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]">
                  ‹ Prev
                </button>
                <button onClick={() => setIsPlaying(p => !p)}
                  className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.24)]">
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <button onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.min(steps.length - 1, s + 1)) }} disabled={currentStep >= steps.length - 1}
                  className="h-11 rounded-xl border border-violet-500/12 bg-white/70 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 disabled:opacity-35 dark:bg-white/[0.03]">
                  Next ›
                </button>
              </div>
              <div className="mt-5 border-t border-violet-500/10 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Animation Speed</span>
                  <span className="text-xs font-mono text-violet-500">{speed}ms</span>
                </div>
                <input type="range" min={150} max={1500} step={50} value={speed}
                  onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
            </div>

            {/* Complexity */}
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

          {/* RIGHT: Code */}
          <div className="overflow-hidden rounded-[24px] border border-violet-500/12 bg-[#0c0d11] shadow-[0_24px_70px_rgba(0,0,0,0.35)] self-start sticky top-4">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-500">{problem.slug}.js</span>
              <span className="rounded-full border border-violet-400/20 bg-violet-500/12 px-2.5 py-1 text-[10px] text-violet-300">JavaScript</span>
            </div>
            <div ref={codeRef} className="max-h-[calc(100vh-160px)] overflow-y-auto font-mono text-sm leading-7">
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1
                const isActive = current?.codeLine === lineNum
                return (
                  <div key={lineNum} data-line={lineNum}
                    className={cn("flex border-l-2 transition-colors duration-200", isActive ? "active-line border-violet-500" : "border-transparent")}>
                    <span className={cn("w-12 shrink-0 select-none pr-4 text-right text-xs leading-7", isActive ? "text-violet-400 font-bold" : "text-neutral-700")}>
                      {lineNum}
                    </span>
                    <span className={cn("whitespace-pre pr-4", isActive ? "text-white" : "text-neutral-400")}>
                      {line || " "}
                    </span>
                  </div>
                )
              })}
              <div className="h-4" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={cn(PANEL, "overflow-hidden")}>
          <div className="flex border-b border-violet-500/10 px-2">
            {(["description", "approaches", "pitfalls"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn("px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all capitalize",
                  activeTab === tab ? "text-violet-500 border-b-2 border-violet-500" : "text-muted-foreground hover:text-foreground")}>
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
                        <span className="text-violet-500 shrink-0">•</span><span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-500">Hints</p>
                  <div className="space-y-2">
                    {problem.hints.map((h, i) => (
                      <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="font-semibold text-amber-500 shrink-0">{i + 1}.</span><span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "approaches" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {problem.approaches.map((a, i) => (
                  <div key={i} className="rounded-2xl border border-violet-500/10 bg-white/45 p-5 dark:bg-white/[0.03]">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{a.name}</div>
                      <span className="rounded-full border border-sky-400/15 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400 shrink-0">⏱ {a.complexity}</span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{a.description}</p>
                    <div className="mt-3">
                      <span className="rounded-full border border-violet-400/15 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-400">💾 {a.space}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "pitfalls" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {problem.pitfalls.map((p, i) => (
                  <div key={i} className="flex gap-3 rounded-2xl border border-rose-500/12 bg-rose-500/[0.04] p-4">
                    <span className="text-rose-500 shrink-0">⚠</span>
                    <p className="text-sm leading-6 text-muted-foreground">{p}</p>
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