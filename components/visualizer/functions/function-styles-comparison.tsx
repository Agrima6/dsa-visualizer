"use client"

interface Row {
  label: string
  color: string
  detail: string
}

interface Comparison {
  name: string
  rows: Row[]
}

const COMPARISONS: Comparison[] = [
  {
    name: "Recursive vs. Iterative Factorial",
    rows: [
      {
        label: "Recursive",
        color: "#f97316",
        detail: "Elegant and mirrors the mathematical definition, but each call adds a frame to the call stack — O(n) extra space, and large n can trigger \"Maximum call stack size exceeded\".",
      },
      {
        label: "Iterative (a loop)",
        color: "#22c55e",
        detail: "Slightly less elegant to read, but uses a single stack frame no matter how large n gets — O(1) space, no risk of stack overflow.",
      },
    ],
  },
  {
    name: "Pure vs. Impure Functions",
    rows: [
      {
        label: "Pure function",
        color: "#3b82f6",
        detail: "Given the same arguments, it always returns the same result and never touches anything outside itself (no logging, no mutating external state). Easy to test, easy to reason about.",
      },
      {
        label: "Impure function",
        color: "#ef4444",
        detail: "Reads or changes something outside its own scope — a global variable, the DOM, a database, the arguments it was passed. Necessary for real work, but harder to predict and test.",
      },
    ],
  },
]

export function FunctionStylesComparison() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {COMPARISONS.map((cmp) => (
        <div
          key={cmp.name}
          className="rounded-[24px] border border-violet-500/12 bg-white/70 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.03] sm:p-6"
        >
          <h3 className="font-semibold">{cmp.name}</h3>
          <div className="mt-4 space-y-3">
            {cmp.rows.map((r) => (
              <div key={r.label} className="flex gap-3 rounded-xl border border-violet-500/10 bg-white/50 p-3 dark:bg-white/[0.02]">
                <span
                  className="mt-0.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: `${r.color}1a`, color: r.color }}
                >
                  {r.label}
                </span>
                <p className="text-xs text-muted-foreground">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
