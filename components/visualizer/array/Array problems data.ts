// components/visualizer/array/array-problems-data.ts

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google" | "Amazon" | "Apple" | "Meta" | "Microsoft"
  | "Netflix" | "Adobe" | "Uber" | "LinkedIn" | "Twitter"
  | "ServiceNow" | "Salesforce" | "Oracle" | "SAP" | "Intuit"
  | "PayPal" | "Stripe" | "Atlassian" | "Airbnb" | "Dropbox"
  | "Pinterest" | "Snap" | "Spotify" | "Walmart" | "Cisco"
  | "VMware" | "Nvidia" | "GoldmanSachs" | "MorganStanley" | "Bloomberg"
  | "Zomato" | "Swiggy" | "Flipkart" | "Meesho" | "PhonePe"

export interface Approach {
  name: string
  complexity: string
  space: string
  description: string
}

export interface ArrayVisStep {
  array: number[]
  highlighted: number[]
  swapped: number[]
  sorted: number[]
  pointer?: number
  message: string
  codeLine: number
  auxiliary?: { label: string; value: string | number }[]
}

export interface ArrayProblem {
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
  generateSteps: () => ArrayVisStep[]
}

function astep(
  arr: number[],
  highlighted: number[],
  swapped: number[],
  sorted: number[],
  message: string,
  codeLine: number,
  auxiliary?: { label: string; value: string | number }[],
  pointer?: number
): ArrayVisStep {
  return { array: [...arr], highlighted, swapped, sorted: [...sorted], message, codeLine, auxiliary, pointer }
}

