// lib/code-playground/complexity-estimator.ts
//
// The empirical Big-O detector: runs the user's own code at several input
// sizes, using the exact same instrumentation runner.ts already has (no
// new instrumentation needed — comparisons + swaps + writes is already
// computed per run), and fits how that operation count actually grows
// against n to a familiar complexity class. Nobody else in this space
// tells you your algorithm's real growth rate from its own execution
// instead of asking you to already know Big-O notation to use the tool.
//
// This is an *average-case, random-input* measurement, not a worst-case
// proof — an algorithm whose behavior depends on already-sorted or
// adversarial input (e.g. quicksort's O(n²) worst case) will typically
// show its average-case growth rate here, not its worst case. That's a
// real, disclosed limitation, not a bug: proving worst-case complexity
// would need adversarial input generation per algorithm shape, which is a
// much bigger problem than this feature is trying to solve.
import { runUserSortCode } from "./runner"

export interface ComplexityDataPoint {
  n: number
  ops: number
}

export type ComplexityClass = "O(1)" | "O(log n)" | "O(n)" | "O(n log n)" | "O(n²)" | "O(n³)" | "Unknown"

export interface ComplexityResult {
  dataPoints: ComplexityDataPoint[]
  bestFit: ComplexityClass
  error: string | null
}

const SIZES = [20, 40, 80, 160, 320]

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * n * 10))
}

/**
 * Classifies growth by the average exponent k such that ops ~ n^k,
 * estimated from consecutive doublings: k = log(opsRatio) / log(nRatio).
 * O(n log n) doesn't have a clean constant exponent, so it's detected
 * separately as "grows faster than linear, but the ratio itself is
 * shrinking toward 1 as n grows" — the signature of a log factor easing
 * off relative to n, versus O(n²) where the ratio stays ~4 every doubling.
 */
export function classify(points: ComplexityDataPoint[]): ComplexityClass {
  if (points.length < 2) return "Unknown"

  const exponents: number[] = []
  for (let i = 1; i < points.length; i++) {
    const nRatio = points[i].n / points[i - 1].n
    const opsRatio = points[i].ops / points[i - 1].ops
    if (opsRatio <= 0) return "Unknown"
    exponents.push(Math.log(opsRatio) / Math.log(nRatio))
  }

  const avg = exponents.reduce((a, b) => a + b, 0) / exponents.length

  if (avg < 0.15) return "O(1)"
  if (avg < 0.65) return "O(log n)"

  // Distinguish O(n) from O(n log n): both start near exponent 1, but
  // O(n log n)'s exponent keeps drifting upward across later doublings
  // (log n keeps growing), while true O(n)'s stays flat near 1.
  if (avg < 1.15) {
    const drifting = exponents.length >= 2 && exponents[exponents.length - 1] - exponents[0] > 0.15
    return drifting ? "O(n log n)" : "O(n)"
  }
  if (avg < 1.7) return "O(n log n)"
  if (avg < 2.5) return "O(n²)"
  return "O(n³)"
}

export async function estimateComplexity(
  code: string,
  expectSorted: boolean,
  onProgress?: (completed: number, total: number) => void
): Promise<ComplexityResult> {
  const dataPoints: ComplexityDataPoint[] = []
  let error: string | null = null

  // A single random array per size is noisy enough to break the whole
  // estimate — caught live: Linear Search searching for a fixed target
  // got "lucky" on one random array at n=160 (found it almost
  // immediately), producing an op count *lower* than n=20's, which threw
  // off the ratio-based classifier into reporting O(n log n) for a
  // straightforwardly O(n) function. Taking the max over several trials
  // per size is much closer to that size's typical/worst case and isn't
  // thrown off by one early-exit fluke.
  const TRIALS_PER_SIZE = 4

  for (let i = 0; i < SIZES.length; i++) {
    const n = SIZES[i]
    try {
      let maxOps = 0
      for (let t = 0; t < TRIALS_PER_SIZE; t++) {
        const result = await runUserSortCode(code, randomArray(n), expectSorted)
        maxOps = Math.max(maxOps, result.comparisons + result.swaps + result.writes)
      }
      // A function with zero comparisons/swaps/writes at every size (e.g.
      // it only ever reads .length, or always returns a constant) is
      // genuinely O(1) — not a measurement failure — so it's kept, not
      // dropped, and Math.max(…, 1) below just avoids a log(0) in classify().
      dataPoints.push({ n, ops: Math.max(maxOps, 1) })
    } catch (err) {
      // Stop at the first size that errors/times out (e.g. genuinely
      // exponential blowup) rather than failing the whole estimate —
      // whatever sizes completed still say something real about growth.
      error = err instanceof Error ? err.message : "Failed to run at a larger size."
      break
    }
    onProgress?.(i + 1, SIZES.length)
  }

  return { dataPoints, bestFit: classify(dataPoints), error }
}
