// Tests the pure classify() logic against operation counts computed from
// real formulas (not guessed) for each complexity class, at the exact
// input sizes the real estimator uses: [20, 40, 80, 160, 320].
import { describe, expect, it } from "vitest"
import { classify, type ComplexityDataPoint } from "@/lib/code-playground/complexity-estimator"

const SIZES = [20, 40, 80, 160, 320]

function points(opsFn: (n: number) => number): ComplexityDataPoint[] {
  return SIZES.map((n) => ({ n, ops: Math.max(opsFn(n), 1) }))
}

describe("classify", () => {
  it("recognizes O(1) — constant operation count regardless of n", () => {
    expect(classify(points(() => 1))).toBe("O(1)")
  })

  it("recognizes O(log n)", () => {
    expect(classify(points((n) => Math.ceil(Math.log2(n))))).toBe("O(log n)")
  })

  it("recognizes O(n) — e.g. a linear search that never finds its target", () => {
    expect(classify(points((n) => n))).toBe("O(n)")
  })

  it("recognizes O(n log n) — e.g. merge sort's comparison count", () => {
    expect(classify(points((n) => n * Math.log2(n)))).toBe("O(n log n)")
  })

  it("recognizes O(n²) — e.g. bubble sort's exact comparison count n(n-1)/2", () => {
    expect(classify(points((n) => (n * (n - 1)) / 2))).toBe("O(n²)")
  })

  it("recognizes O(n³)", () => {
    expect(classify(points((n) => n ** 3))).toBe("O(n³)")
  })

  it("returns Unknown for fewer than 2 data points", () => {
    expect(classify([])).toBe("Unknown")
    expect(classify([{ n: 20, ops: 5 }])).toBe("Unknown")
  })
})