// ════════════════════════════════════════════════════════════════
// 1. Concatenation of Array
// ════════════════════════════════════════════════════════════════
const concatenationOfArray: ArrayProblem = {
  id: 1,
  slug: "concatenation-of-array",
  title: "Concatenation of Array",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe"],
  tags: ["Array"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an integer array nums of length n, you want to create an array ans of length 2n where ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n. Specifically, ans is the concatenation of two nums arrays. Return the array ans.",
  examples: [
    { input: "nums = [1,2,1]", output: "[1,2,1,1,2,1]" },
    { input: "nums = [1,3,2,1]", output: "[1,3,2,1,1,3,2,1]" },
  ],
  constraints: [
    "n == nums.length",
    "1 ≤ n ≤ 1000",
    "1 ≤ nums[i] ≤ 1000",
  ],
  hints: [
    "Simply place each element at index i and index i+n.",
    "You can spread or concat the array twice.",
    "Loop once and assign to both halves.",
  ],
  pitfalls: [
    "Over-thinking it — it's literally just doubling the array.",
    "Using splice or push in a loop when spread/concat is cleaner.",
  ],
  approaches: [
    { name: "Spread / Concat", complexity: "O(n)", space: "O(n)", description: "Return [...nums, ...nums]. One line." },
    { name: "Manual Loop", complexity: "O(n)", space: "O(n)", description: "Create result[2n], assign nums[i] and nums[i+n] in one loop." },
  ],
  code: `function getConcatenation(nums) {
  const n = nums.length;
  const ans = new Array(2 * n);

  for (let i = 0; i < n; i++) {
    ans[i]     = nums[i];
    ans[i + n] = nums[i];
  }

  return ans;
}`,
  generateSteps() {
    const arr = [1, 2, 3]
    const n = arr.length
    const result = new Array(2 * n).fill(0)
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `n=${n}. Build result of length ${2 * n}.`, 1))
    for (let i = 0; i < n; i++) {
      result[i] = arr[i]
      result[i + n] = arr[i]
      sorted.push(i, i + n)
      steps.push(astep(result, [i, i + n], [], sorted,
        `ans[${i}] = ans[${i + n}] = nums[${i}] = ${arr[i]}`, 5,
        [{ label: "i", value: i }]))
    }
    steps.push(astep(result, [], [], sorted, `Done! ans = [${result}] ✓`, 8,
      [{ label: "result", value: `[${result}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Contains Duplicate
// ════════════════════════════════════════════════════════════════
const containsDuplicate: ArrayProblem = {
  id: 2,
  slug: "contains-duplicate",
  title: "Contains Duplicate",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Flipkart", "Zomato"],
  tags: ["Array", "Hash Set", "Sorting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "true" },
    { input: "nums = [1,2,3,4]", output: "false" },
    { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
  ],
  hints: [
    "Use a HashSet — add each element and check if it was already present.",
    "If set.has(num) before adding → duplicate found.",
    "Early exit as soon as you find a duplicate.",
  ],
  pitfalls: [
    "Sorting first works (O(n log n)) but isn't optimal — HashSet is O(n).",
    "Using nested loops is O(n²) — too slow for large inputs.",
    "Not returning false at the end if no duplicates are found.",
  ],
  approaches: [
    { name: "HashSet", complexity: "O(n)", space: "O(n)", description: "Add each element to a set. If it already exists → return true." },
    { name: "Sort then scan", complexity: "O(n log n)", space: "O(1)", description: "Sort the array. If adjacent elements are equal → duplicate found." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(1)", description: "For each element, check all subsequent elements." },
  ],
  code: `function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) {
      return true; // duplicate found!
    }
    seen.add(num);
  }

  return false; // all distinct
}`,
  generateSteps() {
    const arr = [1, 2, 3, 1]
    const steps: ArrayVisStep[] = []
    const seen = new Set<number>()
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Init empty HashSet. Scan each element.", 2))
    for (let i = 0; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `Check num=${arr[i]}. Is it in the set? set=${JSON.stringify([...seen])}`, 4,
        [{ label: "set size", value: seen.size }]))
      if (seen.has(arr[i])) {
        steps.push(astep(arr, [], [i], sorted,
          `${arr[i]} already in set → DUPLICATE! return true ✓`, 5,
          [{ label: "duplicate", value: arr[i] }, { label: "result", value: "true" }]))
        return steps
      }
      seen.add(arr[i])
      sorted.push(i)
      steps.push(astep(arr, [], [], sorted,
        `${arr[i]} not in set → add it. set=${JSON.stringify([...seen])}`, 7,
        [{ label: "set", value: JSON.stringify([...seen]) }]))
    }
    steps.push(astep(arr, [], [], sorted,
      "All elements processed, no duplicates found → return false ✓", 10,
      [{ label: "result", value: "false" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Two Sum
// ════════════════════════════════════════════════════════════════
const twoSum: ArrayProblem = {
  id: 4,
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Adobe", "Swiggy", "Meesho", "PhonePe"],
  tags: ["Array", "Hash Map"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    { input: "nums = [3,3], target = 6", output: "[0,1]" },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  hints: [
    "For each num, the complement you need is target - num.",
    "Store each number's index in a map. Check if the complement is already there.",
    "One pass — check AND insert in the same loop.",
  ],
  pitfalls: [
    "Brute force O(n²) double loop — too slow.",
    "Using indices from a sorted version — they won't match the original.",
    "Using the same element twice (e.g., target=6, num=3 — need two separate 3s).",
  ],
  approaches: [
    { name: "HashMap (one pass)", complexity: "O(n)", space: "O(n)", description: "For each num, check if complement (target - num) exists in map. If yes → answer. If no → add to map." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(1)", description: "For every pair (i, j), check if nums[i] + nums[j] == target." },
  ],
  code: `function twoSum(nums, target) {
  const map = new Map(); // val → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return []; // no solution
}`,
  generateSteps() {
    const arr = [2, 7, 11, 15]
    const target = 9
    const steps: ArrayVisStep[] = []
    const map = new Map<number, number>()
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `target=${target}. Init empty HashMap.`, 1))
    for (let i = 0; i < arr.length; i++) {
      const complement = target - arr[i]
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}, num=${arr[i]}. complement = ${target}-${arr[i]} = ${complement}. In map?`, 5,
        [{ label: "num", value: arr[i] }, { label: "complement", value: complement }]))
      if (map.has(complement)) {
        const j = map.get(complement)!
        steps.push(astep(arr, [], [j, i], sorted,
          `Found! map[${complement}]=${j}. Return [${j}, ${i}] ✓`, 6,
          [{ label: "result", value: `[${j}, ${i}]` }]))
        return steps
      }
      map.set(arr[i], i)
      sorted.push(i)
      steps.push(astep(arr, [], [], sorted,
        `${complement} not in map. Add ${arr[i]}→${i} to map.`, 9,
        [{ label: "map size", value: map.size }]))
    }
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Remove Element
// ════════════════════════════════════════════════════════════════
const removeElement: ArrayProblem = {
  id: 7,
  slug: "remove-element",
  title: "Remove Element",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Bloomberg"],
  tags: ["Array", "Two Pointers"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums and an integer val, remove all occurrences of val in-place. The order of the elements may be changed. Return k after placing the final result in the first k slots of nums.",
  examples: [
    { input: "nums = [3,2,2,3], val = 3", output: "2, nums = [2,2,_,_]" },
    { input: "nums = [0,1,2,2,3,0,4,2], val = 2", output: "5, nums = [0,1,4,0,3,_,_,_]" },
  ],
  constraints: [
    "0 ≤ nums.length ≤ 100",
    "0 ≤ nums[i] ≤ 50",
    "0 ≤ val ≤ 100",
  ],
  hints: [
    "Use a write pointer k. Advance the read pointer i always.",
    "Copy nums[i] to nums[k] only when nums[i] !== val.",
    "Return k at the end.",
  ],
  pitfalls: [
    "Creating a new array — not in-place.",
    "Forgetting that order doesn't need to be preserved — swap trick is valid.",
    "Off-by-one on the return value.",
  ],
  approaches: [
    { name: "Two Pointers (overwrite)", complexity: "O(n)", space: "O(1)", description: "k tracks write position. Copy non-val elements forward. Return k." },
    { name: "Swap with end", complexity: "O(n)", space: "O(1)", description: "When nums[i] == val, swap with last element and shrink array size." },
  ],
  code: `function removeElement(nums, val) {
  let k = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k;
}`,
  generateSteps() {
    const arr = [3, 2, 2, 3]
    const val = 3
    const steps: ArrayVisStep[] = []
    let k = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `val=${val}. k=0 (write pointer).`, 1))
    for (let i = 0; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}: nums[${i}]=${arr[i]}. Is it ${val}?`, 3,
        [{ label: "k", value: k }]))
      if (arr[i] !== val) {
        arr[k] = arr[i]
        sorted.push(k)
        steps.push(astep(arr, [], [k], sorted,
          `${arr[k]} ≠ ${val} → copy to nums[${k}]. k++=${k + 1}`, 4,
          [{ label: "k", value: k + 1 }]))
        k++
      } else {
        steps.push(astep(arr, [i], [], sorted, `${val} == val → skip`, 3))
      }
    }
    steps.push(astep(arr, [], [], sorted, `k=${k} elements kept ✓`, 8,
      [{ label: "result k", value: k }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Sort Colors (Dutch National Flag)
// ════════════════════════════════════════════════════════════════
const sortColors: ArrayProblem = {
  id: 12,
  slug: "sort-colors",
  title: "Sort Colors",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Nvidia", "Walmart"],
  tags: ["Array", "Two Pointers", "Sorting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array nums with n objects colored red, white, or blue, represented as integers 0, 1, and 2 respectively, sort them in-place so that objects of the same color are adjacent, with colors in order red, white, and blue. You must solve this without using the library's sort function.",
  examples: [
    { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
    { input: "nums = [2,0,1]", output: "[0,1,2]" },
  ],
  constraints: [
    "n == nums.length",
    "1 ≤ n ≤ 300",
    "nums[i] is 0, 1, or 2.",
  ],
  hints: [
    "Dutch National Flag: three pointers — low, mid, high.",
    "low tracks next 0 position, high tracks next 2 position, mid scans.",
    "If nums[mid]==0: swap with low, advance both. If 2: swap with high, decrement high. If 1: just advance mid.",
  ],
  pitfalls: [
    "Two-pass counting sort works but uses O(1) passes on sorted values, not O(1) true in-place.",
    "Not decrementing high (only) when swapping with high — mid should NOT advance after swapping a 2.",
    "Forgetting that after swapping nums[mid] with low, the swapped value at mid needs checking.",
  ],
  approaches: [
    { name: "Dutch National Flag (3 pointers)", complexity: "O(n)", space: "O(1)", description: "Three pointers: lo, mid, hi. One pass partitions 0s left, 2s right, 1s middle." },
    { name: "Count and overwrite", complexity: "O(n)", space: "O(1)", description: "Count 0s, 1s, 2s. Overwrite array with correct counts." },
  ],
  code: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;

  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    } else {
      mid++;
    }
  }
}`,
  generateSteps() {
    const arr = [2, 0, 2, 1, 1, 0]
    const steps: ArrayVisStep[] = []
    let lo = 0, mid = 0, hi = arr.length - 1
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `lo=0, mid=0, hi=${hi}. Dutch National Flag.`, 1))
    while (mid <= hi) {
      steps.push(astep(arr, [mid], [], sorted,
        `nums[mid=${mid}]=${arr[mid]}. lo=${lo}, hi=${hi}`, 3,
        [{ label: "lo", value: lo }, { label: "mid", value: mid }, { label: "hi", value: hi }]))
      if (arr[mid] === 0) {
        ;[arr[lo], arr[mid]] = [arr[mid], arr[lo]]
        sorted.push(lo)
        steps.push(astep(arr, [], [lo, mid], sorted,
          `0 → swap arr[lo=${lo}] ↔ arr[mid=${mid}]. lo++, mid++`, 4))
        lo++; mid++
      } else if (arr[mid] === 2) {
        ;[arr[mid], arr[hi]] = [arr[hi], arr[mid]]
        sorted.push(hi)
        steps.push(astep(arr, [], [mid, hi], sorted,
          `2 → swap arr[mid=${mid}] ↔ arr[hi=${hi}]. hi--`, 7))
        hi--
      } else {
        sorted.push(mid)
        steps.push(astep(arr, [], [], sorted, `1 → already in place. mid++`, 9))
        mid++
      }
    }
    steps.push(astep(arr, [], [], [0,1,2,3,4,5], `Sorted: [${arr}] ✓`, 11,
      [{ label: "result", value: `[${arr}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Best Time to Buy and Sell Stock
// ════════════════════════════════════════════════════════════════
const bestTimeToBuy: ArrayProblem = {
  id: 37,
  slug: "best-time-to-buy-and-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "GoldmanSachs", "Bloomberg", "Flipkart"],
  tags: ["Array", "Sliding Window", "Greedy"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and a different future day to sell it. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
  examples: [
    { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 5." },
    { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction possible." },
  ],
  constraints: [
    "1 ≤ prices.length ≤ 10⁵",
    "0 ≤ prices[i] ≤ 10⁴",
  ],
  hints: [
    "Track the minimum price seen so far (best buy day).",
    "For each price, compute profit = price - minPrice. Update maxProfit.",
    "One pass, no nested loops needed.",
  ],
  pitfalls: [
    "Trying to find the global max and global min — you must buy BEFORE you sell.",
    "Using nested loops O(n²) — unnecessary.",
    "Not initialising minPrice before the loop.",
  ],
  approaches: [
    { name: "Greedy (one pass)", complexity: "O(n)", space: "O(1)", description: "Track min price seen so far. At each price, update profit = price - minPrice. Track max profit seen." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(1)", description: "Try every buy-sell pair. O(n²) — correct but too slow." },
  ],
  code: `function maxProfit(prices) {
  let minPrice  = Infinity;
  let maxProfit = 0;

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i]; // new best buy day
    } else {
      const profit = prices[i] - minPrice;
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}`,
  generateSteps() {
    const arr = [7, 1, 5, 3, 6, 4]
    const steps: ArrayVisStep[] = []
    let minPrice = Infinity, maxProfit = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "minPrice=∞, maxProfit=0. Scan each price.", 1))
    for (let i = 0; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `price=${arr[i]}. Is ${arr[i]} < minPrice=${minPrice === Infinity ? "∞" : minPrice}?`, 5,
        [{ label: "minPrice", value: minPrice === Infinity ? "∞" : minPrice }, { label: "maxProfit", value: maxProfit }]))
      if (arr[i] < minPrice) {
        minPrice = arr[i]
        steps.push(astep(arr, [], [i], sorted, `New minPrice = ${minPrice}! (best buy day so far)`, 6,
          [{ label: "minPrice", value: minPrice }]))
      } else {
        const profit = arr[i] - minPrice
        maxProfit = Math.max(maxProfit, profit)
        sorted.push(i)
        steps.push(astep(arr, [], [], sorted,
          `profit = ${arr[i]}-${minPrice} = ${profit}. maxProfit = ${maxProfit}`, 9,
          [{ label: "profit today", value: profit }, { label: "maxProfit", value: maxProfit }]))
      }
    }
    steps.push(astep(arr, [], [], sorted, `Done! maxProfit = ${maxProfit} ✓`, 12,
      [{ label: "result", value: maxProfit }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Best Time to Buy and Sell Stock II
// ════════════════════════════════════════════════════════════════
const bestTimeToBuyII: ArrayProblem = {
  id: 19,
  slug: "best-time-to-buy-and-sell-stock-ii",
  title: "Best Time to Buy And Sell Stock II",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "GoldmanSachs", "MorganStanley"],
  tags: ["Array", "Greedy"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given an integer array prices where prices[i] is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day. Find and return the maximum profit you can achieve.",
  examples: [
    { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Buy day 2 (price=1), sell day 3 (price=5), profit=4. Buy day 4 (price=3), sell day 5 (price=6), profit=3. Total=7." },
    { input: "prices = [1,2,3,4,5]", output: "4" },
    { input: "prices = [7,6,4,3,1]", output: "0" },
  ],
  constraints: [
    "1 ≤ prices.length ≤ 3 × 10⁴",
    "0 ≤ prices[i] ≤ 10⁴",
  ],
  hints: [
    "Collect every upward slope — if prices[i] > prices[i-1], add the difference.",
    "You can buy and sell on the same day, so every positive daily gain counts.",
    "No need to track buy/sell days explicitly.",
  ],
  pitfalls: [
    "Thinking you need to find the optimal buy/sell points — just sum all positive differences.",
    "Missing that you can make multiple transactions.",
  ],
  approaches: [
    { name: "Greedy (sum gains)", complexity: "O(n)", space: "O(1)", description: "Add prices[i] - prices[i-1] whenever it's positive. Captures every profitable day-to-day move." },
  ],
  code: `function maxProfit(prices) {
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }

  return profit;
}`,
  generateSteps() {
    const arr = [7, 1, 5, 3, 6, 4]
    const steps: ArrayVisStep[] = []
    let profit = 0
    const sorted: number[] = [0]

    steps.push(astep(arr, [], [], sorted, "profit=0. Sum all positive day-to-day gains.", 1))
    for (let i = 1; i < arr.length; i++) {
      const gain = arr[i] - arr[i - 1]
      steps.push(astep(arr, [i - 1, i], [], sorted,
        `prices[${i}]=${arr[i]} - prices[${i-1}]=${arr[i-1]} = ${gain}`, 3,
        [{ label: "daily gain", value: gain }, { label: "profit", value: profit }]))
      if (gain > 0) {
        profit += gain
        sorted.push(i)
        steps.push(astep(arr, [], [i], sorted,
          `Gain ${gain} > 0 → profit += ${gain} = ${profit}`, 4,
          [{ label: "profit", value: profit }]))
      } else {
        steps.push(astep(arr, [i], [], sorted, `No gain (${gain} ≤ 0) → skip`, 3))
      }
    }
    steps.push(astep(arr, [], [], sorted, `maxProfit = ${profit} ✓`, 7,
      [{ label: "result", value: profit }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Merge Sorted Array
// ════════════════════════════════════════════════════════════════
const mergeSortedArray: ArrayProblem = {
  id: 27,
  slug: "merge-sorted-array",
  title: "Merge Sorted Array",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Adobe"],
  tags: ["Array", "Two Pointers", "Sorting"],
  timeComplexity: "O(m+n)",
  spaceComplexity: "O(1)",
  description:
    "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array in-place.",
  examples: [
    { input: "nums1 = [1,2,3,0,0,0], m=3, nums2 = [2,5,6], n=3", output: "[1,2,2,3,5,6]" },
    { input: "nums1 = [1], m=1, nums2 = [], n=0", output: "[1]" },
  ],
  constraints: [
    "nums1.length == m + n",
    "nums2.length == n",
    "0 ≤ m, n ≤ 200",
    "-10⁹ ≤ nums1[i], nums2[i] ≤ 10⁹",
  ],
  hints: [
    "Fill from the back — compare m-1 and n-1 pointers, place the larger at m+n-1.",
    "Working backwards avoids overwriting elements not yet processed.",
    "After the loop, if nums2 has remaining elements, copy them over.",
  ],
  pitfalls: [
    "Merging from the front overwrites elements before they are processed.",
    "Forgetting to copy leftover nums2 elements.",
  ],
  approaches: [
    { name: "Three pointers (backwards)", complexity: "O(m+n)", space: "O(1)", description: "p1=m-1, p2=n-1, p=m+n-1. Compare and place larger at p, decrement pointers." },
    { name: "Copy then sort", complexity: "O((m+n) log(m+n))", space: "O(1)", description: "Copy nums2 into nums1 then sort. Simple but not optimal." },
  ],
  code: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p  = m + n - 1;

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
}`,
  generateSteps() {
    const arr = [1, 2, 3, 0, 0, 0]
    const nums2 = [2, 5, 6]
    const m = 3, n = 3
    const steps: ArrayVisStep[] = []
    let p1 = m - 1, p2 = n - 1, p = m + n - 1
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `p1=${p1}, p2=${p2}, p=${p}. Fill from back.`, 1))
    while (p2 >= 0) {
      steps.push(astep(arr, [p1, p], [], sorted,
        `nums1[p1=${p1}]=${arr[p1]} vs nums2[p2=${p2}]=${nums2[p2]}`, 5,
        [{ label: "p1", value: p1 }, { label: "p2", value: p2 }, { label: "p", value: p }]))
      if (p1 >= 0 && arr[p1] > nums2[p2]) {
        arr[p] = arr[p1]
        sorted.push(p)
        steps.push(astep(arr, [], [p], sorted, `Place nums1[${p1}]=${arr[p]} at p=${p}. p1--, p--`, 6))
        p1--
      } else {
        arr[p] = nums2[p2]
        sorted.push(p)
        steps.push(astep(arr, [], [p], sorted, `Place nums2[${p2}]=${arr[p]} at p=${p}. p2--, p--`, 8))
        p2--
      }
      p--
    }
    steps.push(astep(arr, [], [], [0,1,2,3,4,5], `Merged: [${arr}] ✓`, 12,
      [{ label: "result", value: `[${arr}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Product of Array Except Self
// ════════════════════════════════════════════════════════════════
const productExceptSelf: ArrayProblem = {
  id: 16,
  slug: "product-of-array-except-self",
  title: "Product of Array Except Self",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Atlassian", "Nvidia"],
  tags: ["Array", "Prefix Product"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
    { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁵",
    "-30 ≤ nums[i] ≤ 30",
    "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
  ],
  hints: [
    "For each index i: result[i] = product of all elements to the left × product of all to the right.",
    "Pass 1 (left to right): compute prefix products. Pass 2 (right to left): multiply by suffix.",
    "No division needed — two passes is enough.",
  ],
  pitfalls: [
    "Using division — forbidden by the problem and breaks on zeros.",
    "O(n²) nested loops — too slow.",
    "Off-by-one: prefix[i] should be product of elements BEFORE i (not including i).",
  ],
  approaches: [
    { name: "Prefix × Suffix", complexity: "O(n)", space: "O(1)", description: "Two-pass. Pass 1: store prefix products in result. Pass 2: multiply each result[i] by running suffix product." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(n)", description: "For each index, compute the product of all other elements." },
  ],
  code: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Pass 1: prefix products
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  // Pass 2: multiply by suffix
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}`,
  generateSteps() {
    const arr = [1, 2, 3, 4]
    const steps: ArrayVisStep[] = []
    const result = new Array(arr.length).fill(1)
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Pass 1: build prefix products in result[].", 4))
    let prefix = 1
    for (let i = 0; i < arr.length; i++) {
      result[i] = prefix
      steps.push(astep(arr, [i], [], sorted,
        `result[${i}] = prefix = ${prefix}. Then prefix *= ${arr[i]} → ${prefix * arr[i]}`, 6,
        [{ label: "prefix", value: prefix }, { label: `result[${i}]`, value: result[i] }]))
      prefix *= arr[i]
    }
    steps.push(astep(arr, [], [], sorted,
      `After pass 1: result = [${result.join(",")}]. Now pass 2: multiply by suffix.`, 10))
    let suffix = 1
    for (let i = arr.length - 1; i >= 0; i--) {
      result[i] *= suffix
      sorted.push(i)
      steps.push(astep(arr, [i], [], sorted,
        `result[${i}] *= suffix=${suffix} → ${result[i]}. suffix *= ${arr[i]} → ${suffix * arr[i]}`, 13,
        [{ label: "suffix", value: suffix }, { label: `result[${i}]`, value: result[i] }]))
      suffix *= arr[i]
    }
    steps.push(astep(arr, [], [], sorted, `result = [${result.join(",")}] ✓`, 16,
      [{ label: "result", value: `[${result.join(",")}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Longest Consecutive Sequence
// ════════════════════════════════════════════════════════════════
const longestConsecutiveSequence: ArrayProblem = {
  id: 18,
  slug: "longest-consecutive-sequence",
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Uber", "Atlassian"],
  tags: ["Array", "Hash Set", "Union Find"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
  examples: [
    { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Consecutive sequence [1,2,3,4]." },
    { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
  ],
  constraints: [
    "0 ≤ nums.length ≤ 10⁵",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
  ],
  hints: [
    "Put all numbers in a HashSet for O(1) lookup.",
    "Only start counting from a number if num-1 is NOT in the set (it's the sequence start).",
    "Extend the sequence by checking num+1, num+2... while they exist in set.",
  ],
  pitfalls: [
    "Sorting first is O(n log n) — violates the O(n) requirement.",
    "Counting from every element — O(n²) worst case without the 'start of sequence' check.",
    "Not deduplicating — duplicate numbers in the set don't matter since we use a Set.",
  ],
  approaches: [
    { name: "HashSet + start detection", complexity: "O(n)", space: "O(n)", description: "Add all to set. For each number that has no predecessor (num-1 not in set), count the full sequence from it." },
    { name: "Sort + scan", complexity: "O(n log n)", space: "O(1)", description: "Sort array, scan for consecutive runs. Doesn't meet O(n) requirement." },
  ],
  code: `function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let best = 0;

  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let cur = num, length = 1;

      while (numSet.has(cur + 1)) {
        cur++; length++;
      }

      best = Math.max(best, length);
    }
  }

  return best;
}`,
  generateSteps() {
    const arr = [100, 4, 200, 1, 3, 2]
    const steps: ArrayVisStep[] = []
    const numSet = new Set(arr)
    let best = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `Set = {${[...numSet].sort((a,b)=>a-b).join(",")}}. Find sequences.`, 1))
    let idx = 0
    for (const num of [100, 4, 200, 1]) {
      if (!numSet.has(num - 1)) {
        let cur = num, length = 1
        steps.push(astep(arr, [idx], [], sorted,
          `num=${num}: no predecessor (${num-1} not in set) → start sequence`, 4,
          [{ label: "start", value: num }]))
        while (numSet.has(cur + 1)) { cur++; length++ }
        best = Math.max(best, length)
        sorted.push(idx)
        steps.push(astep(arr, [], [idx], sorted,
          `Sequence from ${num}: length=${length}. best=${best}`, 7,
          [{ label: "sequence length", value: length }, { label: "best", value: best }]))
      } else {
        steps.push(astep(arr, [idx], [], sorted,
          `num=${num}: ${num-1} exists in set → not a start. Skip.`, 3))
      }
      idx++
    }
    steps.push(astep(arr, [], [], sorted, `Longest consecutive = ${best} ✓`, 12,
      [{ label: "result", value: best }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 11. Subarray Sum Equals K
// ════════════════════════════════════════════════════════════════
const subarraySumEqualsK: ArrayProblem = {
  id: 21,
  slug: "subarray-sum-equals-k",
  title: "Subarray Sum Equals K",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "LinkedIn", "Uber", "Spotify", "Flipkart"],
  tags: ["Array", "Hash Map", "Prefix Sum"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
  examples: [
    { input: "nums = [1,1,1], k = 2", output: "2" },
    { input: "nums = [1,2,3], k = 3", output: "2" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 2 × 10⁴",
    "-1000 ≤ nums[i] ≤ 1000",
    "-10⁷ ≤ k ≤ 10⁷",
  ],
  hints: [
    "Prefix sum: if prefixSum[j] - prefixSum[i] == k, subarray [i+1..j] sums to k.",
    "Use a HashMap to count how many times each prefix sum has occurred.",
    "For each index, check if (prefixSum - k) exists in the map.",
  ],
  pitfalls: [
    "Brute force O(n²) — checking all subarrays.",
    "Sliding window doesn't work here because negative numbers are allowed.",
    "Not initializing map with {0: 1} — misses subarrays starting from index 0.",
  ],
  approaches: [
    { name: "Prefix Sum + HashMap", complexity: "O(n)", space: "O(n)", description: "Track prefix sums in a map. At each index, count how many previous sums equal (current - k)." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(1)", description: "Check all (i,j) pairs. O(n²) — too slow for n=20000." },
  ],
  code: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;

  for (const num of nums) {
    sum += num;

    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }

    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}`,
  generateSteps() {
    const arr = [1, 1, 1]
    const k = 2
    const steps: ArrayVisStep[] = []
    const map = new Map([[0, 1]])
    let sum = 0, count = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `k=${k}. map={0:1}, sum=0, count=0.`, 1))
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]
      const need = sum - k
      steps.push(astep(arr, [i], [], sorted,
        `num=${arr[i]}, sum=${sum}. Check map for sum-k=${need}.`, 5,
        [{ label: "sum", value: sum }, { label: "need", value: need }, { label: "count", value: count }]))
      if (map.has(need)) {
        count += map.get(need)!
        sorted.push(i)
        steps.push(astep(arr, [], [i], sorted,
          `Found! count += map[${need}]=${map.get(need)} → count=${count}`, 6,
          [{ label: "count", value: count }]))
      }
      map.set(sum, (map.get(sum) || 0) + 1)
      steps.push(astep(arr, [], [], sorted,
        `Add sum=${sum} to map. map size=${map.size}`, 9,
        [{ label: "map[sum]", value: map.get(sum)! }]))
    }
    steps.push(astep(arr, [], [], sorted, `Total subarrays = ${count} ✓`, 12,
      [{ label: "result", value: count }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 12. Maximum Subarray — Kadane's
// ════════════════════════════════════════════════════════════════
const maxSubarray: ArrayProblem = {
  id: 207,
  slug: "maximum-subarray",
  title: "Maximum Subarray",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Bloomberg", "Swiggy"],
  tags: ["Array", "Dynamic Programming", "Divide & Conquer"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
  examples: [
    { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." },
    { input: "nums = [1]", output: "1" },
    { input: "nums = [5,4,-1,7,8]", output: "23" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-10⁴ ≤ nums[i] ≤ 10⁴",
  ],
  hints: [
    "Kadane's algorithm: at each position, either extend current subarray or start fresh.",
    "current = max(num, current + num). maxSum = max(maxSum, current).",
    "If current sum becomes negative, reset — starting fresh from the next element is always better.",
  ],
  pitfalls: [
    "Initializing maxSum = 0 instead of nums[0] — fails for all-negative arrays.",
    "Trying to find the actual subarray indices adds complexity — only the sum is required here.",
    "Divide and conquer works but is O(n log n) — Kadane's is simpler and O(n).",
  ],
  approaches: [
    { name: "Kadane's Algorithm", complexity: "O(n)", space: "O(1)", description: "Track current subarray sum. At each step: current = max(num, current + num). Update global max." },
    { name: "Divide & Conquer", complexity: "O(n log n)", space: "O(log n)", description: "Recursively split array. Max subarray is in left half, right half, or crosses midpoint." },
  ],
  code: `function maxSubArray(nums) {
  let current = nums[0];
  let maxSum  = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // extend or restart
    current = Math.max(nums[i], current + nums[i]);
    maxSum  = Math.max(maxSum, current);
  }

  return maxSum;
}`,
  generateSteps() {
    const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    const steps: ArrayVisStep[] = []
    let current = arr[0], maxSum = arr[0]
    const sorted: number[] = []

    steps.push(astep(arr, [0], [], sorted,
      `Start: current = maxSum = nums[0] = ${arr[0]}`, 1,
      [{ label: "current", value: current }, { label: "maxSum", value: maxSum }]))
    for (let i = 1; i < arr.length; i++) {
      const extend = current + arr[i]
      const fresh = arr[i]
      const newCurrent = Math.max(fresh, extend)
      const prevMax = maxSum
      current = newCurrent
      maxSum = Math.max(maxSum, current)
      steps.push(astep(arr, [i], current > prevMax ? [i] : [], sorted,
        `i=${i}: extend=${extend}, fresh=${fresh}. current=max(${fresh},${extend})=${current}. maxSum=${maxSum}`, 6,
        [{ label: "current", value: current }, { label: "maxSum", value: maxSum }]))
      if (current > 0) sorted.push(i)
    }
    steps.push(astep(arr, [], [], sorted, `maxSum = ${maxSum} ✓`, 8,
      [{ label: "result", value: maxSum }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 13. 3Sum
// ════════════════════════════════════════════════════════════════
const threeSum: ArrayProblem = {
  id: 30,
  slug: "3sum",
  title: "3Sum",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Adobe", "Uber"],
  tags: ["Array", "Two Pointers", "Sorting"],
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
  examples: [
    { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
    { input: "nums = [0,1,1]", output: "[]" },
    { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
  ],
  constraints: [
    "3 ≤ nums.length ≤ 3000",
    "-10⁵ ≤ nums[i] ≤ 10⁵",
  ],
  hints: [
    "Sort the array first. Fix nums[i] and use two pointers for the remaining pair.",
    "Skip duplicate values of i to avoid duplicate triplets.",
    "When a triplet is found, skip duplicates for both left and right pointers.",
  ],
  pitfalls: [
    "Not sorting first — two pointers only work on sorted arrays.",
    "Not skipping duplicates for i — produces duplicate triplets.",
    "Using HashSet approach — more complex and space-intensive.",
  ],
  approaches: [
    { name: "Sort + Two Pointers", complexity: "O(n²)", space: "O(1)", description: "Sort. For each i, use left/right pointers to find pairs summing to -nums[i]. Skip duplicates." },
    { name: "HashSet", complexity: "O(n²)", space: "O(n)", description: "For each pair (i,j), check if -(nums[i]+nums[j]) exists. Use set to avoid duplicates." },
  ],
  code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dup

    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        result.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }
  return result;
}`,
  generateSteps() {
    const arr = [-4, -1, -1, 0, 1, 2]
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `Sorted: [${arr}]. Fix i, two-pointer for pair.`, 1))
    steps.push(astep(arr, [0], [], sorted, `i=0, nums[0]=${arr[0]}. lo=1, hi=${arr.length-1}`, 4,
      [{ label: "target", value: -arr[0] }]))
    steps.push(astep(arr, [1, arr.length-1], [], sorted,
      `sum=${arr[0]}+${arr[1]}+${arr[arr.length-1]}=${arr[0]+arr[1]+arr[arr.length-1]}. sum < 0 → lo++`, 9))
    steps.push(astep(arr, [1, 2, arr.length-1], [], sorted, `i=1, nums[1]=${arr[1]}. lo=2, hi=${arr.length-1}`, 4))
    const s = arr[1] + arr[2] + arr[arr.length-1]
    steps.push(astep(arr, [2, arr.length-1], [], sorted,
      `sum=${arr[1]}+${arr[2]}+${arr[arr.length-1]}=${s}. Found triplet!`, 8,
      [{ label: "triplet", value: `[${arr[1]},${arr[2]},${arr[arr.length-1]}]` }]))
    sorted.push(2, arr.length-1)
    steps.push(astep(arr, [2, 3, arr.length-2], sorted, sorted,
      `sum=${arr[1]}+${arr[3]}+${arr[arr.length-2]}=${arr[1]+arr[3]+arr[arr.length-2]}. Found triplet!`, 8,
      [{ label: "triplet", value: `[${arr[1]},${arr[3]},${arr[arr.length-2]}]` }]))
    steps.push(astep(arr, [], [], [0,1,2,3,4,5], `Result: [[-1,-1,2],[-1,0,1]] ✓`, 20,
      [{ label: "triplets", value: 2 }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 14. Jump Game
// ════════════════════════════════════════════════════════════════
const jumpGame: ArrayProblem = {
  id: 210,
  slug: "jump-game",
  title: "Jump Game",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Bloomberg"],
  tags: ["Array", "Greedy", "Dynamic Programming"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
    { input: "nums = [3,2,1,0,4]", output: "false", explanation: "Always stuck at index 3 which has jump length 0." },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁴",
    "0 ≤ nums[i] ≤ 10⁵",
  ],
  hints: [
    "Track the farthest index reachable so far.",
    "If i ever exceeds maxReach, return false.",
    "Update maxReach = max(maxReach, i + nums[i]) at each step.",
  ],
  pitfalls: [
    "DP solution works but is O(n²) — greedy one-pass is O(n).",
    "Forgetting to check if the current index is reachable before updating maxReach.",
    "Checking if last index is in range, not just ≥ last index.",
  ],
  approaches: [
    { name: "Greedy (max reach)", complexity: "O(n)", space: "O(1)", description: "Track maxReach. If i > maxReach at any point, return false. If maxReach ≥ n-1, return true." },
    { name: "DP", complexity: "O(n²)", space: "O(n)", description: "dp[i] = can we reach index i? Mark reachable indices from each reachable position." },
  ],
  code: `function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false; // can't reach here

    maxReach = Math.max(maxReach, i + nums[i]);

    if (maxReach >= nums.length - 1) return true;
  }

  return true;
}`,
  generateSteps() {
    const arr = [2, 3, 1, 1, 4]
    const steps: ArrayVisStep[] = []
    let maxReach = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "maxReach=0. Track farthest reachable index.", 1))
    for (let i = 0; i < arr.length; i++) {
      if (i > maxReach) {
        steps.push(astep(arr, [i], [], sorted,
          `i=${i} > maxReach=${maxReach} → CANNOT REACH → return false`, 4,
          [{ label: "result", value: "false" }]))
        return steps
      }
      const newReach = i + arr[i]
      maxReach = Math.max(maxReach, newReach)
      sorted.push(i)
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}: i+nums[i]=${newReach}. maxReach=max(${maxReach}, ${newReach})=${maxReach}`, 5,
        [{ label: "maxReach", value: maxReach }]))
      if (maxReach >= arr.length - 1) {
        steps.push(astep(arr, [], [], sorted, `maxReach=${maxReach} ≥ last index → return true ✓`, 7,
          [{ label: "result", value: "true" }]))
        return steps
      }
    }
    steps.push(astep(arr, [], [], sorted, `Reached end → true ✓`, 9, [{ label: "result", value: "true" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 15. Jump Game II
// ════════════════════════════════════════════════════════════════
const jumpGameII: ArrayProblem = {
  id: 211,
  slug: "jump-game-ii",
  title: "Jump Game II",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Bloomberg", "Uber"],
  tags: ["Array", "Greedy", "Dynamic Programming"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1].",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "2", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
    { input: "nums = [2,3,0,1,4]", output: "2" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁴",
    "0 ≤ nums[i] ≤ 1000",
    "The answer is guaranteed to exist.",
  ],
  hints: [
    "Greedy: at each 'level' (jump), track the farthest you can reach.",
    "When i reaches the current jump boundary, increment jumps and extend boundary.",
    "Don't need to jump to the last index — just need to reach or pass it.",
  ],
  pitfalls: [
    "DP O(n²) works but is overkill — greedy is O(n).",
    "Off-by-one: loop should go to nums.length-1, not nums.length.",
    "Incrementing jumps too eagerly instead of at the boundary.",
  ],
  approaches: [
    { name: "Greedy BFS levels", complexity: "O(n)", space: "O(1)", description: "Track curEnd (current jump range) and farthest. When i == curEnd, increment jumps and set curEnd = farthest." },
    { name: "DP", complexity: "O(n²)", space: "O(n)", description: "dp[i] = min jumps to reach i. O(n²)." },
  ],
  code: `function jump(nums) {
  let jumps = 0;
  let curEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
    }
  }

  return jumps;
}`,
  generateSteps() {
    const arr = [2, 3, 1, 1, 4]
    const steps: ArrayVisStep[] = []
    let jumps = 0, curEnd = 0, farthest = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "jumps=0, curEnd=0, farthest=0.", 1))
    for (let i = 0; i < arr.length - 1; i++) {
      farthest = Math.max(farthest, i + arr[i])
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}: farthest=max(${farthest}, ${i}+${arr[i]})=${farthest}`, 5,
        [{ label: "farthest", value: farthest }, { label: "curEnd", value: curEnd }]))
      if (i === curEnd) {
        jumps++
        curEnd = farthest
        sorted.push(i)
        steps.push(astep(arr, [], [i], sorted,
          `i==curEnd → jump! jumps=${jumps}, curEnd=${curEnd}`, 8,
          [{ label: "jumps", value: jumps }, { label: "curEnd", value: curEnd }]))
      }
    }
    steps.push(astep(arr, [], [], sorted, `Min jumps = ${jumps} ✓`, 12,
      [{ label: "result", value: jumps }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 16. Two Sum II – Input Array Is Sorted
// ════════════════════════════════════════════════════════════════
const twoSumII: ArrayProblem = {
  id: 29,
  slug: "two-sum-ii-input-array-is-sorted",
  title: "Two Sum II – Input Array Is Sorted",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg", "Adobe"],
  tags: ["Array", "Two Pointers", "Binary Search"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers (1-indexed) as an integer array [index1, index2].",
  examples: [
    { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
    { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
    { input: "numbers = [-1,0], target = -1", output: "[1,2]" },
  ],
  constraints: [
    "2 ≤ numbers.length ≤ 3 × 10⁴",
    "-1000 ≤ numbers[i] ≤ 1000",
    "Exactly one solution exists.",
    "Must use only O(1) extra space.",
  ],
  hints: [
    "Two pointers: left=0, right=n-1.",
    "If sum < target → left++. If sum > target → right--. If sum == target → found.",
    "Since the array is sorted, two pointers is guaranteed to work.",
  ],
  pitfalls: [
    "Using a HashMap — violates the O(1) space requirement.",
    "Returning 0-indexed values instead of 1-indexed.",
    "Not using the sorted property — treating it like regular Two Sum.",
  ],
  approaches: [
    { name: "Two Pointers", complexity: "O(n)", space: "O(1)", description: "left=0, right=n-1. Move inward based on sum comparison to target." },
    { name: "Binary Search", complexity: "O(n log n)", space: "O(1)", description: "For each element, binary search for the complement. O(n log n)." },
  ],
  code: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}`,
  generateSteps() {
    const arr = [2, 7, 11, 15]
    const target = 9
    const steps: ArrayVisStep[] = []
    let left = 0, right = arr.length - 1
    const sorted: number[] = []

    steps.push(astep(arr, [left, right], [], sorted, `target=${target}. left=0, right=${right}.`, 1))
    while (left < right) {
      const sum = arr[left] + arr[right]
      steps.push(astep(arr, [left, right], [], sorted,
        `sum = ${arr[left]}+${arr[right]} = ${sum}. target=${target}`, 4,
        [{ label: "sum", value: sum }, { label: "left", value: left }, { label: "right", value: right }]))
      if (sum === target) {
        sorted.push(left, right)
        steps.push(astep(arr, [], [left, right], sorted,
          `Found! Return [${left+1}, ${right+1}] ✓`, 5,
          [{ label: "result", value: `[${left+1},${right+1}]` }]))
        return steps
      } else if (sum < target) {
        steps.push(astep(arr, [left], [], sorted, `sum < target → left++`, 7))
        left++
      } else {
        steps.push(astep(arr, [right], [], sorted, `sum > target → right--`, 9))
        right--
      }
    }
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 17. Boats to Save People
// ════════════════════════════════════════════════════════════════
const boatsToSavePeople: ArrayProblem = {
  id: 34,
  slug: "boats-to-save-people",
  title: "Boats to Save People",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Bloomberg"],
  tags: ["Array", "Two Pointers", "Greedy", "Sorting"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(1)",
  description:
    "You are given an array people where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most limit. Return the minimum number of boats to carry every given person.",
  examples: [
    { input: "people = [1,2], limit = 3", output: "1" },
    { input: "people = [3,2,2,1], limit = 3", output: "3" },
    { input: "people = [3,5,3,4], limit = 5", output: "4" },
  ],
  constraints: [
    "1 ≤ people.length ≤ 5 × 10⁴",
    "1 ≤ people[i] ≤ limit ≤ 3 × 10⁴",
  ],
  hints: [
    "Sort the array. Use two pointers: lightest and heaviest.",
    "If lightest + heaviest ≤ limit, pair them and advance both pointers.",
    "Otherwise, heaviest person goes alone. Always increment boat count.",
  ],
  pitfalls: [
    "Not sorting first — greedy doesn't work on unsorted input.",
    "Trying more than 2 people per boat — constraint is max 2.",
    "Decrementing right without checking bounds.",
  ],
  approaches: [
    { name: "Greedy + Two Pointers", complexity: "O(n log n)", space: "O(1)", description: "Sort. Greedily pair the heaviest with the lightest if possible. Each iteration = one boat." },
  ],
  code: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let lo = 0, hi = people.length - 1;
  let boats = 0;

  while (lo <= hi) {
    if (people[lo] + people[hi] <= limit) {
      lo++; // pair lightest with heaviest
    }
    hi--;   // heaviest always gets a boat
    boats++;
  }

  return boats;
}`,
  generateSteps() {
    const arr = [1, 2, 2, 3]
    const limit = 3
    const steps: ArrayVisStep[] = []
    let lo = 0, hi = arr.length - 1, boats = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `Sorted: [${arr}]. limit=${limit}. lo=0, hi=${hi}.`, 1))
    while (lo <= hi) {
      steps.push(astep(arr, [lo, hi], [], sorted,
        `people[lo=${lo}]=${arr[lo]} + people[hi=${hi}]=${arr[hi]} = ${arr[lo]+arr[hi]}. limit=${limit}`, 4,
        [{ label: "boats", value: boats }]))
      if (arr[lo] + arr[hi] <= limit) {
        sorted.push(lo)
        steps.push(astep(arr, [], [lo, hi], sorted,
          `${arr[lo]+arr[hi]} ≤ limit → pair together! lo++, hi--, boats++`, 5))
        lo++
      } else {
        sorted.push(hi)
        steps.push(astep(arr, [], [hi], sorted,
          `${arr[lo]+arr[hi]} > limit → heaviest alone. hi--, boats++`, 7))
      }
      hi--; boats++
    }
    steps.push(astep(arr, [], [], sorted, `Min boats = ${boats} ✓`, 11,
      [{ label: "result", value: boats }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 18. Contains Duplicate II
// ════════════════════════════════════════════════════════════════
const containsDuplicateII: ArrayProblem = {
  id: 36,
  slug: "contains-duplicate-ii",
  title: "Contains Duplicate II",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg", "Adobe"],
  tags: ["Array", "Hash Map", "Sliding Window"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(min(n,k))",
  description:
    "Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.",
  examples: [
    { input: "nums = [1,2,3,1], k = 3", output: "true" },
    { input: "nums = [1,0,1,1], k = 1", output: "true" },
    { input: "nums = [1,2,3,1,2,3], k = 2", output: "false" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "0 ≤ k ≤ 10⁵",
  ],
  hints: [
    "Use a HashMap mapping value → last seen index.",
    "If the value is already in the map and i - map[val] ≤ k → return true.",
    "Update the map with the current index each time.",
  ],
  pitfalls: [
    "Not updating the map to the latest index — stale indices can cause false negatives.",
    "Using abs(i - j) when i always > j in a forward scan — abs is unnecessary.",
  ],
  approaches: [
    { name: "HashMap (val → last index)", complexity: "O(n)", space: "O(min(n,k))", description: "Store last seen index for each value. Check if distance ≤ k." },
    { name: "Sliding window set", complexity: "O(n)", space: "O(k)", description: "Maintain a set of size k. If num already in set → return true. Remove oldest element when window exceeds k." },
  ],
  code: `function containsNearbyDuplicate(nums, k) {
  const map = new Map(); // val → last index

  for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i]) && i - map.get(nums[i]) <= k) {
      return true;
    }
    map.set(nums[i], i);
  }

  return false;
}`,
  generateSteps() {
    const arr = [1, 2, 3, 1]
    const k = 3
    const steps: ArrayVisStep[] = []
    const map = new Map<number, number>()
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `k=${k}. HashMap: val → last index.`, 1))
    for (let i = 0; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}, nums[i]=${arr[i]}. In map? Last index=${map.get(arr[i]) ?? 'N/A'}`, 3,
        [{ label: "val", value: arr[i] }]))
      if (map.has(arr[i]) && i - map.get(arr[i])! <= k) {
        sorted.push(i)
        steps.push(astep(arr, [], [i], sorted,
          `Duplicate found! dist=${i - map.get(arr[i])!} ≤ k=${k} → return true ✓`, 4,
          [{ label: "result", value: "true" }]))
        return steps
      }
      map.set(arr[i], i)
      steps.push(astep(arr, [], [], sorted, `Map[${arr[i]}] = ${i}`, 6))
    }
    steps.push(astep(arr, [], [], sorted, "No nearby duplicate → return false ✓", 9,
      [{ label: "result", value: "false" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 19. First Missing Positive  — LOCKED
// ════════════════════════════════════════════════════════════════
const firstMissingPositive: ArrayProblem = {
  id: 22,
  slug: "first-missing-positive",
  title: "First Missing Positive",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Nvidia"],
  tags: ["Array", "Hash Map", "Cyclic Sort"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
  examples: [
    { input: "nums = [1,2,0]", output: "3" },
    { input: "nums = [3,4,-1,1]", output: "2" },
    { input: "nums = [7,8,9,11,12]", output: "1" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
  ],
  hints: [
    "The answer must be in range [1, n+1].",
    "Use the array itself as a hash map — nums[i] should ideally hold value i+1.",
    "Place each number in its 'correct' position using cyclic sort, then find the first mismatch.",
  ],
  pitfalls: [
    "Using a HashSet — O(n) space, violates constraint.",
    "Not handling numbers outside [1, n] — just ignore them.",
    "Infinite loops in cyclic sort: stop when nums[i] == nums[nums[i]-1] (already in right spot or duplicate).",
  ],
  approaches: [
    { name: "Cyclic Sort", complexity: "O(n)", space: "O(1)", description: "Place every number in its correct index (val-1). Scan for first index where nums[i] != i+1." },
    { name: "Negate markers", complexity: "O(n)", space: "O(1)", description: "Use sign as marker: negate nums[val-1] for each val in [1,n]. First positive index + 1 is answer." },
  ],
  code: `function firstMissingPositive(nums) {
  const n = nums.length;

  // Place nums[i] at index nums[i]-1
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n
           && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  // Find first mismatch
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  return n + 1;
}`,
  generateSteps() {
    const arr = [3, 4, -1, 1]
    const n = arr.length
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Cyclic sort: place each num at index num-1.", 3))
    for (let i = 0; i < n; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}, nums[i]=${arr[i]}. Place at correct index?`, 4))
      while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
        const j = arr[i] - 1
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        steps.push(astep(arr, [], [i, j], sorted, `Swap: nums[${i}] ↔ nums[${j}]`, 6))
      }
    }
    steps.push(astep(arr, [], [], sorted, `After sort: [${arr}]. Scan for mismatch.`, 9))
    for (let i = 0; i < n; i++) {
      if (arr[i] !== i + 1) {
        sorted.push(i)
        steps.push(astep(arr, [], [i], sorted,
          `nums[${i}]=${arr[i]} ≠ ${i+1} → first missing = ${i+1} ✓`, 11,
          [{ label: "result", value: i + 1 }]))
        return steps
      }
      sorted.push(i)
    }
    steps.push(astep(arr, [], [], sorted, `All placed → missing = ${n+1} ✓`, 14,
      [{ label: "result", value: n + 1 }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 20. Majority Element II  — LOCKED
// ════════════════════════════════════════════════════════════════
const majorityElementII: ArrayProblem = {
  id: 20,
  slug: "majority-element-ii",
  title: "Majority Element II",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Oracle", "Bloomberg"],
  tags: ["Array", "Hash Map", "Boyer-Moore Voting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array of size n, find all elements that appear more than ⌊n/3⌋ times.",
  examples: [
    { input: "nums = [3,2,3]", output: "[3]" },
    { input: "nums = [1,2]", output: "[1,2]" },
    { input: "nums = [1,1,1,3,3,2,2,2]", output: "[1,2]" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 5 × 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
  ],
  hints: [
    "At most 2 elements can appear > n/3 times.",
    "Extended Boyer-Moore: maintain 2 candidates and 2 counts.",
    "After first pass, verify both candidates exceed n/3 in a second pass.",
  ],
  pitfalls: [
    "Only checking for one majority element — there can be up to 2.",
    "Not verifying candidates in a second pass.",
    "Not decrementing both counts when num matches neither candidate.",
  ],
  approaches: [
    { name: "Boyer-Moore (2 candidates)", complexity: "O(n)", space: "O(1)", description: "Track 2 candidates. First pass to find candidates, second pass to verify count > n/3." },
    { name: "HashMap", complexity: "O(n)", space: "O(n)", description: "Count all elements. Filter those with count > n/3." },
  ],
  code: `function majorityElement(nums) {
  let cand1 = null, cand2 = null;
  let cnt1 = 0, cnt2 = 0;

  for (const num of nums) {
    if (num === cand1)      { cnt1++; }
    else if (num === cand2) { cnt2++; }
    else if (cnt1 === 0)    { cand1 = num; cnt1 = 1; }
    else if (cnt2 === 0)    { cand2 = num; cnt2 = 1; }
    else                    { cnt1--; cnt2--; }
  }

  // Verify
  cnt1 = cnt2 = 0;
  for (const num of nums) {
    if (num === cand1) cnt1++;
    else if (num === cand2) cnt2++;
  }

  const result = [];
  const n = nums.length;
  if (cnt1 > Math.floor(n / 3)) result.push(cand1);
  if (cnt2 > Math.floor(n / 3)) result.push(cand2);
  return result;
}`,
  generateSteps() {
    const arr = [1, 1, 1, 3, 3, 2, 2, 2]
    const steps: ArrayVisStep[] = []
    let cand1: number | null = null, cand2: number | null = null
    let cnt1 = 0, cnt2 = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Two candidate Boyer-Moore voting.", 1))
    for (let i = 0; i < arr.length; i++) {
      const num = arr[i]
      steps.push(astep(arr, [i], [], sorted,
        `num=${num}. cand1=${cand1}(${cnt1}), cand2=${cand2}(${cnt2})`, 4,
        [{ label: "cand1", value: `${cand1}(${cnt1})` }, { label: "cand2", value: `${cand2}(${cnt2})` }]))
      if (num === cand1) { cnt1++; sorted.push(i) }
      else if (num === cand2) { cnt2++; sorted.push(i) }
      else if (cnt1 === 0) { cand1 = num; cnt1 = 1 }
      else if (cnt2 === 0) { cand2 = num; cnt2 = 1 }
      else { cnt1--; cnt2-- }
    }
    steps.push(astep(arr, [], [], sorted,
      `Candidates: ${cand1}, ${cand2}. Verifying...`, 13))
    steps.push(astep(arr, [], [], sorted,
      `Result: [1, 2] ✓ (both appear > n/3 times)`, 20,
      [{ label: "result", value: "[1, 2]" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 21. Majority Element  — LOCKED
// ════════════════════════════════════════════════════════════════
const majorityElement: ArrayProblem = {
  id: 8,
  slug: "majority-element",
  title: "Majority Element",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Oracle", "Salesforce", "Flipkart"],
  tags: ["Array", "Hash Map", "Boyer-Moore Voting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
  examples: [
    { input: "nums = [3,2,3]", output: "3" },
    { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
  ],
  constraints: [
    "n == nums.length",
    "1 ≤ n ≤ 5 × 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "The majority element always exists.",
  ],
  hints: [
    "Boyer-Moore Voting: maintain a candidate and count. Increment on match, decrement on mismatch. Reset when count hits 0.",
    "Since majority appears > n/2 times, the voting algorithm is guaranteed to find it.",
    "HashMap approach also works in O(n) time but O(n) space.",
  ],
  pitfalls: [
    "Boyer-Moore: forgetting to reset the candidate when count drops to 0.",
    "HashMap approach uses O(n) space — the Boyer-Moore approach is O(1).",
    "Not verifying the candidate after the first pass (needed if majority isn't guaranteed).",
  ],
  approaches: [
    { name: "Boyer-Moore Voting", complexity: "O(n)", space: "O(1)", description: "Maintain candidate and count. Increment if current = candidate, else decrement. Reset at 0." },
    { name: "HashMap Count", complexity: "O(n)", space: "O(n)", description: "Count occurrences. Return element with count > n/2." },
  ],
  code: `function majorityElement(nums) {
  let candidate = nums[0];
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }

  return candidate;
}`,
  generateSteps() {
    const arr = [2, 2, 1, 1, 1, 2, 2]
    const steps: ArrayVisStep[] = []
    let candidate = arr[0], count = 1
    const sorted: number[] = []

    steps.push(astep(arr, [0], [], sorted,
      `Start: candidate=${candidate}, count=${count}`, 1,
      [{ label: "candidate", value: candidate }, { label: "count", value: count }]))
    for (let i = 1; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `nums[${i}]=${arr[i]}. count=${count}. candidate=${candidate}`, 4,
        [{ label: "candidate", value: candidate }, { label: "count", value: count }]))
      if (count === 0) {
        candidate = arr[i]; count = 1
        steps.push(astep(arr, [], [i], sorted, `count=0 → reset. New candidate=${candidate}`, 6,
          [{ label: "candidate", value: candidate }]))
      } else if (arr[i] === candidate) {
        count++
        sorted.push(i)
        steps.push(astep(arr, [], [], sorted, `${arr[i]} == candidate → count=${count}`, 9,
          [{ label: "count", value: count }]))
      } else {
        count--
        steps.push(astep(arr, [], [i], sorted, `${arr[i]} != candidate → count=${count}`, 11,
          [{ label: "count", value: count }]))
      }
    }
    steps.push(astep(arr, [], [], sorted,
      `Majority element = ${candidate} ✓`, 14, [{ label: "result", value: candidate }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 22. Remove Duplicates From Sorted Array  — LOCKED
// ════════════════════════════════════════════════════════════════
const removeDuplicates: ArrayProblem = {
  id: 28,
  slug: "remove-duplicates-from-sorted-array",
  title: "Remove Duplicates From Sorted Array",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "ServiceNow", "Meesho"],
  tags: ["Array", "Two Pointers"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return k, the number of unique elements.",
  examples: [
    { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
    { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 3 × 10⁴",
    "-100 ≤ nums[i] ≤ 100",
    "nums is sorted in non-decreasing order.",
  ],
  hints: [
    "Use two pointers: k (write head) and i (read head).",
    "Only advance k when nums[i] != nums[k-1] (a new unique element).",
    "Since array is sorted, duplicates are always adjacent.",
  ],
  pitfalls: [
    "Starting k at 0 instead of 1 — the first element is always unique.",
    "Not using in-place modification — extra space is not needed.",
    "Forgetting to return k (the count of unique elements), not the modified array.",
  ],
  approaches: [
    { name: "Two Pointers", complexity: "O(n)", space: "O(1)", description: "Slow pointer k tracks the write position. Fast pointer i reads. Copy nums[i] to nums[k] only when a new unique value is found." },
  ],
  code: `function removeDuplicates(nums) {
  let k = 1; // write pointer

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      nums[k] = nums[i]; // copy unique element
      k++;
    }
  }

  return k; // count of unique elements
}`,
  generateSteps() {
    const arr = [0, 0, 1, 1, 2, 2, 3]
    const steps: ArrayVisStep[] = []
    let k = 1
    const sorted: number[] = [0]

    steps.push(astep(arr, [], [], sorted, "k=1 (write head). i=1 (read head). Array is sorted.", 2))
    for (let i = 1; i < arr.length; i++) {
      steps.push(astep(arr, [i], [], sorted,
        `i=${i}: nums[${i}]=${arr[i]} vs nums[k-1]=${arr[k-1]}. Same?`, 4,
        [{ label: "k", value: k }, { label: "i", value: i }], k))
      if (arr[i] !== arr[k - 1]) {
        arr[k] = arr[i]
        sorted.push(k)
        steps.push(astep(arr, [], [k], sorted,
          `Different! Copy ${arr[i]} to position k=${k}. k++=${k + 1}`, 5,
          [{ label: "unique count", value: k + 1 }]))
        k++
      } else {
        steps.push(astep(arr, [i], [], sorted, `Duplicate ${arr[i]} — skip`, 3))
      }
    }
    steps.push(astep(arr, [], [], sorted,
      `Done! k=${k} unique elements ✓`, 8, [{ label: "result k", value: k }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 23. Rotate Array  — LOCKED
// ════════════════════════════════════════════════════════════════
const rotateArray: ArrayProblem = {
  id: 32,
  slug: "rotate-array",
  title: "Rotate Array",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Nvidia", "Flipkart"],
  tags: ["Array", "Math", "Two Pointers"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
  examples: [
    { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
    { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
    "0 ≤ k ≤ 10⁵",
  ],
  hints: [
    "The 3-reversal trick: reverse all, reverse first k, reverse last n-k.",
    "k = k % n to handle k > n.",
    "Extra array approach works in O(n) time but O(n) space — the reversal is O(1) space.",
  ],
  pitfalls: [
    "Forgetting k = k % n — large k values wrap around.",
    "Brute force rotating one step at a time: O(n×k) — too slow.",
    "Off-by-one in the reversal boundaries.",
  ],
  approaches: [
    { name: "3 Reversals", complexity: "O(n)", space: "O(1)", description: "Reverse entire array, then reverse [0..k-1], then reverse [k..n-1]." },
    { name: "Extra Array", complexity: "O(n)", space: "O(n)", description: "Place each element at (i + k) % n in a new array, then copy back." },
  ],
  code: `function rotate(nums, k) {
  k = k % nums.length;

  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums, left, right) {
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++; right--;
  }
}`,
  generateSteps() {
    const arr = [1, 2, 3, 4, 5, 6, 7]
    const k = 3
    const n = arr.length
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, `k=${k}. Step 1: reverse entire array.`, 2))
    let lo = 0, hi = n - 1
    while (lo < hi) {
      ;[arr[lo], arr[hi]] = [arr[hi], arr[lo]]
      steps.push(astep(arr, [], [lo, hi], sorted, `Swap arr[${lo}]↔arr[${hi}]`, 9))
      lo++; hi--
    }
    steps.push(astep(arr, [], [], sorted, `After full reverse: [${arr}]. Step 2: reverse [0..k-1].`, 3))
    lo = 0; hi = k - 1
    while (lo < hi) {
      ;[arr[lo], arr[hi]] = [arr[hi], arr[lo]]
      steps.push(astep(arr, [], [lo, hi], sorted, `Swap arr[${lo}]↔arr[${hi}]`, 9))
      lo++; hi--
    }
    steps.push(astep(arr, [], [], sorted, `Step 3: reverse [k..n-1].`, 4))
    lo = k; hi = n - 1
    while (lo < hi) {
      ;[arr[lo], arr[hi]] = [arr[hi], arr[lo]]
      steps.push(astep(arr, [], [lo, hi], sorted, `Swap arr[${lo}]↔arr[${hi}]`, 9))
      lo++; hi--
    }
    for (let i = 0; i < n; i++) sorted.push(i)
    steps.push(astep(arr, [], [], sorted, `Rotated by ${k}: [${arr}] ✓`, 4,
      [{ label: "result", value: `[${arr}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 24. Container With Most Water  — LOCKED
// ════════════════════════════════════════════════════════════════
const containerWithMostWater: ArrayProblem = {
  id: 33,
  slug: "container-with-most-water",
  title: "Container With Most Water",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Atlassian", "Spotify"],
  tags: ["Array", "Two Pointers", "Greedy"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given an integer array height of length n. Find two lines that together with the x-axis form a container that contains the most water. Return the maximum amount of water a container can store.",
  examples: [
    { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    { input: "height = [1,1]", output: "1" },
  ],
  constraints: [
    "n == height.length",
    "2 ≤ n ≤ 10⁵",
    "0 ≤ height[i] ≤ 10⁴",
  ],
  hints: [
    "Two pointers starting at both ends. Width = right - left.",
    "Water = min(height[left], height[right]) × width.",
    "Move the pointer at the shorter line inward.",
  ],
  pitfalls: [
    "O(n²) brute force trying all pairs — too slow.",
    "Moving the taller pointer inward — that can never improve the result.",
    "Not taking min(heights) for the water level.",
  ],
  approaches: [
    { name: "Two Pointers", complexity: "O(n)", space: "O(1)", description: "Start left=0, right=n-1. Compute water, update max. Move the shorter pointer inward." },
    { name: "Brute Force", complexity: "O(n²)", space: "O(1)", description: "Try all pairs (i, j). O(n²) — too slow for n=10⁵." },
  ],
  code: `function maxArea(height) {
  let left  = 0;
  let right = height.length - 1;
  let max   = 0;

  while (left < right) {
    const water = Math.min(height[left], height[right])
                  * (right - left);
    max = Math.max(max, water);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}`,
  generateSteps() {
    const arr = [1, 8, 6, 2, 5, 4, 8, 3, 7]
    const steps: ArrayVisStep[] = []
    let left = 0, right = arr.length - 1, max = 0
    const sorted: number[] = []

    steps.push(astep(arr, [left, right], [], sorted, `left=${left}, right=${right}. Start two-pointer scan.`, 2))
    while (left < right) {
      const water = Math.min(arr[left], arr[right]) * (right - left)
      if (water > max) { max = water; sorted.push(left, right) }
      steps.push(astep(arr, [left, right], [], sorted,
        `water = min(${arr[left]},${arr[right]}) × (${right}-${left}) = ${water}. max=${max}`, 5,
        [{ label: "water", value: water }, { label: "max", value: max }]))
      if (arr[left] < arr[right]) {
        left++
      } else {
        right--
      }
    }
    steps.push(astep(arr, [], [], sorted, `maxArea = ${max} ✓`, 15, [{ label: "result", value: max }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 25. Trapping Rain Water  — LOCKED
// ════════════════════════════════════════════════════════════════
const trappingRainWater: ArrayProblem = {
  id: 35,
  slug: "trapping-rain-water",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "MorganStanley", "Nvidia"],
  tags: ["Array", "Two Pointers", "Stack", "DP"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
  examples: [
    { input: "height = [0,1,0,2,1,0,1,3,1,0,1,2]", output: "6" },
    { input: "height = [4,2,0,3,2,5]", output: "9" },
  ],
  constraints: [
    "n == height.length",
    "1 ≤ n ≤ 2 × 10⁴",
    "0 ≤ height[i] ≤ 10⁵",
  ],
  hints: [
    "Water at index i = min(maxLeft[i], maxRight[i]) - height[i].",
    "Two-pointer: maintain leftMax and rightMax on the fly.",
    "If leftMax < rightMax: water[left] = leftMax - height[left]. Else: water[right] = rightMax - height[right].",
  ],
  pitfalls: [
    "Forgetting to clamp water to max(0, ...) — bars taller than their bounds contribute 0.",
    "Computing maxLeft and maxRight arrays separately (O(n) space).",
    "Confusing water level (min of max heights) with bar height.",
  ],
  approaches: [
    { name: "Two Pointers", complexity: "O(n)", space: "O(1)", description: "Move two pointers inward. Process the side with the smaller max height. Water = maxSide - height." },
    { name: "DP (prefix/suffix max)", complexity: "O(n)", space: "O(n)", description: "Precompute leftMax[i] and rightMax[i]. water[i] = min(leftMax[i], rightMax[i]) - height[i]." },
    { name: "Monotonic Stack", complexity: "O(n)", space: "O(n)", description: "Use a decreasing stack. When a taller bar is found, pop and compute water in the valley." },
  ],
  code: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }

  return water;
}`,
  generateSteps() {
    const arr = [4, 2, 0, 3, 2, 5]
    const steps: ArrayVisStep[] = []
    let left = 0, right = arr.length - 1
    let leftMax = 0, rightMax = 0, water = 0
    const sorted: number[] = []

    steps.push(astep(arr, [left, right], [], sorted,
      `left=${left}, right=${right}. leftMax=0, rightMax=0. water=0`, 1))
    while (left < right) {
      steps.push(astep(arr, [left, right], [], sorted,
        `height[left]=${arr[left]} vs height[right]=${arr[right]}`, 6,
        [{ label: "leftMax", value: leftMax }, { label: "rightMax", value: rightMax }, { label: "water", value: water }]))
      if (arr[left] < arr[right]) {
        if (arr[left] >= leftMax) {
          leftMax = arr[left]
          steps.push(astep(arr, [left], [], sorted, `New leftMax = ${leftMax}`, 8,
            [{ label: "leftMax", value: leftMax }]))
        } else {
          water += leftMax - arr[left]
          sorted.push(left)
          steps.push(astep(arr, [], [left], sorted,
            `water += ${leftMax}-${arr[left]} = ${leftMax - arr[left]}. Total=${water}`, 10,
            [{ label: "water", value: water }]))
        }
        left++
      } else {
        if (arr[right] >= rightMax) {
          rightMax = arr[right]
          steps.push(astep(arr, [right], [], sorted, `New rightMax = ${rightMax}`, 13,
            [{ label: "rightMax", value: rightMax }]))
        } else {
          water += rightMax - arr[right]
          sorted.push(right)
          steps.push(astep(arr, [], [right], sorted,
            `water += ${rightMax}-${arr[right]} = ${rightMax - arr[right]}. Total=${water}`, 15,
            [{ label: "water", value: water }]))
        }
        right--
      }
    }
    steps.push(astep(arr, [], [], sorted, `Total water trapped = ${water} ✓`, 20,
      [{ label: "result", value: water }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 26. Set Matrix Zeroes  — LOCKED
// ════════════════════════════════════════════════════════════════
const setMatrixZeroes: ArrayProblem = {
  id: 233,
  slug: "set-matrix-zeroes",
  title: "Set Matrix Zeroes",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Oracle"],
  tags: ["Array", "Hash Set", "Matrix"],
  timeComplexity: "O(m×n)",
  spaceComplexity: "O(1)",
  description:
    "Given an m×n integer matrix matrix, if an element is 0, set its entire row and column to 0's. Do it in-place.",
  examples: [
    { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" },
    { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" },
  ],
  constraints: [
    "m == matrix.length",
    "n == matrix[0].length",
    "1 ≤ m, n ≤ 200",
    "-2³¹ ≤ matrix[i][j] ≤ 2³¹ - 1",
  ],
  hints: [
    "Use first row and first column as markers — check if row 0 / col 0 themselves contain zero first.",
    "Pass 1: mark row/col in first row/col. Pass 2: use markers to zero cells. Pass 3: zero first row/col if needed.",
    "Naive O(m×n) space approach: collect zero positions in sets, then zero rows and columns.",
  ],
  pitfalls: [
    "Zeroing rows/cols during the first pass — contaminates markers.",
    "Forgetting to handle the first row and first column separately.",
    "Using extra arrays of size m and n — violates O(1) spirit (use in-place markers).",
  ],
  approaches: [
    { name: "In-place markers (first row/col)", complexity: "O(m×n)", space: "O(1)", description: "Use first row/col as flags. Handle overlap (is row0 itself zero?) with a separate boolean." },
    { name: "Set of rows/cols", complexity: "O(m×n)", space: "O(m+n)", description: "Collect rows and cols that contain zero into sets. Then zero them. Simpler but O(m+n) space." },
  ],
  code: `function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = matrix[0].includes(0);
  let firstColZero = matrix.some(r => r[0] === 0);

  // Mark zeros on first row/col
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }

  // Zero cells using markers
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][0] === 0 || matrix[0][j] === 0)
        matrix[i][j] = 0;

  if (firstRowZero) matrix[0].fill(0);
  if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
}`,
  generateSteps() {
    const arr = [1, 0, 1, 0, 0, 0, 1, 0, 1]
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Flattened 3×3 matrix. Mark zero positions first.", 1))
    steps.push(astep(arr, [1], [], sorted, "Found zero at [0][1] → mark row 0, col 1.", 5,
      [{ label: "zero at", value: "[0,1]" }]))
    sorted.push(1)
    steps.push(astep(arr, [3], [], sorted, "Found zero at [1][0] → mark row 1, col 0.", 5,
      [{ label: "zero at", value: "[1,0]" }]))
    sorted.push(3, 4, 5)
    steps.push(astep(arr, [], [0, 1, 2, 3, 6], sorted,
      "Zero entire row 1 + col 0 + col 1 → result shown.", 14,
      [{ label: "result", value: "[[1,0,1],[0,0,0],[1,0,1]]" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 27. Spiral Matrix  — LOCKED
// ════════════════════════════════════════════════════════════════
const spiralMatrix: ArrayProblem = {
  id: 232,
  slug: "spiral-matrix",
  title: "Spiral Matrix",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Adobe", "Nvidia"],
  tags: ["Array", "Matrix", "Simulation"],
  timeComplexity: "O(m×n)",
  spaceComplexity: "O(1)",
  description:
    "Given an m×n matrix, return all elements of the matrix in spiral order.",
  examples: [
    { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
    { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" },
  ],
  constraints: [
    "m == matrix.length",
    "n == matrix[0].length",
    "1 ≤ m, n ≤ 10",
    "-100 ≤ matrix[i][j] ≤ 100",
  ],
  hints: [
    "Maintain four boundaries: top, bottom, left, right.",
    "Traverse right, then down, then left, then up. Shrink boundaries after each pass.",
    "Stop when top > bottom or left > right.",
  ],
  pitfalls: [
    "Not shrinking boundaries — infinite loop.",
    "Not checking boundary conditions mid-pass (e.g., single row left in middle).",
    "Using visited array — O(m×n) space, not necessary.",
  ],
  approaches: [
    { name: "Layer-by-layer (4 boundaries)", complexity: "O(m×n)", space: "O(1)", description: "Track top/bottom/left/right. Traverse each boundary and shrink it. Repeat until empty." },
    { name: "Direction array", complexity: "O(m×n)", space: "O(m×n)", description: "Use a visited array and rotate directions. More code, same complexity." },
  ],
  code: `function spiralOrder(matrix) {
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++)   result.push(matrix[top][c]);   top++;
    for (let r = top; r <= bottom; r++)   result.push(matrix[r][right]); right--;
    if (top <= bottom)
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]); bottom--;
    if (left <= right)
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);  left++;
  }

  return result;
}`,
  generateSteps() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const steps: ArrayVisStep[] = []
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "3×3 matrix. top=0,bottom=2,left=0,right=2.", 1))
    steps.push(astep(arr, [0, 1, 2], [], sorted, "Traverse top row left→right: [1,2,3]. top++", 4))
    sorted.push(0, 1, 2)
    steps.push(astep(arr, [5, 8], sorted, sorted, "Traverse right col top→bottom: [6,9]. right--", 5))
    sorted.push(5, 8)
    steps.push(astep(arr, [7, 6], sorted, sorted, "Traverse bottom row right→left: [8,7]. bottom--", 7))
    sorted.push(7, 6)
    steps.push(astep(arr, [3], sorted, sorted, "Traverse left col bottom→top: [4]. left++", 9))
    sorted.push(3)
    steps.push(astep(arr, [4], sorted, sorted, "Inner cell [5]. Spiral complete.", 4))
    sorted.push(4)
    steps.push(astep(arr, [], [], sorted, "Spiral: [1,2,3,6,9,8,7,4,5] ✓", 14,
      [{ label: "result", value: "[1,2,3,6,9,8,7,4,5]" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 28. Maximum Sum Circular Subarray  — LOCKED
// ════════════════════════════════════════════════════════════════
const maxSumCircularSubarray: ArrayProblem = {
  id: 208,
  slug: "maximum-sum-circular-subarray",
  title: "Maximum Sum Circular Subarray",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg"],
  tags: ["Array", "Dynamic Programming", "Divide & Conquer", "Queue"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums. A circular array means the end of the array connects to the beginning.",
  examples: [
    { input: "nums = [1,-2,3,-2]", output: "3" },
    { input: "nums = [5,-3,5]", output: "10" },
    { input: "nums = [-3,-2,-3]", output: "-2" },
  ],
  constraints: [
    "n == nums.length",
    "1 ≤ n ≤ 3 × 10⁴",
    "-3 × 10⁴ ≤ nums[i] ≤ 3 × 10⁴",
  ],
  hints: [
    "The answer is either a normal subarray max (Kadane's) OR wraps around.",
    "Wrap-around max = total sum - minimum subarray sum.",
    "If all elements are negative, return the max element (total - minSubarray = 0, so use Kadane's result).",
  ],
  pitfalls: [
    "Forgetting the all-negative case — total - minSum = 0 which is wrong.",
    "Not using Kadane's for the minimum subarray (it's just negated Kadane's).",
    "Returning 0 when all elements are negative.",
  ],
  approaches: [
    { name: "Kadane's + wrap-around", complexity: "O(n)", space: "O(1)", description: "max(maxSubarraySum, totalSum - minSubarraySum). Handle all-negative by returning maxSubarraySum." },
  ],
  code: `function maxSubarraySumCircular(nums) {
  let totalSum = 0;
  let maxSum = nums[0], curMax = 0;
  let minSum = nums[0], curMin = 0;

  for (const num of nums) {
    curMax = Math.max(curMax + num, num);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(curMin + num, num);
    minSum = Math.min(minSum, curMin);
    totalSum += num;
  }

  return maxSum > 0
    ? Math.max(maxSum, totalSum - minSum)
    : maxSum;
}`,
  generateSteps() {
    const arr = [5, -3, 5]
    const steps: ArrayVisStep[] = []
    let totalSum = 0, maxSum = arr[0], curMax = 0, minSum = arr[0], curMin = 0
    const sorted: number[] = []

    steps.push(astep(arr, [], [], sorted, "Track maxSubarray AND minSubarray simultaneously.", 1))
    for (let i = 0; i < arr.length; i++) {
      curMax = Math.max(curMax + arr[i], arr[i])
      maxSum = Math.max(maxSum, curMax)
      curMin = Math.min(curMin + arr[i], arr[i])
      minSum = Math.min(minSum, curMin)
      totalSum += arr[i]
      sorted.push(i)
      steps.push(astep(arr, [i], [], sorted,
        `num=${arr[i]}: curMax=${curMax}, maxSum=${maxSum}, curMin=${curMin}, minSum=${minSum}`, 5,
        [{ label: "maxSum", value: maxSum }, { label: "minSum", value: minSum }, { label: "total", value: totalSum }]))
    }
    const result = maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum
    steps.push(astep(arr, [], [], sorted,
      `max(${maxSum}, ${totalSum}-${minSum}=${totalSum-minSum}) = ${result} ✓`, 12,
      [{ label: "result", value: result }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════
// Last 10 are LOCKED
export const ARRAY_PROBLEMS: ArrayProblem[] = [
  concatenationOfArray,      // #1   Easy   — free
  containsDuplicate,         // #2   Easy   — free
  twoSum,                    // #4   Easy   — free
  removeElement,             // #7   Easy   — free
  sortColors,                // #12  Medium — free
  bestTimeToBuy,             // #37  Easy   — free
  bestTimeToBuyII,           // #19  Medium — free
  mergeSortedArray,          // #27  Easy   — free
  productExceptSelf,         // #16  Medium — free
  longestConsecutiveSequence,// #18  Medium — free
  subarraySumEqualsK,        // #21  Medium — free
  maxSubarray,               // #207 Medium — free
  threeSum,                  // #30  Medium — free
  jumpGame,                  // #210 Medium — free
  jumpGameII,                // #211 Medium — free
  twoSumII,                  // #29  Medium — free
  boatsToSavePeople,         // #34  Medium — free
  containsDuplicateII,       // #36  Easy   — free
  firstMissingPositive,      // #22  Hard   — LOCKED
  majorityElementII,         // #20  Medium — LOCKED
  majorityElement,           // #8   Easy   — LOCKED
  removeDuplicates,          // #28  Easy   — LOCKED
  rotateArray,               // #32  Medium — LOCKED
  containerWithMostWater,    // #33  Medium — LOCKED
  trappingRainWater,         // #35  Hard   — LOCKED
  setMatrixZeroes,           // #233 Medium — LOCKED
  spiralMatrix,              // #232 Medium — LOCKED
  maxSumCircularSubarray,    // #208 Medium — LOCKED
]