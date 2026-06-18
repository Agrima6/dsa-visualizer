// components/visualizer/binary-tree/binary-tree-problems-data.ts

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

// ─── Tree node for visualization ────────────────────────────────
export interface BinaryTreeNodeVis {
  id: string
  val: number | string
  leftId: string | null
  rightId: string | null
  parentId: string | null
}

export interface BinaryTreeVisStep {
  nodes: Record<string, BinaryTreeNodeVis>
  rootId: string | null
  highlighted: string[]   // violet — currently visiting
  visited: string[]       // green  — processed/done
  comparing: string[]     // amber  — comparing pair
  path: string[]          // rose   — path/result nodes
  auxiliary: { label: string; value: string | number }[]
  result: (string | number)[]
  message: string
  codeLine: number
}

export interface BinaryTreeProblem {
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
  generateSteps: () => BinaryTreeVisStep[]
}

// ─── Helpers ────────────────────────────────────────────────────
let _btuid = 0
function btuid() { return `bt${++_btuid}` }

/**
 * Build a tree from BFS-level array (null = missing node).
 * Returns { nodes: Record<id, BinaryTreeNodeVis>, rootId }
 */
function buildTree(arr: (number | string | null)[]): {
  nodes: Record<string, BinaryTreeNodeVis>
  rootId: string | null
} {
  if (!arr.length || arr[0] == null) return { nodes: {}, rootId: null }
  const nodes: Record<string, BinaryTreeNodeVis> = {}
  const ids: (string | null)[] = []

  for (const v of arr) {
    if (v == null) { ids.push(null); continue }
    const id = btuid()
    nodes[id] = { id, val: v, leftId: null, rightId: null, parentId: null }
    ids.push(id)
  }

  for (let i = 0; i < ids.length; i++) {
    if (!ids[i]) continue
    const li = 2 * i + 1, ri = 2 * i + 2
    if (li < ids.length && ids[li]) {
      nodes[ids[i]!].leftId = ids[li]
      nodes[ids[li]!].parentId = ids[i]
    }
    if (ri < ids.length && ids[ri]) {
      nodes[ids[i]!].rightId = ids[ri]
      nodes[ids[ri]!].parentId = ids[i]
    }
  }
  return { nodes, rootId: ids[0] }
}

function tframe(
  nodes: Record<string, BinaryTreeNodeVis>,
  rootId: string | null,
  highlighted: string[],
  visited: string[],
  comparing: string[],
  path: string[],
  message: string,
  codeLine: number,
  auxiliary: { label: string; value: string | number }[] = [],
  result: (string | number)[] = []
): BinaryTreeVisStep {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    rootId,
    highlighted,
    visited: [...visited],
    comparing,
    path,
    auxiliary,
    result,
    message,
    codeLine,
  }
}

