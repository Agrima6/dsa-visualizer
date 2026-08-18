// components/visualizer/sorting/sorting-bug-data-more.ts
// Hand-authored "Spot the Bug" variants for 9 additional problems — see
// sorting-bug-types.ts for the contract. Each variant's generateBuggySteps()
// runs the SAME fixed input as the real problem's generateSteps(), with one
// realistic single-mistake bug injected. Verified with a throwaway Node
// script to genuinely diverge and produce a meaningfully wrong final result.

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
// 1. Sort an Array — Merge Sort recursion drops an element.
// `right = mergeSort(mid + 1, hi)` instead of `mergeSort(mid, hi)` — the
// element at index `mid` never gets included in either half, so it's lost
// from the merge and the final array ends up corrupted (and shorter
// effective coverage — some slots keep stale values).
// ════════════════════════════════════════════════════════════════
const sortAnArrayBug: SortingBugVariant = {
  problemSlug: "sort-an-array",
  bugTitle: "Off-by-one recursion bound skips an element",
  bugExplanation:
    "The right half should be mergeSort(mid, hi) — starting AT mid. This buggy version starts at mid + 1, so the element at index mid is never included in either the left half [lo, mid-1] or the right half [mid+1, hi]. It silently vanishes from the merge, and the final array is left with duplicated/stale values instead of being fully sorted.",
  buggyCode: `function sortArray(nums) {
  // Merge Sort — O(n log n) guaranteed
  if (nums.length <= 1) return nums;

  const mid = Math.floor(nums.length / 2);
  const left  = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid + 1)); // BUG: should be nums.slice(mid) — drops nums[mid]

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
  generateBuggySteps() {
    const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6]
    const steps: VisStep[] = []
    const sorted: number[] = []

    steps.push(bugStep(arr, [], [], sorted, "Start Merge Sort on [5,2,8,1,9,3,7,4,6]", 1))

    function mergeSort(lo: number, hi: number): number[] {
      const len = hi - lo + 1
      if (len <= 1) {
        steps.push(bugStep(arr, [lo], [], sorted, `Base case: [${arr[lo]}] length ≤ 1, already sorted`, 3))
        return [arr[lo]]
      }

      const mid = lo + Math.floor(len / 2)
      steps.push(bugStep(arr, Array.from({ length: len }, (_, k) => lo + k), [], sorted,
        `Split [${arr.slice(lo, hi + 1).join(",")}] at mid → left [${arr.slice(lo, mid).join(",")}], right [${arr.slice(mid, hi + 1).join(",")}]`, 5))

      const left = mergeSort(lo, mid - 1)
      const right = mid + 1 > hi ? [] : mergeSort(mid + 1, hi) // BUG: should be mergeSort(mid, hi)

      steps.push(bugStep(arr, Array.from({ length: len }, (_, k) => lo + k), [], sorted,
        `Merging [${left.join(",")}] and [${right.join(",")}]`, 9))

      const merged: number[] = []
      let lp = 0, rp = 0, ki = lo

      while (lp < left.length && rp < right.length) {
        steps.push(bugStep(arr, [lo + lp, mid + 1 + rp], [], sorted, `Compare left=${left[lp]} vs right=${right[rp]}`, 17))
        if (left[lp] <= right[rp]) {
          arr[ki] = left[lp]
          merged.push(left[lp])
          lp++
          steps.push(bugStep(arr, [ki], [], sorted, `Placed ${arr[ki]} at index ${ki}`, 18))
        } else {
          arr[ki] = right[rp]
          merged.push(right[rp])
          rp++
          steps.push(bugStep(arr, [ki], [], sorted, `Placed ${arr[ki]} at index ${ki}`, 20))
        }
        ki++
      }
      while (lp < left.length) {
        arr[ki] = left[lp]
        merged.push(left[lp])
        steps.push(bugStep(arr, [ki], [], sorted, `Copy remaining left ${arr[ki]} to index ${ki}`, 24))
        lp++; ki++
      }
      while (rp < right.length) {
        arr[ki] = right[rp]
        merged.push(right[rp])
        steps.push(bugStep(arr, [ki], [], sorted, `Copy remaining right ${arr[ki]} to index ${ki}`, 24))
        rp++; ki++
      }

      return merged
    }

    mergeSort(0, arr.length - 1)

    steps.push(bugStep(arr, [], [], Array.from({ length: arr.length }, (_, i) => i), `Loop finished — final array: [${arr.join(",")}]`, 1))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Top K Frequent Elements — buckets traversed low→high instead of
// high→low, so the algorithm collects the LEAST frequent elements first.
// ════════════════════════════════════════════════════════════════
const topKFrequentBug: SortingBugVariant = {
  problemSlug: "top-k-frequent-elements",
  bugTitle: "Buckets scanned in the wrong direction",
  bugExplanation:
    "buckets[i] holds numbers with frequency i, and the correct algorithm scans from the highest-frequency bucket down to collect the k most frequent numbers. This buggy version scans from bucket 0 upward instead, so it collects the LEAST frequent numbers first — the exact opposite of what the problem asks for.",
  buggyCode: `function topKFrequent(nums, k) {
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
  // BUG: scans low→high (least frequent first) instead of high→low
  for (let i = 0; i < buckets.length && result.length < k; i++) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}`,
  generateBuggySteps() {
    const nums = [1, 1, 1, 2, 2, 3, 3, 3, 3, 4]
    const freqMap: Record<number, number> = {}
    for (const n of nums) freqMap[n] = (freqMap[n] || 0) + 1

    const entries = Object.entries(freqMap).map(([num, cnt]) => ({ num: Number(num), cnt }))
    const arr = entries.map(e => e.cnt)
    const steps: VisStep[] = []
    const k = 2

    steps.push(bugStep(arr, [], [], [], "Count frequencies of each element", 3))
    steps.push(bugStep(arr, [0, 1, 2, 3], [], [], "Frequencies: 1→3, 2→2, 3→4, 4→1", 5))

    // BUG: sort ascending (least frequent first) instead of descending
    const sortedByFreq = [...entries].sort((a, b) => a.cnt - b.cnt)
    const topKIdx = sortedByFreq.slice(0, k).map(e => entries.findIndex(x => x.num === e.num))

    steps.push(bugStep(arr, topKIdx, [], [], `Scanning buckets low→high: picked ${sortedByFreq.slice(0, k).map(e => e.num).join(", ")}`, 16))
    steps.push(bugStep(arr, [], [], topKIdx, `Answer: [${sortedByFreq.slice(0, k).map(e => e.num).join(", ")}] ✗ (least frequent, not most)`, 19))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Longest Consecutive Sequence — missing negation on the
// "sequence start" check flips it: a number is (wrongly) treated as a
// valid start only when num-1 IS already in the set, i.e. only from the
// middle of a run, so true sequence starts are skipped and streaks get
// undercounted.
// ════════════════════════════════════════════════════════════════
const longestConsecutiveBug: SortingBugVariant = {
  problemSlug: "longest-consecutive-sequence",
  bugTitle: "Missing negation on the sequence-start check",
  bugExplanation:
    "The correct check is `if (!set.has(num - 1))` — only start counting from a number that has no predecessor in the set. This buggy version drops the `!`, so it only starts counting from numbers whose predecessor IS in the set — meaning it starts mid-sequence instead of at the true beginning, undercounting every streak.",
  buggyCode: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    // BUG: missing "!" — should only start when num-1 is NOT in the set
    if (set.has(num - 1)) {
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
  generateBuggySteps() {
    const arr = [100, 4, 200, 1, 3, 2]
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], "Build a HashSet from all numbers", 2))
    steps.push(bugStep(arr, [], [], [], "For each num: only start if num-1 IS in set (bug!)", 7))
    steps.push(bugStep(arr, [4], [], [], "num=2 → 2-1=1 in set → treated as start (wrong! 2 is mid-sequence)", 7))
    steps.push(bugStep(arr, [4, 5], [], [], "Check 2→3: 3 in set ✓, streak=2", 11))
    steps.push(bugStep(arr, [4, 5, 1], [], [], "Check 3→4: 4 in set ✓, streak=3", 11))
    steps.push(bugStep(arr, [], [], [4, 5, 1], "Longest = 3 ✗ (true answer is 4 — real start num=1 was skipped)", 16))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Kth Largest Element in an Array — partition comparison inverted
// (`>=` instead of `<=`). The target-index formula stays correct (so the
// setup narration matches the real trace exactly), but the partition
// itself groups elements backwards, so QuickSelect converges on the
// wrong value.
// ════════════════════════════════════════════════════════════════
const kthLargestBug: SortingBugVariant = {
  problemSlug: "kth-largest-element-in-an-array",
  bugTitle: "Partition comparison inverted (>= instead of <=)",
  bugExplanation:
    "Lomuto partition is supposed to move elements ≤ the pivot to the left region (nums[j] <= pivot). This buggy version uses >= instead, which groups elements ≥ the pivot to the left — the exact opposite grouping. The target index formula is untouched, but QuickSelect ends up converging on the kth SMALLEST element instead of the kth largest, because the partition it's navigating by is inverted.",
  buggyCode: `function findKthLargest(nums, k) {
  // QuickSelect — O(n) average
  const target = nums.length - k;

  function partition(lo, hi) {
    const pivot = nums[hi];
    let i = lo;

    for (let j = lo; j < hi; j++) {
      if (nums[j] >= pivot) { // BUG: should be <= — this groups the wrong side left
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
  generateBuggySteps() {
    const arr = [3, 2, 1, 5, 6, 4]
    const steps: VisStep[] = []
    const k = 2
    const target = arr.length - k

    steps.push(bugStep(arr, [], [], [], `Find k=${k}th largest. Target index = ${target} in sorted order`, 3))

    function partition(lo: number, hi: number): number {
      const pivot = arr[hi]
      steps.push(bugStep(arr, [hi], [], [], `Pivot = arr[${hi}] = ${pivot}`, 6, hi))
      let i = lo
      for (let j = lo; j < hi; j++) {
        steps.push(bugStep(arr, [j], [], [], `arr[${j}]=${arr[j]} vs pivot=${pivot}`, 10, hi))
        if (arr[j] >= pivot) { // BUG
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          if (i !== j) steps.push(bugStep(arr, [], [i, j], [], `Swap arr[${i}] and arr[${j}]`, 11))
          i++
        }
      }
      ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
      steps.push(bugStep(arr, [], [i, hi], [], `Pivot ${pivot} placed at index ${i}`, 16, i))
      return i
    }

    function quickSelect(lo: number, hi: number): number {
      if (lo === hi) {
        steps.push(bugStep(arr, [lo], [], [], `lo === hi: single element arr[${lo}] = ${arr[lo]}`, 21))
        return arr[lo]
      }
      const p = partition(lo, hi)
      if (p === target) {
        steps.push(bugStep(arr, [], [], [p], `Pivot at target index ${target} → answer is ${arr[p]}`, 23))
        return arr[p]
      } else if (p < target) {
        steps.push(bugStep(arr, [], [], [], `Pivot at ${p} < target ${target} → recurse into right half [${p + 1},${hi}]`, 24))
        return quickSelect(p + 1, hi)
      } else {
        steps.push(bugStep(arr, [], [], [], `Pivot at ${p} > target ${target} → recurse into left half [${lo},${p - 1}]`, 25))
        return quickSelect(lo, p - 1)
      }
    }

    quickSelect(0, arr.length - 1)

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Merge Intervals — overlap check compares against last[0] (the
// kept interval's START) instead of last[1] (its END). Since intervals
// are sorted by start ascending, curr[0] >= last[0] always holds, so this
// wrong reference means "overlap" is essentially never detected and
// nothing ever merges.
// ════════════════════════════════════════════════════════════════
const mergeIntervalsBug: SortingBugVariant = {
  problemSlug: "merge-intervals",
  bugTitle: "Overlap check compares against the wrong endpoint",
  bugExplanation:
    "Two intervals overlap when the next interval's start is ≤ the LAST merged interval's end (last[1]). This buggy version compares against last[0] — the last interval's START — instead. Since intervals are sorted by start ascending, curr[0] is always ≥ last[0], so the overlap condition is essentially never true, and no intervals get merged at all.",
  buggyCode: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const curr = intervals[i];

    if (curr[0] <= last[0]) { // BUG: should compare against last[1] (the end), not last[0]
      // overlapping — merge
      last[1] = Math.max(last[1], curr[1]);
    } else {
      result.push(curr);
    }
  }

  return result;
}`,
  generateBuggySteps() {
    const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]].map(iv => [...iv])
    intervals.sort((a, b) => a[0] - b[0])
    const arr = intervals.map(iv => iv[1] - iv[0] + 1)
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], "Sort intervals by start time → [[1,3],[2,6],[8,10],[15,18]]", 2))

    const result: number[][] = [intervals[0]]
    steps.push(bugStep(arr, [0], [], [], "result = [[1,3]]. Compare next interval [2,6]", 4))

    for (let i = 1; i < intervals.length; i++) {
      const last = result[result.length - 1]
      const curr = intervals[i]
      if (curr[0] <= last[0]) {
        steps.push(bugStep(arr, [result.length - 1, i], [], [], `${curr[0]} ≤ last[0]=${last[0]} → overlapping! Merge`, 10))
        last[1] = Math.max(last[1], curr[1])
        steps.push(bugStep(arr, [], [result.length - 1, i], [], `Merged: result = [${result.map(r => `[${r}]`).join(",")}]`, 12))
      } else {
        steps.push(bugStep(arr, [result.length - 1, i], [], [], `${curr[0]} > last[0]=${last[0]} → no overlap (wrong comparison!)`, 10))
        result.push(curr)
        steps.push(bugStep(arr, [], [], [i], `Append [${curr}]. result = [${result.map(r => `[${r}]`).join(",")}]`, 14))
      }
    }

    steps.push(bugStep(arr, [], [], Array.from({ length: intervals.length }, (_, i) => i),
      `Final: [${result.map(r => `[${r}]`).join(",")}] ✗ (nothing merged — should be [[1,6],[8,10],[15,18]])`, 18))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Non Overlapping Intervals — off-by-one on the overlap check: uses
// `start <= prevEnd` instead of `start < prevEnd`, so touching intervals
// (start == prevEnd) get wrongly counted as overlapping and removed.
// ════════════════════════════════════════════════════════════════
const nonOverlappingIntervalsBug: SortingBugVariant = {
  problemSlug: "non-overlapping-intervals",
  bugTitle: "Off-by-one: <= instead of < in the overlap check",
  bugExplanation:
    "Two intervals only truly overlap when start < prevEnd — if start === prevEnd they merely touch and should both be kept. This buggy version uses start <= prevEnd, so a touching interval is wrongly flagged as an overlap and removed, inflating the removal count above the true minimum.",
  buggyCode: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // sort by end

  let removals = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];

    if (start <= prevEnd) { // BUG: should be strict < — touching intervals don't overlap
      // overlap: remove current (it ends later)
      removals++;
    } else {
      prevEnd = end; // no overlap: keep this interval
    }
  }

  return removals;
}`,
  generateBuggySteps() {
    // Same fixed display array the real problem uses (end times of the
    // already-sorted intervals [[1,2],[2,3],[1,3],[3,4]]) — keeping it
    // identical to generateSteps() is what makes the two traces
    // comparable step by step.
    const arr = [2, 3, 4, 3]
    const intervals = [[1, 2], [2, 3], [1, 3], [3, 4]]
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], `Sort by end time: [${intervals.map(i => `[${i}]`).join(",")}]`, 2))

    let removals = 0
    let prevEnd = intervals[0][1]
    steps.push(bugStep(arr, [0], [], [], `Keep [${intervals[0]}]. prevEnd=${prevEnd}`, 5))

    for (let i = 1; i < intervals.length; i++) {
      const [start, end] = intervals[i]
      if (start <= prevEnd) {
        removals++
        steps.push(bugStep(arr, [i], [], [], `[${intervals[i]}]: start=${start} ≤ prevEnd=${prevEnd} → overlap! Remove. removals=${removals}`, 12))
      } else {
        prevEnd = end
        steps.push(bugStep(arr, [i], [], [], `[${intervals[i]}]: start=${start} > prevEnd → keep. prevEnd=${end}`, 14))
      }
    }

    steps.push(bugStep(arr, [], [], Array.from({ length: intervals.length }, (_, i) => i), `Answer = ${removals} removals ✗ (true minimum is 1)`, 13))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Meeting Rooms — off-by-one loop start: `for (let i = 2; ...)`
// instead of `i = 1`, skipping the very first consecutive-pair check.
// ════════════════════════════════════════════════════════════════
const meetingRoomsBug: SortingBugVariant = {
  problemSlug: "meeting-rooms",
  bugTitle: "Loop starts at i=2, skipping the first comparison",
  bugExplanation:
    "The scan needs to check every consecutive pair, starting from i=1 (comparing meeting 0 and meeting 1). This buggy version starts the loop at i=2 instead, so the very first pair is never compared. If the earliest overlap happens to be between meetings 0 and 1 (as it does here), it's missed entirely and the function wrongly reports that all meetings can be attended.",
  buggyCode: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 2; i < intervals.length; i++) { // BUG: should start at i = 1
    const prevEnd   = intervals[i - 1][1];
    const currStart = intervals[i][0];

    if (currStart < prevEnd) return false;
  }

  return true;
}`,
  generateBuggySteps() {
    const arr = [30, 10, 20]
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], "Sort by start: [[0,30],[5,10],[15,20]]", 2))
    steps.push(bugStep(arr, [1, 2], [], [], "Loop starts at i=2 (bug!) — skips comparing [0,30] vs [5,10]", 4))
    steps.push(bugStep(arr, [1, 2], [], [], "Compare [5,10] and [15,20]: start=15 < end=10? No → no overlap detected", 8))
    steps.push(bugStep(arr, [], [], [0, 1, 2], "Return true ✗ — wrongly says all meetings can be attended (they overlap!)", 10))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Meeting Rooms II — rooms counter initialized to 1 instead of 0,
// inflating the max concurrent room count by one throughout the sweep.
// ════════════════════════════════════════════════════════════════
const meetingRoomsIIBug: SortingBugVariant = {
  problemSlug: "meeting-rooms-ii",
  bugTitle: "Room counter initialized to 1 instead of 0",
  bugExplanation:
    "rooms should start at 0 — no rooms are in use before the sweep begins. This buggy version initializes rooms to 1, so every increment during the sweep is off by one, and the reported maximum number of concurrently-needed rooms ends up one higher than the true answer.",
  buggyCode: `function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a,b) => a-b);
  const ends   = intervals.map(i => i[1]).sort((a,b) => a-b);

  let rooms = 1, maxRooms = 0; // BUG: rooms should start at 0
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
  generateBuggySteps() {
    const arr = [30, 10, 20]
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], "starts=[0,5,15] ends=[10,20,30]", 2))

    const starts = [0, 5, 15]
    const ends = [10, 20, 30]
    const n = starts.length
    let rooms = 1 // BUG: should start at 0
    let maxRooms = 0
    let s = 0, e = 0

    while (s < n) {
      if (starts[s] < ends[e]) {
        rooms++
        steps.push(bugStep(arr, [s], [], [], `start=${starts[s]} < end=${ends[e]} → new room. rooms=${rooms}`, 9))
        s++
      } else {
        rooms--
        steps.push(bugStep(arr, [], [], [e], `start=${starts[s]} ≥ end=${ends[e]} → free a room. rooms=${rooms}`, 12))
        e++
      }
      maxRooms = Math.max(maxRooms, rooms)
    }

    steps.push(bugStep(arr, [], [], [0, 1, 2], `Max rooms needed = ${maxRooms} ✗ (true answer is 2 — off-by-one initialization)`, 19))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Insert Interval — Phase 1's "add non-overlapping" condition
