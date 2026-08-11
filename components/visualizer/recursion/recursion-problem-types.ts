// Shared types + helpers for every recursion problem file. Import from
// here in recursion-problems-{beginner,intermediate,advanced}.ts — do not
// redefine these types locally, and do not build `stack` arrays by hand.

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google"
  | "Amazon"
  | "Apple"
  | "Meta"
  | "Microsoft"
  | "Netflix"
  | "Adobe"
  | "Uber"
  | "LinkedIn"
  | "Twitter"
  | "ServiceNow"
  | "Salesforce"
  | "Oracle"
  | "SAP"
  | "Intuit"
  | "PayPal"
  | "Stripe"
  | "Atlassian"
  | "Airbnb"
  | "Dropbox"
  | "Pinterest"
  | "Snap"
  | "Spotify"
  | "Walmart"
  | "Cisco"
  | "VMware"
  | "Nvidia"
  | "GoldmanSachs"
  | "MorganStanley"
  | "Bloomberg"
  | "Zomato"
  | "Swiggy"
  | "Flipkart"
  | "Meesho"
  | "PhonePe"

export interface Approach {
  name: string
  complexity: string
  space: string
  description: string
}

export interface StackFrame {
  id: string
  label: string
  vars: { name: string; value: string }[]
}

export interface RecursionVisStep {
  codeLine: number
  stack: StackFrame[]
  /** The array/string currently being worked on, if this problem has one. */
  array?: (number | string)[]
  /** Indices into `array` currently being looked at / compared. */
  highlighted?: number[]
  /** Indices into `array` just swapped or written. */
  swapped?: number[]
  /** Accumulated results so far (subsets found, permutations found, moves made, etc). */
  result?: string[]
  message: string
}

export interface RecursionProblem {
  id: number
  slug: string
  title: string
  difficulty: Difficulty
  companies: Company[]
  tags: string[]
  timeComplexity: string
  spaceComplexity: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  hints: string[]
  pitfalls: string[]
  approaches: Approach[]
  code: string
  generateSteps: () => RecursionVisStep[]
}

let uid = 0

/**
 * Builds ONE call-stack frame. `vars` are the frame's bound parameters /
 * locals, shown under the frame's label, e.g. frame("factorial(4)", [["n", 4]]).
 */
export function frame(label: string, vars: [string, string | number][] = []): StackFrame {
  return { id: `f${uid++}`, label, vars: vars.map(([name, value]) => ({ name, value: String(value) })) }
}

/**
 * Deep-clones every frame (including its vars array) before it gets
 * embedded in a step. This is REQUIRED, not optional: frame objects get
 * mutated later in a real recursive trace (e.g. a "note" added when a
 * call returns), and without cloning, earlier steps that still hold a
 * reference to the same frame object would silently change too. This
 * exact bug already happened once in this codebase's Functions section —
 * don't reintroduce it here.
 */
function snapshotStack(stack: StackFrame[]): StackFrame[] {
  return stack.map((f) => ({ ...f, vars: f.vars.map((v) => ({ ...v })) }))
}

/**
 * Builds one RecursionVisStep. ALWAYS use this instead of constructing a
 * step object by hand — it guarantees the stack snapshot is cloned.
 */
export function step(
  codeLine: number,
  stack: StackFrame[],
  message: string,
  extra: Partial<Pick<RecursionVisStep, "array" | "highlighted" | "swapped" | "result">> = {}
): RecursionVisStep {
  return { codeLine, stack: snapshotStack(stack), message, ...extra }
}
