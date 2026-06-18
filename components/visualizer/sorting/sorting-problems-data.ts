// components/visualizer/sorting/sorting-problems-data.ts

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

export interface VisStep {
  array: number[]
  highlighted: number[]   // yellow — comparing
  swapped: number[]       // red — swapping
  sorted: number[]        // green — finalized
  pivot?: number          // index of pivot (purple)
  message: string
  codeLine: number
}

export interface SortingProblem {
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
  generateSteps: () => VisStep[]
}

// ─── helpers ────────────────────────────────────────────────────
function step(
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
// 1. Sort an Array  (#11)
// ════════════════════════════════════════════════════════════════
const sortAnArray: SortingProblem = {
  id: 11,
  slug: "sort-an-array",
  title: "Sort an Array",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Adobe", "Nvidia", "ServiceNow"],
  tags: ["Sorting", "Divide & Conquer", "Heap"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(log n)",
  description:
    "Given an array of integers nums, sort the array in ascending order and return it. You must solve the problem without using any built-in functions in O(n log n) time complexity and with the smallest space complexity possible.",
  examples: [
    { input: "nums = [5,2,3,1]", output: "[1,2,3,5]" },
    { input: "nums = [5,1,1,2,0,0]", output: "[0,0,1,1,2,5]" },
  ],
  constraints: ["1 ≤ nums.length ≤ 5 × 10⁴", "-5 × 10⁴ ≤ nums[i] ≤ 5 × 10⁴"],
  hints: [
    "Think about which O(n log n) sort is simplest to implement cleanly.",
    "Merge Sort guarantees O(n log n) in all cases.",
    "Quick Sort is faster in practice but has O(n²) worst case without randomization.",
  ],
  pitfalls: [
    "Using Array.sort() counts as a built-in — the problem forbids it.",
    "Bubble / Insertion / Selection Sort are O(n²) — too slow for n=50000.",
    "Forgetting to handle the base case (array of length ≤ 1) in recursion.",
    "Off-by-one errors when computing the mid index.",
  ],
  approaches: [
    {
      name: "Merge Sort",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Divide the array in half recursively, sort each half, then merge the two sorted halves back together.",
    },
    {
      name: "Quick Sort (randomized)",
      complexity: "O(n log n) avg",
      space: "O(log n)",
      description: "Pick a random pivot, partition elements around it, then recursively sort each side. Randomization avoids worst-case O(n²).",
    },
    {
      name: "Heap Sort",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Build a max-heap in-place, then repeatedly extract the maximum into sorted position.",
    },
  ],
  code: `function sortArray(nums) {
  // Merge Sort — O(n log n) guaranteed
  if (nums.length <= 1) return nums;

  const mid = Math.floor(nums.length / 2);
  const left  = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`,

  generateSteps() {
    const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6]
    const steps: VisStep[] = []
    const sorted: number[] = []

    steps.push(step(arr, [], [], sorted, "Start Merge Sort on [5,2,8,1,9,3,7,4,6]", 2))

    const n = arr.length
    for (let width = 1; width < n; width *= 2) {
      for (let i = 0; i < n; i += 2 * width) {
        const left = i
        const mid = Math.min(i + width, n)
        const right = Math.min(i + 2 * width, n)

        steps.push(step(arr, Array.from({ length: right - left }, (_, k) => left + k), [], sorted,
          `Merging subarray [${arr.slice(left, mid).join(",")}] and [${arr.slice(mid, right).join(",")}]`, 6))

        const leftHalf = arr.slice(left, mid)
        const rightHalf = arr.slice(mid, right)
        let lp = 0, rp = 0, ki = left

        while (lp < leftHalf.length && rp < rightHalf.length) {
          if (leftHalf[lp] <= rightHalf[rp]) {
            arr[ki] = leftHalf[lp++]
          } else {
            arr[ki] = rightHalf[rp++]
          }
          steps.push(step(arr, [ki], [], sorted, `Placed ${arr[ki]} at index ${ki}`, 16))
          ki++
        }
        while (lp < leftHalf.length) { arr[ki] = leftHalf[lp++]; ki++ }
        while (rp < rightHalf.length) { arr[ki] = rightHalf[rp++]; ki++ }
      }
    }

    steps.push(step(arr, [], [], Array.from({ length: n }, (_, i) => i), "Array fully sorted! ✓", 10))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Sort Colors  (#12)
// ════════════════════════════════════════════════════════════════
const sortColors: SortingProblem = {
  id: 12,
  slug: "sort-colors",
  title: "Sort Colors",
  difficulty: "Medium",
  companies: ["Meta", "Amazon", "Microsoft", "Google", "Adobe", "Uber", "Salesforce", "Flipkart"],
  tags: ["Two Pointers", "Sorting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array nums with n objects colored red, white, or blue (represented as 0, 1, 2), sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. You must solve this without using the library's sort function.",
  examples: [
    { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
    { input: "nums = [2,0,1]", output: "[0,1,2]" },
  ],
  constraints: ["n == nums.length", "1 ≤ n ≤ 300", "nums[i] is 0, 1, or 2"],
  hints: [
    "The Dutch National Flag algorithm by Dijkstra solves this in one pass.",
    "Maintain three regions: [0..low-1] = 0s, [low..mid-1] = 1s, [high+1..n-1] = 2s.",
    "Use three pointers: low, mid, high.",
  ],
  pitfalls: [
    "Incrementing mid when you swap a 2 to the high end — you haven't inspected the new element at mid yet.",
    "Using counting sort (two passes) works but misses the one-pass follow-up.",
    "Forgetting the loop condition should be mid ≤ high, not mid < high.",
  ],
  approaches: [
    {
      name: "Dutch National Flag (one pass)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Use three pointers. low tracks the boundary of 0s, high tracks boundary of 2s. mid scans forward.",
    },
    {
      name: "Counting Sort (two pass)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Count 0s, 1s, 2s. Then overwrite array with correct counts. Simple but two-pass.",
    },
  ],
  code: `function sortColors(nums) {
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
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
      // do NOT increment mid here!
    }
  }

  return nums;
}`,

  generateSteps() {
    const arr = [2, 0, 2, 1, 1, 0]
    const steps: VisStep[] = []
    let low = 0, mid = 0, high = arr.length - 1
    const sortedIdx: number[] = []

    steps.push(step(arr, [], [], [], "Dutch National Flag — low=0, mid=0, high=5", 2))

    while (mid <= high) {
      steps.push(step(arr, [mid], [], sortedIdx, `Inspecting nums[mid=${mid}] = ${arr[mid]}`, 5, low))

      if (arr[mid] === 0) {
        ;[arr[low], arr[mid]] = [arr[mid], arr[low]]
        steps.push(step(arr, [], [low, mid], sortedIdx, `nums[mid]=0 → swap with low=${low}`, 7))
        low++; mid++
      } else if (arr[mid] === 1) {
        steps.push(step(arr, [mid], [], sortedIdx, `nums[mid]=1 → already in place, mid++`, 10))
        mid++
      } else {
        ;[arr[mid], arr[high]] = [arr[high], arr[mid]]
        steps.push(step(arr, [], [mid, high], sortedIdx, `nums[mid]=2 → swap with high=${high}`, 13))
        high--
      }
    }

    steps.push(step(arr, [], [], Array.from({ length: arr.length }, (_, i) => i), "Sorted! [0,0,1,1,2,2] ✓", 18))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Top K Frequent Elements  (#13)
// ════════════════════════════════════════════════════════════════
const topKFrequent: SortingProblem = {
  id: 13,
  slug: "top-k-frequent-elements",
  title: "Top K Frequent Elements",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "LinkedIn", "Uber", "Apple", "Spotify", "PayPal"],
  tags: ["Hash Map", "Heap", "Bucket Sort"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order. Your algorithm's time complexity must be better than O(n log n).",
  examples: [
    { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
    { input: "nums = [1], k = 1", output: "[1]" },
  ],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "k is in the range [1, number of unique elements in nums]"],
  hints: [
    "Bucket sort by frequency gives O(n) — each bucket index = frequency.",
    "Max frequency can't exceed n, so you need at most n+1 buckets.",
    "A min-heap of size k also works in O(n log k).",
  ],
  pitfalls: [
    "Using Array.sort() on frequency map entries gives O(n log n) — not better than that threshold.",
    "Forgetting that multiple numbers can have the same frequency.",
    "Off-by-one: bucket array should be size n+1 (index 0 unused).",
  ],
  approaches: [
    {
      name: "Bucket Sort",
      complexity: "O(n)",
      space: "O(n)",
      description: "Count frequencies. Create n+1 buckets indexed by frequency. Traverse buckets from right (highest freq) to collect k elements.",
    },
    {
      name: "Min-Heap",
      complexity: "O(n log k)",
      space: "O(n)",
      description: "Count frequencies. Maintain a min-heap of size k. Push each unique number; pop when heap exceeds k.",
    },
    {
      name: "Quick Select",
      complexity: "O(n) avg",
      space: "O(n)",
      description: "Use QuickSelect on the frequency array to find the k-th largest frequency in linear average time.",
    },
  ],
  code: `function topKFrequent(nums, k) {
  // Bucket Sort approach — O(n)
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }

  // buckets[i] = list of numbers with frequency i
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}`,

  generateSteps() {
    const nums = [1, 1, 1, 2, 2, 3, 3, 3, 3, 4]
    const freqMap: Record<number, number> = {}
    for (const n of nums) freqMap[n] = (freqMap[n] || 0) + 1

    const entries = Object.entries(freqMap).map(([num, cnt]) => ({ num: Number(num), cnt }))
    const arr = entries.map(e => e.cnt)
    const steps: VisStep[] = []
    const k = 2

    steps.push(step(arr, [], [], [], "Count frequencies of each element", 3))
    steps.push(step(arr, [0, 1, 2, 3], [], [], "Frequencies: 1→3, 2→2, 3→4, 4→1", 9))

    const sortedByFreq = [...entries].sort((a, b) => b.cnt - a.cnt)
    const topKIdx = sortedByFreq.slice(0, k).map(e => entries.findIndex(x => x.num === e.num))

    steps.push(step(arr, topKIdx, [], [], `Top-${k} most frequent: ${sortedByFreq.slice(0, k).map(e => e.num).join(", ")}`, 14))
    steps.push(step(arr, [], [], topKIdx, `Answer: [${sortedByFreq.slice(0, k).map(e => e.num).join(", ")}] ✓`, 16))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Longest Consecutive Sequence  (#18)
// ════════════════════════════════════════════════════════════════
const longestConsecutive: SortingProblem = {
  id: 18,
  slug: "longest-consecutive-sequence",
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
companies: ["Google", "Amazon", "Meta", "Microsoft", "Adobe", "Uber", "Atlassian", "ServiceNow", "Nvidia"],  tags: ["Hash Set", "Sorting"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
  examples: [
    { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive sequence is [1,2,3,4]." },
    { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
  ],
  constraints: ["0 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
  hints: [
    "Put all numbers in a HashSet for O(1) lookup.",
    "For each number n, only start counting if n-1 is NOT in the set (so n is a sequence start).",
    "Then count upwards: how far can you go from n?",
  ],
  pitfalls: [
    "Using sort + scan is O(n log n) — the problem asks for O(n).",
    "Checking every number as a sequence start — O(n²) without the 'n-1 not in set' optimization.",
    "Not handling duplicates (the HashSet deduplicates automatically).",
  ],
  approaches: [
    {
      name: "HashSet O(n)",
      complexity: "O(n)",
      space: "O(n)",
      description: "Add all numbers to a set. For each sequence start (num where num-1 ∉ set), count how far the chain extends.",
    },
    {
      name: "Sort + Scan",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort the array. Scan linearly, extending streak when adjacent numbers differ by 1.",
    },
  ],
  code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    // Only start a sequence from its beginning
    if (!set.has(num - 1)) {
      let current = num;
      let streak = 1;

      while (set.has(current + 1)) {
        current++;
        streak++;
      }

      longest = Math.max(longest, streak);
    }
  }

  return longest;
}`,

  generateSteps() {
    const arr = [100, 4, 200, 1, 3, 2]
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "Build a HashSet from all numbers", 2))
    steps.push(step(arr, [], [], [], "For each num: skip if num-1 is in set (not a start)", 5))
    steps.push(step(arr, [3], [], [], "num=1 → 1-1=0 not in set → sequence start!", 7))
    steps.push(step(arr, [3, 2], [], [], "Check 1→2: 2 in set ✓, streak=2", 10))
    steps.push(step(arr, [3, 2, 1], [], [], "Check 2→3: 3 in set ✓, streak=3", 10))
    steps.push(step(arr, [3, 2, 1, 4], [], [], "Check 3→4: 4 in set ✓, streak=4", 10))
    steps.push(step(arr, [], [], [3, 2, 1, 4], "Longest = 4 ([1,2,3,4]) ✓", 15))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Kth Largest Element in an Array  (#113)
// ════════════════════════════════════════════════════════════════
const kthLargest: SortingProblem = {
  id: 113,
  slug: "kth-largest-element-in-an-array",
  title: "Kth Largest Element in an Array",
  difficulty: "Medium",
companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "LinkedIn", "Bloomberg", "GoldmanSachs"],  tags: ["Sorting", "Heap", "Quick Select", "Divide & Conquer"],
  timeComplexity: "O(n) avg",
  spaceComplexity: "O(1)",
  description:
    "Given an integer array nums and an integer k, return the k-th largest element in the array. Note that it is the k-th largest element in the sorted order, not the k-th distinct element. Can you solve it without sorting?",
  examples: [
    { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
  ],
  constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
  hints: [
    "QuickSelect is like QuickSort but only recurse into the relevant half.",
    "The k-th largest = index (n-k) in a sorted array.",
    "A min-heap of size k also works: iterate, push; if heap.size > k, pop min.",
  ],
  pitfalls: [
    "Using sort() is O(n log n) — QuickSelect averages O(n).",
    "QuickSelect has O(n²) worst case without randomizing the pivot.",
    "Confusing k-th largest with k-th smallest (target index is n-k, not k).",
  ],
  approaches: [
    {
      name: "QuickSelect",
      complexity: "O(n) avg, O(n²) worst",
      space: "O(1)",
      description: "Partition around a pivot. If pivot lands at target index, done. Otherwise recurse into only one side.",
    },
    {
      name: "Min-Heap of size k",
      complexity: "O(n log k)",
      space: "O(k)",
      description: "Maintain a min-heap of the k largest seen so far. Iterate through all numbers; push then pop-if-over-k.",
    },
    {
      name: "Sort",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort descending and return index k-1. Simple but slower than optimal.",
    },
  ],
  code: `function findKthLargest(nums, k) {
  // QuickSelect — O(n) average
  const target = nums.length - k;

  function partition(lo, hi) {
    const pivot = nums[hi];
    let i = lo;

    for (let j = lo; j < hi; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }

    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
  }

  function quickSelect(lo, hi) {
    if (lo === hi) return nums[lo];
    const p = partition(lo, hi);
    if (p === target) return nums[p];
    if (p < target)  return quickSelect(p + 1, hi);
    return quickSelect(lo, p - 1);
  }

  return quickSelect(0, nums.length - 1);
}`,

  generateSteps() {
    const arr = [3, 2, 1, 5, 6, 4]
    const steps: VisStep[] = []
    const k = 2
    const target = arr.length - k

    steps.push(step(arr, [], [], [], `Find k=${k}th largest. Target index = ${target} in sorted order`, 2))

    const pivotIdx = arr.length - 1
    steps.push(step(arr, [pivotIdx], [], [], `Pivot = arr[${pivotIdx}] = ${arr[pivotIdx]}`, 5, pivotIdx))

    const pivotVal = arr[pivotIdx]
    let i = 0
    for (let j = 0; j < arr.length - 1; j++) {
      steps.push(step(arr, [j], [], [], `arr[${j}]=${arr[j]} vs pivot=${pivotVal}`, 7, pivotIdx))
      if (arr[j] <= pivotVal) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        if (i !== j) steps.push(step(arr, [], [i, j], [], `Swap arr[${i}] and arr[${j}]`, 8))
        i++
      }
    }
    ;[arr[i], arr[pivotIdx]] = [arr[pivotIdx], arr[i]]
    steps.push(step(arr, [], [i, pivotIdx], [], `Pivot ${pivotVal} placed at index ${i}`, 12, i))

    if (i === target) {
      steps.push(step(arr, [], [], [i], `Pivot at target index ${target} → answer is ${arr[i]} ✓`, 15))
    } else {
      steps.push(step(arr, [], [], [i], `Pivot at ${i}, target is ${target} → recurse into right half`, 16))
      const sorted = [...arr].sort((a, b) => a - b)
      steps.push(step(sorted, [], [], [target], `After full QuickSelect: answer = ${sorted[target]} ✓`, 17))
    }

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Merge Intervals  (#221)
// ════════════════════════════════════════════════════════════════
const mergeIntervals: SortingProblem = {
  id: 221,
  slug: "merge-intervals",
  title: "Merge Intervals",
  difficulty: "Medium",
companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "LinkedIn", "Twitter", "Oracle", "Salesforce"],  tags: ["Sorting", "Arrays", "Intervals"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
  examples: [
    { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap → merge to [1,6]." },
    { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." },
  ],
  constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ start_i ≤ end_i ≤ 10⁴"],
  hints: [
    "Sort intervals by start time first.",
    "After sorting, an interval [a,b] overlaps [c,d] iff c ≤ b.",
    "Merge by extending the end: max(b, d).",
  ],
  pitfalls: [
    "Not sorting first — adjacent intervals may not be adjacent in the input.",
    "Using < instead of <= when checking overlap (touching intervals [1,4],[4,5] should merge).",
    "Forgetting to push the last merged interval after the loop.",
  ],
  approaches: [
    {
      name: "Sort + Scan",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort by start. Iterate: if current interval overlaps with last result interval, merge; else append.",
    },
  ],
  code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const curr = intervals[i];

    if (curr[0] <= last[1]) {
      // overlapping — merge
      last[1] = Math.max(last[1], curr[1]);
    } else {
      result.push(curr);
    }
  }

  return result;
}`,

  generateSteps() {
    const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
    const arr = intervals.map(iv => iv[1] - iv[0] + 1)
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "Sort intervals by start time → [[1,3],[2,6],[8,10],[15,18]]", 2))
    steps.push(step(arr, [0], [], [], "result = [[1,3]]. Compare next interval [2,6]", 4))
    steps.push(step(arr, [0, 1], [], [], "2 ≤ 3 → overlapping! Merge to [1, max(3,6)] = [1,6]", 9))
    steps.push(step(arr, [], [0, 1], [], "Merged: result = [[1,6]]", 10))
    steps.push(step(arr, [1, 2], [], [], "Compare [1,6] with [8,10]: 8 > 6 → no overlap", 13))
    steps.push(step(arr, [], [], [0, 1], "Append [8,10]. result = [[1,6],[8,10]]", 14))
    steps.push(step(arr, [2, 3], [], [0, 1], "Compare [8,10] with [15,18]: 15 > 10 → no overlap", 13))
    steps.push(step(arr, [], [], [0, 1, 2, 3], "Final: [[1,6],[8,10],[15,18]] ✓", 16))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Non Overlapping Intervals  (#222)
// ════════════════════════════════════════════════════════════════
const nonOverlappingIntervals: SortingProblem = {
  id: 222,
  slug: "non-overlapping-intervals",
  title: "Non Overlapping Intervals",
  difficulty: "Medium",
companies: ["Google", "Amazon", "Microsoft", "Meta", "Adobe", "Atlassian", "ServiceNow"],  tags: ["Sorting", "Greedy", "Intervals"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
  examples: [
    { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "[1,3] can be removed and the rest are non-overlapping." },
    { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
  ],
  constraints: ["1 ≤ intervals.length ≤ 10⁵", "-5 × 10⁴ ≤ start_i < end_i ≤ 5 × 10⁴"],
  hints: [
    "Sort by end time (not start time) for greedy.",
    "Always keep the interval that ends earliest — it leaves maximum room for future intervals.",
    "Count removals = intervals that start before the current end boundary.",
  ],
  pitfalls: [
    "Sorting by start time instead of end time — the greedy choice is to keep what ends soonest.",
    "Off by one in counting removals.",
    "Not understanding this is equivalent to: find max non-overlapping intervals, then answer = n - max.",
  ],
  approaches: [
    {
      name: "Greedy (sort by end)",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort by end time. Greedily keep intervals; when overlap found, remove the one with the later end time (the current one).",
    },
  ],
  code: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // sort by end

  let removals = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];

    if (start < prevEnd) {
      // overlap: remove current (it ends later)
      removals++;
    } else {
      prevEnd = end; // no overlap: keep this interval
    }
  }

  return removals;
}`,

  generateSteps() {
    const arr = [2, 3, 4, 3]
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "Sort by end time: [[1,2],[2,3],[1,3],[3,4]]", 2))
    steps.push(step(arr, [0], [], [], "Keep [1,2]. prevEnd=2", 5))
    steps.push(step(arr, [1], [], [0], "[2,3]: start=2 ≥ prevEnd=2 → no overlap, keep. prevEnd=3", 10))
    steps.push(step(arr, [2], [], [0, 1], "[1,3]: start=1 < prevEnd=3 → overlap! Remove. removals=1", 8))
    steps.push(step(arr, [3], [], [0, 1, 2], "[3,4]: start=3 ≥ prevEnd=3 → keep. prevEnd=4", 10))
    steps.push(step(arr, [], [], [0, 1, 2, 3], "Answer = 1 removal ✓", 13))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Meeting Rooms  (#223)
// ════════════════════════════════════════════════════════════════
const meetingRooms: SortingProblem = {
  id: 223,
  slug: "meeting-rooms",
  title: "Meeting Rooms",
  difficulty: "Easy",
companies: ["Amazon", "Meta", "Microsoft", "Google", "Uber", "LinkedIn", "Zomato", "Swiggy"],  tags: ["Sorting", "Intervals"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array of meeting time intervals where intervals[i] = [start_i, end_i], determine if a person could attend all meetings (no two meetings overlap).",
  examples: [
    { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false" },
    { input: "intervals = [[7,10],[2,4]]", output: "true" },
  ],
  constraints: ["0 ≤ intervals.length ≤ 10⁴"],
  hints: [
    "Sort by start time.",
    "Check if any meeting's start is before the previous meeting's end.",
  ],
  pitfalls: [
    "Forgetting to sort first.",
    "Not using strict < (meetings that touch [0,10],[10,20] are fine).",
  ],
  approaches: [
    {
      name: "Sort + Linear Scan",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort intervals by start time. Check each consecutive pair for overlap.",
    },
  ],
  code: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < intervals.length; i++) {
    const prevEnd   = intervals[i - 1][1];
    const currStart = intervals[i][0];

    if (currStart < prevEnd) return false;
  }

  return true;
}`,

  generateSteps() {
    const arr = [30, 10, 20]
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "Sort by start: [[0,30],[5,10],[15,20]]", 2))
    steps.push(step(arr, [0, 1], [], [], "Compare [0,30] and [5,10]: start=5 < end=30 → OVERLAP!", 5))
    steps.push(step(arr, [], [0, 1], [], "Return false — can't attend all meetings ✓", 6))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Meeting Rooms II  (#224)
// ════════════════════════════════════════════════════════════════
const meetingRoomsII: SortingProblem = {
  id: 224,
  slug: "meeting-rooms-ii",
  title: "Meeting Rooms II",
  difficulty: "Medium",
companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Uber", "Salesforce", "Oracle", "Cisco"],  tags: ["Sorting", "Heap", "Greedy", "Intervals"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of meeting time intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of conference rooms required.",
  examples: [
    { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
    { input: "intervals = [[7,10],[2,4]]", output: "1" },
  ],
  constraints: ["1 ≤ intervals.length ≤ 10⁴"],
  hints: [
    "Sort start and end times separately.",
    "Use two pointers — one for starts, one for ends. If next start < current end → need new room.",
    "A min-heap of room end times also works clearly.",
  ],
  pitfalls: [
    "Sorting full intervals instead of just the start/end times separately.",
    "Not decrementing rooms when a meeting ends before the next one starts.",
  ],
  approaches: [
    {
      name: "Two Sorted Arrays",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort starts and ends separately. Use two pointers to simulate a timeline sweep.",
    },
    {
      name: "Min-Heap",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort by start. Push end times into a min-heap. If next meeting starts after heap's min end, pop (reuse room).",
    },
  ],
  code: `function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a,b) => a-b);
  const ends   = intervals.map(i => i[1]).sort((a,b) => a-b);

  let rooms = 0, maxRooms = 0;
  let s = 0, e = 0;

  while (s < intervals.length) {
    if (starts[s] < ends[e]) {
      rooms++;           // new meeting starts before any ends
      s++;
    } else {
      rooms--;           // a meeting ended, room freed
      e++;
    }
    maxRooms = Math.max(maxRooms, rooms);
  }

  return maxRooms;
}`,

  generateSteps() {
    const arr = [30, 10, 20]
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "starts=[0,5,15] ends=[10,20,30]", 2))
    steps.push(step(arr, [0], [], [], "start=0 < end=10 → new room. rooms=1", 9))
    steps.push(step(arr, [0, 1], [], [], "start=5 < end=10 → new room. rooms=2", 9))
    steps.push(step(arr, [0, 2], [], [1], "start=15 ≥ end=10 → free a room. rooms=1", 12))
    steps.push(step(arr, [], [], [0, 1, 2], "Max rooms needed = 2 ✓", 17))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Insert Interval  (#220)
// ════════════════════════════════════════════════════════════════
const insertInterval: SortingProblem = {
  id: 220,
  slug: "insert-interval",
  title: "Insert Interval",
  difficulty: "Medium",
companies: ["Google", "LinkedIn", "Amazon", "Microsoft", "Meta", "Apple", "ServiceNow", "Flipkart"],  tags: ["Sorting", "Intervals", "Arrays"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "You are given an array of non-overlapping intervals sorted in ascending order by start time, and a new interval. Insert the new interval into the array (merge if necessary) and return the updated array of non-overlapping intervals, still sorted.",
  examples: [
    { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
    { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" },
  ],
  constraints: ["0 ≤ intervals.length ≤ 10⁴"],
  hints: [
    "Add all intervals that end before the new interval starts.",
    "Merge all overlapping intervals by expanding the new interval.",
    "Add all remaining intervals after the merge.",
  ],
  pitfalls: [
    "Off-by-one: overlap condition is newStart ≤ existingEnd AND newEnd ≥ existingStart.",
    "Forgetting to add the new (possibly merged) interval before adding trailing intervals.",
    "Edge case: empty intervals array.",
  ],
  approaches: [
    {
      name: "Linear Scan (no sort needed)",
      complexity: "O(n)",
      space: "O(n)",
      description: "Input is already sorted. Three phases: copy non-overlapping before, merge overlapping, copy rest.",
    },
  ],
  code: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;

  // Phase 1: add all before new interval
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++]);
  }

  // Phase 2: merge overlapping
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // Phase 3: add remaining
  while (i < n) result.push(intervals[i++]);

  return result;
}`,

  generateSteps() {
    const arr = [2, 4, 2, 4]
    const steps: VisStep[] = []

    steps.push(step(arr, [], [], [], "intervals=[[1,3],[6,9]] newInterval=[2,5]", 1))
    steps.push(step(arr, [0], [], [], "Phase 1: [1,3] ends at 3 ≥ newStart=2 → skip phase 1", 7))
    steps.push(step(arr, [0], [], [], "Phase 2: [1,3] overlaps [2,5]. Merge → [1,5]", 11))
    steps.push(step(arr, [], [0], [], "newInterval updated to [1,5]", 12))
    steps.push(step(arr, [1], [0], [], "Phase 2: [6,9] start=6 > newEnd=5 → stop merging", 10))
    steps.push(step(arr, [], [], [0], "Push merged [1,5]", 14))
    steps.push(step(arr, [], [], [0, 1], "Phase 3: push [6,9]. Result = [[1,5],[6,9]] ✓", 17))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════
export const SORTING_PROBLEMS: SortingProblem[] = [
  sortAnArray,
  sortColors,
  topKFrequent,
  longestConsecutive,
  kthLargest,
  insertInterval,
  mergeIntervals,
  nonOverlappingIntervals,
  meetingRooms,
  meetingRoomsII,
]