// components/visualizer/sorting/sorting-bug-data-core.ts
// Hand-authored reference "Spot the Bug" variants — see sorting-bug-types.ts.

import type { VisStep } from "./sorting-problems-data"
import type { SortingBugVariant } from "./sorting-bug-types"

function bugStep(
  arr: number[],
  highlighted: number[],
  swapped: number[],
  sorted: number[],
  message: string,
  codeLine: number,
  pivot?: number
): VisStep {
  return { array: [...arr], highlighted, swapped, sorted: [...sorted], pivot, message, codeLine }
}

// ════════════════════════════════════════════════════════════════
// Sort Colors — a copy-paste pointer mix-up: the 2-case swaps with
// `low` instead of `high` (easy mistake, since the 0-case right above
// it swaps with `low`). On this problem's real test array, it doesn't
// just misplace one element — it never makes any progress at all.
// ════════════════════════════════════════════════════════════════
const sortColorsBug: SortingBugVariant = {
  problemSlug: "sort-colors",
  bugTitle: "Swaps a 2 with `low` instead of `high`",
  bugExplanation:
    "The 2-case is supposed to swap nums[mid] with nums[high] to push the 2 to the end. This buggy version swaps with nums[low] instead — probably copy-pasted from the 0-case right above it. Since nums[low] is usually not a 2 itself, this just shuffles values around near the front without ever making progress toward the high end, and high still decrements as if the swap worked.",
  buggyCode: `function sortColors(nums) {
  // Dutch National Flag Algorithm
  let low = 0, mid = 0, high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[low]] = [nums[low], nums[mid]]; // BUG: swapped with low, not high
      high--;
    }
  }

  return nums;
}`,
  generateBuggySteps() {
    const arr = [2, 0, 2, 1, 1, 0]
    const steps: VisStep[] = []
    let low = 0, mid = 0, high = arr.length - 1
    const sortedIdx: number[] = []
    let guard = 0

    steps.push(bugStep(arr, [], [], [], "Dutch National Flag — low=0, mid=0, high=5", 3))

    while (mid <= high) {
      // A real bug can loop far longer than the correct algorithm ever would —
      // this guard just keeps the demo trace finite, it isn't part of the bug.
      if (guard++ > 30) break

      steps.push(bugStep(arr, [mid], [], sortedIdx, `Inspecting nums[mid=${mid}] = ${arr[mid]}`, 6, low))

      if (arr[mid] === 0) {
        ;[arr[low], arr[mid]] = [arr[mid], arr[low]]
        steps.push(bugStep(arr, [], [low, mid], sortedIdx, `nums[mid]=0 → swap with low=${low}`, 7))
        low++; mid++
      } else if (arr[mid] === 1) {
        steps.push(bugStep(arr, [mid], [], sortedIdx, `nums[mid]=1 → already in place, mid++`, 11))
        mid++
      } else {
        ;[arr[mid], arr[low]] = [arr[low], arr[mid]] // BUG
        steps.push(bugStep(arr, [], [mid, low], sortedIdx, `nums[mid]=2 → swap with high=${high}`, 13))
        high--
      }
    }

    steps.push(bugStep(arr, [], [], [], `Loop finished — final array: [${arr.join(",")}]`, 19))
    return steps
  },
}

export const SORTING_BUG_CORE: SortingBugVariant[] = [sortColorsBug]
