import { ComplexityId } from "./complexity-data"

export interface AlgoStep {
  codeLine: number
  array: number[]
  highlighted: number[]
  swapped?: number[]
  found?: number[]
  message: string
  opCount: number
}

export interface AlgorithmDemo {
  id: string
  label: string
  complexityId: ComplexityId
  code: string
  /** Runs the REAL algorithm against an n-sized input and returns every
   *  step it actually took — opCount is a running tally of real operations,
   *  not a formula. This is what keeps the demo mathematically honest. */
  run: (n: number) => { steps: AlgoStep[]; input: number[] }
  inputHint: (n: number) => string
}

function range(n: number, fn: (i: number) => number) {
  return Array.from({ length: n }, (_, i) => fn(i))
}

// ─────────────────────────────────────────────────────────────────
// O(1) — direct access
// ─────────────────────────────────────────────────────────────────
const constantAccess: AlgorithmDemo = {
  id: "constant",
  label: "Array Access",
  complexityId: "o1",
  code: `function algoMaitriGetFirst(arr) {
  return arr[0];
}`,
  inputHint: (n) => `arr has ${n} elements`,
  run(n) {
    const input = range(n, (i) => i + 1)
    const steps: AlgoStep[] = [
      {
        codeLine: 2,
        array: input,
        highlighted: [0],
        message: `Grab arr[0] directly. One operation — completely independent of the other ${n - 1} elements.`,
        opCount: 1,
      },
    ]
    return { steps, input }
  },
}

// ─────────────────────────────────────────────────────────────────
// O(log n) — binary search (searches for a value that isn't present,
// which deterministically forces the full worst-case step count).
// ─────────────────────────────────────────────────────────────────
const binarySearch: AlgorithmDemo = {
  id: "binary-search",
  label: "Binary Search",
  complexityId: "ologn",
  code: `function algoMaitriBinarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}`,
  inputHint: (n) => `sorted array of ${n}, searching for a value that isn't there (worst case)`,
  run(n) {
    const input = range(n, (i) => i * 2)
    const target = -1
    const steps: AlgoStep[] = []
    const lo = 0
    let hi = input.length - 1
    let ops = 0

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      ops++
      steps.push({
        codeLine: 7,
        array: input,
        highlighted: [mid],
        message: `Check middle (index ${mid}, value ${input[mid]}) — not a match, and target is smaller, so discard the right half.`,
        opCount: ops,
      })
      hi = mid - 1
    }

    steps.push({
      codeLine: 11,
      array: input,
      highlighted: [],
      message: `Search space exhausted after ${ops} comparison${ops === 1 ? "" : "s"} — not found.`,
      opCount: ops,
    })

    return { steps, input }
  },
}

// ─────────────────────────────────────────────────────────────────
// O(n) — linear search (target not present → full worst-case scan)
// ─────────────────────────────────────────────────────────────────
const linearSearch: AlgorithmDemo = {
  id: "linear-search",
  label: "Linear Search",
  complexityId: "on",
  code: `function algoMaitriLinearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
  inputHint: (n) => `array of ${n}, searching for a value that isn't there (worst case)`,
  run(n) {
    const input = range(n, (i) => i + 1)
    const target = -1
    const steps: AlgoStep[] = []
    let ops = 0

    for (let i = 0; i < input.length; i++) {
      ops++
      steps.push({
        codeLine: 3,
        array: input,
        highlighted: [i],
        message: `Check index ${i} (value ${input[i]}) — no match, move to the next one.`,
        opCount: ops,
      })
    }

    steps.push({
      codeLine: 5,
      array: input,
      highlighted: [],
      message: `Reached the end after checking all ${ops} elements — not found.`,
      opCount: ops,
    })

    return { steps, input }
  },
}

// ─────────────────────────────────────────────────────────────────
// O(n²) — bubble sort on a reverse-sorted array (guarantees max swaps,
// but the *comparison* count is fixed at n(n-1)/2 regardless of data).
// ─────────────────────────────────────────────────────────────────
const bubbleSort: AlgorithmDemo = {
  id: "bubble-sort",
  label: "Bubble Sort",
  complexityId: "on2",
  code: `function algoMaitriBubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  inputHint: (n) => `reverse-sorted array of ${n} (worst case — maximum swaps)`,
  run(n) {
    const arr = range(n, (i) => n - i)
    const input = [...arr]
    const steps: AlgoStep[] = []
    let ops = 0

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        ops++
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          steps.push({
            codeLine: 5,
            array: [...arr],
            highlighted: [j, j + 1],
            swapped: [j, j + 1],
            message: `Compare index ${j} and ${j + 1} — out of order, swap them.`,
            opCount: ops,
          })
        } else {
          steps.push({
            codeLine: 4,
            array: [...arr],
            highlighted: [j, j + 1],
            message: `Compare index ${j} and ${j + 1} — already in order.`,
            opCount: ops,
          })
        }
      }
    }

    steps.push({
      codeLine: 9,
      array: [...arr],
      highlighted: [],
      found: range(arr.length, (i) => i),
      message: `Sorted after ${ops} comparisons — exactly n(n-1)/2 for n = ${n}.`,
      opCount: ops,
    })

    return { steps, input }
  },
}

// ─────────────────────────────────────────────────────────────────
// O(n log n) — merge sort on a reverse-sorted array, in-place on a
// shared working array so absolute indices stay meaningful to show.
// ─────────────────────────────────────────────────────────────────
const mergeSortDemo: AlgorithmDemo = {
  id: "merge-sort",
  label: "Merge Sort",
  complexityId: "onlogn",
  code: `function algoMaitriMergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = algoMaitriMergeSort(arr.slice(0, mid));
  const right = algoMaitriMergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  inputHint: (n) => `reverse-sorted array of ${n}`,
  run(n) {
    const arr = range(n, (i) => n - i)
    const input = [...arr]
    const steps: AlgoStep[] = []
    let ops = 0

    function sort(lo: number, hi: number): number[] {
      if (hi - lo <= 1) return [arr[lo]]
      const mid = lo + Math.floor((hi - lo) / 2)
      const left = sort(lo, mid)
      const right = sort(mid, hi)

      let i = 0
      let j = 0
      let k = lo
      while (i < left.length && j < right.length) {
        ops++
        if (left[i] <= right[j]) {
          arr[k] = left[i++]
        } else {
          arr[k] = right[j++]
        }
        steps.push({
          codeLine: 16,
          array: [...arr],
          highlighted: [k],
          message: `Merge step: compare fronts of the two sorted halves, place the smaller (${arr[k]}) at index ${k}.`,
          opCount: ops,
        })
        k++
      }
      while (i < left.length) arr[k] = left[i++], k++
      while (j < right.length) arr[k] = right[j++], k++

      return arr.slice(lo, hi)
    }

    sort(0, arr.length)

    steps.push({
      codeLine: 8,
      array: [...arr],
      highlighted: [],
      found: range(arr.length, (i) => i),
      message: `Fully merged after ${ops} comparisons — close to n·log₂(n) ≈ ${Math.round(n * Math.log2(Math.max(n, 2)))} for n = ${n}.`,
      opCount: ops,
    })

    return { steps, input }
  },
}

export const ALGORITHM_DEMOS: AlgorithmDemo[] = [
  constantAccess,
  binarySearch,
  linearSearch,
  mergeSortDemo,
  bubbleSort,
]
