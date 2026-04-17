// components/visualizer/heap/heap-problems-data.ts

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google" | "Amazon" | "Apple" | "Meta" | "Microsoft"
  | "Netflix" | "Adobe" | "Uber" | "LinkedIn" | "Twitter"
  | "ServiceNow" | "Salesforce" | "Oracle" | "SAP" | "Intuit"
  | "PayPal" | "Stripe" | "Atlassian" | "Airbnb" | "Dropbox"
  | "Pinterest" | "Snap" | "Spotify" | "Walmart" | "Cisco"
  | "VMware" | "Nvidia" | "GoldmanSachs" | "MorganStanley"
  | "Bloomberg" | "Zomato" | "Swiggy" | "Flipkart" | "Meesho" | "PhonePe"

export interface Approach {
  name: string
  complexity: string
  space: string
  description: string
}

export interface HeapNode {
  id: string
  value: number | string
  isRoot?: boolean
}

export interface HeapVisStep {
  nodes: HeapNode[]
  highlighted: string[]
  swapped: string[]
  done: string[]
  auxiliary: { label: string; value: string | number }[]
  message: string
  codeLine: number
}

export interface HeapProblem {
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
  generateSteps: () => HeapVisStep[]
}

// ─── helpers ────────────────────────────────────────────────────
let _huid = 0
function huid() { return `h${++_huid}` }

function makeHeap(values: (number | string)[]): HeapNode[] {
  return values.map((v, i) => ({ value: v, id: huid(), isRoot: i === 0 }))
}

function hframe(
  nodes: HeapNode[],
  highlighted: string[],
  swapped: string[],
  done: string[],
  message: string,
  codeLine: number,
  auxiliary: { label: string; value: string | number }[] = []
): HeapVisStep {
  return { nodes: nodes.map(n => ({ ...n })), highlighted, swapped, done, auxiliary, message, codeLine }
}

