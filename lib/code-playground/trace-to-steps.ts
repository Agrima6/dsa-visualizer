import type { SortStep } from "@/components/visualizer/sorting/types"

export interface TraceEvent {
  type: "compare" | "swap" | "write"
  i: number | null
  j: number | null
  array: number[]
}

/** Converts a raw execution trace into the same SortStep shape every other
 * visualizer in this app already renders, so the code playground can reuse
 * <SortingBars> and the same step-scrubber pattern with zero new rendering
 * code. */
export function traceToSteps(
  initialArray: number[],
  trace: TraceEvent[],
  finalArray: number[],
  mutated: boolean
): SortStep[] {
  const steps: SortStep[] = [
    { array: initialArray, compared: [], swapped: [], sorted: [], message: "Starting your code..." },
  ]

  for (const event of trace) {
    if (event.type === "compare") {
      const compared = [event.i, event.j].filter((x): x is number => x !== null)
      steps.push({
        array: event.array,
        compared,
        swapped: [],
        sorted: [],
        message: compared.length === 2
          ? `Comparing index ${compared[0]} and ${compared[1]}`
          : `Comparing index ${compared[0]}`,
      })
    } else if (event.type === "swap") {
      steps.push({
        array: event.array,
        compared: [],
        swapped: [event.i as number, event.j as number],
        sorted: [],
        message: `Swapped index ${event.i} and ${event.j}`,
      })
    } else {
      steps.push({
        array: event.array,
        compared: [],
        swapped: event.i !== null ? [event.i] : [],
        sorted: [],
        message: `Wrote index ${event.i}`,
      })
    }
  }

  const isSorted = finalArray.length > 0 && finalArray.every((v, idx) => idx === 0 || finalArray[idx - 1] <= v)
  // Only claim "should be sorted" for algorithms that actually rearranged
  // the array — a pure search/read-only function (no swaps or writes)
  // isn't trying to sort anything, so warning it "isn't fully sorted"
  // would be a false, irrelevant complaint.
  const message = !mutated
    ? "Your function finished."
    : isSorted
      ? "Done — the array is sorted!"
      : "Your function finished, but the array isn't fully sorted."

  steps.push({
    array: finalArray,
    compared: [],
    swapped: [],
    sorted: mutated && isSorted ? finalArray.map((_, i) => i) : [],
    message,
  })

  return steps
}
