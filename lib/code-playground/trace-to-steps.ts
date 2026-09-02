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
  mutated: boolean,
  expectSorted: boolean
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
  // the array (no swaps or writes means a pure search/read-only function,
  // which isn't trying to sort anything) AND are expected to sort in the
  // first place — a reverse, dedupe, or rotate function correctly leaves
  // the array unsorted, so asserting it "isn't fully sorted" there would
  // be a false, misleading complaint about correct code.
  const checkSorted = mutated && expectSorted
  const message = !checkSorted
    ? "Your function finished."
    : isSorted
      ? "Done — the array is sorted!"
      : "Your function finished, but the array isn't fully sorted."

  steps.push({
    array: finalArray,
    compared: [],
    swapped: [],
    sorted: checkSorted && isSorted ? finalArray.map((_, i) => i) : [],
    message,
  })

  return steps
}
