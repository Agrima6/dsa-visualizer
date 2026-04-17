// components/visualizer/queue/queue-problems-data.ts
// Place at: components/visualizer/queue/queue-problems-data.ts

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

// One frame of the queue visualization
export interface QueueVisStep {
  // The queue — index 0 = FRONT, last = REAR
  queue: { value: string | number; label?: string }[]
  // Indices into `queue` that are highlighted (active/comparing)
  highlighted: number[]
  // Indices currently being dequeued (flash before removal)
  dequeued: number[]
  // Side-panel key/value pairs (BFS level, visited nodes, result, etc.)
  auxiliary: { label: string; value: string | number }[]
  message: string
  codeLine: number
}

export interface QueueProblem {
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
  generateSteps: () => QueueVisStep[]
}

// ─── helper ──────────────────────────────────────────────────────
function frame(
  queue: { value: string | number; label?: string }[],
  highlighted: number[],
  message: string,
  codeLine: number,
  auxiliary: { label: string; value: string | number }[] = [],
  dequeued: number[] = []
): QueueVisStep {
  return { queue: queue.map(q => ({ ...q })), highlighted, dequeued, auxiliary, message, codeLine }
}

// ════════════════════════════════════════════════════════════════
// 1. Implement Stack Using Queues  (#47)
// ════════════════════════════════════════════════════════════════
const implStackUsingQueues: QueueProblem = {
  id: 47,
  slug: "implement-stack-using-queues",
  title: "Implement Stack Using Queues",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Microsoft"],
  tags: ["Queue", "Stack", "Design"],
  timeComplexity: "O(n) push, O(1) pop",
  spaceComplexity: "O(n)",
  description:
    "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty). Follow-up: Can you implement the stack using only one queue?",
  examples: [
    {
      input: `MyStack()
push(1), push(2)
top()  → 2
pop()  → 2
empty() → false`,
      output: "[2, 2, false]",
    },
  ],
  constraints: ["1 ≤ x ≤ 9", "At most 100 calls", "pop/top only called on non-empty stack"],
  hints: [
    "On push: enqueue into queue, then rotate all n-1 existing elements to the back.",
    "After rotation, the newest element sits at the FRONT — simulating a stack's top.",
    "pop and top become O(1) dequeue/peek since the front is always the most recent.",
  ],
  pitfalls: [
    "Forgetting to rotate after pushing — the queue front would be the oldest element, not the newest.",
    "Using two queues unnecessarily — one queue with rotation is cleaner.",
    "Rotating n times instead of n-1 times (rotating the new element back to the back).",
  ],
  approaches: [
    {
      name: "One Queue with rotation",
      complexity: "O(n) push, O(1) pop/top",
      space: "O(n)",
      description: "Enqueue new element, then rotate all previous elements to behind it. Front is always the top.",
    },
    {
      name: "Two Queues",
      complexity: "O(n) push, O(1) pop",
      space: "O(n)",
      description: "Use q1 as main, q2 as temp. On push, move all of q1 to q2, enqueue new into q1, move q2 back.",
    },
  ],
  code: `class MyStack {
  constructor() {
    this.queue = [];
  }

  push(x) {
    this.queue.push(x);
    // rotate: move all elements before x to the back
    let rotations = this.queue.length - 1;
    while (rotations--) {
      this.queue.push(this.queue.shift());
    }
  }

  pop() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  empty() {
    return this.queue.length === 0;
  }
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []
    let q: number[] = []

    const snap = (hl: number[], msg: string, line: number, aux: { label: string; value: string | number }[] = []) => {
      steps.push(frame(q.map((v, i) => ({ value: v, label: i === 0 ? "FRONT (top)" : undefined })), hl, msg, line, aux))
    }

    snap([], "MyStack created. queue=[]", 2)

    // push(1)
    q.push(1)
    snap([q.length - 1], "push(1): enqueue 1. queue=[1]. No rotation needed.", 7)

    // push(2)
    q.push(2)
    snap([q.length - 1], "push(2): enqueue 2. queue=[1,2]. Rotate 1 element.", 7)
    const front = q.shift()!; q.push(front)
    snap([0], "Rotated: moved 1 to back. queue=[2,1]. Front=2 (top) ✓", 10)

    // top
    snap([0], `top() → ${q[0]} ✓ (just peek front)`, 16)

    // pop
    const popped = q[0]
    steps.push(frame(q.map((v, i) => ({ value: v })), [], `pop() → ${popped}. Dequeue front.`, 13, [{ label: "popped", value: popped }], [0]))
    q.shift()
    snap([], `queue=[${q.join(",")}]. empty()=${q.length === 0}`, 20, [{ label: "empty", value: String(q.length === 0) }])

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Binary Tree Level Order Traversal  (#99)
// ════════════════════════════════════════════════════════════════
const binaryTreeLevelOrder: QueueProblem = {
  id: 99,
  slug: "binary-tree-level-order-traversal",
  title: "Binary Tree Level Order Traversal",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn"],
  tags: ["Queue", "BFS", "Binary Tree"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    { input: "root = [1]", output: "[[1]]" },
    { input: "root = []", output: "[]" },
  ],
  constraints: ["The number of nodes in the tree is in the range [0, 2000]", "-1000 ≤ Node.val ≤ 1000"],
  hints: [
    "Use a queue (BFS). Start by enqueueing the root.",
    "At each level, record the current queue size — that many nodes belong to this level.",
    "Dequeue each node, add its value to the current level, enqueue its children.",
  ],
  pitfalls: [
    "Not recording the queue size before the inner loop — children enqueued during the loop will mix into the current level.",
    "Forgetting null checks before enqueuing children.",
    "Using DFS (recursion with depth) — technically works but less intuitive than BFS for level order.",
  ],
  approaches: [
    {
      name: "BFS with Queue",
      complexity: "O(n)",
      space: "O(n)",
      description: "Enqueue root. Per level: snapshot queue size, dequeue that many nodes, enqueue their children. Collect level arrays.",
    },
  ],
  code: `function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue  = [root];

  while (queue.length) {
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
    // Tree: 3 → [9, 20], 20 → [15, 7]
    const steps: QueueVisStep[] = []
    let q: { value: number; label?: string }[] = []

    steps.push(frame([], [], "Enqueue root (3). Start BFS.", 4))
    q = [{ value: 3, label: "root" }]
    steps.push(frame(q, [0], "queue=[3]. Begin level 0.", 6))

    // Level 0: process 3
    steps.push(frame(q, [0], "levelSize=1. Dequeue 3 → level=[3].", 9, [{ label: "level 0", value: "[3]" }]))
    steps.push(frame(q, [], "Enqueue children: 9 (left), 20 (right).", 12, [{ label: "level 0", value: "[3]" }], [0]))
    q = [{ value: 9, label: "left" }, { value: 20, label: "right" }]
    steps.push(frame(q, [0, 1], "queue=[9,20]. Level 0 done → result=[[3]].", 16, [{ label: "result so far", value: "[[3]]" }]))

    // Level 1: process 9 and 20
    steps.push(frame(q, [0], "levelSize=2. Dequeue 9 → level=[9]. No children.", 9, [{ label: "level 1 so far", value: "[9]" }]))
    steps.push(frame(q, [], "Dequeue 9 done.", 11, [{ label: "level 1 so far", value: "[9]" }], [0]))
    q = [{ value: 20, label: "right" }]
    steps.push(frame(q, [0], "Dequeue 20 → level=[9,20]. Enqueue 15, 7.", 9, [{ label: "level 1 so far", value: "[9,20]" }]))
    steps.push(frame(q, [], "Enqueue 15, 7.", 12, [{ label: "level 1", value: "[9,20]" }], [0]))
    q = [{ value: 15, label: "left" }, { value: 7, label: "right" }]
    steps.push(frame(q, [0, 1], "queue=[15,7]. Level 1 done → result=[[3],[9,20]].", 16, [{ label: "result so far", value: "[[3],[9,20]]" }]))

    // Level 2
    steps.push(frame(q, [0], "levelSize=2. Dequeue 15 → level=[15]. No children.", 9, [{ label: "level 2 so far", value: "[15]" }]))
    steps.push(frame(q, [], "Dequeue 15 done.", 11, [{ label: "level 2 so far", value: "[15]" }], [0]))
    q = [{ value: 7, label: "right" }]
    steps.push(frame(q, [0], "Dequeue 7 → level=[15,7]. No children.", 9, [{ label: "level 2 so far", value: "[15,7]" }]))
    steps.push(frame([], [], "queue empty. Level 2 done. Result: [[3],[9,20],[15,7]] ✓", 16, [{ label: "result", value: "[[3],[9,20],[15,7]]" }], [0]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Number of Islands  (#145)
// ════════════════════════════════════════════════════════════════
const numberOfIslands: QueueProblem = {
  id: 145,
  slug: "number-of-islands",
  title: "Number of Islands",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "LinkedIn"],
  tags: ["Queue", "BFS", "DFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(min(m,n))",
  description:
    "Given an m×n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
  examples: [
    {
      input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
      output: "1",
    },
    {
      input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
      output: "3",
    },
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
  hints: [
    "Iterate every cell. When you find a '1', increment island count and BFS/DFS to mark the whole island as visited.",
    "BFS: enqueue the cell, mark visited (set to '0' or use a visited set), enqueue all valid '1' neighbors.",
    "The queue naturally expands the island level by level.",
  ],
  pitfalls: [
    "Not marking cells as visited before or as you enqueue them — causes duplicate processing.",
    "Checking bounds after dequeuing instead of before enqueuing — can add invalid coordinates.",
    "Forgetting diagonal connections are NOT counted (only up/down/left/right).",
  ],
  approaches: [
    {
      name: "BFS with Queue",
      complexity: "O(m×n)",
      space: "O(min(m,n))",
      description: "For each unvisited land cell, BFS outward to mark the whole island as visited, increment count.",
    },
    {
      name: "DFS (recursive)",
      complexity: "O(m×n)",
      space: "O(m×n)",
      description: "Same idea but with recursion. Simpler code but risks stack overflow on large inputs.",
    },
    {
      name: "Union-Find",
      complexity: "O(m×n · α)",
      space: "O(m×n)",
      description: "Connect adjacent land cells with union. Number of distinct roots = number of islands.",
    },
  ],
  code: `function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  function bfs(r, c) {
    const queue = [[r, c]];
    grid[r][c] = '0';   // mark visited

    while (queue.length) {
      const [row, col] = queue.shift();
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;

        if (nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols &&
            grid[nr][nc] === '1') {
          queue.push([nr, nc]);
          grid[nr][nc] = '0';  // mark
        }
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        bfs(r, c);
      }
    }
  }

  return islands;
}`,
  generateSteps() {
    // Simple 3×3 grid: 2 islands
    const steps: QueueVisStep[] = []
    let q: { value: string | number; label?: string }[] = []

    steps.push(frame([], [], `grid has land ('1') cells. Scan for unvisited '1'.`, 1))

    // Island 1 — cell (0,0)
    steps.push(frame([], [], `Found '1' at (0,0) → islands=1. Start BFS.`, 4, [{ label: "islands", value: 1 }]))
    q = [{ value: "(0,0)", label: "start" }]
    steps.push(frame(q, [0], `Enqueue (0,0), mark visited.`, 8, [{ label: "islands", value: 1 }]))
    steps.push(frame(q, [0], `Dequeue (0,0). Check neighbors: (0,1)='1', (1,0)='1'.`, 9, [{ label: "islands", value: 1 }], [0]))
    q = [{ value: "(0,1)" }, { value: "(1,0)" }]
    steps.push(frame(q, [0, 1], `Enqueue (0,1) and (1,0), mark both visited.`, 17, [{ label: "islands", value: 1 }]))
    steps.push(frame(q, [0], `Dequeue (0,1). Neighbors already visited or water.`, 9, [{ label: "islands", value: 1 }], [0]))
    q = [{ value: "(1,0)" }]
    steps.push(frame(q, [0], `Dequeue (1,0). Neighbors already visited or water.`, 9, [{ label: "islands", value: 1 }], [0]))
    q = []
    steps.push(frame([], [], `BFS done. Island 1 fully marked.`, 6, [{ label: "islands", value: 1 }]))

    // Island 2
    steps.push(frame([], [], `Scan continues… Found '1' at (2,2) → islands=2. Start BFS.`, 25, [{ label: "islands", value: 2 }]))
    q = [{ value: "(2,2)", label: "start" }]
    steps.push(frame(q, [0], `Enqueue (2,2), mark visited.`, 8, [{ label: "islands", value: 2 }]))
    steps.push(frame(q, [0], `Dequeue (2,2). No '1' neighbors.`, 9, [{ label: "islands", value: 2 }], [0]))
    steps.push(frame([], [], `BFS done. island 2 marked. No more '1' cells.`, 6, [{ label: "islands", value: 2 }]))
    steps.push(frame([], [], `Return 2 islands ✓`, 29, [{ label: "result", value: 2 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Rotting Oranges  (#149)
// ════════════════════════════════════════════════════════════════
const rottingOranges: QueueProblem = {
  id: 149,
  slug: "rotting-oranges",
  title: "Rotting Oranges",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft"],
  tags: ["Queue", "BFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  description:
    "You are given an m×n grid where each cell is 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if impossible.",
  examples: [
    { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
    { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1", explanation: "Bottom-left orange is isolated." },
    { input: "grid = [[0,2]]", output: "0" },
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 10", "grid[i][j] ∈ {0,1,2}"],
  hints: [
    "Multi-source BFS: start by enqueueing ALL rotten oranges simultaneously.",
    "Process level by level — each level = 1 minute.",
    "Count fresh oranges upfront; decrement as they rot. If fresh > 0 at the end → return -1.",
  ],
  pitfalls: [
    "Single-source BFS (starting from one rotten orange) — multiple rotten sources spread simultaneously.",
    "Not counting fresh oranges before BFS — can't detect the impossible case easily.",
    "Incrementing time even when no orange rotted in that minute.",
  ],
  approaches: [
    {
      name: "Multi-source BFS",
      complexity: "O(m×n)",
      space: "O(m×n)",
      description: "Enqueue all initial rotten oranges. BFS outward; each level = 1 minute. Track fresh count.",
    },
  ],
  code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  let fresh = 0, minutes = 0;

  // Collect all initial rotten + count fresh
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      if (grid[r][c] === 1) fresh++;
    }
  }

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length && fresh) {
    const size = queue.length;   // current "wave"

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols &&
            grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return fresh === 0 ? minutes : -1;
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], "grid=[[2,1,1],[1,1,0],[0,1,1]]. Count fresh=6, enqueue all rotten.", 1))
    let q: { value: string | number; label?: string }[] = [{ value: "(0,0)", label: "rotten" }]
    steps.push(frame(q, [0], "queue=[(0,0)]. fresh=6, minutes=0.", 5, [{ label: "fresh", value: 6 }, { label: "minutes", value: 0 }]))

    // Minute 1
    steps.push(frame(q, [0], "Minute 1: wave size=1. Process (0,0).", 18, [{ label: "fresh", value: 6 }, { label: "minutes", value: 0 }]))
    steps.push(frame(q, [], "Dequeue (0,0). Rot neighbors (0,1) and (1,0). fresh=4.", 22, [{ label: "fresh", value: 4 }, { label: "minutes", value: 0 }], [0]))
    q = [{ value: "(0,1)", label: "newly rotten" }, { value: "(1,0)", label: "newly rotten" }]
    steps.push(frame(q, [0, 1], "Enqueue (0,1),(1,0). minutes++ → 1.", 27, [{ label: "fresh", value: 4 }, { label: "minutes", value: 1 }]))

    // Minute 2
    steps.push(frame(q, [0, 1], "Minute 2: wave size=2.", 18, [{ label: "fresh", value: 4 }, { label: "minutes", value: 1 }]))
    steps.push(frame(q, [], "Process (0,1): rot (0,2). Process (1,0): rot (1,1). fresh=2.", 22, [{ label: "fresh", value: 2 }, { label: "minutes", value: 1 }], [0, 1]))
    q = [{ value: "(0,2)", label: "newly rotten" }, { value: "(1,1)", label: "newly rotten" }]
    steps.push(frame(q, [0, 1], "Enqueue (0,2),(1,1). minutes++ → 2.", 27, [{ label: "fresh", value: 2 }, { label: "minutes", value: 2 }]))

    // Minute 3
    steps.push(frame(q, [], "Process (0,2),(1,1): rot (2,1). fresh=1. minutes→3.", 22, [{ label: "fresh", value: 1 }, { label: "minutes", value: 3 }], [0, 1]))
    q = [{ value: "(2,1)", label: "newly rotten" }]
    steps.push(frame(q, [0], "Enqueue (2,1). minutes++ → 3.", 27, [{ label: "fresh", value: 1 }, { label: "minutes", value: 3 }]))

    // Minute 4
    steps.push(frame(q, [], "Process (2,1): rot (2,2). fresh=0. minutes→4.", 22, [{ label: "fresh", value: 0 }, { label: "minutes", value: 4 }], [0]))
    steps.push(frame([], [], "fresh=0 → return minutes=4 ✓", 31, [{ label: "result", value: 4 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Walls And Gates  (#148)
// ════════════════════════════════════════════════════════════════
const wallsAndGates: QueueProblem = {
  id: 148,
  slug: "walls-and-gates",
  title: "Walls And Gates",
  difficulty: "Medium",
  companies: ["Google", "Meta", "Amazon", "Microsoft"],
  tags: ["Queue", "BFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  description:
    "You are given an m×n grid filled with three possible values: -1 (wall), 0 (gate), or INF (2³¹-1, empty room). Fill each empty room with the distance to its nearest gate. If impossible, keep INF.",
  examples: [
    {
      input: `grid = [
  [INF,-1,0,INF],
  [INF,INF,INF,-1],
  [INF,-1,INF,-1],
  [0,-1,INF,INF]
]`,
      output: `[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]`,
    },
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 250", "grid[i][j] ∈ {-1, 0, 2³¹-1}"],
  hints: [
    "Multi-source BFS from ALL gates simultaneously — not single-source per gate (that's O(m²n²)).",
    "Enqueue all gate cells (value=0) upfront.",
    "BFS outward: when you visit a room, its distance = parent distance + 1.",
  ],
  pitfalls: [
    "Running BFS separately from each gate — O(gates × m × n) instead of O(m×n).",
    "Not skipping walls (-1) and already-visited cells (value < INF).",
    "Overwriting cells that already got a shorter distance from another gate.",
  ],
  approaches: [
    {
      name: "Multi-source BFS",
      complexity: "O(m×n)",
      space: "O(m×n)",
      description: "Enqueue all gates at once. BFS expands outward — each level adds 1 to distance. First visit = shortest path.",
    },
  ],
  code: `function wallsAndGates(rooms) {
  const INF = 2147483647;
  const rows = rooms.length, cols = rooms[0].length;
  const queue = [];

  // Enqueue all gates
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (rooms[r][c] === 0) queue.push([r, c]);

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && rooms[nr][nc] === INF) {
        rooms[nr][nc] = rooms[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], "Find all gates (value=0) and enqueue them.", 1))
    let q: { value: string | number; label?: string }[] = [{ value: "(0,2)", label: "gate" }, { value: "(3,0)", label: "gate" }]
    steps.push(frame(q, [0, 1], "Enqueued 2 gates: (0,2) and (3,0). BFS starts.", 8, [{ label: "distance", value: 0 }]))

    steps.push(frame(q, [0], "Dequeue (0,2) [gate]. Spread to neighbors with dist=1.", 13, [{ label: "distance", value: 1 }]))
    steps.push(frame(q, [], "Rot (0,3)=1, (1,2)=1 from gate at (0,2).", 19, [{ label: "distance", value: 1 }], [0]))
    q = [{ value: "(3,0)", label: "gate" }, { value: "(0,3)", label: "dist=1" }, { value: "(1,2)", label: "dist=1" }]
    steps.push(frame(q, [1, 2], "queue grows. Continue BFS wave.", 20, [{ label: "wave", value: "dist=1" }]))

    steps.push(frame(q, [0], "Dequeue (3,0) [gate]. Spread to (2,0)=1.", 13, [{ label: "distance", value: 1 }]))
    steps.push(frame(q, [], "Set (2,0)=1.", 19, [{ label: "distance", value: 1 }], [0]))
    q = [{ value: "(0,3)", label: "dist=1" }, { value: "(1,2)", label: "dist=1" }, { value: "(2,0)", label: "dist=1" }]
    steps.push(frame(q, [0, 1, 2], "Process dist=1 nodes. Expand to dist=2...", 13, [{ label: "wave", value: "dist=2" }]))

    steps.push(frame([], [], "BFS continues until all reachable INF cells are filled. ✓", 23, [{ label: "status", value: "complete" }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Open The Lock  (#152)
// ════════════════════════════════════════════════════════════════
const openTheLock: QueueProblem = {
  id: 152,
  slug: "open-the-lock",
  title: "Open The Lock",
  difficulty: "Medium",
  companies: ["Google", "Amazon"],
  tags: ["Queue", "BFS", "Hash Set"],
  timeComplexity: "O(10⁴)",
  spaceComplexity: "O(10⁴)",
  description:
    'You have a lock with 4 circular dials (0-9). Starting at "0000", find the minimum number of turns to reach the target. You cannot pass through any of the deadend combinations. Return -1 if impossible.',
  examples: [
    { input: 'deadends=["0201","0101","0102","1212","2002"], target="0202"', output: "6" },
    { input: 'deadends=["8888"], target="0009"', output: "1" },
    { input: 'deadends=["8887","8889","8878","8898","8788","8988","7888","9888"], target="8888"', output: "-1" },
  ],
  constraints: ["1 ≤ deadends.length ≤ 500", "target is a 4-digit string of digits"],
  hints: [
    "BFS on the state space — each state is a 4-character string.",
    "From each state, there are 8 neighbors (each dial ±1, wrapping 0↔9).",
    "Use a visited set to avoid revisiting states. Initialize with deadends.",
    "If start '0000' is in deadends, return -1 immediately.",
  ],
  pitfalls: [
    "Not handling wrap-around: 0 - 1 = 9, 9 + 1 = 0.",
    "Adding deadends to visited BEFORE starting BFS to block them properly.",
    "Not checking if '0000' itself is a deadend.",
  ],
  approaches: [
    {
      name: "BFS",
      complexity: "O(10⁴ × 4 × 2) = O(10⁴)",
      space: "O(10⁴)",
      description: "Standard BFS from '0000'. Each level = 1 turn. State space is bounded at 10,000 combinations.",
    },
    {
      name: "Bidirectional BFS",
      complexity: "O(10²)",
      space: "O(10²)",
      description: "BFS from both '0000' and target simultaneously. Meets in the middle — much faster in practice.",
    },
  ],
  code: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has("0000")) return -1;

  const queue   = ["0000"];
  const visited = new Set(["0000"]);
  let turns = 0;

  while (queue.length) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const curr = queue.shift();
      if (curr === target) return turns;

      for (let d = 0; d < 4; d++) {
        for (const delta of [1, -1]) {
          const digit = (Number(curr[d]) + delta + 10) % 10;
          const next  = curr.slice(0,d) + digit + curr.slice(d+1);

          if (!visited.has(next) && !dead.has(next)) {
            visited.add(next);
            queue.push(next);
          }
        }
      }
    }
    turns++;
  }

  return -1;
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], `Start at "0000". Target="0009". BFS each combination.`, 1))
    let q: { value: string | number; label?: string }[] = [{ value: '"0000"', label: "start" }]
    steps.push(frame(q, [0], `queue=["0000"]. turns=0.`, 6, [{ label: "turns", value: 0 }]))

    steps.push(frame(q, [0], `turns=0: Process "0000". Check if target. Expand 8 neighbors.`, 10, [{ label: "turns", value: 0 }]))
    steps.push(frame(q, [], `Dequeue "0000". Generate: "1000","9000","0100","0010","0001","0900","0090","0009"`, 12, [{ label: "turns", value: 0 }], [0]))
    q = [{ value: '"0001"', label: "dial4+1" }, { value: '"0009"', label: "dial4-1" }, { value: '"..."' }]
    steps.push(frame(q, [1], `Enqueue neighbors. "0009" is in the queue! turns++ → 1.`, 19, [{ label: "turns", value: 1 }]))

    steps.push(frame(q, [0], `turns=1: Process "0001" — not target.`, 10, [{ label: "turns", value: 1 }]))
    steps.push(frame(q, [0], `Continue... Process "0009" — matches target!`, 10, [{ label: "turns", value: 1 }]))
    steps.push(frame([], [], `Return turns=1 ✓`, 12, [{ label: "result", value: 1 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Course Schedule  (#153)
// ════════════════════════════════════════════════════════════════
const courseSchedule: QueueProblem = {
  id: 153,
  slug: "course-schedule",
  title: "Course Schedule",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber"],
  tags: ["Queue", "BFS", "Topological Sort", "Graph"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  description:
    "There are numCourses courses labeled 0 to numCourses-1. You are given an array prerequisites where prerequisites[i] = [a, b] means you must take course b before course a. Return true if you can finish all courses (no cycle exists in the dependency graph).",
  examples: [
    { input: "numCourses=2, prerequisites=[[1,0]]", output: "true", explanation: "Take 0, then 1." },
    { input: "numCourses=2, prerequisites=[[1,0],[0,1]]", output: "false", explanation: "Cycle: 0→1→0." },
  ],
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"],
  hints: [
    "Model as directed graph. Use Kahn's algorithm (BFS topological sort).",
    "Build in-degree array. Enqueue all nodes with in-degree 0 (no prerequisites).",
    "When you 'take' a course (dequeue), decrement in-degree of its dependents. If any reach 0, enqueue them.",
    "If you processed all numCourses nodes → no cycle. Otherwise → cycle exists.",
  ],
  pitfalls: [
    "Using DFS instead of BFS — both work but BFS (Kahn's) is more intuitive with a queue.",
    "Not initializing the in-degree array correctly for all nodes.",
    "Confusing the edge direction: prerequisite [a,b] means b→a (b must come before a).",
  ],
  approaches: [
    {
      name: "Kahn's Algorithm (BFS Topological Sort)",
      complexity: "O(V+E)",
      space: "O(V+E)",
      description: "Build in-degree map. BFS from zero-in-degree nodes. If all nodes processed, no cycle.",
    },
    {
      name: "DFS Cycle Detection",
      complexity: "O(V+E)",
      space: "O(V)",
      description: "DFS with 3-color marking (white/gray/black). Gray node revisited = cycle found.",
    },
  ],
  code: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({length: numCourses}, () => []);

  for (const [a, b] of prerequisites) {
    adj[b].push(a);   // b must come before a
    inDegree[a]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++)
    if (inDegree[i] === 0) queue.push(i);

  let taken = 0;

  while (queue.length) {
    const course = queue.shift();
    taken++;

    for (const next of adj[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return taken === numCourses;
}`,
  generateSteps() {
    // numCourses=4, prerequisites=[[1,0],[2,1],[3,1]] → no cycle
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], "Build graph: prereqs=[[1,0],[2,1],[3,1]]. Compute in-degrees.", 1))
    steps.push(frame([], [], "inDegree=[0:0, 1:1, 2:1, 3:1]. Course 0 has in-degree 0.", 8, [
      { label: "inDegree", value: "[0,1,1,1]" },
    ]))

    let q: { value: string | number; label?: string }[] = [{ value: "C0", label: "in=0" }]
    steps.push(frame(q, [0], "Enqueue C0 (in-degree=0). taken=0.", 10, [{ label: "taken", value: 0 }]))

    steps.push(frame(q, [0], "Dequeue C0. taken=1. Decrement neighbors.", 14, [{ label: "taken", value: 1 }]))
    steps.push(frame(q, [], "C1 in-degree: 1→0. Enqueue C1.", 18, [{ label: "taken", value: 1 }], [0]))
    q = [{ value: "C1", label: "in=0" }]
    steps.push(frame(q, [0], "Dequeue C1. taken=2. Decrement C2,C3.", 14, [{ label: "taken", value: 2 }]))
    steps.push(frame(q, [], "C2 in=0, C3 in=0. Enqueue both.", 18, [{ label: "taken", value: 2 }], [0]))
    q = [{ value: "C2", label: "in=0" }, { value: "C3", label: "in=0" }]
    steps.push(frame(q, [0, 1], "Dequeue C2 (taken=3), Dequeue C3 (taken=4). No more neighbors.", 14, [{ label: "taken", value: 4 }]))
    steps.push(frame([], [], "taken=4 === numCourses=4 → return true ✓ (No cycle)", 22, [{ label: "result", value: "true" }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Design Circular Queue  (#82)
// ════════════════════════════════════════════════════════════════
const designCircularQueue: QueueProblem = {
  id: 82,
  slug: "design-circular-queue",
  title: "Design Circular Queue",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Microsoft"],
  tags: ["Queue", "Design", "Array"],
  timeComplexity: "O(1) all ops",
  spaceComplexity: "O(k)",
  description:
    "Design your implementation of a circular queue. A circular queue is a linear data structure where operations are performed in a FIFO order and the last position connects to the first to form a circle. Implement MyCircularQueue(k), enQueue(val), deQueue(), Front(), Rear(), isEmpty(), isFull().",
  examples: [
    {
      input: `MyCircularQueue(3)
enQueue(1)→true, enQueue(2)→true, enQueue(3)→true
enQueue(4)→false (full)
Rear()→3, isFull()→true
deQueue()→true
enQueue(4)→true
Rear()→4`,
      output: "[true,true,true,false,3,true,true,true,4]",
    },
  ],
  constraints: ["1 ≤ k ≤ 1000", "0 ≤ val ≤ 1000", "At most 3000 calls"],
  hints: [
    "Use a fixed-size array of length k with head and tail pointers.",
    "Advance pointers with modulo: tail = (tail + 1) % k to wrap around.",
    "Track size (or use a count variable) to distinguish empty from full — both have head===tail otherwise.",
  ],
  pitfalls: [
    "Not using modulo arithmetic for wrap-around.",
    "Confusing full vs empty when both states can have head === tail.",
    "Off-by-one in size check: isFull means size === k, not tail === head.",
  ],
  approaches: [
    {
      name: "Array + Two Pointers",
      complexity: "O(1)",
      space: "O(k)",
      description: "Fixed array, head and tail indices, size counter. Modulo arithmetic for circular wrapping.",
    },
    {
      name: "Linked List",
      complexity: "O(1)",
      space: "O(k)",
      description: "Singly linked list with head/tail. Simpler index management but more memory overhead.",
    },
  ],
  code: `class MyCircularQueue {
  constructor(k) {
    this.data = new Array(k);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(val) {
    if (this.isFull()) return false;
    this.data[this.tail] = val;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return true;
  }

  Front() { return this.isEmpty() ? -1 : this.data[this.head]; }
  Rear()  { return this.isEmpty() ? -1 :
    this.data[(this.tail - 1 + this.capacity) % this.capacity]; }
  isEmpty() { return this.size === 0; }
  isFull()  { return this.size === this.capacity; }
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []
    const cap = 3
    const data = new Array(cap).fill(null)
    let head = 0, tail = 0, size = 0

    const snap = (hl: number[], msg: string, line: number, deq: number[] = []) => {
      const q = data.map((v, i) => ({
        value: v === null ? "—" : v,
        label: i === head && size > 0 ? "HEAD" : i === (tail - 1 + cap) % cap && size > 0 ? "TAIL" : undefined,
      }))
      steps.push(frame(q, hl, msg, line, [
        { label: "head", value: head },
        { label: "tail", value: tail },
        { label: "size", value: size },
      ], deq))
    }

    snap([], "MyCircularQueue(3). Array of size 3, head=tail=0, size=0.", 2)

    // enQueue(1)
    data[tail] = 1; tail = (tail + 1) % cap; size++
    snap([0], "enQueue(1): data[0]=1, tail→1, size=1.", 10)

    // enQueue(2)
    data[tail] = 2; tail = (tail + 1) % cap; size++
    snap([1], "enQueue(2): data[1]=2, tail→2, size=2.", 10)

    // enQueue(3)
    data[tail] = 3; tail = (tail + 1) % cap; size++
    snap([2], "enQueue(3): data[2]=3, tail→0 (wrap!), size=3.", 10)

    snap([], "isFull(): size=3 === capacity=3 → true ✓", 26, [])

    // deQueue
    snap([head], "deQueue(): head=0 → advance head.", 18, [head])
    head = (head + 1) % cap; size--
    snap([], "head→1, size=2. Slot 0 is now reusable.", 19)

    // enQueue(4)
    data[tail] = 4; tail = (tail + 1) % cap; size++
    snap([0], "enQueue(4): reuse slot 0! data[0]=4, tail→1, size=3.", 10)

    snap([2], `Rear(): data[(tail-1+cap)%cap]=data[0]=4 → Rear=4 ✓`, 23)

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Word Ladder  (#162)
// ════════════════════════════════════════════════════════════════
const wordLadder: QueueProblem = {
  id: 162,
  slug: "word-ladder",
  title: "Word Ladder",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "LinkedIn"],
  tags: ["Queue", "BFS", "Hash Set", "String"],
  timeComplexity: "O(m² × n)",
  spaceComplexity: "O(m² × n)",
  description:
    "A transformation sequence from word beginWord to word endWord using dictionary wordList changes one letter at a time, and every intermediate word must exist in wordList. Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
  examples: [
    { input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: "5", explanation: '"hit"→"hot"→"dot"→"dog"→"cog"' },
    { input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log"]', output: "0", explanation: '"cog" not in wordList.' },
  ],
  constraints: ["1 ≤ beginWord.length ≤ 10", "All words have the same length", "1 ≤ wordList.length ≤ 5000"],
  hints: [
    "BFS on word states. Each level = one transformation.",
    "For each word, try replacing each character with 'a'-'z'. If the result is in wordList and unvisited, enqueue it.",
    "Remove words from the set as you visit them (instead of a separate visited set).",
  ],
  pitfalls: [
    "Using edit distance check for neighbors — O(26×m) per word is fine; comparing all pairs is O(n²).",
    "Not removing the endWord from wordList check if it's not reachable.",
    "Off-by-one in return value: count sequences (words), not edges (transformations).",
  ],
  approaches: [
    {
      name: "BFS",
      complexity: "O(m²×n)",
      space: "O(m²×n)",
      description: "BFS level by level from beginWord. Each level = 1 transformation. Return level+1 when endWord is reached.",
    },
    {
      name: "Bidirectional BFS",
      complexity: "O(m²×√n)",
      space: "O(m²×√n)",
      description: "BFS from both ends simultaneously. Much faster when solution depth is large.",
    },
  ],
  code: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue = [[beginWord, 1]];

  while (queue.length) {
    const [word, length] = queue.shift();

    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0,i)
          + String.fromCharCode(c)
          + word.slice(i+1);

        if (next === endWord) return length + 1;

        if (wordSet.has(next)) {
          wordSet.delete(next);   // mark visited
          queue.push([next, length + 1]);
        }
      }
    }
  }

  return 0;
}`,
  generateSteps() {
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], `beginWord="hit" endWord="cog". BFS shortest path.`, 1))
    let q: { value: string | number; label?: string }[] = [{ value: '"hit"', label: "len=1" }]
    steps.push(frame(q, [0], `Enqueue "hit" with length=1.`, 4, [{ label: "length", value: 1 }]))

    steps.push(frame(q, [0], `Dequeue "hit". Try all 1-letter changes.`, 6, [{ label: "length", value: 1 }]))
    steps.push(frame(q, [], `"hot" is in wordSet! Enqueue ["hot", 2].`, 15, [{ label: "length", value: 2 }], [0]))
    q = [{ value: '"hot"', label: "len=2" }]
    steps.push(frame(q, [0], `Level 2: Dequeue "hot". Try changes.`, 6, [{ label: "length", value: 2 }]))
    steps.push(frame(q, [], `"dot","lot" found. Enqueue both with len=3.`, 15, [{ label: "length", value: 3 }], [0]))
    q = [{ value: '"dot"', label: "len=3" }, { value: '"lot"', label: "len=3" }]
    steps.push(frame(q, [0, 1], `Level 3: Process "dot" → "dog". Process "lot" → "log".`, 6, [{ label: "length", value: 3 }]))
    steps.push(frame(q, [], `Enqueue "dog","log" with len=4.`, 15, [{ label: "length", value: 4 }], [0, 1]))
    q = [{ value: '"dog"', label: "len=4" }, { value: '"log"', label: "len=4" }]
    steps.push(frame(q, [0], `Level 4: Process "dog" → try "cog". "cog"===endWord!`, 13, [{ label: "length", value: 4 }]))
    steps.push(frame([], [], `Return length+1 = 5 ✓ ("hit"→"hot"→"dot"→"dog"→"cog")`, 13, [{ label: "result", value: 5 }]))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Sliding Window Maximum  (#44)
// ════════════════════════════════════════════════════════════════
const slidingWindowMax: QueueProblem = {
  id: 44,
  slug: "sliding-window-maximum",
  title: "Sliding Window Maximum",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple"],
  tags: ["Queue", "Monotonic Deque", "Sliding Window"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(k)",
  description:
    "You are given an array of integers nums and an integer k. There is a sliding window of size k moving from left to right. Return an array of the maximum value in each window position.",
  examples: [
    { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
    { input: "nums = [1], k = 1", output: "[1]" },
  ],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"],
  hints: [
    "Use a monotonic decreasing deque that stores INDICES (not values).",
    "Before adding index i: pop from back while nums[deque.back] ≤ nums[i] (useless smaller elements).",
    "Pop from front when the front index is out of the current window (index ≤ i - k).",
    "The front of the deque is always the index of the current window's maximum.",
  ],
  pitfalls: [
    "Storing values instead of indices — you can't check if the front is out of the window.",
    "Using a max-heap — O(n log k), not O(n).",
    "Forgetting to pop the front when it slides out of the window.",
    "Off-by-one: window starts adding to result when i >= k-1.",
  ],
  approaches: [
    {
      name: "Monotonic Deque",
      complexity: "O(n)",
      space: "O(k)",
      description: "Maintain a deque of indices in decreasing order of their values. Front = current window max.",
    },
    {
      name: "Max Heap",
      complexity: "O(n log k)",
      space: "O(k)",
      description: "Keep a max heap of (value, index). Pop stale entries when front index < i-k+1.",
    },
  ],
  code: `function maxSlidingWindow(nums, k) {
  const deque  = [];  // stores indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // Remove indices out of window
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }

    // Remove smaller elements from back
    while (deque.length && nums[deque.at(-1)] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}`,
  generateSteps() {
    const nums = [1, 3, -1, -3, 5, 3, 6, 7]
    const k = 3
    const deque: number[] = []
    const result: number[] = []
    const steps: QueueVisStep[] = []

    steps.push(frame([], [], `nums=[${nums.join(",")}], k=${k}. Use monotonic deque of indices.`, 1))

    for (let i = 0; i < nums.length; i++) {
      // Remove out-of-window
      while (deque.length && deque[0] <= i - k) deque.shift()
      // Remove smaller from back
      while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop()
      deque.push(i)

      const windowMax = nums[deque[0]]
      const q = deque.map((idx, pos) => ({
        value: `i=${idx}(${nums[idx]})`,
        label: pos === 0 ? "MAX" : undefined,
      }))

      if (i >= k - 1) {
        result.push(windowMax)
        steps.push(frame(q, [0],
          `i=${i}: window=[${nums.slice(i - k + 1, i + 1).join(",")}]. Max=${windowMax}. result=[${result.join(",")}]`,
          15,
          [{ label: "result", value: `[${result.join(",")}]` }]
        ))
      } else {
        steps.push(frame(q, [q.length - 1],
          `i=${i}: building window. deque=[${deque.map(ix => `${ix}(${nums[ix]})`).join(",")}]`,
          12
        ))
      }
    }

    steps.push(frame([], [], `Final result=[${result.join(",")}] ✓`, 19, [{ label: "result", value: `[${result.join(",")}]` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════
export const QUEUE_PROBLEMS: QueueProblem[] = [
  implStackUsingQueues,
  designCircularQueue,
  binaryTreeLevelOrder,
  numberOfIslands,
  rottingOranges,
  wallsAndGates,
  openTheLock,
  courseSchedule,
  wordLadder,
  slidingWindowMax,
]