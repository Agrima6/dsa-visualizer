// components/visualizer/avl-tree/avl-tree-problems-data.ts

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google" | "Amazon" | "Apple" | "Meta" | "Microsoft"
  | "Netflix" | "Adobe" | "Uber" | "LinkedIn" | "Twitter"
  | "ServiceNow" | "Salesforce" | "Oracle" | "SAP" | "Intuit"
  | "PayPal" | "Stripe" | "Atlassian" | "Airbnb" | "Dropbox"
  | "Pinterest" | "Snap" | "Spotify" | "Walmart" | "Cisco"
  | "VMware" | "Nvidia" | "GoldmanSachs" | "MorganStanley"
  | "Bloomberg" | "Zomato" | "Swiggy" | "Flipkart" | "Meesho"
  | "PhonePe" | "Wipro" | "TCS" | "Infosys"

export interface AVLVisNode {
  id: string
  value: number
  balanceFactor: number
  height: number
  isHead?: boolean
  isTail?: boolean
  label?: string
}

export interface AVLVisStep {
  nodes: AVLVisNode[]
  highlighted: string[]
  rotated: string[]
  done: string[]
  pointers: { nodeId: string; label: string }[]
  auxiliary: { label: string; value: string }[]
  message: string
  codeLine: number
  treeSnapshot?: {
    value: number
    bf: number
    height: number
    left?: any
    right?: any
  } | null
}

export interface AVLTreeProblem {
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
  approaches: { name: string; description: string; complexity: string; space: string }[]
  pitfalls: string[]
  code: string
  generateSteps: () => AVLVisStep[]
}

// ─── Helper: build a simple AVL node chain for visualization ───────────────
function makeNode(id: string, value: number, bf: number, height: number, extra?: Partial<AVLVisNode>): AVLVisNode {
  return { id, value, balanceFactor: bf, height, ...extra }
}

