// components/visualizer/linked-list/linked-list-problems-data.ts

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

export interface ListNode {
  value: string | number
  id: string
  isHead?: boolean
  isTail?: boolean
  label?: string
}

export interface LinkedListVisStep {
  nodes: ListNode[]
  highlighted: string[]
  swapped: string[]
  done: string[]
  pointers: { label: string; nodeId: string }[]
  auxiliary: { label: string; value: string | number }[]
  message: string
  codeLine: number
}

export interface LinkedListProblem {
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
  generateSteps: () => LinkedListVisStep[]
}

// ─── helpers ────────────────────────────────────────────────────
let _uid = 0
function uid() { return `n${++_uid}` }

function frame(
  nodes: ListNode[],
  highlighted: string[],
  swapped: string[],
  done: string[],
  message: string,
  codeLine: number,
  pointers: { label: string; nodeId: string }[] = [],
  auxiliary: { label: string; value: string | number }[] = []
): LinkedListVisStep {
  return { nodes: nodes.map(n => ({ ...n })), highlighted, swapped, done, pointers, auxiliary, message, codeLine }
}

function makeList(values: (string | number)[]): ListNode[] {
  return values.map((v, i) => ({
    value: v,
    id: uid(),
    isHead: i === 0,
    isTail: i === values.length - 1,
  }))
}

