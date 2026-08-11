// components/visualizer/recursion/recursion-problems-core.ts
// Reference implementations — factorial (simplest possible call stack),
// binary search (array + call stack), subsets (backtracking + results).
// New problem files should follow this exact shape: real `code`, and a
// `generateSteps()` that ACTUALLY RUNS that logic (or a faithful mirror
// of it) rather than describing it, pushing one `step(...)` per
// meaningful line executed.

import { RecursionProblem, frame, step } from "./recursion-problem-types"

// ════════════════════════════════════════════════════════════════
// 1. Factorial of a Number
// ════════════════════════════════════════════════════════════════
const factorial: RecursionProblem = {
  id: 1,
  slug: "factorial-of-a-number",
  title: "Factorial of a Number",
  difficulty: "Easy",
  companies: ["Amazon", "Microsoft", "Google", "Adobe"],
  tags: ["Recursion", "Base Case", "Math"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given a non-negative integer n, compute n! (n factorial) — the product of all positive integers from 1 to n. By definition, 0! = 1. This is the canonical first recursion problem: it has exactly one base case and one recursive case.",
  examples: [
    { input: "n = 5", output: "120", explanation: "5 × 4 × 3 × 2 × 1 = 120" },
    { input: "n = 0", output: "1", explanation: "0! is defined as 1." },
  ],
  constraints: ["0 ≤ n ≤ 15 (to keep the result within a safe integer range)"],
  hints: [
    "Identify the base case first: what's the smallest input you can answer immediately without recursing?",
    "The recursive case should call the function with a SMALLER version of the problem (n-1), and combine that result with the current n.",
    "Every recursive call needs to make measurable progress toward the base case, or it never terminates.",
  ],
  pitfalls: [
    "Forgetting the base case entirely — causes infinite recursion until the call stack overflows.",
    "Off-by-one in the base case (using n < 1 instead of n <= 1 works too, but n == 1 alone misses n = 0).",
    "Not returning the recursive call's result — a bare `factorial(n - 1);` without `return` produces undefined.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(n)",
      space: "O(n) — one stack frame per call",
      description: "Base case n ≤ 1 returns 1. Otherwise return n × factorial(n - 1).",
    },
    {
      name: "Iterative",
      complexity: "O(n)",
      space: "O(1)",
      description: "A simple loop multiplying a running total — no call stack growth, but less directly mirrors the mathematical definition.",
    },
  ],
  code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
  generateSteps() {
    const n = 5
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(k: number): number {
      const f = frame(`factorial(${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call factorial(${k}) — push a new frame.`))

      if (k <= 1) {
        steps.push(step(2, stack, `Base case: n=${k} ≤ 1, return 1.`))
        stack.pop()
        return 1
      }

      steps.push(step(3, stack, `n=${k} > 1 — need factorial(${k - 1}) before this call can finish.`))
      const sub = run(k - 1)
      const result = k * sub
      steps.push(step(3, stack, `factorial(${k - 1}) returned ${sub}. Compute ${k} × ${sub} = ${result}.`))
      stack.pop()
      return result
    }

    const result = run(n)
    steps.push(step(4, [], `All frames popped — factorial(${n}) = ${result}.`, { result: [`factorial(${n}) = ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Binary Search (Recursive)
// ════════════════════════════════════════════════════════════════
const binarySearch: RecursionProblem = {
  id: 2,
  slug: "binary-search-recursive",
  title: "Binary Search (Recursive)",
  difficulty: "Easy",
  companies: ["Google", "Amazon", "Microsoft", "Meta", "Flipkart"],
  tags: ["Recursion", "Array", "Divide & Conquer", "Binary Search"],
  timeComplexity: "O(log n)",
  spaceComplexity: "O(log n)",
  description:
    "Given a sorted array of integers and a target value, return the index of target if it exists, or -1 if it doesn't — implemented recursively instead of with a while loop. Each call halves the search range by comparing the target against the middle element.",
  examples: [
    { input: "arr = [2,4,6,8,10,12,14], target = 10", output: "4" },
    { input: "arr = [1,3,5], target = 4", output: "-1" },
  ],
  constraints: ["1 ≤ arr.length ≤ 10⁴", "arr is sorted in ascending order", "All elements are distinct"],
  hints: [
    "Track the search range with lo and hi parameters instead of slicing the array on every call.",
    "The base case is when the range is empty: lo > hi.",
    "Compare arr[mid] to target to decide whether to recurse into the left half or the right half — never both.",
  ],
  pitfalls: [
    "Slicing the array on every recursive call (arr.slice(...)) instead of passing lo/hi — this quietly turns an O(log n) algorithm into O(n log n) because slicing itself is O(n).",
    "Off-by-one when narrowing the range: it must be mid + 1 / mid - 1, not mid itself, or you can loop forever on a 2-element range.",
    "Integer overflow from (lo + hi) in languages with fixed-width integers — not a practical concern in JS, but worth knowing for interviews in other languages.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(log n)",
      space: "O(log n) for the call stack",
      description: "Each call handles one comparison and recurses into exactly one half of the remaining range.",
    },
    {
      name: "Iterative",
      complexity: "O(log n)",
      space: "O(1)",
      description: "The same halving logic in a while loop, avoiding call stack growth entirely.",
    },
  ],
  code: `function binarySearch(arr, target, lo, hi) {
  if (lo > hi) return -1;
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, hi);
  return binarySearch(arr, target, lo, mid - 1);
}`,
  generateSteps() {
    const arr = [2, 4, 6, 8, 10, 12, 14]
    const target = 10
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(lo: number, hi: number): number {
      const f = frame(`binarySearch(lo=${lo}, hi=${hi})`, [
        ["lo", lo],
        ["hi", hi],
      ])
      stack.push(f)
      steps.push(step(1, stack, `Call binarySearch with lo=${lo}, hi=${hi}.`, { array: arr }))

      if (lo > hi) {
        steps.push(step(2, stack, `lo=${lo} > hi=${hi} — search space is empty, return -1.`, { array: arr }))
        stack.pop()
        return -1
      }

      const mid = Math.floor((lo + hi) / 2)
      steps.push(step(3, stack, `mid = floor((${lo}+${hi})/2) = ${mid}.`, { array: arr, highlighted: [mid] }))

      if (arr[mid] === target) {
        steps.push(step(4, stack, `arr[${mid}]=${arr[mid]} equals target ${target} — found it!`, { array: arr, highlighted: [mid] }))
        stack.pop()
        return mid
      }

      let result: number
      if (arr[mid] < target) {
        steps.push(step(5, stack, `arr[${mid}]=${arr[mid]} < target=${target} — search the right half.`, { array: arr, highlighted: [mid] }))
        result = run(mid + 1, hi)
      } else {
        steps.push(step(6, stack, `arr[${mid}]=${arr[mid]} > target=${target} — search the left half.`, { array: arr, highlighted: [mid] }))
        result = run(lo, mid - 1)
      }
      stack.pop()
      return result
    }

    const result = run(0, arr.length - 1)
    steps.push(step(7, [], `Search complete — target ${target} found at index ${result}.`, { array: arr, result: [`index ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Subsets (Power Set)
// ════════════════════════════════════════════════════════════════
const subsets: RecursionProblem = {
  id: 3,
  slug: "subsets",
  title: "Subsets (Power Set)",
  difficulty: "Medium",
  companies: ["Amazon", "Meta", "Google", "Microsoft", "Uber"],
  tags: ["Recursion", "Backtracking", "Array"],
  timeComplexity: "O(n · 2ⁿ)",
  spaceComplexity: "O(n) recursion depth, O(2ⁿ) for the output",
  description:
    "Given an array of distinct integers, return all possible subsets (the power set), including the empty set and the array itself. This is the foundational backtracking pattern: at every array position, you either include it in the current subset or skip it.",
  examples: [
    { input: "nums = [1,2,3]", output: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]" },
    { input: "nums = []", output: "[[]]" },
  ],
  constraints: ["1 ≤ nums.length ≤ 10", "All integers are distinct"],
  hints: [
    "A subset is 'built' by a sequence of include/skip decisions — recursion naturally explores every combination of those decisions.",
    "Record the current path as a valid subset EVERY time you enter the recursive function, not just at the end.",
    "After exploring with an element included, remove it before trying the next candidate — that's the 'backtrack' step.",
  ],
  pitfalls: [
    "Pushing `path` directly into `result` instead of a COPY ([...path]) — since path keeps mutating, every entry in result ends up pointing at the same (eventually empty) array.",
    "Forgetting to pop after recursing — the path keeps growing and never returns to a valid prior state for sibling branches.",
    "Trying to avoid duplicates with extra checks — not needed here since all elements are distinct and each is only ever chosen once.",
  ],
  approaches: [
    {
      name: "Backtracking",
      complexity: "O(n · 2ⁿ)",
      space: "O(n)",
      description: "For each starting index, record the current path as a subset, then try including each remaining element one at a time, undoing the choice after recursing.",
    },
    {
      name: "Iterative (bit masking)",
      complexity: "O(n · 2ⁿ)",
      space: "O(1) extra (excluding output)",
      description: "Each of the 2ⁿ numbers from 0 to 2ⁿ-1, read as a bitmask, directly encodes one subset — no recursion needed.",
    },
  ],
  code: `function subsets(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}`,
  generateSteps() {
    const nums = [1, 2, 3]
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const path: number[] = []
    const result: number[][] = []

    const fmt = () => result.map((r) => `[${r.join(",")}]`)

    function backtrack(start: number) {
      const f = frame(`backtrack(start=${start})`, [["start", start]])
      stack.push(f)

      const snapshot = [...path]
      result.push(snapshot)
      steps.push(step(6, stack, `Record current subset: [${snapshot.join(",")}].`, { array: nums, result: fmt() }))

      for (let i = start; i < nums.length; i++) {
        path.push(nums[i])
        steps.push(step(8, stack, `Choose nums[${i}]=${nums[i]} → path=[${path.join(",")}].`, {
          array: nums,
          highlighted: [i],
          result: fmt(),
        }))

        backtrack(i + 1)

        path.pop()
        steps.push(step(10, stack, `Backtrack: remove ${nums[i]} → path=[${path.join(",")}].`, {
          array: nums,
          highlighted: [i],
          result: fmt(),
        }))
      }

      stack.pop()
    }

    backtrack(0)
    steps.push(step(15, [], `All ${result.length} subsets found.`, { array: nums, result: fmt() }))
    return steps
  },
}

export const RECURSION_CORE_PROBLEMS: RecursionProblem[] = [factorial, binarySearch, subsets]
