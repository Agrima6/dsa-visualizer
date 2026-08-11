export type ComplexityId = "o1" | "ologn" | "on" | "onlogn" | "on2" | "o2n"

export interface ComplexityInfo {
  id: ComplexityId
  label: string
  notation: string
  color: string
  /** Exact operation count for a given n — the single source of truth for
   *  every number shown across the growth explorer, graph, and code demos. */
  ops: (n: number) => number
  analogy: {
    title: string
    text: string
  }
  blurb: string
}

export const COMPLEXITIES: ComplexityInfo[] = [
  {
    id: "o1",
    label: "Constant",
    notation: "O(1)",
    color: "#22c55e",
    ops: () => 1,
    analogy: {
      title: "Grabbing the top book off a stack",
      text: "Doesn't matter if the stack has 10 books or 10 million — you always just take the top one. No searching involved.",
    },
    blurb: "The work stays exactly the same no matter how big the input gets.",
  },
  {
    id: "ologn",
    label: "Logarithmic",
    notation: "O(log n)",
    color: "#3b82f6",
    ops: (n) => Math.max(1, Math.ceil(Math.log2(Math.max(1, n)))),
    analogy: {
      title: "Finding a name in a phone book",
      text: "You open to the middle, see you've gone too far, flip to the middle of the remaining half, and repeat. Each step throws away half the problem.",
    },
    blurb: "The work grows, but incredibly slowly — doubling the input adds just one more step.",
  },
  {
    id: "on",
    label: "Linear",
    notation: "O(n)",
    color: "#eab308",
    ops: (n) => n,
    analogy: {
      title: "Reading every page of a book",
      text: "To find a specific sentence with no index, you check page 1, then page 2, then page 3... A book twice as long takes twice as long to read.",
    },
    blurb: "The work grows in direct proportion to the input — double the input, double the work.",
  },
  {
    id: "onlogn",
    label: "Linearithmic",
    notation: "O(n log n)",
    color: "#f97316",
    ops: (n) => Math.max(1, Math.ceil(n * Math.log2(Math.max(1, n)))),
    analogy: {
      title: "Sorting a deck by repeatedly merging piles",
      text: "Split the deck in half again and again (log n splits), then merge everything back together in order (n work per merge pass).",
    },
    blurb: "Slightly worse than linear — the classic signature of a good sorting algorithm.",
  },
  {
    id: "on2",
    label: "Quadratic",
    notation: "O(n²)",
    color: "#ef4444",
    ops: (n) => n * n,
    analogy: {
      title: "Everyone shaking hands with everyone",
      text: "In a room of n people, each person shakes n others' hands. Twice as many people means roughly four times as many handshakes.",
    },
    blurb: "The work explodes as a square of the input — fine for small n, painful past a few thousand.",
  },
  {
    id: "o2n",
    label: "Exponential",
    notation: "O(2ⁿ)",
    color: "#a855f7",
    ops: (n) => Math.pow(2, Math.min(n, 1000)),
    analogy: {
      title: "Guessing every possible password",
      text: "Each extra character multiplies the number of combinations to try. Add one more digit and the search space doubles.",
    },
    blurb: "The work doubles with every single extra input — becomes impossible shockingly fast.",
  },
]

export function getComplexity(id: ComplexityId): ComplexityInfo {
  return COMPLEXITIES.find((c) => c.id === id)!
}

export function formatOps(n: number): string {
  const rounded = Math.round(n)
  // Fixed to en-US on purpose: the visitor's locale can produce very long
  // digit groupings (e.g. Indian lakh/crore commas) that overflow the
  // fixed-width value column, and "1.2B" reads faster than either anyway.
  if (rounded >= 100_000) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(rounded)
  }
  return new Intl.NumberFormat("en-US").format(rounded)
}