function step(
  nodes: AVLVisNode[],
  highlighted: string[],
  rotated: string[],
  done: string[],
  pointers: { nodeId: string; label: string }[],
  auxiliary: { label: string; value: string }[],
  message: string,
  codeLine: number
): AVLVisStep {
  return { nodes, highlighted, rotated, done, pointers, auxiliary, message, codeLine }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM DATA
// ─────────────────────────────────────────────────────────────────────────────

export const AVL_TREE_PROBLEMS: AVLTreeProblem[] = [

  // ─── 1. Insert Into AVL Tree ───────────────────────────────────────────────
  {
    id: 1,
    slug: "insert-into-avl-tree",
    title: "Insert into an AVL Tree",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Microsoft", "Adobe", "Oracle"],
    tags: ["AVL Tree", "BST", "Rotation", "Recursion"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n)",
    description:
      "Given the root of an AVL tree and a value, insert the value into the tree maintaining the AVL property. After insertion, perform rotations if necessary to keep the tree balanced. Return the root of the modified tree.",
    examples: [
      {
        input: "root = [10,5,15], val = 3",
        output: "[10,5,15,3]",
        explanation: "3 < 10, go left. 3 < 5, go left. Insert 3. Balance factors remain valid, no rotation needed.",
      },
      {
        input: "root = [10,5,15], val = 2",
        output: "[5,2,10,null,null,null,15] after LL rotation",
        explanation: "Insert 2 causes imbalance at root. Left-Left case triggers right rotation.",
      },
    ],
    constraints: [
      "Number of nodes in tree is in range [0, 1000]",
      "-10^4 <= Node.val <= 10^4",
      "All values are unique",
      "Tree is a valid AVL tree before insertion",
    ],
    hints: [
      "Insert like a normal BST first, then check balance factor bottom-up.",
      "Balance factor = height(left) - height(right). If |bf| > 1, rotate.",
      "Four cases: LL, RR, LR, RL. Identify which using child's balance factor.",
    ],
    approaches: [
      {
        name: "Recursive Insert + Rebalance",
        description: "Recursively insert into left or right subtree. On the way back up, update heights and check balance factors. Apply appropriate rotation.",
        complexity: "O(log n)",
        space: "O(log n) stack",
      },
      {
        name: "Iterative with Parent Stack",
        description: "Insert iteratively, track parent chain in a stack, then rebalance bottom-up.",
        complexity: "O(log n)",
        space: "O(log n) stack",
      },
    ],
    pitfalls: [
      "Forgetting to update height after rotation.",
      "Confusing LR and RL cases.",
      "Not returning the new root after rotation.",
      "Recalculating balance factor before updating height.",
    ],
    code: `function insertAVL(root, val) {
  // Step 1: Standard BST insert
  if (!root) {
    return new AVLNode(val);
  }

  if (val < root.val) {
    root.left = insertAVL(root.left, val);
  } else if (val > root.val) {
    root.right = insertAVL(root.right, val);
  } else {
    return root; // Duplicates not allowed
  }

  // Step 2: Update height of current node
  root.height = 1 + Math.max(
    getHeight(root.left),
    getHeight(root.right)
  );

  // Step 3: Compute balance factor
  const bf = getBalance(root);

  // Step 4: Apply rotations if unbalanced

  // LL Case
  if (bf > 1 && val < root.left.val) {
    return rotateRight(root);
  }

  // RR Case
  if (bf < -1 && val > root.right.val) {
    return rotateLeft(root);
  }

  // LR Case
  if (bf > 1 && val > root.left.val) {
    root.left = rotateLeft(root.left);
    return rotateRight(root);
  }

  // RL Case
  if (bf < -1 && val < root.right.val) {
    root.right = rotateRight(root.right);
    return rotateLeft(root);
  }

  return root;
}`,
    generateSteps(): AVLVisStep[] {
      const n10 = makeNode("n10", 10, 1, 2, { isHead: true })
      const n5  = makeNode("n5",  5,  1, 1)
      const n15 = makeNode("n15", 15, 0, 1)
      const n3  = makeNode("n3",  3,  0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n10, n5, n15], [], [], [], [{ nodeId: "n10", label: "root" }], [], "Start: Insert 3 into AVL tree [10, 5, 15]", 1))
      steps.push(step([n10, n5, n15], ["n10"], [], [], [{ nodeId: "n10", label: "root" }], [{ label: "val", value: "3" }], "3 < 10 → go left", 5))
      steps.push(step([n10, n5, n15], ["n5"], [], [], [{ nodeId: "n5", label: "curr" }], [{ label: "val", value: "3" }], "3 < 5 → go left", 7))
      steps.push(step([n10, n5, n15, { ...n3, label: "new" }], ["n3"], [], [], [{ nodeId: "n3", label: "new" }], [], "Root is null → create new node(3)", 3))
      steps.push(step([n10, n5, n15, n3], ["n5"], [], [], [], [{ label: "height(5)", value: "2" }, { label: "bf(5)", value: "1" }], "Update height of node 5: 1 + max(1,0) = 2", 17))
      steps.push(step([n10, n5, n15, n3], ["n10"], [], [], [], [{ label: "height(10)", value: "3" }, { label: "bf(10)", value: "1" }], "Update height of node 10: balanced (bf=1)", 17))
      steps.push(step([n10, n5, n15, n3], [], [], ["n10", "n5", "n15", "n3"], [], [{ label: "Result", value: "Balanced!" }], "Tree balanced after insert. No rotation needed.", 44))

      return steps
    },
  },

  // ─── 2. Validate AVL Tree ──────────────────────────────────────────────────
  {
    id: 2,
    slug: "validate-avl-tree",
    title: "Validate AVL Tree",
    difficulty: "Medium",
    companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
    tags: ["AVL Tree", "DFS", "Recursion", "Tree"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Given the root of a binary tree, determine if it is a valid AVL tree. A valid AVL tree satisfies both the BST property and the height-balance property (|height(left) - height(right)| <= 1 for every node).",
    examples: [
      {
        input: "root = [3,1,5,null,2,4,null]",
        output: "true",
        explanation: "All nodes satisfy BST property and balance factor is within [-1, 1].",
      },
      {
        input: "root = [1,null,2,null,3]",
        output: "false",
        explanation: "Right-skewed tree. Node 1 has bf = -2, violating AVL property.",
      },
    ],
    constraints: [
      "Number of nodes in range [1, 10^4]",
      "-10^4 <= Node.val <= 10^4",
    ],
    hints: [
      "Use a helper that returns both height and validity.",
      "If either subtree is invalid, propagate -1 as height to short-circuit.",
      "Check BST property simultaneously using min/max bounds.",
    ],
    approaches: [
      {
        name: "Bottom-Up DFS",
        description: "Return height from each subtree. If height difference > 1, return -1 to signal invalidity.",
        complexity: "O(n)",
        space: "O(h)",
      },
      {
        name: "Top-Down (Naive)",
        description: "For each node, independently compute heights and check balance. Simple but O(n²).",
        complexity: "O(n²)",
        space: "O(h)",
      },
    ],
    pitfalls: [
      "Forgetting to check BST validity alongside balance.",
      "Using null height as 0 instead of -1.",
      "Not short-circuiting when a subtree is already invalid.",
    ],
    code: `function isValidAVL(root) {
  function dfs(node, min, max) {
    if (!node) return 0; // height of null = 0

    // Check BST bounds
    if (node.val <= min || node.val >= max) {
      return -1; // invalid
    }

    const leftH  = dfs(node.left,  min, node.val);
    const rightH = dfs(node.right, node.val, max);

    // Propagate invalidity
    if (leftH === -1 || rightH === -1) return -1;

    // Check AVL balance property
    if (Math.abs(leftH - rightH) > 1) return -1;

    return 1 + Math.max(leftH, rightH);
  }

  return dfs(root, -Infinity, Infinity) !== -1;
}`,
    generateSteps(): AVLVisStep[] {
      const n3 = makeNode("n3", 3, 0, 2, { isHead: true })
      const n1 = makeNode("n1", 1, 1, 1)
      const n5 = makeNode("n5", 5, 0, 1)
      const n2 = makeNode("n2", 2, 0, 0)
      const n4 = makeNode("n4", 4, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n3, n1, n5, n2, n4], [], [], [], [{ nodeId: "n3", label: "root" }], [], "Validate AVL Tree: DFS each node", 1))
      steps.push(step([n3, n1, n5, n2, n4], ["n1"], [], [], [{ nodeId: "n1", label: "curr" }], [{ label: "min", value: "-∞" }, { label: "max", value: "3" }], "Visit node 1: check BST bounds [-∞, 3]", 5))
      steps.push(step([n3, n1, n5, n2, n4], ["n2"], [], [], [{ nodeId: "n2", label: "curr" }], [{ label: "min", value: "1" }, { label: "max", value: "3" }], "Visit node 2: leaf. Height = 1", 9))
      steps.push(step([n3, n1, n5, n2, n4], ["n1"], ["n2"], [], [], [{ label: "leftH(1)", value: "1" }, { label: "rightH(1)", value: "0" }, { label: "|bf|", value: "1 ✓" }], "Node 1: |bf| = 1. Valid. Height = 2", 16))
      steps.push(step([n3, n1, n5, n2, n4], ["n4"], [], [], [{ nodeId: "n4", label: "curr" }], [{ label: "min", value: "3" }, { label: "max", value: "5" }], "Visit node 4: leaf. Height = 1", 9))
      steps.push(step([n3, n1, n5, n2, n4], ["n5"], ["n4"], [], [], [{ label: "leftH(5)", value: "1" }, { label: "rightH(5)", value: "0" }, { label: "|bf|", value: "1 ✓" }], "Node 5: |bf| = 1. Valid. Height = 2", 16))
      steps.push(step([n3, n1, n5, n2, n4], ["n3"], ["n1", "n5"], [], [], [{ label: "leftH(3)", value: "2" }, { label: "rightH(3)", value: "2" }, { label: "|bf|", value: "0 ✓" }], "Node 3: |bf| = 0. Valid AVL tree!", 16))
      steps.push(step([n3, n1, n5, n2, n4], [], [], ["n3", "n1", "n5", "n2", "n4"], [], [{ label: "Result", value: "true" }], "Tree is a valid AVL tree ✓", 20))

      return steps
    },
  },

  // ─── 3. Height of AVL Tree ─────────────────────────────────────────────────
  {
    id: 3,
    slug: "height-of-avl-tree",
    title: "Height of AVL Tree",
    difficulty: "Easy",
    companies: ["Amazon", "Adobe", "Wipro", "Flipkart"],
    tags: ["AVL Tree", "DFS", "Recursion"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Given the root of a binary tree, find its height. The height is the number of edges on the longest path from root to a leaf. For an AVL tree of n nodes, height is guaranteed to be O(log n).",
    examples: [
      { input: "root = [3,1,5,null,2]", output: "2", explanation: "Longest path: 3 → 1 → 2, which has 2 edges." },
      { input: "root = []", output: "-1", explanation: "Empty tree has height -1." },
    ],
    constraints: ["Number of nodes in [0, 10^4]", "-10^4 <= Node.val <= 10^4"],
    hints: [
      "Height of null node is -1 (or 0 depending on convention).",
      "Height = 1 + max(leftHeight, rightHeight).",
    ],
    approaches: [
      {
        name: "Recursive DFS",
        description: "Recursively compute height of left and right subtrees, return 1 + max.",
        complexity: "O(n)",
        space: "O(h)",
      },
      {
        name: "Iterative BFS",
        description: "Level-order traversal, count levels.",
        complexity: "O(n)",
        space: "O(n)",
      },
    ],
    pitfalls: [
      "Off-by-one: height is edges, not nodes.",
      "Returning 0 for null instead of -1.",
    ],
    code: `function heightAVL(root) {
  if (!root) return -1; // null node height

  const leftHeight  = heightAVL(root.left);
  const rightHeight = heightAVL(root.right);

  return 1 + Math.max(leftHeight, rightHeight);
}

// For AVL tree with n nodes:
// Height is always O(log n) — guaranteed by balance
// Fibonacci-like worst case: ~1.44 * log2(n)`,
    generateSteps(): AVLVisStep[] {
      const n3 = makeNode("n3", 3, 0, 2, { isHead: true })
      const n1 = makeNode("n1", 1, 1, 1)
      const n5 = makeNode("n5", 0, 1, 1)
      const n2 = makeNode("n2", 2, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n3, n1, n5, n2], [], [], [], [{ nodeId: "n3", label: "root" }], [], "Find height: DFS post-order", 1))
      steps.push(step([n3, n1, n5, n2], ["n2"], [], [], [{ nodeId: "n2", label: "leaf" }], [], "Node 2: leaf → height = 0 (no children)", 4))
      steps.push(step([n3, n1, n5, n2], ["n1"], ["n2"], [], [], [{ label: "leftH", value: "0" }, { label: "rightH", value: "-1" }, { label: "h(1)", value: "1" }], "Node 1: 1 + max(0, -1) = 1", 6))
      steps.push(step([n3, n1, n5, n2], ["n5"], [], [], [{ nodeId: "n5", label: "leaf" }], [{ label: "h(5)", value: "0" }], "Node 5: leaf → height = 0", 4))
      steps.push(step([n3, n1, n5, n2], ["n3"], ["n1", "n5"], [], [], [{ label: "leftH", value: "1" }, { label: "rightH", value: "0" }, { label: "h(root)", value: "2" }], "Root: 1 + max(1, 0) = 2. Height = 2", 6))
      steps.push(step([n3, n1, n5, n2], [], [], ["n3", "n1", "n5", "n2"], [], [{ label: "Height", value: "2" }], "AVL height = 2 (guaranteed O(log n))", 9))

      return steps
    },
  },

  // ─── 4. AVL Tree Rotations ─────────────────────────────────────────────────
  {
    id: 4,
    slug: "avl-tree-rotations",
    title: "AVL Tree Rotations",
    difficulty: "Medium",
    companies: ["Google", "Microsoft", "Amazon", "Meta", "Oracle"],
    tags: ["AVL Tree", "Rotation", "BST", "Balance"],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    description:
      "Implement Left Rotation and Right Rotation for an AVL tree node. These are the core building blocks for rebalancing. Left rotation is used in RR case; right rotation in LL case. LR and RL cases combine both.",
    examples: [
      {
        input: "Unbalanced node z with right-heavy right child y",
        output: "y becomes new root, z becomes y's left child (Left Rotation)",
        explanation: "RR case: single left rotation at z restores balance.",
      },
    ],
    constraints: ["Node values are distinct integers", "Rotation must preserve BST property"],
    hints: [
      "In left rotation: new root = right child, update pointers carefully.",
      "Always update heights after rotation: child first, then new root.",
      "Left rotation: y = z.right; z.right = y.left; y.left = z;",
    ],
    approaches: [
      {
        name: "Standard Rotation",
        description: "Reassign 3 pointers per rotation. O(1) time. Update heights bottom-up.",
        complexity: "O(1)",
        space: "O(1)",
      },
    ],
    pitfalls: [
      "Updating heights in wrong order (parent before child).",
      "Losing reference to subtree T2 during rotation.",
      "Forgetting to update parent pointer (in non-recursive implementations).",
    ],
    code: `function rotateLeft(z) {
  const y  = z.right;     // y is new root
  const T2 = y.left;      // T2 will move to z.right

  // Perform rotation
  y.left  = z;
  z.right = T2;

  // Update heights (z first, then y)
  z.height = 1 + Math.max(
    getHeight(z.left), getHeight(z.right)
  );
  y.height = 1 + Math.max(
    getHeight(y.left), getHeight(y.right)
  );

  return y; // y is new root
}

function rotateRight(z) {
  const y  = z.left;      // y is new root
  const T3 = y.right;     // T3 will move to z.left

  // Perform rotation
  y.right = z;
  z.left  = T3;

  // Update heights
  z.height = 1 + Math.max(
    getHeight(z.left), getHeight(z.right)
  );
  y.height = 1 + Math.max(
    getHeight(y.left), getHeight(y.right)
  );

  return y; // y is new root
}`,
    generateSteps(): AVLVisStep[] {
      const nz = makeNode("nz", 30, -2, 2, { isHead: true, label: "z (unbalanced)" })
      const ny = makeNode("ny", 20, -1, 1, { label: "y" })
      const n10 = makeNode("n10", 10, 0, 0)
      const t2 = makeNode("t2", 25, 0, 0, { label: "T2" })
      const steps: AVLVisStep[] = []

      steps.push(step([nz, ny, n10, t2], [], [], [], [{ nodeId: "nz", label: "z" }, { nodeId: "ny", label: "y" }], [{ label: "bf(z)", value: "-2 ✗" }], "RR Case: z=30 is unbalanced (bf=-2). Need Left Rotation.", 1))
      steps.push(step([nz, ny, n10, t2], ["ny"], [], [], [{ nodeId: "ny", label: "new root" }], [{ label: "y", value: "20" }, { label: "T2", value: "25" }], "y = z.right = 20. T2 = y.left = 25", 2))
      steps.push(step([nz, ny, n10, t2], ["ny", "nz"], ["ny"], [], [], [], "Rotate: y.left = z, z.right = T2", 6))
      const newZ = makeNode("nz", 30, 1, 1, { label: "z (updated)" })
      const newY = makeNode("ny", 20, 0, 2, { isHead: true, label: "y (new root)" })
      steps.push(step([newY, n10, newZ, t2], ["nz"], [], [], [], [{ label: "h(z)", value: "1" }], "Update height of z: 1 + max(0,0) = 1", 9))
      steps.push(step([newY, n10, newZ, t2], ["ny"], ["nz"], [], [], [{ label: "h(y)", value: "2" }, { label: "bf(y)", value: "0 ✓" }], "Update height of y: 1 + max(1,1) = 2. Balanced!", 13))
      steps.push(step([newY, n10, newZ, t2], [], [], ["ny", "n10", "nz", "t2"], [], [{ label: "New Root", value: "20" }], "Left rotation complete. Tree rebalanced.", 17))

      return steps
    },
  },

  // ─── 5. Delete from AVL Tree ───────────────────────────────────────────────
  {
    id: 5,
    slug: "delete-from-avl-tree",
    title: "Delete from AVL Tree",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Bloomberg"],
    tags: ["AVL Tree", "BST", "Rotation", "Delete"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n)",
    description:
      "Given the root of an AVL tree and a key, delete the node with the given key and return the root of the balanced tree. After deletion, restore AVL balance using rotations as needed.",
    examples: [
      {
        input: "root = [9,1,10,null,null,null,null], key = 10",
        output: "[9,1,null]",
        explanation: "Delete leaf 10. Node 9 becomes right-heavy but still valid (bf=1). No rotation.",
      },
      {
        input: "root = [1,null,2,null,3], key = 1",
        output: "[2,null,3] after rotation",
        explanation: "Delete root 1, causing imbalance. RR rotation restores balance.",
      },
    ],
    constraints: [
      "Number of nodes in [1, 1000]",
      "All values are unique",
      "key is guaranteed to exist in tree",
    ],
    hints: [
      "Delete same as BST: find node, replace with inorder successor if two children.",
      "After deletion, rebalance bottom-up just like insert.",
      "Four rotation cases same as insertion.",
    ],
    approaches: [
      {
        name: "Recursive Delete + Rebalance",
        description: "BST delete recursively. On unwind, update heights and apply rotations.",
        complexity: "O(log n)",
        space: "O(log n)",
      },
    ],
    pitfalls: [
      "Forgetting to rebalance after inorder successor replacement.",
      "Not updating height of node even when no rotation occurs.",
      "Incorrect rotation case selection after deletion.",
    ],
    code: `function deleteAVL(root, key) {
  if (!root) return null;

  // Step 1: BST delete
  if (key < root.val) {
    root.left = deleteAVL(root.left, key);
  } else if (key > root.val) {
    root.right = deleteAVL(root.right, key);
  } else {
    // Node found
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    // Two children: get inorder successor
    const successor = getMin(root.right);
    root.val = successor.val;
    root.right = deleteAVL(root.right, successor.val);
  }

  // Step 2: Update height
  root.height = 1 + Math.max(
    getHeight(root.left),
    getHeight(root.right)
  );

  // Step 3: Rebalance
  const bf = getBalance(root);

  // LL case
  if (bf > 1 && getBalance(root.left) >= 0)
    return rotateRight(root);

  // LR case
  if (bf > 1 && getBalance(root.left) < 0) {
    root.left = rotateLeft(root.left);
    return rotateRight(root);
  }

  // RR case
  if (bf < -1 && getBalance(root.right) <= 0)
    return rotateLeft(root);

  // RL case
  if (bf < -1 && getBalance(root.right) > 0) {
    root.right = rotateRight(root.right);
    return rotateLeft(root);
  }

  return root;
}`,
    generateSteps(): AVLVisStep[] {
      const n9  = makeNode("n9",  9,  1, 2, { isHead: true })
      const n1  = makeNode("n1",  1,  0, 1)
      const n10 = makeNode("n10", 10, 0, 1)
      const steps: AVLVisStep[] = []

      steps.push(step([n9, n1, n10], [], [], [], [{ nodeId: "n9", label: "root" }], [{ label: "key", value: "10" }], "Delete key=10 from AVL tree", 1))
      steps.push(step([n9, n1, n10], ["n9"], [], [], [{ nodeId: "n9", label: "curr" }], [], "10 > 9 → go right", 6))
      steps.push(step([n9, n1, n10], ["n10"], [], [], [{ nodeId: "n10", label: "found!" }], [], "Node 10 found. It's a leaf (no children)", 9))
      steps.push(step([n9, n1], ["n9"], ["n10"], [], [], [{ label: "bf(9)", value: "1 ✓" }], "Delete 10. Update height(9). bf=1, still balanced.", 20))
      steps.push(step([n9, n1], [], [], ["n9", "n1"], [], [{ label: "Result", value: "No rotation" }], "Tree balanced after delete. No rotation needed.", 42))

      return steps
    },
  },

  // ─── 6. Kth Smallest in AVL ────────────────────────────────────────────────
  {
    id: 6,
    slug: "kth-smallest-avl",
    title: "Kth Smallest Element in AVL Tree",
    difficulty: "Medium",
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Bloomberg"],
    tags: ["AVL Tree", "BST", "Inorder", "DFS"],
    timeComplexity: "O(log n + k)",
    spaceComplexity: "O(h)",
    description:
      "Given the root of an AVL tree and an integer k, return the kth smallest value (1-indexed) among all node values. The AVL property guarantees O(log n) height, so inorder traversal stops early.",
    examples: [
      { input: "root = [5,3,7,1,4], k = 2", output: "3", explanation: "Inorder: [1,3,4,5,7]. 2nd element = 3." },
      { input: "root = [5,3,7,1,4], k = 4", output: "5", explanation: "Inorder: [1,3,4,5,7]. 4th element = 5." },
    ],
    constraints: ["1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4"],
    hints: [
      "Inorder traversal of BST gives sorted order.",
      "Stop early once k elements are visited.",
      "Can augment nodes with subtree size for O(log n) solution.",
    ],
    approaches: [
      {
        name: "Inorder DFS",
        description: "Recursive inorder traversal. Count visited nodes. Return when count reaches k.",
        complexity: "O(log n + k)",
        space: "O(h)",
      },
      {
        name: "Augmented BST",
        description: "Store subtree size in each node. Navigate using size to find kth in O(log n).",
        complexity: "O(log n)",
        space: "O(1) extra",
      },
    ],
    pitfalls: [
      "Not stopping traversal early after finding kth element.",
      "Off-by-one in counter.",
    ],
    code: `function kthSmallestAVL(root, k) {
  let count = 0;
  let result = null;

  function inorder(node) {
    if (!node || result !== null) return;

    inorder(node.left); // visit left subtree

    count++;
    if (count === k) {
      result = node.val; // found kth
      return;
    }

    inorder(node.right); // visit right subtree
  }

  inorder(root);
  return result;
}`,
    generateSteps(): AVLVisStep[] {
      const n5 = makeNode("n5", 5, 0, 2, { isHead: true })
      const n3 = makeNode("n3", 3, 0, 1)
      const n7 = makeNode("n7", 7, 0, 1)
      const n1 = makeNode("n1", 1, 0, 0)
      const n4 = makeNode("n4", 4, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n5, n3, n7, n1, n4], [], [], [], [{ nodeId: "n5", label: "root" }], [{ label: "k", value: "2" }, { label: "count", value: "0" }], "Find 2nd smallest. Inorder traversal.", 1))
      steps.push(step([n5, n3, n7, n1, n4], ["n1"], [], [], [{ nodeId: "n1", label: "visit" }], [{ label: "count", value: "1" }, { label: "k", value: "2" }], "Visit node 1. count=1, k=2. Not found yet.", 9))
      steps.push(step([n5, n3, n7, n1, n4], ["n3"], ["n1"], [], [{ nodeId: "n3", label: "visit" }], [{ label: "count", value: "2" }, { label: "k", value: "2" }], "Visit node 3. count=2 = k! Found answer.", 11))
      steps.push(step([n5, n3, n7, n1, n4], [], [], ["n1", "n3"], [], [{ label: "Result", value: "3" }], "2nd smallest = 3. Stop early. O(log n + k).", 13))

      return steps
    },
  },

  // ─── 7. Balance Factor Computation ────────────────────────────────────────
  {
    id: 7,
    slug: "balance-factor-avl",
    title: "Compute Balance Factors",
    difficulty: "Easy",
    companies: ["Adobe", "Wipro", "TCS", "Infosys", "Oracle"],
    tags: ["AVL Tree", "Height", "Balance Factor"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Given the root of a binary tree, compute and return the balance factor for every node. Balance factor = height(leftSubtree) - height(rightSubtree). For a valid AVL tree, every node must have balance factor in {-1, 0, 1}.",
    examples: [
      {
        input: "root = [3,1,5,null,2]",
        output: "{3: 1, 1: 1, 5: 0, 2: 0}",
        explanation: "Node 3: h(left)=2, h(right)=1, bf=1. Node 1: h(left)=-1, h(right)=0, bf=1.",
      },
    ],
    constraints: ["1 <= nodes <= 10^4", "-10^4 <= val <= 10^4"],
    hints: [
      "Post-order traversal: compute children heights before parent.",
      "Height of null = -1.",
      "bf = leftHeight - rightHeight.",
    ],
    approaches: [
      {
        name: "Post-Order DFS",
        description: "Visit leaves first, propagate heights up. O(n) total.",
        complexity: "O(n)",
        space: "O(h)",
      },
    ],
    pitfalls: [
      "Calling height() separately for each node is O(n²).",
      "Forgetting null height = -1.",
    ],
    code: `function computeBalanceFactors(root) {
  const factors = new Map();

  function getHeight(node) {
    if (!node) return -1;
    const lh = getHeight(node.left);
    const rh = getHeight(node.right);
    const bf = lh - rh;
    factors.set(node.val, bf);
    return 1 + Math.max(lh, rh);
  }

  getHeight(root);
  return factors;
}`,
    generateSteps(): AVLVisStep[] {
      const n3 = makeNode("n3", 3, 1, 2, { isHead: true })
      const n1 = makeNode("n1", 1, 1, 1)
      const n5 = makeNode("n5", 5, 0, 0)
      const n2 = makeNode("n2", 2, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n3, n1, n5, n2], [], [], [], [{ nodeId: "n3", label: "root" }], [], "Compute balance factors using post-order DFS", 1))
      steps.push(step([n3, n1, n5, n2], ["n2"], [], [], [], [{ label: "bf(2)", value: "0" }, { label: "h(2)", value: "0" }], "Node 2: leaf. bf = (-1) - (-1) = 0. Height = 0", 6))
      steps.push(step([n3, n1, n5, n2], ["n1"], ["n2"], [], [], [{ label: "lh", value: "0" }, { label: "rh", value: "-1" }, { label: "bf(1)", value: "1" }], "Node 1: lh=0, rh=-1. bf=1. Height=1", 6))
      steps.push(step([n3, n1, n5, n2], ["n5"], [], [], [], [{ label: "bf(5)", value: "0" }, { label: "h(5)", value: "0" }], "Node 5: leaf. bf = 0. Height = 0", 6))
      steps.push(step([n3, n1, n5, n2], ["n3"], ["n1", "n5"], [], [], [{ label: "lh", value: "1" }, { label: "rh", value: "0" }, { label: "bf(3)", value: "1" }], "Node 3: lh=1, rh=0. bf=1. Height=2. All valid!", 6))
      steps.push(step([n3, n1, n5, n2], [], [], ["n3", "n1", "n5", "n2"], [], [{ label: "bf(3)", value: "1" }, { label: "bf(1)", value: "1" }, { label: "bf(5)", value: "0" }], "All balance factors computed. All in [-1,1] ✓", 10))

      return steps
    },
  },

  // ─── 8. AVL Tree Inorder Successor ────────────────────────────────────────
  {
    id: 8,
    slug: "inorder-successor-avl",
    title: "Inorder Successor in AVL Tree",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Stripe"],
    tags: ["AVL Tree", "BST", "Inorder", "Traversal"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Given the root of an AVL tree and a node p, find the inorder successor of p. The inorder successor is the node with the smallest value greater than p.val. Since the tree is an AVL tree, the height is O(log n) ensuring efficient traversal.",
    examples: [
      { input: "root = [5,3,7,1,4], p = 3", output: "4", explanation: "Inorder: [1,3,4,5,7]. Successor of 3 is 4." },
      { input: "root = [5,3,7,1,4], p = 5", output: "7", explanation: "Successor of 5 is 7 (right subtree min)." },
      { input: "root = [5,3,7,1,4], p = 7", output: "null", explanation: "7 is the largest, no successor." },
    ],
    constraints: ["All values unique", "1 <= n <= 10^4"],
    hints: [
      "If node has right subtree, successor = min of right subtree.",
      "Otherwise, walk from root; last ancestor where we turned left is the successor.",
    ],
    approaches: [
      {
        name: "BST Property (No Parent Pointer)",
        description: "Start from root. When you go left, update successor. When you reach target, check right subtree.",
        complexity: "O(log n)",
        space: "O(1)",
      },
      {
        name: "Inorder Traversal",
        description: "Full inorder, return element after p. Simple but O(n).",
        complexity: "O(n)",
        space: "O(h)",
      },
    ],
    pitfalls: [
      "Forgetting the case when target node has no right child.",
      "Not utilizing BST property, doing full inorder instead.",
    ],
    code: `function inorderSuccessor(root, p) {
  let successor = null;
  let curr = root;

  while (curr) {
    if (p.val < curr.val) {
      // curr could be the successor
      successor = curr;
      curr = curr.left;
    } else {
      // p >= curr, successor must be to right
      curr = curr.right;
    }
  }

  return successor;
}`,
    generateSteps(): AVLVisStep[] {
      const n5 = makeNode("n5", 5, 0, 2, { isHead: true })
      const n3 = makeNode("n3", 3, 0, 1)
      const n7 = makeNode("n7", 7, 0, 1)
      const n1 = makeNode("n1", 1, 0, 0)
      const n4 = makeNode("n4", 4, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n5, n3, n7, n1, n4], [], [], [], [{ nodeId: "n5", label: "root" }], [{ label: "p", value: "3" }, { label: "successor", value: "null" }], "Find inorder successor of node 3", 1))
      steps.push(step([n5, n3, n7, n1, n4], ["n5"], [], [], [{ nodeId: "n5", label: "curr" }], [{ label: "3 < 5", value: "→ go left" }, { label: "successor", value: "5" }], "3 < 5: successor = 5. Go left.", 5))
      steps.push(step([n5, n3, n7, n1, n4], ["n3"], [], [], [{ nodeId: "n3", label: "curr" }], [{ label: "3 == 3", value: "→ go right" }, { label: "successor", value: "5" }], "3 == 3: p found. Go right subtree.", 8))
      steps.push(step([n5, n3, n7, n1, n4], ["n4"], [], [], [{ nodeId: "n4", label: "curr" }], [{ label: "3 < 4", value: "→ go left" }, { label: "successor", value: "4" }], "4 > 3: successor = 4. Go left (null).", 5))
      steps.push(step([n5, n3, n7, n1, n4], [], [], ["n4"], [], [{ label: "Successor", value: "4" }], "curr = null. Return successor = 4.", 14))

      return steps
    },
  },

  // ─── 9. Count Nodes in AVL ─────────────────────────────────────────────────
  {
    id: 9,
    slug: "count-nodes-avl",
    title: "Count Nodes in AVL Tree",
    difficulty: "Easy",
    companies: ["Amazon", "Flipkart", "Zomato", "Meesho"],
    tags: ["AVL Tree", "Recursion", "Complete Binary Tree"],
    timeComplexity: "O(log² n)",
    spaceComplexity: "O(log n)",
    description:
      "Given the root of a complete binary tree (like a balanced AVL tree), count the number of nodes more efficiently than O(n) by exploiting the height property.",
    examples: [
      { input: "root = [1,2,3,4,5,6]", output: "6" },
      { input: "root = []", output: "0" },
    ],
    constraints: ["0 <= n <= 5 * 10^4", "Tree is complete and balanced"],
    hints: [
      "Left height == right height means left subtree is perfect.",
      "Perfect BST of height h has 2^h - 1 nodes.",
      "Otherwise recurse: total = 1 + count(left) + count(right).",
    ],
    approaches: [
      {
        name: "Binary Search on Height",
        description: "Compare left and right heights. If equal, left is perfect; count it in O(1) and recurse right. O(log² n) overall.",
        complexity: "O(log² n)",
        space: "O(log n)",
      },
    ],
    pitfalls: ["Using simple O(n) recursion ignores the balanced property."],
    code: `function countNodes(root) {
  if (!root) return 0;

  let leftH = 0, rightH = 0;
  let l = root, r = root;

  while (l) { leftH++;  l = l.left; }
  while (r) { rightH++; r = r.right; }

  // Perfect binary tree
  if (leftH === rightH) {
    return (1 << leftH) - 1; // 2^h - 1
  }

  // Recurse
  return 1 + countNodes(root.left)
           + countNodes(root.right);
}`,
    generateSteps(): AVLVisStep[] {
      const n1 = makeNode("n1", 1, 0, 2, { isHead: true })
      const n2 = makeNode("n2", 2, 0, 1)
      const n3 = makeNode("n3", 3, 0, 1)
      const n4 = makeNode("n4", 4, 0, 0)
      const n5 = makeNode("n5", 5, 0, 0)
      const n6 = makeNode("n6", 6, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n1, n2, n3, n4, n5, n6], [], [], [], [{ nodeId: "n1", label: "root" }], [], "Count nodes in complete/balanced tree", 1))
      steps.push(step([n1, n2, n3, n4, n5, n6], ["n1"], [], [], [{ nodeId: "n1", label: "l,r" }], [{ label: "leftH", value: "0" }, { label: "rightH", value: "0" }], "Measure leftH and rightH from root", 4))
      steps.push(step([n1, n2, n3, n4, n5, n6], ["n1", "n2", "n4"], [], [], [], [{ label: "leftH", value: "3" }, { label: "rightH", value: "2" }], "leftH=3, rightH=2: not equal → recurse", 8))
      steps.push(step([n1, n2, n3, n4, n5, n6], ["n2"], [], [], [], [{ label: "leftH(2)", value: "2" }, { label: "rightH(2)", value: "2" }], "At node 2: leftH=rightH=2. Perfect subtree!", 9))
      steps.push(step([n1, n2, n3, n4, n5, n6], ["n2"], [], ["n2", "n4", "n5"], [], [{ label: "count(left)", value: "2^2-1 = 3" }], "Left subtree = 2^2-1 = 3 nodes in O(1)", 11))
      steps.push(step([n1, n2, n3, n4, n5, n6], [], [], ["n1", "n2", "n3", "n4", "n5", "n6"], [], [{ label: "Total", value: "6 nodes" }], "Total = 1 + 3 + 2 = 6. O(log²n) efficiency.", 13))

      return steps
    },
  },

  // ─── 10. Sorted Array to AVL ───────────────────────────────────────────────
  {
    id: 10,
    slug: "sorted-array-to-avl",
    title: "Convert Sorted Array to AVL Tree",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Microsoft", "Adobe", "Nvidia"],
    tags: ["AVL Tree", "Divide & Conquer", "Recursion", "BST"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(log n)",
    description:
      "Given a sorted array, build a height-balanced BST (AVL tree) from it. Choose the middle element as root to ensure balance. This is the reverse of inorder traversal.",
    examples: [
      { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]", explanation: "Middle=0 is root. Recurse on left half and right half." },
      { input: "nums = [1,3]", output: "[3,1] or [1,null,3]", explanation: "Either can be height-balanced." },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in ascending order"],
    hints: [
      "Pick mid = (lo + hi) / 2 as root.",
      "Recurse left half for left subtree, right half for right subtree.",
      "Tree is automatically AVL-valid because of balanced splitting.",
    ],
    approaches: [
      {
        name: "Divide & Conquer",
        description: "Mid element = root. Recurse on left and right halves. O(n) time, O(log n) stack.",
        complexity: "O(n)",
        space: "O(log n)",
      },
    ],
    pitfalls: [
      "Choosing first or last element as root creates skewed tree.",
      "Off-by-one in mid calculation causing infinite recursion.",
    ],
    code: `function sortedArrayToAVL(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;

    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(nums[mid]);

    node.left  = build(lo, mid - 1);
    node.right = build(mid + 1, hi);

    return node;
  }

  return build(0, nums.length - 1);
}`,
    generateSteps(): AVLVisStep[] {
      const steps: AVLVisStep[] = []
      const arr = [-10, -3, 0, 5, 9]

      steps.push(step([], [], [], [], [], [{ label: "nums", value: "[-10,-3,0,5,9]" }, { label: "lo", value: "0" }, { label: "hi", value: "4" }], "Build AVL from sorted array. Pick mid as root.", 1))
      const n0   = makeNode("n0",  0,  0, 2, { isHead: true, label: "mid=2" })
      steps.push(step([n0], ["n0"], [], [], [{ nodeId: "n0", label: "root" }], [{ label: "mid", value: "2 → val=0" }], "Root = nums[2] = 0. Recurse left [0..1] and right [3..4]", 4))
      const nm3 = makeNode("nm3", -3, -1, 1, { label: "mid=0 of left" })
      steps.push(step([n0, nm3], ["nm3"], [], [], [], [{ label: "left half", value: "[-10,-3]" }, { label: "mid", value: "0 → val=-3" }], "Left root = nums[0+1/2=0]=-10... wait mid=(0+1)/2=0 → -10. Then recurse.", 4))
      const nm10 = makeNode("nm10", -10, 0, 0)
      const nm3b = makeNode("nm3b", -3, 1, 1)
      const n9   = makeNode("n9",  9, -1, 1)
      const n5   = makeNode("n5",  5,  0, 0)
      steps.push(step([n0, nm10, nm3b, n9, n5], [], [], [], [], [{ label: "Built!", value: "0,-10,-3,9,5" }], "Tree fully built: balanced and AVL-valid by construction.", 6))
      steps.push(step([n0, nm10, nm3b, n9, n5], [], [], ["n0", "nm10", "nm3b", "n9", "n5"], [], [{ label: "Height", value: "2 (O(log n))" }], "Sorted array → balanced AVL tree. O(n) time.", 9))

      return steps
    },
  },

  // ─── 11. AVL vs BST Search ─────────────────────────────────────────────────
  {
    id: 11,
    slug: "avl-vs-bst-search",
    title: "Search in AVL Tree",
    difficulty: "Easy",
    companies: ["Amazon", "Microsoft", "Oracle", "Cisco", "Walmart"],
    tags: ["AVL Tree", "BST", "Binary Search", "Search"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Given the root of an AVL tree and a target value, return the node with that value or null. Since AVL trees are balanced BSTs, search is always O(log n) — unlike unbalanced BSTs which degrade to O(n) in worst case.",
    examples: [
      { input: "root = [5,3,7,1,4], target = 4", output: "Node(4)", explanation: "5→3→4. Found in 3 comparisons = O(log 5) ≈ 2-3." },
      { input: "root = [5,3,7,1,4], target = 6", output: "null", explanation: "6 not in tree." },
    ],
    constraints: ["1 <= n <= 10^4", "All values unique"],
    hints: [
      "Same as BST search: go left if target < curr, right if target > curr.",
      "AVL guarantees O(log n) due to balanced height.",
    ],
    approaches: [
      {
        name: "Iterative BST Search",
        description: "Traverse left/right based on comparison. O(log n) guaranteed by AVL balance.",
        complexity: "O(log n)",
        space: "O(1)",
      },
    ],
    pitfalls: ["Using linear search instead of BST property."],
    code: `function searchAVL(root, target) {
  let curr = root;

  while (curr) {
    if (target === curr.val) {
      return curr; // found
    } else if (target < curr.val) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }
  }

  return null; // not found
}

// AVL guarantees: height = O(log n)
// So while loop runs at most O(log n) times
// vs unbalanced BST: potentially O(n)`,
    generateSteps(): AVLVisStep[] {
      const n5 = makeNode("n5", 5, 0, 2, { isHead: true })
      const n3 = makeNode("n3", 3, 0, 1)
      const n7 = makeNode("n7", 7, 0, 1)
      const n1 = makeNode("n1", 1, 0, 0)
      const n4 = makeNode("n4", 4, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n5, n3, n7, n1, n4], [], [], [], [{ nodeId: "n5", label: "root" }], [{ label: "target", value: "4" }], "Search for 4 in AVL tree. O(log n) guaranteed.", 1))
      steps.push(step([n5, n3, n7, n1, n4], ["n5"], [], [], [{ nodeId: "n5", label: "curr" }], [{ label: "4 < 5", value: "→ go left" }], "4 < 5: go left", 7))
      steps.push(step([n5, n3, n7, n1, n4], ["n3"], [], [], [{ nodeId: "n3", label: "curr" }], [{ label: "4 > 3", value: "→ go right" }], "4 > 3: go right", 9))
      steps.push(step([n5, n3, n7, n1, n4], ["n4"], [], [], [{ nodeId: "n4", label: "curr" }], [{ label: "4 == 4", value: "✓ FOUND" }], "4 == 4: node found! 3 comparisons = O(log 5)", 5))
      steps.push(step([n5, n3, n7, n1, n4], [], [], ["n4"], [], [{ label: "Found", value: "Node(4)" }, { label: "Steps", value: "3 = O(log n)" }], "Search complete. AVL guarantees O(log n) worst case.", 6))

      return steps
    },
  },

  // ─── 12. Serialize AVL Tree ────────────────────────────────────────────────
  {
    id: 12,
    slug: "serialize-avl-tree",
    title: "Serialize and Deserialize AVL Tree",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Meta", "Microsoft", "LinkedIn"],
    tags: ["AVL Tree", "BFS", "DFS", "Serialization", "Design"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "Design an algorithm to serialize and deserialize an AVL tree. Serialization converts the tree to a string; deserialization restores it. For AVL trees, you can store just the values (not balance factors) since balance is reconstructed.",
    examples: [
      { input: "root = [4,2,6,1,3,5,7]", output: '"4,2,1,#,#,3,#,#,6,5,#,#,7,#,#"', explanation: "Preorder with null markers." },
    ],
    constraints: ["0 <= n <= 10^4", "-10^4 <= val <= 10^4"],
    hints: [
      "Use preorder traversal for serialization (root before children).",
      "During deserialization, use a pointer/index into the serialized string.",
    ],
    approaches: [
      {
        name: "Preorder DFS",
        description: "Serialize with preorder + null markers. Deserialize by rebuilding same order.",
        complexity: "O(n)",
        space: "O(n)",
      },
      {
        name: "BFS Level Order",
        description: "Level-order serialization, reconstruct with queue.",
        complexity: "O(n)",
        space: "O(n)",
      },
    ],
    pitfalls: [
      "Not including null markers causes ambiguous deserialization.",
      "Forgetting to re-balance during deserialization if inserting one by one.",
    ],
    code: `function serialize(root) {
  const parts = [];
  function preorder(node) {
    if (!node) { parts.push('#'); return; }
    parts.push(String(node.val));
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  return parts.join(',');
}

function deserialize(data) {
  const tokens = data.split(',');
  let idx = 0;

  function build() {
    if (tokens[idx] === '#') {
      idx++;
      return null;
    }
    const node = new AVLNode(parseInt(tokens[idx++]));
    node.left  = build();
    node.right = build();
    // Recompute height and bf after build
    node.height = 1 + Math.max(
      getHeight(node.left),
      getHeight(node.right)
    );
    return node;
  }

  return build();
}`,
    generateSteps(): AVLVisStep[] {
      const n4 = makeNode("n4", 4, 0, 2, { isHead: true })
      const n2 = makeNode("n2", 2, 0, 1)
      const n6 = makeNode("n6", 6, 0, 1)
      const n1 = makeNode("n1", 1, 0, 0)
      const n3 = makeNode("n3", 3, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n4, n2, n6, n1, n3], [], [], [], [{ nodeId: "n4", label: "root" }], [], "Serialize AVL tree using preorder DFS", 1))
      steps.push(step([n4, n2, n6, n1, n3], ["n4"], [], [], [{ nodeId: "n4", label: "visit" }], [{ label: "output", value: "4" }], "Visit root 4. Emit '4'", 4))
      steps.push(step([n4, n2, n6, n1, n3], ["n2"], [], [], [{ nodeId: "n2", label: "visit" }], [{ label: "output", value: "4,2" }], "Go left. Visit 2. Emit '2'", 4))
      steps.push(step([n4, n2, n6, n1, n3], ["n1"], [], [], [{ nodeId: "n1", label: "visit" }], [{ label: "output", value: "4,2,1,#,#" }], "Visit 1. It's a leaf. Emit '1,#,#'", 4))
      steps.push(step([n4, n2, n6, n1, n3], ["n3"], [], [], [{ nodeId: "n3", label: "visit" }], [{ label: "output", value: "4,2,1,#,#,3,#,#" }], "Visit 3 (right of 2). Leaf. Emit '3,#,#'", 4))
      steps.push(step([n4, n2, n6, n1, n3], ["n6"], [], [], [{ nodeId: "n6", label: "visit" }], [{ label: "output", value: "4,2,1,#,#,3,#,#,6,#,#" }], "Visit 6 (right of 4). Leaf. Emit '6,#,#'", 4))
      steps.push(step([n4, n2, n6, n1, n3], [], [], ["n4", "n2", "n6", "n1", "n3"], [], [{ label: "Serialized", value: "4,2,1,#,#,3,#,#,6,#,#" }], "Serialization complete. Deserialize reverses this.", 9))

      return steps
    },
  },

  // ─── 13. LCA in AVL Tree ───────────────────────────────────────────────────
  {
    id: 13,
    slug: "lca-avl-tree",
    title: "Lowest Common Ancestor in AVL Tree",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Bloomberg"],
    tags: ["AVL Tree", "BST", "LCA", "Recursion"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Given an AVL tree and two nodes p and q, find their Lowest Common Ancestor (LCA). In a BST, the LCA is the node where p and q are in different subtrees (or one of them is the node itself). AVL balance ensures O(log n) traversal.",
    examples: [
      { input: "root=[6,2,8,0,4,7,9], p=2, q=8", output: "6", explanation: "p and q are in different subtrees of 6." },
      { input: "root=[6,2,8,0,4,7,9], p=2, q=4", output: "2", explanation: "4 is in subtree of 2, so 2 is LCA." },
    ],
    constraints: ["2 <= n <= 10^5", "All values are unique", "p != q", "Both p and q exist in the tree"],
    hints: [
      "Use BST property: if both p and q are less than curr, LCA is in left subtree.",
      "If both greater, LCA is in right subtree.",
      "Otherwise current node is the LCA.",
    ],
    approaches: [
      {
        name: "BST Property Iterative",
        description: "Walk from root. At split point (one each side), that's the LCA. O(log n) due to AVL balance.",
        complexity: "O(log n)",
        space: "O(1)",
      },
    ],
    pitfalls: [
      "Using naive O(n) tree LCA approach instead of BST property.",
      "Forgetting that one of p/q could be the LCA itself.",
    ],
    code: `function lcaAVL(root, p, q) {
  let curr = root;

  while (curr) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left; // both in left subtree
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right; // both in right subtree
    } else {
      // Split point: curr is LCA
      return curr;
    }
  }

  return null;
}`,
    generateSteps(): AVLVisStep[] {
      const n6 = makeNode("n6", 6, 0, 2, { isHead: true })
      const n2 = makeNode("n2", 2, 0, 1)
      const n8 = makeNode("n8", 8, 0, 1)
      const n0 = makeNode("n0", 0, 0, 0)
      const n4 = makeNode("n4", 4, 0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n6, n2, n8, n0, n4], [], [], [], [{ nodeId: "n6", label: "root" }], [{ label: "p", value: "2" }, { label: "q", value: "4" }], "Find LCA(2, 4) in AVL tree", 1))
      steps.push(step([n6, n2, n8, n0, n4], ["n6"], [], [], [{ nodeId: "n6", label: "curr" }], [{ label: "2<6 && 4<6", value: "→ go left" }], "Both 2 and 4 < 6. Go left.", 4))
      steps.push(step([n6, n2, n8, n0, n4], ["n2"], [], [], [{ nodeId: "n2", label: "curr" }], [{ label: "2==2, 4>2", value: "→ split!" }], "p=2 is at curr, q=4 is in right. SPLIT! LCA = 2.", 8))
      steps.push(step([n6, n2, n8, n0, n4], [], [], ["n2"], [], [{ label: "LCA", value: "Node(2)" }], "LCA found = 2. One of p/q can itself be the LCA.", 10))

      return steps
    },
  },

  // ─── 14. Range Query AVL ───────────────────────────────────────────────────
  {
    id: 14,
    slug: "range-query-avl",
    title: "Range Sum Query on AVL Tree",
    difficulty: "Medium",
    companies: ["Google", "Amazon", "Microsoft", "Stripe", "Atlassian"],
    tags: ["AVL Tree", "BST", "Range Query", "DFS"],
    timeComplexity: "O(log n + k)",
    spaceComplexity: "O(log n)",
    description:
      "Given an AVL tree and a range [low, high], return the sum of all node values within the range. Utilize the BST property to skip entire subtrees, achieving better than O(n) performance.",
    examples: [
      { input: "root = [10,5,15,3,7,null,18], low=7, high=15", output: "32", explanation: "Nodes 7, 10, 15 are in range. Sum = 32." },
    ],
    constraints: ["1 <= n <= 2*10^4", "1 <= Node.val <= 10^5", "1 <= low <= high <= 10^5"],
    hints: [
      "If curr.val < low, entire left subtree is out — only go right.",
      "If curr.val > high, entire right subtree is out — only go left.",
      "Otherwise add curr.val and recurse both sides.",
    ],
    approaches: [
      {
        name: "Pruned DFS",
        description: "Skip subtrees outside range using BST property. O(log n + k) where k = nodes in range.",
        complexity: "O(log n + k)",
        space: "O(log n)",
      },
    ],
    pitfalls: [
      "Visiting all nodes (O(n)) instead of pruning.",
      "Including nodes at exactly low and high boundaries (they should be included).",
    ],
    code: `function rangeSumAVL(root, low, high) {
  if (!root) return 0;

  // Prune left subtree if curr <= low
  if (root.val < low) {
    return rangeSumAVL(root.right, low, high);
  }

  // Prune right subtree if curr >= high
  if (root.val > high) {
    return rangeSumAVL(root.left, low, high);
  }

  // curr is in range: add and recurse both
  return root.val
       + rangeSumAVL(root.left,  low, high)
       + rangeSumAVL(root.right, low, high);
}`,
    generateSteps(): AVLVisStep[] {
      const n10 = makeNode("n10", 10, 1, 2, { isHead: true })
      const n5  = makeNode("n5",  5,  0, 1)
      const n15 = makeNode("n15", 15, 1, 1)
      const n3  = makeNode("n3",  3,  0, 0)
      const n7  = makeNode("n7",  7,  0, 0)
      const steps: AVLVisStep[] = []

      steps.push(step([n10, n5, n15, n3, n7], [], [], [], [{ nodeId: "n10", label: "root" }], [{ label: "low", value: "7" }, { label: "high", value: "15" }, { label: "sum", value: "0" }], "Range sum [7,15]. Prune subtrees outside range.", 1))
      steps.push(step([n10, n5, n15, n3, n7], ["n10"], [], [], [{ nodeId: "n10", label: "in range" }], [{ label: "7≤10≤15", value: "→ add 10" }, { label: "sum", value: "10" }], "10 in [7,15]. Add 10. Recurse both sides.", 11))
      steps.push(step([n10, n5, n15, n3, n7], ["n5"], [], [], [{ nodeId: "n5", label: "curr" }], [{ label: "5 < 7", value: "→ prune left" }], "5 < low(7). Prune left subtree of 5. Go right only.", 4))
      steps.push(step([n10, n5, n15, n3, n7], ["n7"], [], [], [{ nodeId: "n7", label: "in range" }], [{ label: "7≤7≤15", value: "→ add 7" }, { label: "sum", value: "17" }], "7 in [7,15]. Add 7. Leaf.", 11))
      steps.push(step([n10, n5, n15, n3, n7], ["n15"], [], [], [{ nodeId: "n15", label: "in range" }], [{ label: "7≤15≤15", value: "→ add 15" }, { label: "sum", value: "32" }], "15 in [7,15]. Add 15. Right child null.", 11))
      steps.push(step([n10, n5, n15, n3, n7], [], [], ["n7", "n10", "n15"], [], [{ label: "Range Sum", value: "32" }, { label: "Nodes visited", value: "4 of 5" }], "Range sum = 32. Pruned node 3. O(log n + k).", 15))

      return steps
    },
  },

  // ─── 15. Merge Two AVL Trees ───────────────────────────────────────────────
  {
    id: 15,
    slug: "merge-two-avl-trees",
    title: "Merge Two AVL Trees",
    difficulty: "Hard",
    companies: ["Google", "Meta", "Amazon", "Microsoft", "GoldmanSachs"],
    tags: ["AVL Tree", "Inorder", "Merge", "Sorting", "Divide & Conquer"],
    timeComplexity: "O(m + n)",
    spaceComplexity: "O(m + n)",
    description:
      "Given the roots of two AVL trees with m and n nodes respectively, merge them into a single valid AVL tree. The resulting tree should contain all elements from both trees in sorted order.",
    examples: [
      { input: "root1 = [2,1,4], root2 = [1,0,3]", output: "[2,1,3,0,null,null,4]", explanation: "Inorder1=[1,2,4], Inorder2=[0,1,3]. Merge=[0,1,1,2,3,4]. Build balanced AVL." },
    ],
    constraints: ["0 <= m, n <= 5000", "All values are unique across both trees"],
    hints: [
      "Step 1: Inorder traverse both trees to get two sorted arrays.",
      "Step 2: Merge the two sorted arrays (like merge sort).",
      "Step 3: Build AVL from sorted merged array using mid-point technique.",
    ],
    approaches: [
      {
        name: "Inorder + Merge + Build",
        description: "3 step: extract inorder arrays O(m+n), merge sorted arrays O(m+n), build balanced tree O(m+n).",
        complexity: "O(m + n)",
        space: "O(m + n)",
      },
    ],
    pitfalls: [
      "Trying to insert one tree into another: O(n log(m+n)), not optimal.",
      "Forgetting duplicates handling (same value in both trees).",
    ],
    code: `function mergeTwoAVL(root1, root2) {
  // Step 1: Get sorted inorder arrays
  function inorder(node, arr) {
    if (!node) return;
    inorder(node.left, arr);
    arr.push(node.val);
    inorder(node.right, arr);
  }

  const arr1 = [], arr2 = [];
  inorder(root1, arr1);
  inorder(root2, arr2);

  // Step 2: Merge sorted arrays
  function mergeSorted(a, b) {
    const res = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] <= b[j]) res.push(a[i++]);
      else res.push(b[j++]);
    }
    while (i < a.length) res.push(a[i++]);
    while (j < b.length) res.push(b[j++]);
    return res;
  }

  const merged = mergeSorted(arr1, arr2);

  // Step 3: Build AVL from sorted array
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new AVLNode(merged[mid]);
    node.left  = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }

  return build(0, merged.length - 1);
}`,
    generateSteps(): AVLVisStep[] {
      const steps: AVLVisStep[] = []
      const t1_2 = makeNode("t1_2", 2, 0, 1, { isHead: true, label: "Tree1 root" })
      const t1_1 = makeNode("t1_1", 1, 0, 0)
      const t1_4 = makeNode("t1_4", 4, 0, 0)
      const t2_1 = makeNode("t2_1", 1, 0, 1, { isHead: true, label: "Tree2 root" })
      const t2_0 = makeNode("t2_0", 0, 0, 0)
      const t2_3 = makeNode("t2_3", 3, 0, 0)

      steps.push(step([t1_2, t1_1, t1_4], [], [], [], [{ nodeId: "t1_2", label: "root1" }], [], "Step 1a: Inorder traverse Tree1 = [1,2,4]", 3))
      steps.push(step([t2_1, t2_0, t2_3], [], [], [], [{ nodeId: "t2_1", label: "root2" }], [], "Step 1b: Inorder traverse Tree2 = [0,1,3]", 3))
      steps.push(step([], [], [], [], [], [{ label: "arr1", value: "[1,2,4]" }, { label: "arr2", value: "[0,1,3]" }, { label: "merged", value: "[0,1,1,2,3,4]" }], "Step 2: Merge sorted arrays → [0,1,1,2,3,4]", 16))

      const mr1 = makeNode("mr1", 1, 0, 2, { isHead: true, label: "mid=2" })
      const mr0 = makeNode("mr0", 0, 0, 0)
      const mr2 = makeNode("mr2", 2, 0, 1)
      const mr3 = makeNode("mr3", 3, 0, 0)
      const mr4 = makeNode("mr4", 4, 0, 0)
      steps.push(step([mr1, mr0, mr2, mr3, mr4], ["mr1"], [], [], [{ nodeId: "mr1", label: "root" }], [{ label: "mid", value: "2 → val=1" }], "Step 3: Build AVL from merged. Root = merged[2] = 1", 29))
      steps.push(step([mr1, mr0, mr2, mr3, mr4], [], [], ["mr1", "mr0", "mr2", "mr3", "mr4"], [], [{ label: "Merged AVL", value: "5 nodes balanced" }], "Merged AVL tree built. Height = 2 = O(log 5). ✓", 29))

      return steps
    },
  },
]