// ════════════════════════════════════════════════════════════════
// 1. Invert Binary Tree  (#90)
// ════════════════════════════════════════════════════════════════
const invertBinaryTree: BinaryTreeProblem = {
  id: 90,
  slug: "invert-binary-tree",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Uber", "Flipkart"],
  tags: ["Tree", "DFS", "BFS", "Recursion"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given the root of a binary tree, invert the tree, and return its root. Inverting means mirroring it around its centre — left and right subtrees are swapped at every node.",
  examples: [
    { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
    { input: "root = [2,1,3]", output: "[2,3,1]" },
    { input: "root = []", output: "[]" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 100].",
    "-100 ≤ Node.val ≤ 100",
  ],
  hints: [
    "Think recursively: if you can invert the left and right subtrees, then just swap them.",
    "Base case: null node → return null.",
    "Both DFS (recursive) and BFS (queue) work correctly.",
  ],
  pitfalls: [
    "Swapping node.left and node.right before recursing on children — you need to recurse AFTER swapping, or swap the results of the recursive calls.",
    "Forgetting the base case and getting a null pointer error.",
  ],
  approaches: [
    {
      name: "DFS Recursive",
      complexity: "O(n)",
      space: "O(h)",
      description: "Recursively invert left and right subtrees, then swap them at the current node.",
    },
    {
      name: "BFS Iterative",
      complexity: "O(n)",
      space: "O(n)",
      description: "Use a queue. For each dequeued node, swap its children and enqueue the non-null children.",
    },
  ],
  code: `function invertTree(root) {
  if (root === null) return null;

  // Swap left and right children
  const temp  = root.left;
  root.left   = root.right;
  root.right  = temp;

  // Recurse on each subtree
  invertTree(root.left);
  invertTree(root.right);

  return root;
}`,
  generateSteps() {
    _btuid = 1000
    const { nodes, rootId } = buildTree([4, 2, 7, 1, 3, 6, 9])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    // Get node ids by level-order
    const ids = Object.keys(nodes)
    // ids[0]=4, find each
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!

    const n4 = findId(4), n2 = findId(2), n7 = findId(7)
    const n1 = findId(1), n3 = findId(3), n6 = findId(6), n9 = findId(9)

    steps.push(tframe(nodes, rootId, [n4], visited, [], [], "Start at root (4). Will invert tree by swapping left ↔ right at each node.", 2))

    steps.push(tframe(nodes, rootId, [n2], visited, [], [], "DFS left: visiting node 2. Recurse deeper first.", 8))
    steps.push(tframe(nodes, rootId, [n1], visited, [], [], "DFS left of 2: visiting node 1 (leaf). No children to swap.", 2))
    visited.push(n1)
    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "DFS right of 2: visiting node 3 (leaf). No children to swap.", 2))
    visited.push(n3)

    // Swap children of node 2
    const tmp2L = nodes[n2].leftId
    nodes[n2].leftId = nodes[n2].rightId
    nodes[n2].rightId = tmp2L
    visited.push(n2)
    steps.push(tframe(nodes, rootId, [n2], visited, [], [], "Back at node 2 — swap left(1) ↔ right(3). ✓", 4))

    steps.push(tframe(nodes, rootId, [n7], visited, [], [], "DFS right of root: visiting node 7. Recurse deeper.", 8))
    steps.push(tframe(nodes, rootId, [n6], visited, [], [], "DFS left of 7: visiting node 6 (leaf). No children to swap.", 2))
    visited.push(n6)
    steps.push(tframe(nodes, rootId, [n9], visited, [], [], "DFS right of 7: visiting node 9 (leaf). No children to swap.", 2))
    visited.push(n9)

    // Swap children of node 7
    const tmp7L = nodes[n7].leftId
    nodes[n7].leftId = nodes[n7].rightId
    nodes[n7].rightId = tmp7L
    visited.push(n7)
    steps.push(tframe(nodes, rootId, [n7], visited, [], [], "Back at node 7 — swap left(6) ↔ right(9). ✓", 4))

    // Swap children of root
    const tmp4L = nodes[n4].leftId
    nodes[n4].leftId = nodes[n4].rightId
    nodes[n4].rightId = tmp4L
    visited.push(n4)
    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "Back at root (4) — swap left(2) ↔ right(7). Tree fully inverted ✓", 10,
      [], [4, 7, 2, 9, 6, 3, 1]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Maximum Depth of Binary Tree  (#91)
// ════════════════════════════════════════════════════════════════
const maxDepth: BinaryTreeProblem = {
  id: 91,
  slug: "maximum-depth-of-binary-tree",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Nvidia", "Swiggy"],
  tags: ["Tree", "DFS", "BFS", "Recursion"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    { input: "root = [1,null,2]", output: "2" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 10⁴].",
    "-100 ≤ Node.val ≤ 100",
  ],
  hints: [
    "depth(node) = 1 + max(depth(left), depth(right)).",
    "Base case: null node has depth 0.",
    "BFS works too — count number of levels.",
  ],
  pitfalls: [
    "Returning 1 for a null node instead of 0.",
    "Using max(left, right) without the + 1 for the current node itself.",
    "Confusing depth (nodes) with height (edges) — this problem counts nodes.",
  ],
  approaches: [
    {
      name: "DFS Recursive",
      complexity: "O(n)",
      space: "O(h)",
      description: "Return 1 + max(depth(left), depth(right)). Base case: null returns 0.",
    },
    {
      name: "BFS Level-by-Level",
      complexity: "O(n)",
      space: "O(n)",
      description: "Process level by level using a queue. Increment depth counter once per level.",
    },
    {
      name: "DFS Iterative (stack)",
      complexity: "O(n)",
      space: "O(h)",
      description: "Use a stack of (node, current_depth) pairs. Track max depth seen.",
    },
  ],
  code: `function maxDepth(root) {
  if (root === null) return 0;

  const leftDepth  = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return 1 + Math.max(leftDepth, rightDepth);
}`,
  generateSteps() {
    _btuid = 2000
    const { nodes, rootId } = buildTree([3, 9, 20, null, null, 15, 7])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n3 = findId(3), n9 = findId(9), n20 = findId(20)
    const n15 = findId(15), n7 = findId(7)

    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "Start at root (3). maxDepth = 1 + max(left, right).", 2))
    steps.push(tframe(nodes, rootId, [n9], visited, [], [], "Go left → node 9 (leaf). left=null→0, right=null→0.", 3))
    visited.push(n9)
    steps.push(tframe(nodes, rootId, [n9], visited, [], [], "Node 9 returns depth = 1 + max(0,0) = 1.", 5, [{ label: "depth(9)", value: 1 }]))

    steps.push(tframe(nodes, rootId, [n20], visited, [], [], "Go right → node 20. Recurse into its children.", 4))
    steps.push(tframe(nodes, rootId, [n15], visited, [], [], "Left child of 20 → node 15 (leaf). Returns depth = 1.", 5))
    visited.push(n15)
    steps.push(tframe(nodes, rootId, [n7], visited, [], [], "Right child of 20 → node 7 (leaf). Returns depth = 1.", 5))
    visited.push(n7)
    visited.push(n20)
    steps.push(tframe(nodes, rootId, [n20], visited, [], [], "Node 20: depth = 1 + max(1, 1) = 2.", 5, [{ label: "depth(20)", value: 2 }]))

    visited.push(n3)
    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "Root (3): depth = 1 + max(depth(9)=1, depth(20)=2) = 3 ✓", 5,
      [{ label: "left depth", value: 1 }, { label: "right depth", value: 2 }, { label: "max depth", value: 3 }],
      [3]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Same Tree  (#94)
// ════════════════════════════════════════════════════════════════
const sameTree: BinaryTreeProblem = {
  id: 94,
  slug: "same-tree",
  title: "Same Tree",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Atlassian", "Meesho"],
  tags: ["Tree", "DFS", "BFS"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
  examples: [
    { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
    { input: "p = [1,2], q = [1,null,2]", output: "false" },
    { input: "p = [1,2,1], q = [1,1,2]", output: "false" },
  ],
  constraints: [
    "The number of nodes in both trees is in the range [0, 100].",
    "-10⁴ ≤ Node.val ≤ 10⁴",
  ],
  hints: [
    "Recursively check: both null → true; one null → false; values differ → false; else recurse both sides.",
    "It's symmetric — same structure AND same values at every position.",
  ],
  pitfalls: [
    "Checking values before checking for null — null dereference on a missing node.",
    "Only checking values without recursing on subtrees.",
  ],
  approaches: [
    {
      name: "DFS Recursive",
      complexity: "O(n)",
      space: "O(h)",
      description: "Check four cases at each node: both null, one null, unequal values, recurse both sides.",
    },
    {
      name: "BFS Iterative",
      complexity: "O(n)",
      space: "O(n)",
      description: "Use two queues (one per tree). Dequeue and compare pairs of corresponding nodes.",
    },
  ],
  code: `function isSameTree(p, q) {
  // Both null → same
  if (p === null && q === null) return true;

  // One null, other not → different
  if (p === null || q === null) return false;

  // Values differ → different
  if (p.val !== q.val) return false;

  // Recurse both sides
  return isSameTree(p.left, q.left) &&
         isSameTree(p.right, q.right);
}`,
  generateSteps() {
    _btuid = 3000
    const { nodes: nodesP, rootId: rootP } = buildTree([1, 2, 3])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const idsP = Object.keys(nodesP)
    const findId = (val: number) => idsP.find(id => nodesP[id].val === val)!
    const p1 = findId(1), p2 = findId(2), p3 = findId(3)

    steps.push(tframe(nodesP, rootP, [p1], visited, [p1], [], "Compare root of p (1) vs root of q (1). Values match ✓", 7))
    visited.push(p1)
    steps.push(tframe(nodesP, rootP, [p2], visited, [p2], [], "Go left: p.left=2, q.left=2. Values match ✓", 7))
    visited.push(p2)

    steps.push(tframe(nodesP, rootP, [], visited, [], [],
      "p.left.left=null, q.left.left=null → both null → true ✓", 3))
    steps.push(tframe(nodesP, rootP, [], visited, [], [],
      "p.left.right=null, q.left.right=null → both null → true ✓", 3))

    steps.push(tframe(nodesP, rootP, [p3], visited, [p3], [], "Go right: p.right=3, q.right=3. Values match ✓", 7))
    visited.push(p3)
    steps.push(tframe(nodesP, rootP, [], visited, [], [],
      "p.right.left=null, q.right.left=null → both null → true ✓", 3))
    steps.push(tframe(nodesP, rootP, [], visited, [], [],
      "p.right.right=null, q.right.right=null → both null → true ✓", 3))

    steps.push(tframe(nodesP, rootP, [], visited, [], [],
      "All corresponding nodes match! isSameTree([1,2,3],[1,2,3]) = true ✓", 9,
      [], ["true"]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Binary Tree Level Order Traversal  (#99)
// ════════════════════════════════════════════════════════════════
const levelOrderTraversal: BinaryTreeProblem = {
  id: 99,
  slug: "binary-tree-level-order-traversal",
  title: "Binary Tree Level Order Traversal",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "ServiceNow", "Flipkart"],
  tags: ["Tree", "BFS", "Queue"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    { input: "root = [1]", output: "[[1]]" },
    { input: "root = []", output: "[]" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 2000].",
    "-1000 ≤ Node.val ≤ 1000",
  ],
  hints: [
    "Use a queue (BFS). Process all nodes at the current level before moving to the next.",
    "Snapshot queue.length at the start of each level — that tells you how many nodes belong to that level.",
    "Push left then right children into the queue for the next level.",
  ],
  pitfalls: [
    "Not snapshotting the queue length per level — you'll mix nodes from different levels.",
    "Using DFS instead of BFS — DFS doesn't naturally group by level without extra bookkeeping.",
  ],
  approaches: [
    {
      name: "BFS with Queue",
      complexity: "O(n)",
      space: "O(n)",
      description: "Use a queue. For each level, process exactly queue.length nodes, collect their values, enqueue children.",
    },
    {
      name: "DFS with depth tracking",
      complexity: "O(n)",
      space: "O(h)",
      description: "DFS passing current depth. Append value to result[depth]. Requires pre-allocating/growing result array.",
    },
  ],
  code: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);

      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}`,
  generateSteps() {
    _btuid = 4000
    const { nodes, rootId } = buildTree([3, 9, 20, null, null, 15, 7])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n3 = findId(3), n9 = findId(9), n20 = findId(20)
    const n15 = findId(15), n7 = findId(7)

    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "Init queue = [3]. BFS level-by-level.", 3))

    // Level 0
    visited.push(n3)
    steps.push(tframe(nodes, rootId, [n3], visited, [], [],
      "Level 0: process node 3. Enqueue children: [9, 20].", 9,
      [{ label: "queue", value: "[9, 20]" }, { label: "level 0", value: "[3]" }]))

    // Level 1
    steps.push(tframe(nodes, rootId, [n9, n20], visited, [], [],
      "Level 1: levelSize=2. Process node 9 (leaf) → no children to enqueue.", 9,
      [{ label: "queue", value: "[20]" }]))
    visited.push(n9)
    steps.push(tframe(nodes, rootId, [n20], visited, [], [],
      "Level 1: Process node 20 → enqueue children 15, 7.", 10,
      [{ label: "queue", value: "[15, 7]" }, { label: "level 1", value: "[9, 20]" }]))
    visited.push(n20)

    // Level 2
    steps.push(tframe(nodes, rootId, [n15, n7], visited, [], [],
      "Level 2: levelSize=2. Process node 15 (leaf) → no children.", 9,
      [{ label: "queue", value: "[7]" }]))
    visited.push(n15)
    steps.push(tframe(nodes, rootId, [n7], visited, [], [],
      "Level 2: Process node 7 (leaf) → no children. Queue empty.", 9,
      [{ label: "queue", value: "[]" }, { label: "level 2", value: "[15, 7]" }]))
    visited.push(n7)

    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "BFS complete! result = [[3],[9,20],[15,7]] ✓", 17,
      [], [[3] as any, [9, 20] as any, [15, 7] as any]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Validate Binary Search Tree  (#103)
// ════════════════════════════════════════════════════════════════
const validateBST: BinaryTreeProblem = {
  id: 103,
  slug: "validate-binary-search-tree",
  title: "Validate Binary Search Tree",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Adobe", "Bloomberg", "Zomato"],
  tags: ["Tree", "DFS", "BST"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST: left subtree contains only nodes with keys less than the node's key; right subtree only nodes greater; both subtrees must also be BSTs.",
  examples: [
    { input: "root = [2,1,3]", output: "true" },
    { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root is 5 but right child is 4 < 5." },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [1, 10⁴].",
    "-2³¹ ≤ Node.val ≤ 2³¹ - 1",
  ],
  hints: [
    "Passing just left/right child comparison fails for deep nodes — a node must satisfy ALL ancestors' constraints.",
    "Pass min and max bounds down: left child gets max=current.val; right child gets min=current.val.",
    "Start with min=-Infinity, max=+Infinity at the root.",
  ],
  pitfalls: [
    "Only comparing a node with its immediate parent — misses cases like [5,4,6,null,null,3,7] where 3 violates root constraint.",
    "Using ≤ instead of < (BST requires strict inequality).",
    "Not initialising bounds to ±Infinity.",
  ],
  approaches: [
    {
      name: "DFS with bounds",
      complexity: "O(n)",
      space: "O(h)",
      description: "DFS(node, min, max). At each node: check min < val < max; recurse left with max=val; recurse right with min=val.",
    },
    {
      name: "Inorder traversal",
      complexity: "O(n)",
      space: "O(h)",
      description: "Inorder traversal of a BST yields a strictly increasing sequence. Verify this property.",
    },
  ],
  code: `function isValidBST(root) {
  function validate(node, min, max) {
    if (node === null) return true;

    if (node.val <= min || node.val >= max) {
      return false; // violates bound
    }

    return validate(node.left,  min, node.val) &&
           validate(node.right, node.val, max);
  }

  return validate(root, -Infinity, +Infinity);
}`,
  generateSteps() {
    _btuid = 5000
    const { nodes, rootId } = buildTree([5, 3, 7, 2, 4, 6, 8])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n5 = findId(5), n3 = findId(3), n7 = findId(7)
    const n2 = findId(2), n4 = findId(4), n6 = findId(6), n8 = findId(8)

    steps.push(tframe(nodes, rootId, [n5], visited, [], [],
      "Start: validate(5, -∞, +∞). Check -∞ < 5 < +∞ ✓", 4,
      [{ label: "min", value: "-∞" }, { label: "max", value: "+∞" }]))
    visited.push(n5)

    steps.push(tframe(nodes, rootId, [n3], visited, [], [],
      "Go left: validate(3, -∞, 5). Check -∞ < 3 < 5 ✓", 4,
      [{ label: "min", value: "-∞" }, { label: "max", value: 5 }]))
    visited.push(n3)

    steps.push(tframe(nodes, rootId, [n2], visited, [], [],
      "Go left: validate(2, -∞, 3). Check -∞ < 2 < 3 ✓", 4,
      [{ label: "min", value: "-∞" }, { label: "max", value: 3 }]))
    visited.push(n2)

    steps.push(tframe(nodes, rootId, [n4], visited, [], [],
      "Go right of 3: validate(4, 3, 5). Check 3 < 4 < 5 ✓", 4,
      [{ label: "min", value: 3 }, { label: "max", value: 5 }]))
    visited.push(n4)

    steps.push(tframe(nodes, rootId, [n7], visited, [], [],
      "Go right of root: validate(7, 5, +∞). Check 5 < 7 < +∞ ✓", 4,
      [{ label: "min", value: 5 }, { label: "max", value: "+∞" }]))
    visited.push(n7)

    steps.push(tframe(nodes, rootId, [n6], visited, [], [],
      "Go left of 7: validate(6, 5, 7). Check 5 < 6 < 7 ✓", 4,
      [{ label: "min", value: 5 }, { label: "max", value: 7 }]))
    visited.push(n6)

    steps.push(tframe(nodes, rootId, [n8], visited, [], [],
      "Go right of 7: validate(8, 7, +∞). Check 7 < 8 < +∞ ✓", 4,
      [{ label: "min", value: 7 }, { label: "max", value: "+∞" }]))
    visited.push(n8)

    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "All nodes satisfy their bounds. Valid BST = true ✓", 9,
      [], ["true"]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Diameter of Binary Tree  (#92)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const diameterOfBinaryTree: BinaryTreeProblem = {
  id: 92,
  slug: "diameter-of-binary-tree",
  title: "Diameter of Binary Tree",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Nvidia", "Oracle", "Salesforce"],
  tags: ["Tree", "DFS"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes. This path may or may not pass through the root. Length = number of edges.",
  examples: [
    { input: "root = [1,2,3,4,5]", output: "3", explanation: "Longest path: 4→2→1→3 or 5→2→1→3, length 3." },
    { input: "root = [1,2]", output: "1" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [1, 10⁴].",
    "-100 ≤ Node.val ≤ 100",
  ],
  hints: [
    "At each node: diameter through this node = height(left) + height(right).",
    "Use a global max variable. DFS returns height; update max as a side effect.",
    "The answer doesn't have to pass through the root!",
  ],
  pitfalls: [
    "Computing height separately for each node — gives O(n²). Do it in one DFS pass.",
    "Forgetting the case where the longest path doesn't go through root.",
    "Counting nodes instead of edges — diameter is in edges.",
  ],
  approaches: [
    {
      name: "DFS with global max",
      complexity: "O(n)",
      space: "O(h)",
      description: "DFS returns height. At each node update diameter = max(diameter, leftH + rightH). One pass.",
    },
  ],
  code: `function diameterOfBinaryTree(root) {
  let diameter = 0;

  function height(node) {
    if (node === null) return 0;

    const leftH  = height(node.left);
    const rightH = height(node.right);

    // diameter through this node
    diameter = Math.max(diameter, leftH + rightH);

    return 1 + Math.max(leftH, rightH);
  }

  height(root);
  return diameter;
}`,
  generateSteps() {
    _btuid = 6000
    const { nodes, rootId } = buildTree([1, 2, 3, 4, 5])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n1 = findId(1), n2 = findId(2), n3 = findId(3)
    const n4 = findId(4), n5 = findId(5)

    steps.push(tframe(nodes, rootId, [n1], visited, [], [], "Start DFS. At each node: update diameter = leftH + rightH.", 2))
    steps.push(tframe(nodes, rootId, [n4], visited, [], [], "Node 4 (leaf): leftH=0, rightH=0. height=1. diameter=max(0,0+0)=0.", 5, [{ label: "diameter", value: 0 }]))
    visited.push(n4)
    steps.push(tframe(nodes, rootId, [n5], visited, [], [], "Node 5 (leaf): leftH=0, rightH=0. height=1. diameter=max(0,0)=0.", 5, [{ label: "diameter", value: 0 }]))
    visited.push(n5)
    steps.push(tframe(nodes, rootId, [n2], visited, [], [],
      "Node 2: leftH=1(node4), rightH=1(node5). diameter=max(0,1+1)=2. height=2.", 8,
      [{ label: "leftH", value: 1 }, { label: "rightH", value: 1 }, { label: "diameter", value: 2 }]))
    visited.push(n2)
    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "Node 3 (leaf): height=1. diameter stays 2.", 5, [{ label: "diameter", value: 2 }]))
    visited.push(n3)
    steps.push(tframe(nodes, rootId, [n1], visited, [], [],
      "Root node 1: leftH=2(subtree via 2), rightH=1(node3). diameter=max(2,2+1)=3 ✓", 8,
      [{ label: "leftH", value: 2 }, { label: "rightH", value: 1 }, { label: "diameter", value: 3 }]))
    visited.push(n1)
    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "Diameter = 3 (path: 4→2→1→3 or 5→2→1→3) ✓", 12, [], [3]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Balanced Binary Tree  (#93)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const balancedBinaryTree: BinaryTreeProblem = {
  id: 93,
  slug: "balanced-binary-tree",
  title: "Balanced Binary Tree",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "LinkedIn", "Adobe", "Atlassian", "PhonePe"],
  tags: ["Tree", "DFS"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is one in which the left and right subtrees of every node differ in height by no more than one.",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "true" },
    { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 5000].",
    "-10⁴ ≤ Node.val ≤ 10⁴",
  ],
  hints: [
    "Return -1 from the height function to signal 'unbalanced' and short-circuit.",
    "If |leftH - rightH| > 1, return -1 immediately instead of continuing.",
    "A single DFS pass — O(n) — is achievable this way.",
  ],
  pitfalls: [
    "Computing height separately for each node — O(n²). Use a single DFS that returns height or -1.",
    "Only checking balance at the root — every node must satisfy the condition.",
    "Returning false too early without checking deeper nodes.",
  ],
  approaches: [
    {
      name: "DFS bottom-up (return height or -1)",
      complexity: "O(n)",
      space: "O(h)",
      description: "dfs returns height if balanced, else -1. If either child returns -1 or |lH-rH|>1, return -1.",
    },
    {
      name: "Naive (two passes)",
      complexity: "O(n²)",
      space: "O(h)",
      description: "At each node compute height via a separate call, check balance. Correct but slow due to repeated work.",
    },
  ],
  code: `function isBalanced(root) {
  function dfs(node) {
    if (node === null) return 0;

    const leftH = dfs(node.left);
    if (leftH === -1) return -1; // early exit

    const rightH = dfs(node.right);
    if (rightH === -1) return -1; // early exit

    if (Math.abs(leftH - rightH) > 1) return -1;

    return 1 + Math.max(leftH, rightH);
  }

  return dfs(root) !== -1;
}`,
  generateSteps() {
    _btuid = 7000
    const { nodes, rootId } = buildTree([3, 9, 20, null, null, 15, 7])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n3 = findId(3), n9 = findId(9), n20 = findId(20)
    const n15 = findId(15), n7 = findId(7)

    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "Check if tree is balanced. dfs() returns height, or -1 if unbalanced.", 2))
    steps.push(tframe(nodes, rootId, [n9], visited, [], [], "Node 9 (leaf): leftH=0, rightH=0. |0-0|=0 ≤ 1. Returns height = 1.", 3, [{ label: "height(9)", value: 1 }]))
    visited.push(n9)
    steps.push(tframe(nodes, rootId, [n15], visited, [], [], "Node 15 (leaf): height = 1.", 3, [{ label: "height(15)", value: 1 }]))
    visited.push(n15)
    steps.push(tframe(nodes, rootId, [n7], visited, [], [], "Node 7 (leaf): height = 1.", 3, [{ label: "height(7)", value: 1 }]))
    visited.push(n7)
    steps.push(tframe(nodes, rootId, [n20], visited, [], [],
      "Node 20: leftH=1, rightH=1. |1-1|=0 ≤ 1 ✓. Returns height = 2.", 9,
      [{ label: "leftH", value: 1 }, { label: "rightH", value: 1 }, { label: "height(20)", value: 2 }]))
    visited.push(n20)
    steps.push(tframe(nodes, rootId, [n3], visited, [], [],
      "Root 3: leftH=1(node9), rightH=2(subtree20). |1-2|=1 ≤ 1 ✓. Balanced!", 9,
      [{ label: "leftH", value: 1 }, { label: "rightH", value: 2 }, { label: "diff", value: 1 }]))
    visited.push(n3)
    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "dfs(root) = 3 ≠ -1 → isBalanced = true ✓", 13, [], ["true"]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Lowest Common Ancestor of BST  (#96)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const lcaBST: BinaryTreeProblem = {
  id: 96,
  slug: "lowest-common-ancestor-of-a-binary-search-tree",
  title: "Lowest Common Ancestor of BST",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Oracle", "GoldmanSachs", "Swiggy"],
  tags: ["Tree", "BST", "DFS"],
  timeComplexity: "O(h)",
  spaceComplexity: "O(1)",
  description:
    "Given a binary search tree, find the lowest common ancestor (LCA) of two given nodes p and q. The LCA is defined as the lowest node that has both p and q as descendants (a node can be a descendant of itself).",
  examples: [
    { input: "root = [6,2,8,0,4,7,9], p = 2, q = 8", output: "6", explanation: "LCA of 2 and 8 is root 6." },
    { input: "root = [6,2,8,0,4,7,9], p = 2, q = 4", output: "2", explanation: "LCA of 2 and 4 is 2 itself." },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [2, 10⁵].",
    "-10⁹ ≤ Node.val ≤ 10⁹",
    "p ≠ q; both p and q exist in the tree.",
  ],
  hints: [
    "Use BST property: if both p and q are less than node → LCA is in left subtree.",
    "If both are greater → LCA is in right subtree.",
    "If they split (one on each side, or node == p or q) → current node is the LCA.",
  ],
  pitfalls: [
    "Treating this like a general binary tree LCA — the BST property allows O(h) vs O(n).",
    "Not handling the case where p or q equals the current node (a node is an ancestor of itself).",
    "Using recursion (O(h) stack) when an iterative solution uses O(1) space.",
  ],
  approaches: [
    {
      name: "Iterative (BST property)",
      complexity: "O(h)",
      space: "O(1)",
      description: "Walk from root. If both p,q < node → go left. If both > node → go right. Else → found LCA.",
    },
    {
      name: "Recursive",
      complexity: "O(h)",
      space: "O(h)",
      description: "Same logic recursively. If both smaller recurse left; if both larger recurse right; else return node.",
    },
  ],
  code: `function lowestCommonAncestor(root, p, q) {
  let node = root;

  while (node !== null) {
    if (p.val < node.val && q.val < node.val) {
      node = node.left;  // both in left subtree
    } else if (p.val > node.val && q.val > node.val) {
      node = node.right; // both in right subtree
    } else {
      return node; // split point = LCA
    }
  }

  return null;
}`,
  generateSteps() {
    _btuid = 8000
    const { nodes, rootId } = buildTree([6, 2, 8, 0, 4, 7, 9])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n6 = findId(6), n2 = findId(2), n8 = findId(8)
    const n0 = findId(0), n4 = findId(4)

    steps.push(tframe(nodes, rootId, [n6], visited, [], [], "Find LCA of p=2, q=4. Start at root (6).", 3))
    steps.push(tframe(nodes, rootId, [n6], visited, [], [],
      "At 6: p=2 < 6 AND q=4 < 6 → both in LEFT subtree. Go left.", 4,
      [{ label: "p", value: 2 }, { label: "q", value: 4 }, { label: "node", value: 6 }]))
    visited.push(n6)

    steps.push(tframe(nodes, rootId, [n2], visited, [], [],
      "At 2: p=2 == node=2, q=4 > node=2 → they SPLIT here. Current node is LCA!", 8,
      [{ label: "p", value: 2 }, { label: "q", value: 4 }, { label: "node", value: 2 }]))
    visited.push(n2)

    steps.push(tframe(nodes, rootId, [], visited, [n2], [],
      "LCA(2, 4) = node 2 ✓  (2 is ancestor of itself and 4 is in its right subtree)", 9,
      [], [2]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Binary Tree Maximum Path Sum  (#108)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const maxPathSum: BinaryTreeProblem = {
  id: 108,
  slug: "binary-tree-maximum-path-sum",
  title: "Binary Tree Maximum Path Sum",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "MorganStanley", "Nvidia"],
  tags: ["Tree", "DFS", "DP"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(h)",
  description:
    "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A node can only appear in the sequence at most once. The path does not need to pass through the root. Given the root of a binary tree, return the maximum path sum.",
  examples: [
    { input: "root = [1,2,3]", output: "6", explanation: "Path: 2→1→3 = 6." },
    { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "Path: 15→20→7 = 42." },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [1, 3 × 10⁴].",
    "-1000 ≤ Node.val ≤ 1000",
  ],
  hints: [
    "At each node: max gain it can contribute = node.val + max(0, leftGain, rightGain).",
    "Max path THROUGH this node = node.val + max(0, leftGain) + max(0, rightGain).",
    "Use a global variable to track the overall max. DFS returns the max gain for the parent.",
  ],
  pitfalls: [
    "Allowing negative subtree contributions — use max(0, gain) to prune them.",
    "Returning the full path sum to the parent — you can only go UP one side.",
    "Not initialising maxSum to -Infinity (not 0, since all values can be negative).",
  ],
  approaches: [
    {
      name: "DFS with global max",
      complexity: "O(n)",
      space: "O(h)",
      description: "dfs returns max gain through node (one direction). Update global max = node.val + leftGain + rightGain at each node.",
    },
  ],
  code: `function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (node === null) return 0;

    // Only take gain if positive
    const leftGain  = Math.max(0, dfs(node.left));
    const rightGain = Math.max(0, dfs(node.right));

    // Path through this node
    maxSum = Math.max(maxSum, node.val + leftGain + rightGain);

    // Return max gain going UP (one direction only)
    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}`,
  generateSteps() {
    _btuid = 9000
    const { nodes, rootId } = buildTree([-10, 9, 20, null, null, 15, 7])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const nm10 = findId(-10), n9 = findId(9), n20 = findId(20)
    const n15 = findId(15), n7 = findId(7)

    steps.push(tframe(nodes, rootId, [nm10], visited, [], [], "maxSum = -∞. dfs returns max gain in one direction only.", 1))
    steps.push(tframe(nodes, rootId, [n9], visited, [], [],
      "Node 9 (leaf): leftGain=0, rightGain=0. pathThru=9. maxSum=max(-∞,9)=9. Returns 9.", 8,
      [{ label: "maxSum", value: 9 }]))
    visited.push(n9)

    steps.push(tframe(nodes, rootId, [n15], visited, [], [],
      "Node 15 (leaf): pathThru=15. maxSum=max(9,15)=15. Returns 15.", 8,
      [{ label: "maxSum", value: 15 }]))
    visited.push(n15)

    steps.push(tframe(nodes, rootId, [n7], visited, [], [],
      "Node 7 (leaf): pathThru=7. maxSum stays 15. Returns 7.", 8,
      [{ label: "maxSum", value: 15 }]))
    visited.push(n7)

    steps.push(tframe(nodes, rootId, [n20], visited, [], [],
      "Node 20: leftGain=max(0,15)=15, rightGain=max(0,7)=7. pathThru=20+15+7=42. maxSum=42!", 9,
      [{ label: "leftGain", value: 15 }, { label: "rightGain", value: 7 }, { label: "maxSum", value: 42 }]))
    visited.push(n20)

    steps.push(tframe(nodes, rootId, [nm10], visited, [], [],
      "Root -10: leftGain=max(0,9)=9, rightGain=max(0,35)=35. pathThru=-10+9+35=34 < 42. maxSum stays 42.", 9,
      [{ label: "pathThru root", value: 34 }, { label: "maxSum", value: 42 }]))
    visited.push(nm10)

    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "Maximum path sum = 42 (path: 15→20→7) ✓", 13, [], [42]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Serialize And Deserialize Binary Tree  (#109)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const serializeDeserialize: BinaryTreeProblem = {
  id: 109,
  slug: "serialize-and-deserialize-binary-tree",
  title: "Serialize And Deserialize Binary Tree",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "LinkedIn", "GoldmanSachs", "Bloomberg"],
  tags: ["Tree", "DFS", "BFS", "Design", "String"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Design an algorithm to serialize and deserialize a binary tree. Serialization converts the tree to a string; deserialization rebuilds the tree from that string. There is no restriction on your format.",
  examples: [
    { input: "root = [1,2,3,null,null,4,5]", output: "Serialize → '1,2,3,N,N,4,5' → Deserialize → [1,2,3,null,null,4,5]" },
    { input: "root = []", output: "Serialize → 'N'" },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 10⁴].",
    "-1000 ≤ Node.val ≤ 1000",
  ],
  hints: [
    "Preorder DFS serialization: root, left, right, with 'N' for nulls. Fully determines the tree.",
    "Deserialization: use a pointer/index into the split array. Recurse — non-N values create nodes.",
    "BFS also works: write level by level, nulls included. Both directions are O(n).",
  ],
  pitfalls: [
    "Inorder + preorder separately: works but requires two strings and unique values. Preorder alone with null markers is simpler.",
    "Not encoding null nodes — you can't distinguish [1,2] from [1,null,2] without null markers.",
    "Using a global index variable for deserialization — use a closure or pass as array reference.",
  ],
  approaches: [
    {
      name: "DFS Preorder with null markers",
      complexity: "O(n)",
      space: "O(n)",
      description: "Serialize: preorder DFS, emit 'N' for null. Deserialize: split by comma, recurse building nodes.",
    },
    {
      name: "BFS Level Order",
      complexity: "O(n)",
      space: "O(n)",
      description: "Serialize: BFS, emit 'N' for missing children. Deserialize: BFS queue reconstruction.",
    },
  ],
  code: `// Serialize: preorder DFS with 'N' for null
function serialize(root) {
  const parts = [];
  function dfs(node) {
    if (!node) { parts.push('N'); return; }
    parts.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return parts.join(',');
}

// Deserialize: consume tokens via index pointer
function deserialize(data) {
  const tokens = data.split(',');
  let i = 0;

  function build() {
    if (tokens[i] === 'N') { i++; return null; }
    const node = new TreeNode(+tokens[i++]);
    node.left  = build();
    node.right = build();
    return node;
  }

  return build();
}`,
  generateSteps() {
    _btuid = 10000
    const { nodes, rootId } = buildTree([1, 2, 3, null, null, 4, 5])
    const steps: BinaryTreeVisStep[] = []
    const visited: string[] = []

    const ids = Object.keys(nodes)
    const findId = (val: number) => ids.find(id => nodes[id].val === val)!
    const n1 = findId(1), n2 = findId(2), n3 = findId(3)
    const n4 = findId(4), n5 = findId(5)

    steps.push(tframe(nodes, rootId, [n1], visited, [], [], "SERIALIZE: Preorder DFS. Emit each value, 'N' for null.", 3))

    steps.push(tframe(nodes, rootId, [n1], visited, [], [], "Visit 1 → emit '1'. Go left.", 5,
      [{ label: "output so far", value: "1" }]))
    visited.push(n1)

    steps.push(tframe(nodes, rootId, [n2], visited, [], [], "Visit 2 → emit '2'. Go left (null).", 5,
      [{ label: "output so far", value: "1,2" }]))
    visited.push(n2)

    steps.push(tframe(nodes, rootId, [], visited, [], [], "2.left = null → emit 'N'. 2.right = null → emit 'N'. Back up.", 4,
      [{ label: "output so far", value: "1,2,N,N" }]))

    steps.push(tframe(nodes, rootId, [n3], visited, [], [], "Visit 3 → emit '3'. Go left.", 5,
      [{ label: "output so far", value: "1,2,N,N,3" }]))
    visited.push(n3)

    steps.push(tframe(nodes, rootId, [n4], visited, [], [], "Visit 4 → emit '4'. 4 is leaf → emit 'N','N'.", 5,
      [{ label: "output so far", value: "1,2,N,N,3,4,N,N" }]))
    visited.push(n4)

    steps.push(tframe(nodes, rootId, [n5], visited, [], [], "Visit 5 → emit '5'. 5 is leaf → emit 'N','N'.", 5,
      [{ label: "serialized", value: "1,2,N,N,3,4,N,N,5,N,N" }]))
    visited.push(n5)

    steps.push(tframe(nodes, rootId, [], visited, [], [],
      "DESERIALIZE: Split by ',' → consume tokens left-to-right, rebuild tree. ✓", 18,
      [{ label: "tokens", value: "1,2,N,N,3,4,N,N,5,N,N" }],
      ["1,2,N,N,3,4,N,N,5,N,N"]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT — 10 problems, last 5 locked
// ════════════════════════════════════════════════════════════════
export const BINARY_TREE_PROBLEMS: BinaryTreeProblem[] = [
  invertBinaryTree,      // #90  Easy   — free
  maxDepth,              // #91  Easy   — free
  sameTree,              // #94  Easy   — free
  levelOrderTraversal,   // #99  Medium — free
  validateBST,           // #103 Medium — free
  diameterOfBinaryTree,  // #92  Easy   — LOCKED
  balancedBinaryTree,    // #93  Easy   — LOCKED
  lcaBST,                // #96  Medium — LOCKED
  maxPathSum,            // #108 Hard   — LOCKED
  serializeDeserialize,  // #109 Hard   — LOCKED
]