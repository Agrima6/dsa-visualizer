// components/visualizer/sorting/sorting-bug-types.ts
// "Spot the Bug" mode: each entry pairs a problem's real generateSteps()
// trace with a buggy variant that uses the SAME algorithm with one
// realistic mistake injected. The divergence point is never hand-authored
// — it's computed at runtime by diffing the two real traces, so it can
// never drift out of sync with the actual code.

import type { VisStep } from "./sorting-problems-data"

export interface SortingBugVariant {
  problemSlug: string       // must match a SortingProblem.slug
  bugTitle: string          // short label, e.g. "Off-by-one in the loop bound"
  bugExplanation: string    // shown after reveal: what's wrong and why it breaks
  buggyCode: string         // full function source with the bug injected
  generateBuggySteps: () => VisStep[]
}

function stepsEqual(a: VisStep, b: VisStep): boolean {
  return (
    a.codeLine === b.codeLine &&
    a.message === b.message &&
    a.pivot === b.pivot &&
    JSON.stringify(a.array) === JSON.stringify(b.array) &&
    JSON.stringify(a.highlighted) === JSON.stringify(b.highlighted) &&
    JSON.stringify(a.swapped) === JSON.stringify(b.swapped) &&
    JSON.stringify(a.sorted) === JSON.stringify(b.sorted)
  )
}

/**
 * First index where the buggy trace's content differs from the correct
 * trace at the same position. If one trace is a strict prefix of the
 * other (same up to the shorter length, then one just stops), the
 * divergence is reported at that shared length.
 */
export function findDivergenceIndex(correctSteps: VisStep[], buggySteps: VisStep[]): number {
  const len = Math.min(correctSteps.length, buggySteps.length)
  for (let i = 0; i < len; i++) {
    if (!stepsEqual(correctSteps[i], buggySteps[i])) return i
  }
  return len
}