// compares against newInterval[1] (its END) instead of newInterval[0]
// (its START). This lets an interval that actually overlaps get pushed
// straight to the result unmerged, and Phase 2 then fails to pick up
// the merge it should have performed.
// ════════════════════════════════════════════════════════════════
const insertIntervalBug: SortingBugVariant = {
  problemSlug: "insert-interval",
  bugTitle: "Phase 1 compares against the wrong endpoint of newInterval",
  bugExplanation:
    "Phase 1 should only copy intervals that end strictly before newInterval STARTS (intervals[i][1] < newInterval[0]). This buggy version compares against newInterval[1] — its END — instead. That's a much looser condition, so an interval that actually overlaps newInterval gets copied to the result unmerged in Phase 1, and Phase 2 never gets the chance to merge it in.",
  buggyCode: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;

  // Phase 1: add all before new interval
  while (i < n && intervals[i][1] < newInterval[1]) { // BUG: should compare to newInterval[0]
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
  generateBuggySteps() {
    const arr = [2, 4, 2, 4]
    const steps: VisStep[] = []

    steps.push(bugStep(arr, [], [], [], "intervals=[[1,3],[6,9]] newInterval=[2,5]", 1))

    const intervals = [[1, 3], [6, 9]].map(iv => [...iv])
    let newInterval = [2, 5]
    const result: number[][] = []
    let i = 0
    const n = intervals.length

    while (i < n && intervals[i][1] < newInterval[1]) {
      steps.push(bugStep(arr, [i], [], [], `Phase 1: [${intervals[i]}] ends at ${intervals[i][1]} < newInterval[1]=${newInterval[1]} → push unmerged (bug!)`, 7))
      result.push(intervals[i])
      i++
    }

    while (i < n && intervals[i][0] <= newInterval[1]) {
      steps.push(bugStep(arr, [i], [], [], `Phase 2: [${intervals[i]}] overlaps [${newInterval}]. Merge`, 11))
      newInterval = [Math.min(newInterval[0], intervals[i][0]), Math.max(newInterval[1], intervals[i][1])]
      steps.push(bugStep(arr, [], [i], [], `newInterval updated to [${newInterval}]`, 14))
      i++
    }
    result.push(newInterval)
    steps.push(bugStep(arr, [], [], result.map((_, idx) => idx), `Push [${newInterval}]. result so far = [${result.map(r => `[${r}]`).join(",")}]`, 17))

    while (i < n) {
      steps.push(bugStep(arr, [i], [], result.map((_, idx) => idx), `Phase 3: push [${intervals[i]}]`, 20))
      result.push(intervals[i])
      i++
    }

    steps.push(bugStep(arr, [], [], result.map((_, idx) => idx),
      `Result = [${result.map(r => `[${r}]`).join(",")}] ✗ (should be [[1,5],[6,9]] — [1,3] never got merged)`, 20))
    return steps
  },
}

export const SORTING_BUG_MORE: SortingBugVariant[] = [
  sortAnArrayBug,
  topKFrequentBug,
  longestConsecutiveBug,
  kthLargestBug,
  mergeIntervalsBug,
  nonOverlappingIntervalsBug,
  meetingRoomsBug,
  meetingRoomsIIBug,
  insertIntervalBug,
]