// ════════════════════════════════════════════════════════════════
// 1. Reverse Linked List  (#73)
// ════════════════════════════════════════════════════════════════
const reverseLinkedList: LinkedListProblem = {
  id: 73,
  slug: "reverse-linked-list",
  title: "Reverse Linked List",
  difficulty: "Easy",
  companies: ["Amazon", "Meta", "Microsoft", "Apple", "Google", "Adobe", "Flipkart", "Swiggy"],
  tags: ["Linked List", "Recursion"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given the head of a singly linked list, reverse the list, and return the reversed list.",
  examples: [
    { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
    { input: "head = [1,2]", output: "[2,1]" },
    { input: "head = []", output: "[]" },
  ],
  constraints: [
    "The number of nodes in the list is in the range [0, 5000].",
    "-5000 ≤ Node.val ≤ 5000",
  ],
  hints: [
    "Use three pointers: prev, curr, and next.",
    "At each step: save next, redirect curr.next to prev, then advance both.",
    "When curr is null, prev is the new head.",
  ],
  pitfalls: [
    "Forgetting to save curr.next before overwriting it — you'll lose the rest of the list.",
    "Returning curr instead of prev at the end — curr will be null.",
    "Not handling the empty list case (head = null).",
  ],
  approaches: [
    {
      name: "Iterative (3-pointer)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Walk the list with prev=null, curr=head. Each step: save next, flip curr.next to prev, advance both.",
    },
    {
      name: "Recursive",
      complexity: "O(n)",
      space: "O(n)",
      description: "Recurse to the tail, then on the way back flip each .next pointer. Call stack = O(n).",
    },
  ],
  code: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;   // save next
    curr.next = prev;         // flip pointer
    prev = curr;              // advance prev
    curr = next;              // advance curr
  }

  return prev; // new head
}`,
  generateSteps() {
    _uid = 100
    const vals = [1, 2, 3, 4, 5]
    const nodes = makeList(vals)
    const ids = nodes.map(n => n.id)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      "Start: prev=null, curr=head. List: 1→2→3→4→5", 1,
      [{ label: "curr", nodeId: ids[0] }]))

    for (let i = 0; i < vals.length; i++) {
      steps.push(frame(nodes, [ids[i]], [], ids.slice(0, i),
        `curr=${vals[i]} → save next, flip curr.next → prev`, 5,
        [
          ...(i > 0 ? [{ label: "prev", nodeId: ids[i - 1] }] : []),
          { label: "curr", nodeId: ids[i] },
        ]))

      steps.push(frame(nodes, [], [ids[i]], ids.slice(0, i),
        `Flipped: ${vals[i]}.next → ${i > 0 ? vals[i - 1] : "null"}. Advance pointers.`, 7,
        [
          { label: "prev", nodeId: ids[i] },
          ...(i + 1 < vals.length ? [{ label: "curr", nodeId: ids[i + 1] }] : []),
        ],
        [{ label: "prev", value: vals[i] }]))
    }

    const reversed = [...nodes].reverse().map((n, i) => ({ ...n, isHead: i === 0, isTail: i === nodes.length - 1 }))
    steps.push(frame(reversed, [], [], ids,
      "curr=null → done! prev is the new head ✓", 13,
      [{ label: "head", nodeId: ids[ids.length - 1] }],
      [{ label: "result", value: vals.slice().reverse().join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Merge Two Sorted Lists  (#74)
// ════════════════════════════════════════════════════════════════
const mergeTwoSortedLists: LinkedListProblem = {
  id: 74,
  slug: "merge-two-sorted-lists",
  title: "Merge Two Sorted Lists",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Bloomberg", "Flipkart"],
  tags: ["Linked List", "Recursion"],
  timeComplexity: "O(n + m)",
  spaceComplexity: "O(1)",
  description:
    "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
  examples: [
    { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
    { input: "list1 = [], list2 = []", output: "[]" },
    { input: "list1 = [], list2 = [0]", output: "[0]" },
  ],
  constraints: [
    "The number of nodes in both lists is in the range [0, 50].",
    "-100 ≤ Node.val ≤ 100",
    "Both lists are sorted in non-decreasing order.",
  ],
  hints: [
    "Use a dummy head node to simplify edge cases.",
    "Compare the front nodes of both lists; attach the smaller one to result.",
    "After one list is exhausted, attach the remainder of the other.",
  ],
  pitfalls: [
    "Not using a dummy node — causes complex head-initialization logic.",
    "Forgetting to attach the remaining nodes after one list is exhausted.",
    "Modifying node values instead of relinking .next pointers.",
  ],
  approaches: [
    {
      name: "Iterative (dummy head)",
      complexity: "O(n + m)",
      space: "O(1)",
      description: "Create dummy head. Compare l1 and l2 node by node, append smaller. Attach remaining list.",
    },
    {
      name: "Recursive",
      complexity: "O(n + m)",
      space: "O(n + m)",
      description: "If l1.val ≤ l2.val: l1.next = merge(l1.next, l2); return l1. Else swap roles.",
    },
  ],
  code: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let curr = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }

  curr.next = list1 ?? list2;
  return dummy.next;
}`,
  generateSteps() {
    _uid = 200
    const l1 = [1, 2, 4], l2 = [1, 3, 4]
    const steps: LinkedListVisStep[] = []
    const result: number[] = []
    let i = 0, j = 0

    const allNodes = makeList([...l1, ...l2])
    steps.push(frame(allNodes, [], [], [],
      `list1=[${l1.join("→")}]   list2=[${l2.join("→")}]`, 1))

    while (i < l1.length && j < l2.length) {
      const a = l1[i], b = l2[j]
      const pick = a <= b ? a : b
      result.push(pick)
      const remNodes = makeList([...l1.slice(i), ...l2.slice(j)])
      steps.push(frame(remNodes, [remNodes[0].id], [], [],
        `Compare ${a} vs ${b} → pick ${pick}. result=[${result.join("→")}]`, 5,
        [],
        [{ label: "result so far", value: result.join(" → ") }]))
      if (a <= b) i++; else j++
    }
    while (i < l1.length) result.push(l1[i++])
    while (j < l2.length) result.push(l2[j++])

    const finalNodes = makeList(result)
    steps.push(frame(finalNodes, [], [], finalNodes.map(n => n.id),
      `Merged: [${result.join("→")}] ✓`, 14,
      [],
      [{ label: "merged list", value: result.join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Linked List Cycle  (#75)
// ════════════════════════════════════════════════════════════════
const linkedListCycle: LinkedListProblem = {
  id: 75,
  slug: "linked-list-cycle",
  title: "Linked List Cycle",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "PayPal", "Zomato"],
  tags: ["Linked List", "Two Pointers", "Hash Table"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given head of a linked list, determine if the linked list has a cycle in it. There is a cycle if some node can be reached again by continuously following the next pointer. Return true if there is a cycle, otherwise return false.",
  examples: [
    { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects back to node at index 1." },
    { input: "head = [1,2], pos = 0", output: "true" },
    { input: "head = [1], pos = -1", output: "false" },
  ],
  constraints: [
    "The number of nodes in the list is in the range [0, 10⁴].",
    "-10⁵ ≤ Node.val ≤ 10⁵",
    "pos is -1 or a valid index in the linked list.",
  ],
  hints: [
    "Floyd's cycle detection: slow moves 1 step, fast moves 2 steps.",
    "If they ever point to the same node, there is a cycle.",
    "If fast reaches null, no cycle.",
  ],
  pitfalls: [
    "Using O(n) extra space with a Set — works but doesn't satisfy the O(1) space follow-up.",
    "Not checking fast.next before accessing fast.next.next — will throw a null pointer error.",
    "Thinking slow and fast might 'skip past' each other inside a cycle — they always meet.",
  ],
  approaches: [
    {
      name: "Floyd's Cycle Detection",
      complexity: "O(n)",
      space: "O(1)",
      description: "Slow moves 1 step, fast moves 2. If they meet → cycle. If fast reaches null → no cycle.",
    },
    {
      name: "Hash Set",
      complexity: "O(n)",
      space: "O(n)",
      description: "Store visited nodes. If you revisit any node, there's a cycle.",
    },
  ],
  code: `function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps

    if (slow === fast) {
      return true; // cycle detected
    }
  }

  return false; // no cycle
}`,
  generateSteps() {
    _uid = 300
    const vals = [3, 2, 0, -4]
    const nodes = makeList(vals)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      "slow=head, fast=head. Both at node 3. (Cycle: -4 → 2)", 1,
      [{ label: "slow", nodeId: nodes[0].id }, { label: "fast", nodeId: nodes[0].id }]))

    const moves = [
      { s: 1, f: 2, sv: 2, fv: 0 },
      { s: 2, f: 1, sv: 0, fv: 2 },
      { s: 3, f: 3, sv: -4, fv: -4 },
    ]

    for (const m of moves) {
      const meet = m.s === m.f
      steps.push(frame(nodes, [nodes[m.s % nodes.length].id], [], [],
        `slow→${m.sv}, fast→${m.fv}${meet ? " → slow===fast! CYCLE DETECTED ✓" : ""}`, 6,
        [
          { label: "slow", nodeId: nodes[m.s % nodes.length].id },
          { label: "fast", nodeId: nodes[m.f % nodes.length].id },
        ],
        [{ label: "slow", value: m.sv }, { label: "fast", value: m.fv }]))
      if (meet) {
        steps.push(frame(nodes, [], [], nodes.map(n => n.id),
          "return true — cycle exists ✓", 8,
          [],
          [{ label: "result", value: "true" }]))
        break
      }
    }
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Reorder List  (#76)
// ════════════════════════════════════════════════════════════════
const reorderList: LinkedListProblem = {
  id: 76,
  slug: "reorder-list",
  title: "Reorder List",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Adobe", "Atlassian", "Bloomberg", "Nvidia"],
  tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "You are given the head of a singly linked list: L0 → L1 → … → Ln-1 → Ln. Reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → … You may not modify node values. Only nodes themselves may be changed.",
  examples: [
    { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
    { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" },
  ],
  constraints: [
    "The number of nodes in the list is in the range [1, 5 × 10⁴].",
    "1 ≤ Node.val ≤ 1000",
  ],
  hints: [
    "Step 1: Find the middle of the list using slow/fast pointers.",
    "Step 2: Reverse the second half in place.",
    "Step 3: Merge the two halves by interleaving.",
  ],
  pitfalls: [
    "Trying to interleave without reversing the second half first.",
    "Not disconnecting the two halves — the first half's tail must point to null.",
    "Off-by-one in finding the middle — use the left-middle for even-length lists.",
  ],
  approaches: [
    {
      name: "Find Mid + Reverse + Merge",
      complexity: "O(n)",
      space: "O(1)",
      description: "3-step: (1) slow/fast to find mid, (2) reverse second half in-place, (3) interleave the two halves.",
    },
    {
      name: "Array + Two Pointers",
      complexity: "O(n)",
      space: "O(n)",
      description: "Collect all nodes into an array. Use left/right indices to relink in the required order.",
    },
  ],
  code: `function reorderList(head) {
  // Step 1: find middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: reverse second half
  let prev = null, curr = slow.next;
  slow.next = null; // split
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // Step 3: merge two halves
  let l1 = head, l2 = prev;
  while (l2) {
    const next1 = l1.next, next2 = l2.next;
    l1.next = l2;
    l2.next = next1;
    l1 = next1; l2 = next2;
  }
}`,
  generateSteps() {
    _uid = 400
    const vals = [1, 2, 3, 4, 5]
    const nodes = makeList(vals)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      "Step 1: Find middle using slow/fast pointers.", 2,
      [{ label: "slow", nodeId: nodes[0].id }, { label: "fast", nodeId: nodes[0].id }]))

    steps.push(frame(nodes, [nodes[2].id], [], [],
      "Middle = node 3 (slow stopped here). Split list into two halves.", 5,
      [{ label: "mid", nodeId: nodes[2].id }]))

    const secondRevNodes = makeList([5, 4])
    const firstHalfNodes = makeList([1, 2, 3])
    steps.push(frame([...firstHalfNodes, ...secondRevNodes], [], secondRevNodes.map(n => n.id), [],
      "Step 2: Reverse second half [4→5] → [5→4].", 12,
      [{ label: "l1", nodeId: firstHalfNodes[0].id }, { label: "l2", nodeId: secondRevNodes[0].id }]))

    const merged = makeList([1, 5, 2, 4, 3])
    steps.push(frame(merged, [], [], merged.map(n => n.id),
      "Step 3: Interleave → [1→5→2→4→3] ✓", 22,
      [],
      [{ label: "result", value: "1→5→2→4→3" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Remove Nth Node From End  (#77)
// ════════════════════════════════════════════════════════════════
const removeNthFromEnd: LinkedListProblem = {
  id: 77,
  slug: "remove-nth-node-from-end-of-list",
  title: "Remove Nth Node From End of List",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Nvidia", "ServiceNow", "Meesho"],
  tags: ["Linked List", "Two Pointers"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given the head of a linked list, remove the nth node from the end of the list and return its head. Do it in one pass.",
  examples: [
    { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
    { input: "head = [1], n = 1", output: "[]" },
    { input: "head = [1,2], n = 1", output: "[1]" },
  ],
  constraints: [
    "The number of nodes in the list is sz.",
    "1 ≤ sz ≤ 30",
    "0 ≤ Node.val ≤ 100",
    "1 ≤ n ≤ sz",
  ],
  hints: [
    "Use two pointers both starting from a dummy node.",
    "Advance fast pointer n+1 steps first.",
    "Move both until fast is null — slow is right before the target node.",
    "Relink: slow.next = slow.next.next.",
  ],
  pitfalls: [
    "Not using a dummy node — removing the head becomes a painful special case.",
    "Advancing fast n steps instead of n+1 — slow lands on the node to remove, not before it.",
    "Forgetting the edge case where you remove the head (n = length).",
  ],
  approaches: [
    {
      name: "Two Pointers (one pass)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Lead fast by n+1 from dummy. Move both until fast=null. Remove slow.next.",
    },
    {
      name: "Two Pass",
      complexity: "O(n)",
      space: "O(1)",
      description: "First pass: count length L. Second pass: walk to (L - n) and remove next.",
    },
  ],
  code: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;

  // advance fast by n+1
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  // move both until fast is null
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  // remove nth node from end
  slow.next = slow.next.next;
  return dummy.next;
}`,
  generateSteps() {
    _uid = 500
    const vals = [1, 2, 3, 4, 5]
    const n = 2
    const nodes = makeList(vals)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      `n=${n}. Advance fast pointer ${n + 1} steps from dummy node.`, 1))

    steps.push(frame(nodes, [nodes[n].id], [], [],
      `fast at node ${vals[n + 1]} (index ${n + 1}). slow still at dummy (before head).`, 6,
      [{ label: "slow", nodeId: nodes[0].id }, { label: "fast", nodeId: nodes[n + 1].id }]))

    const slowIdx = vals.length - n - 1
    steps.push(frame(nodes, [nodes[slowIdx].id], [], [],
      `fast=null. slow is at node ${vals[slowIdx]}, just before the node to remove.`, 11,
      [{ label: "slow", nodeId: nodes[slowIdx].id }]))

    steps.push(frame(nodes, [], [nodes[slowIdx + 1].id], [],
      `Remove slow.next = node ${vals[slowIdx + 1]}. Relink.`, 14,
      [{ label: "slow.next (remove)", nodeId: nodes[slowIdx + 1].id }]))

    const result = vals.filter((_, i) => i !== slowIdx + 1)
    const finalNodes = makeList(result)
    steps.push(frame(finalNodes, [], [], finalNodes.map(n => n.id),
      `Done! [${result.join("→")}] ✓`, 15,
      [],
      [{ label: "result", value: result.join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Copy List With Random Pointer  (#78)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const copyListWithRandomPointer: LinkedListProblem = {
  id: 78,
  slug: "copy-list-with-random-pointer",
  title: "Copy List With Random Pointer",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "LinkedIn", "Salesforce"],
  tags: ["Linked List", "Hash Map"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "A linked list of length n is given where each node also has a random pointer which could point to any node in the list, or null. Construct a deep copy of the list. Return the head of the copied linked list.",
  examples: [
    {
      input: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
      output: "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
      explanation: "Each node is a deep copy with both .next and .random correctly set.",
    },
  ],
  constraints: [
    "0 ≤ n ≤ 1000",
    "-10⁴ ≤ Node.val ≤ 10⁴",
    "Node.random is null or points to some node in the list.",
  ],
  hints: [
    "Use a hash map: old node → new (cloned) node.",
    "Pass 1: create all clone nodes and store in the map.",
    "Pass 2: set .next and .random on clones using the map.",
  ],
  pitfalls: [
    "Trying to clone in one pass — the random-pointed node may not be cloned yet.",
    "Confusing original nodes with their clones.",
    "Not handling null random pointers (map.get(null) must return null).",
  ],
  approaches: [
    {
      name: "Hash Map (two pass)",
      complexity: "O(n)",
      space: "O(n)",
      description: "Pass 1: clone all nodes into a map. Pass 2: set .next and .random using map lookups.",
    },
    {
      name: "Interleave nodes (no extra space)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Weave clones between originals, set random pointers using neighbour trick, then unweave.",
    },
  ],
  code: `function copyRandomList(head) {
  const map = new Map(); // original → clone

  // Pass 1: create all clones
  let curr = head;
  while (curr) {
    map.set(curr, new Node(curr.val));
    curr = curr.next;
  }

  // Pass 2: wire .next and .random
  curr = head;
  while (curr) {
    const clone = map.get(curr);
    clone.next   = map.get(curr.next)   ?? null;
    clone.random = map.get(curr.random) ?? null;
    curr = curr.next;
  }

  return map.get(head);
}`,
  generateSteps() {
    _uid = 600
    const vals = [7, 13, 11, 10, 1]
    const nodes = makeList(vals)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      "Pass 1: Clone every node into a HashMap (original → clone).", 4))

    for (let i = 0; i < nodes.length; i++) {
      steps.push(frame(nodes, [nodes[i].id], [], nodes.slice(0, i).map(n => n.id),
        `Clone node ${vals[i]} → map.set(original, new Node(${vals[i]}))`, 6,
        [{ label: "curr", nodeId: nodes[i].id }]))
    }

    steps.push(frame(nodes, [], [], [],
      "Pass 2: Wire .next and .random on each clone using the map.", 12))

    const cloneNodes = makeList(vals.map(v => `${v}'`))
    steps.push(frame(cloneNodes, [], [], cloneNodes.map(n => n.id),
      "All clones wired: .next and .random correctly set ✓", 17,
      [],
      [{ label: "deep copy head", value: `${vals[0]}'` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Add Two Numbers  (#79)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const addTwoNumbers: LinkedListProblem = {
  id: 79,
  slug: "add-two-numbers",
  title: "Add Two Numbers",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "GoldmanSachs", "MorganStanley"],
  tags: ["Linked List", "Math", "Recursion"],
  timeComplexity: "O(max(m, n))",
  spaceComplexity: "O(max(m, n))",
  description:
    "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.",
  examples: [
    { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." },
    { input: "l1 = [0], l2 = [0]", output: "[0]" },
    { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" },
  ],
  constraints: [
    "The number of nodes in each list is in [1, 100].",
    "0 ≤ Node.val ≤ 9",
    "No leading zeros except for the number 0 itself.",
  ],
  hints: [
    "Simulate column-by-column addition as you would on paper.",
    "Track a carry variable initialized to 0.",
    "New digit = (d1 + d2 + carry) % 10. New carry = Math.floor(sum / 10).",
    "After both lists end, check if carry is still non-zero — add a final node.",
  ],
  pitfalls: [
    "Forgetting to emit a final node for leftover carry after both lists are exhausted.",
    "Not handling lists of different lengths — use 0 when one list runs out.",
    "Using carry = carry / 10 instead of Math.floor(carry / 10).",
  ],
  approaches: [
    {
      name: "Simulation",
      complexity: "O(max(m,n))",
      space: "O(max(m,n))",
      description: "Traverse both lists simultaneously, sum digits + carry, build result list digit by digit.",
    },
  ],
  code: `function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const v1 = l1 ? l1.val : 0;
    const v2 = l2 ? l2.val : 0;
    const sum = v1 + v2 + carry;

    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummy.next;
}`,
  generateSteps() {
    _uid = 700
    const l1 = [2, 4, 3], l2 = [5, 6, 4]
    const steps: LinkedListVisStep[] = []
    const result: number[] = []
    let carry = 0
    const allNodes = makeList([...l1, ...l2])

    steps.push(frame(allNodes, [], [], [],
      `l1=[${l1.join("→")}] (=342)   l2=[${l2.join("→")}] (=465)`, 1))

    for (let i = 0; i < Math.max(l1.length, l2.length); i++) {
      const a = l1[i] ?? 0, b = l2[i] ?? 0
      const sum = a + b + carry
      const digit = sum % 10
      const prevCarry = carry
      carry = Math.floor(sum / 10)
      result.push(digit)
      steps.push(frame(allNodes, [], [], [],
        `${a} + ${b} + carry(${prevCarry}) = ${sum} → digit=${digit}, carry=${carry}`, 7,
        [],
        [{ label: "digit", value: digit }, { label: "carry", value: carry }, { label: "result so far", value: result.join("→") }]))
    }

    if (carry) result.push(carry)
    const finalNodes = makeList(result)
    steps.push(frame(finalNodes, [], [], finalNodes.map(n => n.id),
      `Sum = [${result.join("→")}] → represents ${result.slice().reverse().join("")} ✓`, 16,
      [],
      [{ label: "result", value: result.join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Find The Duplicate Number  (#80)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const findDuplicateNumber: LinkedListProblem = {
  id: 80,
  slug: "find-the-duplicate-number",
  title: "Find The Duplicate Number",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Nvidia", "Flipkart", "Atlassian", "Adobe"],
  tags: ["Linked List", "Two Pointers", "Binary Search", "Bit Manipulation"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given an array of n+1 integers where each is in [1, n], find the one repeated number. You must solve it without modifying the array and using only constant extra space.",
  examples: [
    { input: "nums = [1,3,4,2,2]", output: "2" },
    { input: "nums = [3,1,3,4,2]", output: "3" },
  ],
  constraints: [
    "1 ≤ n ≤ 10⁵",
    "nums.length == n + 1",
    "1 ≤ nums[i] ≤ n",
    "Only one number repeats, but may appear more than twice.",
  ],
  hints: [
    "Model the array as a linked list: index i has a 'next pointer' of nums[i].",
    "Since there's a duplicate, there must be a cycle — apply Floyd's algorithm.",
    "Phase 1: find where slow and fast meet. Phase 2: walk from index 0 to find cycle entry = duplicate.",
  ],
  pitfalls: [
    "Using sort or marking visited — both modify the array or use O(n) space.",
    "Stopping after Phase 1 — the meeting point is NOT necessarily the duplicate.",
    "Confusing index i with value nums[i] — the 'next' is nums[i], not i+1.",
  ],
  approaches: [
    {
      name: "Floyd's Cycle Detection",
      complexity: "O(n)",
      space: "O(1)",
      description: "Model as linked list. Phase 1: meet point. Phase 2: walk slow from start + slow2 from meet until they meet = duplicate.",
    },
    {
      name: "Binary Search on values",
      complexity: "O(n log n)",
      space: "O(1)",
      description: "Count numbers ≤ mid. If count > mid, duplicate ∈ [1, mid]. Binary search the value range.",
    },
  ],
  code: `function findDuplicate(nums) {
  // Phase 1: find intersection point
  let slow = nums[0];
  let fast = nums[0];

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Phase 2: find cycle entry = duplicate
  let slow2 = nums[0];
  while (slow !== slow2) {
    slow  = nums[slow];
    slow2 = nums[slow2];
  }

  return slow; // the duplicate
}`,
  generateSteps() {
    _uid = 800
    const nums = [1, 3, 4, 2, 2]
    const nodes = makeList(nums)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      `nums=[${nums.join(",")}]. Index i → nums[i] forms a linked list with a cycle.`, 1))

    steps.push(frame(nodes, [nodes[0].id], [], [],
      "Phase 1: slow=nums[0]=1, fast=nums[0]=1.", 4,
      [{ label: "slow", nodeId: nodes[0].id }, { label: "fast", nodeId: nodes[0].id }]))

    const trace = [
      { s: 1, f: 2, sv: 3, fv: 4, meet: false },
      { s: 2, f: 3, sv: 4, fv: 2, meet: false },
      { s: 3, f: 3, sv: 2, fv: 2, meet: true },
    ]

    for (const t of trace) {
      const si = nums.indexOf(t.sv)
      const fi = nums.indexOf(t.fv)
      steps.push(frame(nodes, [nodes[Math.max(si, 0)].id], [], [],
        `slow=${t.sv}, fast=${t.fv}${t.meet ? " → MEET! Moving to Phase 2." : ""}`, 6,
        [
          { label: "slow", nodeId: nodes[Math.max(si, 0)].id },
          { label: "fast", nodeId: nodes[Math.max(fi, 0)].id },
        ],
        [{ label: "slow", value: t.sv }, { label: "fast", value: t.fv }]))
      if (t.meet) break
    }

    steps.push(frame(nodes, [], [], [],
      "Phase 2: slow2=nums[0]=1. Walk slow & slow2 until they meet.", 12))

    steps.push(frame(nodes, [], [], nodes.map(n => n.id),
      "slow===slow2 at value 2 → duplicate = 2 ✓", 15,
      [{ label: "duplicate", nodeId: nodes[1].id }],
      [{ label: "duplicate", value: 2 }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Reverse Linked List II  (#81)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const reverseLinkedListII: LinkedListProblem = {
  id: 81,
  slug: "reverse-linked-list-ii",
  title: "Reverse Linked List II",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Swiggy", "PayPal"],
  tags: ["Linked List"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  description:
    "Given the head of a singly linked list and two integers left and right where left ≤ right, reverse the nodes of the list from position left to position right, and return the reversed list.",
  examples: [
    { input: "head = [1,2,3,4,5], left = 2, right = 4", output: "[1,4,3,2,5]" },
    { input: "head = [5], left = 1, right = 1", output: "[5]" },
  ],
  constraints: [
    "The number of nodes in the list is n.",
    "1 ≤ n ≤ 500",
    "1 ≤ left ≤ right ≤ n",
  ],
  hints: [
    "Use a dummy head to handle the edge case of left = 1.",
    "Walk (left - 1) steps from dummy to reach the node just before the range.",
    "Use the insert-at-front technique: (right - left) times, move curr.next to front of the reversed section.",
  ],
  pitfalls: [
    "Not using a dummy node — makes left=1 a special case.",
    "Using a separate full reverse of the sublist instead of insert-at-front.",
    "Off-by-one: you need (right - left) iterations, not (right - left + 1).",
  ],
  approaches: [
    {
      name: "Insert-at-Front (one pass)",
      complexity: "O(n)",
      space: "O(1)",
      description: "Walk to position left-1. Repeatedly take curr.next and insert before curr. Do this (right-left) times.",
    },
  ],
  code: `function reverseBetween(head, left, right) {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  // walk to node just before 'left'
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next;
  }

  let curr = prev.next;
  for (let i = 0; i < right - left; i++) {
    const next = curr.next;
    curr.next  = next.next;
    next.next  = prev.next;
    prev.next  = next;
  }

  return dummy.next;
}`,
  generateSteps() {
    _uid = 900
    const vals = [1, 2, 3, 4, 5]
    const left = 2, right = 4
    const nodes = makeList(vals)
    const steps: LinkedListVisStep[] = []

    steps.push(frame(nodes, [], [], [],
      `left=${left}, right=${right}. Walk ${left - 1} step(s) from dummy to reach node before position ${left}.`, 1))

    steps.push(frame(nodes, [nodes[left - 2].id], [], [],
      `prev = node ${vals[left - 2]} (pos ${left - 1}). curr = node ${vals[left - 1]} (pos ${left}).`, 5,
      [{ label: "prev", nodeId: nodes[left - 2].id }, { label: "curr", nodeId: nodes[left - 1].id }]))

    steps.push(frame(nodes, nodes.slice(left - 1, right).map(n => n.id), [], [],
      `Reversing positions ${left}–${right}: [${vals.slice(left - 1, right).join("→")}] → [${vals.slice(left - 1, right).reverse().join("→")}]`, 9,
      [{ label: "range start", nodeId: nodes[left - 1].id }]))

    const result = [...vals.slice(0, left - 1), ...vals.slice(left - 1, right).reverse(), ...vals.slice(right)]
    const finalNodes = makeList(result)
    steps.push(frame(finalNodes, [], [], finalNodes.map(n => n.id),
      `Done! [${result.join("→")}] ✓`, 14,
      [],
      [{ label: "result", value: result.join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. LRU Cache  (#83)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const lruCache: LinkedListProblem = {
  id: 83,
  slug: "lru-cache",
  title: "LRU Cache",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "Salesforce", "Oracle", "Cisco", "PhonePe"],
  tags: ["Linked List", "Hash Map", "Design"],
  timeComplexity: "O(1)",
  spaceComplexity: "O(capacity)",
  description:
    "Design a data structure following the Least Recently Used (LRU) cache eviction policy. Implement LRUCache(capacity), get(key), and put(key, value) — all in O(1). When capacity is reached, evict the least recently used key.",
  examples: [
    {
      input: `LRUCache(2)
put(1,1), put(2,2), get(1)→1
put(3,3) → evicts key 2
get(2)→-1, put(4,4) → evicts key 1
get(1)→-1, get(3)→3, get(4)→4`,
      output: "[1, -1, -1, 3, 4]",
    },
  ],
  constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "At most 2×10⁵ calls"],
  hints: [
    "Use a doubly linked list + HashMap: DLL for O(1) insert/delete, map for O(1) lookup.",
    "Most-recently-used node sits just before the tail. Least-recently-used sits just after the head.",
    "On get or put: remove the node from its current position and re-insert at MRU end.",
    "Use sentinel dummy head and tail nodes to avoid edge cases.",
  ],
  pitfalls: [
    "Using a singly linked list — you can't remove a node in O(1) without a reference to its predecessor.",
    "Forgetting to delete the evicted key from the HashMap.",
    "Not moving the node to MRU on get (only on put).",
  ],
  approaches: [
    {
      name: "Doubly Linked List + HashMap",
      complexity: "O(1) all ops",
      space: "O(capacity)",
      description: "HashMap: key → node. DLL: fast O(1) move-to-front and evict-LRU. Dummy head=LRU end, dummy tail=MRU end.",
    },
  ],
  code: `class LRUCache {
  constructor(capacity) {
    this.cap  = capacity;
    this.map  = new Map();
    this.head = { key: 0, val: 0 }; // LRU dummy
    this.tail = { key: 0, val: 0 }; // MRU dummy
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _insertMRU(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._insertMRU(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) this._remove(this.map.get(key));
    const node = { key, val: value };
    this.map.set(key, node);
    this._insertMRU(node);
    if (this.map.size > this.cap) {
      const lru = this.head.next;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
  generateSteps() {
    _uid = 1000
    const steps: LinkedListVisStep[] = []
    let cache: { key: number; val: number }[] = []

    const snap = (msg: string, codeLine: number) => {
      const nodes = makeList(cache.length ? cache.map(c => `${c.key}:${c.val}`) : ["(empty)"])
      steps.push(frame(nodes, [], [], [],
        msg, codeLine, [],
        [
          { label: "LRU ← order → MRU", value: cache.map(c => `[${c.key}:${c.val}]`).join(" → ") || "(empty)" },
        ]))
    }

    snap("LRUCache(2). head(LRU sentinel) ↔ tail(MRU sentinel).", 1)
    cache.push({ key: 1, val: 1 })
    snap("put(1,1) → insert at MRU end.", 30)
    cache.push({ key: 2, val: 2 })
    snap("put(2,2) → insert at MRU end.", 30)
    cache = [...cache.filter(c => c.key !== 1), { key: 1, val: 1 }]
    snap("get(1)=1 → move key 1 to MRU end.", 24)
    cache.shift()
    cache.push({ key: 3, val: 3 })
    snap("put(3,3) → cache full, evict LRU (key 2). Insert key 3.", 34)

    const finalNodes = makeList(cache.map(c => `${c.key}:${c.val}`))
    steps.push(frame(finalNodes, [], [], finalNodes.map(n => n.id),
      `Final cache: ${cache.map(c => `[${c.key}:${c.val}]`).join(" → ")}  (LRU → MRU) ✓`, 36,
      [],
      [{ label: "state", value: cache.map(c => `${c.key}:${c.val}`).join(" → ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT — 10 problems, last 5 will be locked
// ════════════════════════════════════════════════════════════════
export const LINKED_LIST_PROBLEMS: LinkedListProblem[] = [
  reverseLinkedList,        // #73 Easy   — free
  mergeTwoSortedLists,      // #74 Easy   — free
  linkedListCycle,          // #75 Easy   — free
  reorderList,              // #76 Medium — free
  removeNthFromEnd,         // #77 Medium — free
  copyListWithRandomPointer,// #78 Medium — LOCKED
  addTwoNumbers,            // #79 Medium — LOCKED
  findDuplicateNumber,      // #80 Medium — LOCKED
  reverseLinkedListII,      // #81 Medium — LOCKED
  lruCache,                 // #83 Medium — LOCKED
]