// ════════════════════════════════════════════════════════════════
// 1. Last Stone Weight  (#111) — Easy
// ════════════════════════════════════════════════════════════════
const lastStoneWeight: HeapProblem = {
  id: 111,
  slug: "last-stone-weight",
  title: "Last Stone Weight",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Apple", "Microsoft", "Adobe", "Flipkart"],
  tags: ["Array", "Heap (Priority Queue)"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "You are given an array of integers stones where stones[i] is the weight of the ith stone. We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. If they are equal, both are destroyed; otherwise the larger stone has its weight reduced by the smaller. Return the weight of the last remaining stone, or 0 if none remain.",
  examples: [
    { input: "stones = [2,7,4,1,8,1]", output: "1", explanation: "Smash 7,8→1. Smash 4,2→2. Smash 2,1→1. Smash 1,1→0. Last stone: 1." },
    { input: "stones = [1]", output: "1" },
  ],
  constraints: [
    "1 ≤ stones.length ≤ 30",
    "1 ≤ stones[i] ≤ 1000",
  ],
  hints: [
    "Use a max-heap to always access the two heaviest stones in O(log n).",
    "After smashing, if y - x > 0, push the result back into the heap.",
    "Stop when heap size ≤ 1.",
  ],
  pitfalls: [
    "JavaScript has no built-in max-heap — use a min-heap with negated values or a library.",
    "Forgetting to push the remainder (y - x) back when y ≠ x.",
    "Returning heap.top() when heap is empty — check isEmpty() first.",
  ],
  approaches: [
    {
      name: "Max-Heap Simulation",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Push all stones into a max-heap. Repeatedly pop two heaviest, smash, and push remainder until ≤ 1 stone.",
    },
    {
      name: "Sorted Array (Brute Force)",
      complexity: "O(n² log n)",
      space: "O(1)",
      description: "Sort after each round. Simple but inefficient for large inputs.",
    },
  ],
  code: `function lastStoneWeight(stones) {
  // Use max-heap (negate for min-heap trick)
  const maxHeap = new MaxPriorityQueue({ priority: x => x });

  for (const s of stones) {
    maxHeap.enqueue(s);
  }

  while (maxHeap.size() > 1) {
    const y = maxHeap.dequeue().element; // heaviest
    const x = maxHeap.dequeue().element; // 2nd heaviest

    if (y !== x) {
      maxHeap.enqueue(y - x); // push remainder
    }
  }

  return maxHeap.isEmpty() ? 0 : maxHeap.dequeue().element;
}`,
  generateSteps() {
    _huid = 100
    const steps: HeapVisStep[] = []

    // Initial
    let heap = makeHeap([8, 7, 4, 2, 1, 1])
    steps.push(hframe(heap, [heap[0].id], [], [],
      "Build max-heap from stones [2,7,4,1,8,1]. Root = 8 (heaviest).", 1,
      [{ label: "heap (max)", value: "8,7,4,2,1,1" }]))

    // Round 1: pop 8 and 7, push 1
    steps.push(hframe(heap, [heap[0].id, heap[1].id], [], [],
      "Pop y=8 and x=7. y≠x → smash! Remainder = 8−7 = 1. Push back.", 9,
      [{ label: "y", value: 8 }, { label: "x", value: 7 }, { label: "y−x", value: 1 }]))

    heap = makeHeap([4, 2, 1, 1, 1])
    steps.push(hframe(heap, [], [heap[0].id], [],
      "Heap after round 1: [4,2,1,1,1]. New root = 4.", 12,
      [{ label: "heap", value: "4,2,1,1,1" }]))

    // Round 2: pop 4 and 2, push 2
    steps.push(hframe(heap, [heap[0].id, heap[1].id], [], [],
      "Pop y=4 and x=2. y≠x → smash! Remainder = 4−2 = 2. Push back.", 9,
      [{ label: "y", value: 4 }, { label: "x", value: 2 }, { label: "y−x", value: 2 }]))

    heap = makeHeap([2, 1, 1, 1])
    steps.push(hframe(heap, [], [heap[0].id], [],
      "Heap after round 2: [2,1,1,1]. New root = 2.", 12,
      [{ label: "heap", value: "2,1,1,1" }]))

    // Round 3: pop 2 and 1, push 1
    steps.push(hframe(heap, [heap[0].id, heap[1].id], [], [],
      "Pop y=2 and x=1. y≠x → smash! Remainder = 2−1 = 1. Push back.", 9,
      [{ label: "y", value: 2 }, { label: "x", value: 1 }, { label: "y−x", value: 1 }]))

    heap = makeHeap([1, 1, 1])
    steps.push(hframe(heap, [], [heap[0].id], [],
      "Heap after round 3: [1,1,1].", 12,
      [{ label: "heap", value: "1,1,1" }]))

    // Round 4: pop 1 and 1 — equal, both destroyed
    steps.push(hframe(heap, [heap[0].id, heap[1].id], [], [],
      "Pop y=1 and x=1. y==x → both destroyed! No push.", 10,
      [{ label: "y", value: 1 }, { label: "x", value: 1 }]))

    const finalHeap = makeHeap([1])
    steps.push(hframe(finalHeap, [], [], finalHeap.map(n => n.id),
      "One stone remains: 1 ✓", 17,
      [{ label: "result", value: 1 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Kth Largest Element in a Stream  (#110) — Easy
// ════════════════════════════════════════════════════════════════
const kthLargestStream: HeapProblem = {
  id: 110,
  slug: "kth-largest-element-in-a-stream",
  title: "Kth Largest Element in a Stream",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Microsoft", "Meta", "LinkedIn", "Bloomberg"],
  tags: ["Tree", "Design", "Binary Search Tree", "Heap (Priority Queue)", "Data Stream"],
  timeComplexity: "O(log k) per add",
  spaceComplexity: "O(k)",
  description:
    "Design a class to find the kth largest element in a stream. The class has a constructor which accepts an integer k and an integer array nums, and a method add(val) which returns the kth largest element in the current stream.",
  examples: [
    {
      input: "k=3, nums=[4,5,8,2], add(3), add(5), add(10), add(9), add(4)",
      output: "[4, 5, 5, 8, 8]",
      explanation: "Maintain min-heap of size k. The root is always the kth largest.",
    },
  ],
  constraints: [
    "1 ≤ k ≤ 10⁴",
    "0 ≤ nums.length ≤ 10⁴",
    "-10⁴ ≤ nums[i], val ≤ 10⁴",
    "At most 10⁴ calls to add.",
  ],
  hints: [
    "A min-heap of size k always has the kth largest at its root.",
    "On each add: push val, then if heap.size > k, pop the smallest.",
    "Return heap.top() — that is the kth largest.",
  ],
  pitfalls: [
    "Using a max-heap — you'd always have the 1st largest at root, not the kth.",
    "Not trimming the heap to size k after each insertion.",
    "Returning heap.top() when the heap has fewer than k elements.",
  ],
  approaches: [
    {
      name: "Min-Heap of Size k",
      complexity: "O(log k) add",
      space: "O(k)",
      description: "Keep only k elements in a min-heap. Root is kth largest. Push new val, pop if size exceeds k.",
    },
  ],
  code: `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue({ priority: x => x });

    for (const n of nums) {
      this.add(n);
    }
  }

  add(val) {
    this.minHeap.enqueue(val);

    // Keep only k elements
    if (this.minHeap.size() > this.k) {
      this.minHeap.dequeue(); // remove smallest
    }

    // Root of min-heap = kth largest
    return this.minHeap.front().element;
  }
}`,
  generateSteps() {
    _huid = 200
    const steps: HeapVisStep[] = []
    const k = 3
    const adds = [4, 5, 8, 2, 3]

    steps.push(hframe([], [], [], [],
      `k=3. Min-heap of size ≤ 3. Root will always be the 3rd largest.`, 1))

    let heapVals: number[] = []
    for (const val of adds) {
      heapVals.push(val)
      heapVals.sort((a, b) => a - b)
      if (heapVals.length > k) heapVals.shift()
      const heap = makeHeap(heapVals)
      steps.push(hframe(heap, [heap[0].id], [], [],
        `add(${val}) → heap=[${heapVals.join(",")}]. kth largest = ${heapVals[0]}`, 9,
        [{ label: `add(${val})`, value: heapVals[0] }, { label: "heap top", value: heapVals[0] }]))
    }

    const finalHeap = makeHeap(heapVals)
    steps.push(hframe(finalHeap, [], [], finalHeap.map(n => n.id),
      `Final min-heap of size k=${k}. Root = ${heapVals[0]} = kth largest ✓`, 17,
      [{ label: "kth largest", value: heapVals[0] }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. K Closest Points to Origin  (#112) — Medium
// ════════════════════════════════════════════════════════════════
const kClosestPoints: HeapProblem = {
  id: 112,
  slug: "k-closest-points-to-origin",
  title: "K Closest Points to Origin",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber", "Nvidia", "LinkedIn", "Flipkart"],
  tags: ["Array", "Math", "Divide and Conquer", "Heap (Priority Queue)", "Sorting"],
  timeComplexity: "O(n log k)",
  spaceComplexity: "O(k)",
  description:
    "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0). The distance is Euclidean. You may return the answer in any order.",
  examples: [
    { input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]", explanation: "Distance of [1,3] = √10. Distance of [-2,2] = √8. [-2,2] is closer." },
    { input: "points = [[3,3],[5,-1],[-2,4]], k = 2", output: "[[3,3],[-2,4]]" },
  ],
  constraints: [
    "1 ≤ k ≤ points.length ≤ 10⁴",
    "-10⁴ ≤ xi, yi ≤ 10⁴",
  ],
  hints: [
    "Use a max-heap of size k keyed by distance squared (avoid sqrt for speed).",
    "For each new point: push it. If heap.size > k, pop the farthest.",
    "All remaining points in the heap are the k closest.",
    "Compare x²+y² — no need for actual sqrt.",
  ],
  pitfalls: [
    "Using a min-heap of all points — O(n log n) space instead of O(k).",
    "Sorting the full array — O(n log n) time, fine but misses the optimal O(n log k).",
    "Forgetting that distance squared preserves order (no need for sqrt).",
  ],
  approaches: [
    {
      name: "Max-Heap of Size k",
      complexity: "O(n log k)",
      space: "O(k)",
      description: "Keep a max-heap of k closest seen so far. Push each point; if size > k, evict the farthest.",
    },
    {
      name: "Sort by Distance",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort all points by distance, return first k. Simple but less optimal.",
    },
    {
      name: "QuickSelect",
      complexity: "O(n) average",
      space: "O(1)",
      description: "Partition points around a pivot like quicksort. Average O(n) but worst case O(n²).",
    },
  ],
  code: `function kClosest(points, k) {
  // Max-heap keyed by distance squared
  const maxHeap = new MaxPriorityQueue({
    priority: ([x, y]) => x * x + y * y
  });

  for (const p of points) {
    maxHeap.enqueue(p);

    // Evict farthest if heap exceeds k
    if (maxHeap.size() > k) {
      maxHeap.dequeue();
    }
  }

  // Remaining points are the k closest
  return maxHeap.toArray().map(e => e.element);
}`,
  generateSteps() {
    _huid = 300
    const steps: HeapVisStep[] = []
    const points = [[1, 3], [-2, 2], [3, 4], [0, 1]]
    const k = 2

    steps.push(hframe([], [], [], [],
      `k=${k}. Process each point. Max-heap stores k closest (farthest at root).`, 1))

    const dist = (p: number[]) => p[0] * p[0] + p[1] * p[1]
    let held: { point: number[]; d: number }[] = []

    for (const p of points) {
      held.push({ point: p, d: dist(p) })
      held.sort((a, b) => b.d - a.d) // max-heap order (farthest first)
      const labels = held.map(h => `[${h.point}] d²=${h.d}`)
      const heap = makeHeap(held.map(h => `d²=${h.d}`))
      steps.push(hframe(heap, [heap[0].id], [], [],
        `Push [${p}] (d²=${dist(p)}). Heap size=${held.length}.`, 6,
        [{ label: "added", value: `[${p}]` }, { label: "d²", value: dist(p) }]))

      if (held.length > k) {
        const evicted = held.shift()!
        const heap2 = makeHeap(held.map(h => `d²=${h.d}`))
        steps.push(hframe(heap2, [], [heap2[0].id], [],
          `Heap size > ${k}. Evict farthest [${evicted.point}] (d²=${evicted.d}).`, 11,
          [{ label: "evicted", value: `[${evicted.point}]` }]))
      }
    }

    const finalHeap = makeHeap(held.map(h => `[${h.point}]`))
    steps.push(hframe(finalHeap, [], [], finalHeap.map(n => n.id),
      `${k} closest points: ${held.map(h => `[${h.point}]`).join(", ")} ✓`, 16,
      [{ label: "result", value: held.map(h => `[${h.point}]`).join(", ") }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Kth Largest Element in an Array  (#113) — Medium
// ════════════════════════════════════════════════════════════════
const kthLargestArray: HeapProblem = {
  id: 113,
  slug: "kth-largest-element-in-an-array",
  title: "Kth Largest Element in an Array",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Apple", "Microsoft", "Bloomberg", "Uber", "Nvidia"],
  tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"],
  timeComplexity: "O(n log k)",
  spaceComplexity: "O(k)",
  description:
    "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?",
  examples: [
    { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
  ],
  constraints: [
    "1 ≤ k ≤ nums.length ≤ 10⁵",
    "-10⁴ ≤ nums[i] ≤ 10⁴",
  ],
  hints: [
    "Maintain a min-heap of exactly k elements.",
    "After processing all elements, the root of the min-heap is the kth largest.",
    "Push each element; if heap.size > k, pop to keep only k largest seen.",
  ],
  pitfalls: [
    "Forgetting to trim the heap — you'll always return heap.min() rather than kth largest.",
    "Using a max-heap — you'd need to extract k times which is O(k log n).",
    "Sorting and indexing — correct but O(n log n), slower than the O(n log k) heap approach.",
  ],
  approaches: [
    {
      name: "Min-Heap of Size k",
      complexity: "O(n log k)",
      space: "O(k)",
      description: "Keep exactly k elements in a min-heap. Push each element; pop if size > k. Root = kth largest.",
    },
    {
      name: "QuickSelect",
      complexity: "O(n) average, O(n²) worst",
      space: "O(1)",
      description: "Partition-based selection similar to quicksort pivot. Average linear time.",
    },
    {
      name: "Sort + Index",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Sort descending, return nums[k-1]. Simple but not optimal.",
    },
  ],
  code: `function findKthLargest(nums, k) {
  const minHeap = new MinPriorityQueue({ priority: x => x });

  for (const n of nums) {
    minHeap.enqueue(n);

    // Keep only k largest
    if (minHeap.size() > k) {
      minHeap.dequeue(); // remove current minimum
    }
  }

  // Root of min-heap = kth largest
  return minHeap.front().element;
}`,
  generateSteps() {
    _huid = 400
    const nums = [3, 2, 1, 5, 6, 4]
    const k = 2
    const steps: HeapVisStep[] = []

    steps.push(hframe([], [], [], [],
      `k=${k}. Build min-heap of size k. Root will be the ${k}nd largest.`, 1))

    let heap: number[] = []
    for (const n of nums) {
      heap.push(n)
      heap.sort((a, b) => a - b)
      const heapNodes = makeHeap(heap)
      steps.push(hframe(heapNodes, [heapNodes[heapNodes.length - 1].id], [], [],
        `Push ${n}. Heap = [${heap.join(",")}], size=${heap.length}`, 4,
        [{ label: "pushed", value: n }]))

      if (heap.length > k) {
        const removed = heap.shift()!
        const trimNodes = makeHeap(heap)
        steps.push(hframe(trimNodes, [], [trimNodes[0].id], [],
          `Size > ${k}. Pop minimum (${removed}). Heap = [${heap.join(",")}]`, 7,
          [{ label: "popped (min)", value: removed }, { label: "heap top", value: heap[0] }]))
      }
    }

    const finalNodes = makeHeap(heap)
    steps.push(hframe(finalNodes, [], [], finalNodes.map(n => n.id),
      `${k}nd largest = heap root = ${heap[0]} ✓`, 12,
      [{ label: "result", value: heap[0] }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Task Scheduler  (#114) — Medium
// ════════════════════════════════════════════════════════════════
const taskScheduler: HeapProblem = {
  id: 114,
  slug: "task-scheduler",
  title: "Task Scheduler",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Salesforce", "Bloomberg"],
  tags: ["Array", "Hash Table", "Greedy", "Sorting", "Heap (Priority Queue)", "Counting"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Given a characters array tasks representing CPU tasks, each labeled 'A' to 'Z', and a cooldown interval n, return the minimum number of intervals the CPU needs to finish all tasks. Each interval, the CPU can complete one task or sit idle. There must be at least n intervals between two same tasks.",
  examples: [
    { input: "tasks = ['A','A','A','B','B','B'], n = 2", output: "8", explanation: "A→B→idle→A→B→idle→A→B" },
    { input: "tasks = ['A','A','A','B','B','B'], n = 0", output: "6" },
  ],
  constraints: [
    "1 ≤ tasks.length ≤ 10⁴",
    "tasks[i] is uppercase English letter",
    "0 ≤ n ≤ 100",
  ],
  hints: [
    "Always schedule the most frequent remaining task first (greedy).",
    "Use a max-heap for task frequencies and a queue for cooldown tracking.",
    "Each cycle processes n+1 slots: fill with tasks from heap, idle if needed.",
    "Time advances by min(n+1, remaining tasks in cycle) if heap becomes empty.",
  ],
  pitfalls: [
    "Not tracking the cooldown — blindly popping from heap without respecting n.",
    "Off-by-one in cycle time: the cycle size is n+1, not n.",
    "Forgetting to add tasks back to the heap after their cooldown expires.",
  ],
  approaches: [
    {
      name: "Max-Heap + Cooldown Queue",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Max-heap of frequencies + queue of (freq, availableTime). Simulate time, always pick highest freq task available.",
    },
    {
      name: "Math Formula",
      complexity: "O(n)",
      space: "O(1)",
      description: "result = max(tasks.length, (maxFreq-1)*(n+1) + countOfMaxFreq). O(n) but harder to derive.",
    },
  ],
  code: `function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) {
    freq[t.charCodeAt(0) - 65]++;
  }

  const maxHeap = new MaxPriorityQueue({ priority: x => x });
  for (const f of freq) if (f > 0) maxHeap.enqueue(f);

  let time = 0;
  const queue = []; // [freq, availableAt]

  while (!maxHeap.isEmpty() || queue.length > 0) {
    time++;

    if (!maxHeap.isEmpty()) {
      const f = maxHeap.dequeue().element - 1;
      if (f > 0) queue.push([f, time + n]);
    }

    if (queue.length > 0 && queue[0][1] === time) {
      maxHeap.enqueue(queue.shift()[0]);
    }
  }

  return time;
}`,
  generateSteps() {
    _huid = 500
    const steps: HeapVisStep[] = []

    steps.push(hframe([], [], [], [],
      "tasks=[A,A,A,B,B,B], n=2. Count frequencies: A=3, B=3.", 1,
      [{ label: "A", value: 3 }, { label: "B", value: 3 }]))

    const heap1 = makeHeap([3, 3])
    steps.push(hframe(heap1, [heap1[0].id], [], [],
      "Max-heap of frequencies: [3, 3]. Top = 3.", 7,
      [{ label: "heap", value: "freq: 3, 3" }]))

    // Cycle 1: A, B, idle
    const heap2 = makeHeap([2, 2])
    steps.push(hframe(heap2, [heap2[0].id], [], [],
      "Cycle 1: Run task A (freq→2), run task B (freq→2), idle. Time += 3.", 11,
      [{ label: "time", value: 3 }, { label: "schedule", value: "A→B→idle" }]))

    // Cycle 2: A, B, idle
    const heap3 = makeHeap([1, 1])
    steps.push(hframe(heap3, [heap3[0].id], [], [],
      "Cycle 2: Run task A (freq→1), run task B (freq→1), idle. Time += 3.", 11,
      [{ label: "time", value: 6 }, { label: "schedule", value: "A→B→idle" }]))

    // Cycle 3: A, B — no idle needed
    const heap4 = makeHeap([0])
    steps.push(hframe(makeHeap([1, 1]), [makeHeap([1, 1])[0].id], [], [],
      "Cycle 3: Run A (freq→0), run B (freq→0). No idle needed. Time += 2.", 14,
      [{ label: "time", value: 8 }, { label: "schedule", value: "A→B" }]))

    const finalNodes = makeHeap(["done"])
    steps.push(hframe(finalNodes, [], [], finalNodes.map(n => n.id),
      "Heap empty. Total time = 8 ✓", 20,
      [{ label: "result", value: 8 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Reorganize String  (#117) — Medium  ← LOCKED
// ════════════════════════════════════════════════════════════════
const reorganizeString: HeapProblem = {
  id: 117,
  slug: "reorganize-string",
  title: "Reorganize String",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "Bloomberg", "Adobe"],
  tags: ["Hash Table", "String", "Greedy", "Sorting", "Heap (Priority Queue)", "Counting"],
  timeComplexity: "O(n log k)",
  spaceComplexity: "O(k)",
  description:
    "Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement, or return '' if not possible.",
  examples: [
    { input: 's = "aab"', output: '"aba"' },
    { input: 's = "aaab"', output: '""', explanation: "Impossible — a appears 3 times but length is 4." },
  ],
  constraints: ["1 ≤ s.length ≤ 500", "s consists of lowercase English letters."],
  hints: [
    "Greedily pick the most frequent character that isn't the same as the last placed.",
    "Use a max-heap of (frequency, character) pairs.",
    "If max freq > ceil(n/2), it's impossible.",
  ],
  pitfalls: [
    "Placing the same character consecutively — always track the previously placed char.",
    "Not checking feasibility: if any char freq > ceil(n/2), return ''.",
    "Forgetting to push the previous character back into the heap after one step.",
  ],
  approaches: [
    {
      name: "Max-Heap (Greedy)",
      complexity: "O(n log k)",
      space: "O(k)",
      description: "Pop two highest-freq chars, append both, decrement freqs, re-push if > 0. Handle last char separately.",
    },
    {
      name: "Interleaved Placement",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort by frequency. Place most frequent chars at even indices, rest at odd indices.",
    },
  ],
  code: `function reorganizeString(s) {
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;

  const maxHeap = new MaxPriorityQueue({
    priority: ([f]) => f
  });
  for (const [c, f] of Object.entries(freq)) {
    maxHeap.enqueue([f, c]);
  }

  let result = '';
  while (maxHeap.size() > 1) {
    const [f1, c1] = maxHeap.dequeue().element;
    const [f2, c2] = maxHeap.dequeue().element;
    result += c1 + c2;
    if (f1 - 1 > 0) maxHeap.enqueue([f1 - 1, c1]);
    if (f2 - 1 > 0) maxHeap.enqueue([f2 - 1, c2]);
  }

  if (!maxHeap.isEmpty()) {
    const [f, c] = maxHeap.dequeue().element;
    if (f > 1) return '';
    result += c;
  }

  return result;
}`,
  generateSteps() {
    _huid = 600
    const steps: HeapVisStep[] = []
    const heap1 = makeHeap(["a:3", "b:1"])
    steps.push(hframe(heap1, [heap1[0].id], [], [],
      's="aaab". Frequencies: a=3, b=1. Max-heap by freq.', 4,
      [{ label: "a", value: 3 }, { label: "b", value: 1 }]))

    steps.push(hframe(heap1, [heap1[0].id, heap1[1].id], [], [],
      "Pop top two: c1=a(3), c2=b(1). Append 'ab'. Decrement freqs.", 10,
      [{ label: "result", value: "ab" }, { label: "a freq", value: 2 }, { label: "b freq", value: 0 }]))

    const heap2 = makeHeap(["a:2"])
    steps.push(hframe(heap2, [heap2[0].id], [], [],
      "Re-push a(2). b exhausted. Only one char left in heap.", 14,
      [{ label: "heap", value: "a:2" }]))

    const heap3 = makeHeap(["a:1"])
    steps.push(hframe(heap3, [], [heap3[0].id], [],
      "Single item: a(2). freq=2 > 1 → impossible! Return ''.", 21,
      [{ label: "result", value: '""' }]))

    const goodHeap = makeHeap(["result"])
    steps.push(hframe(goodHeap, [], [], goodHeap.map(n => n.id),
      'For s="aab": heap=[a:2,b:1] → append "ab", re-push a:1 → append "a" → "aba" ✓', 23,
      [{ label: "example result", value: '"aba"' }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Longest Happy String  (#118) — Medium  ← LOCKED
// ════════════════════════════════════════════════════════════════
const longestHappyString: HeapProblem = {
  id: 118,
  slug: "longest-happy-string",
  title: "Longest Happy String",
  difficulty: "Medium",
  companies: ["Google", "Meta", "Amazon", "Microsoft", "Adobe"],
  tags: ["String", "Greedy", "Heap (Priority Queue)"],
  timeComplexity: "O(n log 3) = O(n)",
  spaceComplexity: "O(1)",
  description:
    "A string s is called happy if it has no three consecutive same characters. Given three integers a, b, and c representing the number of letters 'a', 'b', 'c' to use, return the longest possible happy string. If multiple solutions exist, return any. If none, return ''.",
  examples: [
    { input: "a=1, b=1, c=7", output: '"ccbccacc"', explanation: "Use c greedily but limit to 2 consecutive." },
    { input: "a=2, b=2, c=1", output: '"aabbc"' },
  ],
  constraints: ["0 ≤ a, b, c ≤ 100"],
  hints: [
    "Greedily pick the character with the highest remaining count.",
    "If it's the same as the last two characters placed, pick the second highest instead.",
    "Stop when no valid character can be appended.",
  ],
  pitfalls: [
    "Always appending the most frequent without checking the last two — creates invalid triplets.",
    "Not skipping to the second-most frequent when needed.",
    "Returning early when the second-most frequent is also invalid.",
  ],
  approaches: [
    {
      name: "Max-Heap (Greedy)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Max-heap of (count, char). Each step: pick top unless it'd create a triplet; then pick second. Re-push with decremented count.",
    },
  ],
  code: `function longestDiverseString(a, b, c) {
  const maxHeap = new MaxPriorityQueue({ priority: ([f]) => f });
  if (a > 0) maxHeap.enqueue([a, 'a']);
  if (b > 0) maxHeap.enqueue([b, 'b']);
  if (c > 0) maxHeap.enqueue([c, 'c']);

  let result = '';

  while (!maxHeap.isEmpty()) {
    const [f1, c1] = maxHeap.dequeue().element;

    const n = result.length;
    if (n >= 2 && result[n-1] === c1 && result[n-2] === c1) {
      // Can't use c1 — use second most frequent
      if (maxHeap.isEmpty()) break;
      const [f2, c2] = maxHeap.dequeue().element;
      result += c2;
      if (f2 - 1 > 0) maxHeap.enqueue([f2 - 1, c2]);
      maxHeap.enqueue([f1, c1]); // put c1 back
    } else {
      result += c1;
      if (f1 - 1 > 0) maxHeap.enqueue([f1 - 1, c1]);
    }
  }

  return result;
}`,
  generateSteps() {
    _huid = 700
    const steps: HeapVisStep[] = []
    const h1 = makeHeap(["c:7", "b:1", "a:1"])
    steps.push(hframe(h1, [h1[0].id], [], [],
      "a=1,b=1,c=7. Max-heap: [c:7, b:1, a:1]. Start building.", 1,
      [{ label: "a", value: 1 }, { label: "b", value: 1 }, { label: "c", value: 7 }]))

    steps.push(hframe(h1, [h1[0].id], [], [],
      "Append c. result='c'. Re-push c:6.", 14,
      [{ label: "result", value: "c" }]))

    const h2 = makeHeap(["c:6", "b:1", "a:1"])
    steps.push(hframe(h2, [h2[0].id], [], [],
      "Append c. result='cc'. Re-push c:5.", 14,
      [{ label: "result", value: "cc" }]))

    const h3 = makeHeap(["c:5", "b:1", "a:1"])
    steps.push(hframe(h3, [h3[1].id], [h3[0].id], [],
      "result ends in 'cc' → can't use c! Use 2nd: b. result='ccb'.", 9,
      [{ label: "result", value: "ccb" }, { label: "skipped", value: "c (would make 'ccc')" }]))

    const h4 = makeHeap(["c:5", "a:1"])
    steps.push(hframe(h4, [h4[0].id], [], [],
      "Append c,c. result='ccbcc'. Use b again. Continue...", 14,
      [{ label: "result so far", value: "ccbcc" }]))

    const finalNodes = makeHeap(["ccbccacc"])
    steps.push(hframe(finalNodes, [], [], finalNodes.map(n => n.id),
      'Final result: "ccbccacc" ✓', 23,
      [{ label: "result", value: '"ccbccacc"' }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Car Pooling  (#119) — Medium  ← LOCKED
// ════════════════════════════════════════════════════════════════
const carPooling: HeapProblem = {
  id: 119,
  slug: "car-pooling",
  title: "Car Pooling",
  difficulty: "Medium",
  companies: ["Uber", "Google", "Amazon", "Meta", "Airbnb", "Lyft"],
  tags: ["Array", "Sorting", "Heap (Priority Queue)", "Simulation", "Prefix Sum"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "There is a car with capacity empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west). You are given the integer capacity and an array trips where trips[i] = [numPassengers, from, to] indicates passengers boarding at from and departing at to. Return true if it is possible to pick up and drop off all passengers.",
  examples: [
    { input: "trips = [[2,1,5],[3,3,7]], capacity = 4", output: "false" },
    { input: "trips = [[2,1,5],[3,3,7]], capacity = 5", output: "true" },
  ],
  constraints: [
    "1 ≤ trips.length ≤ 1000",
    "trips[i].length == 3",
    "1 ≤ numPassengers ≤ 100",
    "0 ≤ from < to ≤ 1000",
    "1 ≤ capacity ≤ 10⁵",
  ],
  hints: [
    "Sort trips by start location. Use a min-heap to track when passengers drop off.",
    "At each stop, first drop off passengers whose 'to' ≤ current 'from'.",
    "Then pick up new passengers. Check if current load exceeds capacity.",
  ],
  pitfalls: [
    "Not dropping off before picking up — may falsely exceed capacity.",
    "Sorting by drop-off instead of pick-up location.",
    "Using total passengers instead of current passengers on board.",
  ],
  approaches: [
    {
      name: "Min-Heap (Sort by Pickup)",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort trips by from. Min-heap of drop-off times. At each trip, eject expired passengers, then board new ones.",
    },
    {
      name: "Difference Array",
      complexity: "O(n + max_location)",
      space: "O(max_location)",
      description: "Track +passengers at from, -passengers at to. Scan prefix sums. Exceeds capacity? Return false.",
    },
  ],
  code: `function carPooling(trips, capacity) {
  // Sort trips by start location
  trips.sort((a, b) => a[1] - b[1]);

  // Min-heap of [dropOff, passengers]
  const minHeap = new MinPriorityQueue({
    priority: ([dropOff]) => dropOff
  });

  let current = 0; // passengers on board

  for (const [num, from, to] of trips) {
    // Drop off passengers who have reached destination
    while (!minHeap.isEmpty() &&
           minHeap.front().element[0] <= from) {
      current -= minHeap.dequeue().element[1];
    }

    // Pick up new passengers
    current += num;
    minHeap.enqueue([to, num]);

    if (current > capacity) return false;
  }

  return true;
}`,
  generateSteps() {
    _huid = 800
    const steps: HeapVisStep[] = []
    const trips = [[2, 1, 5], [3, 3, 7], [1, 5, 9]]
    const capacity = 4

    steps.push(hframe([], [], [], [],
      `capacity=${capacity}. Sort trips by pickup. trips=[[2,1,5],[3,3,7],[1,5,9]]`, 2))

    const h1 = makeHeap(["[5,2]"])
    steps.push(hframe(h1, [h1[0].id], [], [],
      "Trip [2,1,5]: from=1. No dropoffs yet. Board 2. current=2. Push [dropOff=5, num=2].", 8,
      [{ label: "current", value: 2 }, { label: "capacity", value: 4 }]))

    const h2 = makeHeap(["[5,2]", "[7,3]"])
    steps.push(hframe(h2, [h2[1].id], [], [],
      "Trip [3,3,7]: from=3. No dropoffs (heap.top=5 > 3). Board 3. current=5 > capacity=4!", 8,
      [{ label: "current", value: 5 }, { label: "capacity", value: 4 }]))

    const failNode = makeHeap(["FAIL"])
    steps.push(hframe(failNode, [], [failNode[0].id], [],
      "current=5 > capacity=4 → return false ✗", 18,
      [{ label: "result", value: "false" }]))

    const okNode = makeHeap(["OK: capacity=5"])
    steps.push(hframe(okNode, [], [], okNode.map(n => n.id),
      "With capacity=5: 2+3=5 ≤ 5 → continue. Drop 2 at stop 5. Board 1. current=4 ≤ 5 → true ✓", 20,
      [{ label: "result (capacity=5)", value: "true" }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Find Median from Data Stream  (#120) — Hard  ← LOCKED
// ════════════════════════════════════════════════════════════════
const findMedianDataStream: HeapProblem = {
  id: 120,
  slug: "find-median-from-data-stream",
  title: "Find Median from Data Stream",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "GoldmanSachs", "Nvidia"],
  tags: ["Two Pointers", "Design", "Sorting", "Heap (Priority Queue)", "Data Stream"],
  timeComplexity: "O(log n) addNum, O(1) findMedian",
  spaceComplexity: "O(n)",
  description:
    "The MedianFinder class stores a stream of numbers and finds the median. addNum(num) adds the number to the data structure. findMedian() returns the median of all elements so far. If even count: average of two middle values. If odd: the middle value.",
  examples: [
    {
      input: `MedianFinder(), addNum(1), addNum(2), findMedian(), addNum(3), findMedian()`,
      output: "[1.5, 2.0]",
      explanation: "After [1,2]: median=(1+2)/2=1.5. After [1,2,3]: median=2.",
    },
  ],
  constraints: [
    "-10⁵ ≤ num ≤ 10⁵",
    "At least one element before findMedian is called.",
    "At most 5×10⁴ calls to addNum and findMedian.",
  ],
  hints: [
    "Maintain two heaps: max-heap for lower half, min-heap for upper half.",
    "Balance the heaps so |maxHeap.size - minHeap.size| ≤ 1.",
    "Median = max-heap top (odd total) or average of both tops (even total).",
    "On addNum: push to max-heap, then rebalance by moving elements between heaps.",
  ],
  pitfalls: [
    "Not rebalancing after each insert — median calculation breaks.",
    "Always pushing to max-heap without checking the value relative to min-heap's top.",
    "Integer overflow when averaging — use (a + b) / 2.0, not (a + b) >> 1.",
  ],
  approaches: [
    {
      name: "Two Heaps (Max + Min)",
      complexity: "O(log n) add, O(1) findMedian",
      space: "O(n)",
      description: "Max-heap = lower half, Min-heap = upper half. Keep sizes balanced within 1. Median from tops.",
    },
    {
      name: "Sorted List + Binary Search",
      complexity: "O(n) add, O(1) findMedian",
      space: "O(n)",
      description: "Keep sorted array; insert at correct position. findMedian in O(1). Insert is O(n).",
    },
  ],
  code: `class MedianFinder {
  constructor() {
    // Max-heap: lower half
    this.lo = new MaxPriorityQueue({ priority: x => x });
    // Min-heap: upper half
    this.hi = new MinPriorityQueue({ priority: x => x });
  }

  addNum(num) {
    // Always push to max-heap first
    this.lo.enqueue(num);

    // Ensure lo.top ≤ hi.top
    if (!this.hi.isEmpty() &&
        this.lo.front().element > this.hi.front().element) {
      this.hi.enqueue(this.lo.dequeue().element);
    }

    // Balance sizes (lo can be at most 1 larger)
    if (this.lo.size() > this.hi.size() + 1) {
      this.hi.enqueue(this.lo.dequeue().element);
    } else if (this.hi.size() > this.lo.size()) {
      this.lo.enqueue(this.hi.dequeue().element);
    }
  }

  findMedian() {
    if (this.lo.size() > this.hi.size()) {
      return this.lo.front().element;
    }
    return (this.lo.front().element + this.hi.front().element) / 2;
  }
}`,
  generateSteps() {
    _huid = 900
    const steps: HeapVisStep[] = []

    steps.push(hframe([], [], [], [],
      "Two heaps: lo (max-heap, lower half) and hi (min-heap, upper half).", 1))

    // addNum(1)
    const lo1 = makeHeap([1])
    const hi1 = makeHeap([])
    steps.push(hframe(lo1, [lo1[0].id], [], [],
      "addNum(1): push to lo. lo=[1], hi=[]. lo.size=1, hi.size=0. Balanced.", 9,
      [{ label: "lo (max-heap)", value: "[1]" }, { label: "hi (min-heap)", value: "[]" }]))

    // addNum(2)
    const lo2 = makeHeap([1])
    const hi2 = makeHeap([2])
    steps.push(hframe([...lo2, ...hi2], [hi2[0].id], [], [],
      "addNum(2): push 2 to lo→lo.top=2 > hi.top? hi empty → move 2 to hi. lo=[1], hi=[2].", 13,
      [{ label: "lo (max-heap)", value: "[1]" }, { label: "hi (min-heap)", value: "[2]" }]))

    // findMedian
    steps.push(hframe([...lo2, ...hi2], [], [], [...lo2, ...hi2].map(n => n.id),
      "findMedian(): sizes equal → (lo.top + hi.top)/2 = (1+2)/2 = 1.5 ✓", 28,
      [{ label: "median", value: 1.5 }]))

    // addNum(3)
    const lo3 = makeHeap([2, 1])
    const hi3 = makeHeap([3])
    steps.push(hframe([...lo3, ...hi3], [lo3[0].id], [], [],
      "addNum(3): push to lo. lo.top=3 > hi.top=2 → swap. lo=[2,1], hi=[3]. Balanced.", 13,
      [{ label: "lo (max-heap)", value: "[2,1]" }, { label: "hi (min-heap)", value: "[3]" }]))

    steps.push(hframe([...lo3, ...hi3], [], [], [...lo3, ...hi3].map(n => n.id),
      "findMedian(): lo.size=2 > hi.size=1 → median = lo.top = 2 ✓", 28,
      [{ label: "median", value: 2 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. IPO  (#121) — Hard  ← LOCKED
// ════════════════════════════════════════════════════════════════
const ipo: HeapProblem = {
  id: 121,
  slug: "ipo",
  title: "IPO",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "GoldmanSachs", "MorganStanley", "Bloomberg"],
  tags: ["Array", "Greedy", "Sorting", "Heap (Priority Queue)"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Suppose LeetCode will start its IPO soon. To sell at a higher price, you want to maximize capital before the IPO by selecting at most k projects. You are given n projects where projects[i] = (profits[i], capital[i]). You start with w capital. Each project you select gives profits[i] capital when completed. Return the maximized capital after at most k projects.",
  examples: [
    { input: "k=2, w=0, profits=[1,2,3], capital=[0,1,1]", output: "4", explanation: "Start with 0. Do project 0 (+1 → w=1). Do project 2 (+3 → w=4)." },
    { input: "k=3, w=0, profits=[1,2,3], capital=[0,1,2]", output: "6" },
  ],
  constraints: [
    "1 ≤ k ≤ 10⁵",
    "0 ≤ w ≤ 10⁹",
    "n == profits.length == capital.length",
    "1 ≤ n ≤ 10⁵",
    "0 ≤ profits[i] ≤ 10⁴",
    "0 ≤ capital[i] ≤ 10⁹",
  ],
  hints: [
    "Sort projects by capital requirement. Use a min-heap for unaffordable projects.",
    "Use a max-heap of profits for affordable projects.",
    "Each round: unlock projects we can now afford (from min-heap), then pick the most profitable one.",
  ],
  pitfalls: [
    "Not sorting projects by capital first — you may miss newly affordable projects.",
    "Greedily picking any affordable project instead of the most profitable.",
    "Forgetting that after completing a project, new projects may become affordable.",
  ],
  approaches: [
    {
      name: "Sort + Two Heaps (Greedy)",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort by capital. Use min-heap for locked projects, max-heap for available profits. Each round: unlock affordable projects, pick max profit.",
    },
  ],
  code: `function findMaximizedCapital(k, w, profits, capital) {
  const n = profits.length;

  // Min-heap sorted by capital requirement
  const minCap = new MinPriorityQueue({
    priority: ([cap]) => cap
  });

  for (let i = 0; i < n; i++) {
    minCap.enqueue([capital[i], profits[i]]);
  }

  // Max-heap of available profits
  const maxProfit = new MaxPriorityQueue({
    priority: ([prof]) => prof
  });

  for (let i = 0; i < k; i++) {
    // Unlock all projects we can now afford
    while (!minCap.isEmpty() &&
           minCap.front().element[0] <= w) {
      const [, prof] = minCap.dequeue().element;
      maxProfit.enqueue([prof]);
    }

    if (maxProfit.isEmpty()) break; // no affordable project

    // Pick most profitable project
    w += maxProfit.dequeue().element[0];
  }

  return w;
}`,
  generateSteps() {
    _huid = 1000
    const steps: HeapVisStep[] = []
    const projects = [[1, 0], [2, 1], [3, 1]]
    const k = 2
    let w = 0

    steps.push(hframe([], [], [], [],
      `k=${k}, w=${w}. projects (profit, capital): [1,0],[2,1],[3,1]. Sort by capital.`, 1))

    const minH = makeHeap(["[0,1]", "[1,2]", "[1,3]"])
    steps.push(hframe(minH, [minH[0].id], [], [],
      "Min-heap by capital: [0→p1, 1→p2, 1→p3]. Max-heap of profits: [].", 7,
      [{ label: "w", value: 0 }, { label: "locked", value: "[0,1],[1,2],[1,3]" }]))

    // Round 1
    const maxH1 = makeHeap(["p=1"])
    steps.push(hframe(maxH1, [maxH1[0].id], [], [],
      "Round 1: w=0. Unlock cap≤0: project [cap=0,profit=1]. max-profit-heap=[1]. Pick profit=1.", 13,
      [{ label: "w before", value: 0 }, { label: "profit picked", value: 1 }, { label: "w after", value: 1 }]))
    w = 1

    // Round 2
    const maxH2 = makeHeap(["p=3", "p=2"])
    steps.push(hframe(maxH2, [maxH2[0].id], [], [],
      "Round 2: w=1. Unlock cap≤1: projects [p=2] and [p=3]. max-heap=[3,2]. Pick profit=3.", 13,
      [{ label: "w before", value: 1 }, { label: "profit picked", value: 3 }, { label: "w after", value: 4 }]))
    w = 4

    const finalNodes = makeHeap([`w=${w}`])
    steps.push(hframe(finalNodes, [], [], finalNodes.map(n => n.id),
      `${k} projects done. Maximized capital = ${w} ✓`, 28,
      [{ label: "result", value: w }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT — 10 problems, last 5 locked
// ════════════════════════════════════════════════════════════════
export const HEAP_PROBLEMS: HeapProblem[] = [
  lastStoneWeight,       // #111 Easy   — free
  kthLargestStream,      // #110 Easy   — free
  kClosestPoints,        // #112 Medium — free
  kthLargestArray,       // #113 Medium — free
  taskScheduler,         // #114 Medium — free
  reorganizeString,      // #117 Medium — LOCKED
  longestHappyString,    // #118 Medium — LOCKED
  carPooling,            // #119 Medium — LOCKED
  findMedianDataStream,  // #120 Hard   — LOCKED
  ipo,                   // #121 Hard   — LOCKED
]