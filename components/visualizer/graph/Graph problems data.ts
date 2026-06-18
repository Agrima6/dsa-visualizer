// components/visualizer/graph/graph-problems-data.ts

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google" | "Amazon" | "Apple" | "Meta" | "Microsoft"
  | "Netflix" | "Adobe" | "Uber" | "LinkedIn" | "Twitter" | "Facebook"
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

export interface GraphVisNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphVisEdge {
  id: string
  from: string
  to: string
  directed?: boolean
}

export interface GraphVisStep {
  nodes: GraphVisNode[]
  edges: GraphVisEdge[]
  grid?: string[][]            // for grid problems (Number of Islands etc.)
  highlighted: string[]        // violet — currently visiting
  visited: string[]            // emerald — done
  inQueue: string[]            // amber — queued
  path: string[]               // rose — result path
  gridHighlighted?: [number, number][]
  gridVisited?: [number, number][]
  message: string
  codeLine: number
  auxiliary?: { label: string; value: string | number }[]
}

export interface GraphProblem {
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
  generateSteps: () => GraphVisStep[]
}

// ─── helpers ─────────────────────────────────────────────────
function makeNodes(defs: { id: string; x: number; y: number }[]): GraphVisNode[] {
  return defs.map(d => ({ ...d, label: d.id }))
}

function makeEdges(defs: [string, string][], directed = false): GraphVisEdge[] {
  return defs.map(([f, t], i) => ({ id: `e${i}`, from: f, to: t, directed }))
}

function gstep(
  nodes: GraphVisNode[],
  edges: GraphVisEdge[],
  highlighted: string[],
  visited: string[],
  inQueue: string[],
  path: string[],
  message: string,
  codeLine: number,
  auxiliary?: { label: string; value: string | number }[]
): GraphVisStep {
  return { nodes: [...nodes], edges: [...edges], highlighted, visited: [...visited], inQueue, path, message, codeLine, auxiliary }
}

// ════════════════════════════════════════════════════════════════
// 1. Number of Islands  (#145)
// ════════════════════════════════════════════════════════════════
const numberOfIslands: GraphProblem = {
  id: 145,
  slug: "number-of-islands",
  title: "Number of Islands",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Uber", "Flipkart", "Zomato"],
  tags: ["Graph", "BFS", "DFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  description:
    "Given an m×n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
  examples: [
    { input: `grid = [["1","1","1"],["0","1","0"],["1","1","0"]]`, output: "1" },
    { input: `grid = [["1","1","0"],["1","0","0"],["0","0","1"]]`, output: "2" },
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
  hints: [
    "Iterate over every cell. When you find an unvisited '1', increment islands and flood-fill the whole island with DFS/BFS.",
    "Flood-fill: mark the cell visited (change to '0' or use visited set) and recurse on 4 neighbors.",
    "Each DFS call from a new unvisited '1' = one complete island.",
  ],
  pitfalls: [
    "Not marking cells visited before recursing — causes infinite loops.",
    "Checking diagonals — only 4-directional (up, down, left, right) connections count.",
    "Bounds checking: ensure r and c stay within grid dimensions.",
  ],
  approaches: [
    { name: "DFS Flood Fill", complexity: "O(m×n)", space: "O(m×n)", description: "For each unvisited '1', DFS to mark the entire island, increment counter. Stack depth = O(m×n) worst case." },
    { name: "BFS Flood Fill", complexity: "O(m×n)", space: "O(min(m,n))", description: "Same idea with a queue instead of recursion. Queue size bounded by shorter dimension." },
    { name: "Union Find", complexity: "O(m×n α(m×n))", space: "O(m×n)", description: "Union adjacent '1' cells. Number of islands = number of distinct roots." },
  ],
  code: `function numIslands(grid) {
  let islands = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols
        || grid[r][c] === '0') return;

    grid[r][c] = '0'; // mark visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        dfs(r, c);
      }
    }
  }

  return islands;
}`,
  generateSteps() {
    const rawGrid = [
      ["1","1","0"],
      ["0","1","0"],
      ["1","0","1"],
    ]

    // Represent grid cells as graph nodes
    const nodes: GraphVisNode[] = []
    const edges: GraphVisEdge[] = []
    for (let r = 0; r < rawGrid.length; r++) {
      for (let c = 0; c < rawGrid[r].length; c++) {
        const id = `${r},${c}`
        nodes.push({ id, label: rawGrid[r][c], x: 120 + c * 100, y: 80 + r * 100 })
        if (rawGrid[r][c] === "1") {
          if (r > 0 && rawGrid[r-1][c] === "1") edges.push({ id: `e-${r},${c}-${r-1},${c}`, from: `${r-1},${c}`, to: id })
          if (c > 0 && rawGrid[r][c-1] === "1") edges.push({ id: `e-${r},${c}-${r},${c-1}`, from: `${r},${c-1}`, to: id })
        }
      }
    }

    const steps: GraphVisStep[] = []
    let islands = 0
    const visited = new Set<string>()
    const allVisited: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [], "Scan grid for unvisited '1' cells (land).", 2))

    const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
    const dfs = (r: number, c: number) => {
      if (r < 0 || r >= rawGrid.length || c < 0 || c >= rawGrid[0].length) return
      const id = `${r},${c}`
      if (visited.has(id) || rawGrid[r][c] === "0") return
      visited.add(id)
      allVisited.push(id)
      steps.push(gstep(nodes, edges, [id], [...allVisited], [], [],
        `DFS at (${r},${c}) — land! Mark visited. Island #${islands}`, 8,
        [{ label: "islands", value: islands }]))
      for (const [dr, dc] of dirs) dfs(r + dr, c + dc)
    }

    for (let r = 0; r < rawGrid.length; r++) {
      for (let c = 0; c < rawGrid[r].length; c++) {
        const id = `${r},${c}`
        if (!visited.has(id) && rawGrid[r][c] === "1") {
          islands++
          steps.push(gstep(nodes, edges, [id], [...allVisited], [], [],
            `Found unvisited land at (${r},${c}). islands++ = ${islands}. Start DFS.`, 18,
            [{ label: "islands", value: islands }]))
          dfs(r, c)
        }
      }
    }

    steps.push(gstep(nodes, edges, [], [...allVisited], [], allVisited,
      `Total islands = ${islands} ✓`, 22, [{ label: "result", value: islands }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Clone Graph  (#147)
// ════════════════════════════════════════════════════════════════
const cloneGraph: GraphProblem = {
  id: 147,
  slug: "clone-graph",
  title: "Clone Graph",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "LinkedIn", "Facebook", "Adobe"],
  tags: ["Graph", "BFS", "DFS", "Hash Map"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  description:
    "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.",
  examples: [
    { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Clone of 4-node cycle graph." },
    { input: "adjList = [[]]", output: "[[]]" },
  ],
  constraints: ["The graph is connected.", "0 ≤ n ≤ 100 nodes.", "1 ≤ Node.val ≤ 100"],
  hints: [
    "Use a HashMap: original node → cloned node. This handles cycles.",
    "DFS: if node is already in map, return its clone (memoization).",
    "Otherwise create a clone, add to map, then recurse on all neighbors.",
  ],
  pitfalls: [
    "Not using a map — you'll get infinite loops on cyclic graphs.",
    "Cloning neighbors by value instead of by reference structure.",
    "Forgetting the base case: null input → return null.",
  ],
  approaches: [
    { name: "DFS + HashMap", complexity: "O(V+E)", space: "O(V)", description: "HashMap maps original → clone. DFS clones each node once, recurses on unvisited neighbors." },
    { name: "BFS + HashMap", complexity: "O(V+E)", space: "O(V)", description: "Same idea with a queue. Process neighbors layer by layer." },
  ],
  code: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map(); // original → clone

  function dfs(n) {
    if (map.has(n)) return map.get(n);

    const clone = new Node(n.val);
    map.set(n, clone);

    for (const neighbor of n.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }

    return clone;
  }

  return dfs(node);
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "1", x: 200, y: 100 }, { id: "2", x: 360, y: 100 },
      { id: "3", x: 360, y: 260 }, { id: "4", x: 200, y: 260 },
    ])
    const edges = makeEdges([["1","2"],["1","4"],["2","3"],["3","4"]])
    const steps: GraphVisStep[] = []
    const visited: string[] = []
    const cloned: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [], "Init HashMap. DFS from node 1.", 2))

    const order = ["1","2","3","4"]
    for (const id of order) {
      steps.push(gstep(nodes, edges, [id], visited, [], [],
        `DFS on node ${id}. Not in map → create clone.`, 6,
        [{ label: "cloned so far", value: `[${cloned.join(",")}]` }]))
      visited.push(id)
      cloned.push(`${id}'`)
      steps.push(gstep(nodes, edges, [], visited, [], [],
        `Clone ${id}' created and added to map. Processing neighbors...`, 8,
        [{ label: "map", value: cloned.join(" | ") }]))
    }

    steps.push(gstep(nodes, edges, [], visited, [], visited,
      `All nodes cloned. Graph deep-copied successfully ✓`, 12,
      [{ label: "cloned nodes", value: cloned.join(", ") }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Rotting Oranges  (#149)
// ════════════════════════════════════════════════════════════════
const rottingOranges: GraphProblem = {
  id: 149,
  slug: "rotting-oranges",
  title: "Rotting Oranges",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Swiggy", "Zomato"],
  tags: ["Graph", "BFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  description:
    "You are given an m×n grid where each cell can have value 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if impossible.",
  examples: [
    { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
    { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" },
    { input: "grid = [[0,2]]", output: "0" },
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 10", "grid[i][j] ∈ {0, 1, 2}"],
  hints: [
    "Multi-source BFS: start from ALL rotten oranges simultaneously.",
    "Count fresh oranges initially. BFS level-by-level = each level is 1 minute.",
    "If fresh count > 0 after BFS, return -1.",
  ],
  pitfalls: [
    "Single-source BFS — you need multi-source (all rotten oranges at time 0).",
    "Not tracking fresh orange count — you'd miss the -1 case.",
    "Returning time - 1 or time + 1 (off by one in the BFS level counting).",
  ],
  approaches: [
    { name: "Multi-source BFS", complexity: "O(m×n)", space: "O(m×n)", description: "Enqueue all rotten oranges. BFS level by level. Each level = 1 minute. Track fresh count to detect -1." },
  ],
  code: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  let fresh = 0, time = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      if (grid[r][c] === 1) fresh++;
    }
  }

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (queue.length && fresh > 0) {
    const size = queue.length;
    time++;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
            && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return fresh === 0 ? time : -1;
}`,
  generateSteps() {
    // Visualize as node graph for clarity
    const grid = [[2,1,1],[1,1,0],[0,1,1]]
    const nodes: GraphVisNode[] = []
    const edges: GraphVisEdge[] = []

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== 0) {
          const id = `${r},${c}`
          const label = grid[r][c] === 2 ? "R" : "F"
          nodes.push({ id, label, x: 100 + c * 120, y: 80 + r * 120 })
          if (r > 0 && grid[r-1][c] !== 0) edges.push({ id: `e${r}${c}u`, from: `${r-1},${c}`, to: id })
          if (c > 0 && grid[r][c-1] !== 0) edges.push({ id: `e${r}${c}l`, from: `${r},${c-1}`, to: id })
        }
      }
    }

    const steps: GraphVisStep[] = []
    const rotten: string[] = ["0,0"]
    const visited = [...rotten]
    const q = ["0,0"]

    steps.push(gstep(nodes, edges, rotten, [], q, [],
      "Init: enqueue all rotten oranges. fresh=5.", 6,
      [{ label: "fresh", value: 5 }, { label: "time", value: 0 }]))

    const spreadOrder = [
      { spread: ["0,1","1,0"], time: 1, fresh: 3 },
      { spread: ["0,2","1,1"], time: 2, fresh: 1 },
      { spread: ["2,1"],       time: 3, fresh: 0 },  // 2,1 connects via 1,1
      { spread: ["2,2"],       time: 4, fresh: 0 },
    ]

    for (const { spread, time, fresh } of spreadOrder) {
      for (const id of spread) visited.push(id)
      steps.push(gstep(nodes, edges, spread, visited, [], [],
        `Minute ${time}: ${spread.map(s => `(${s})`).join(",")} become rotten. fresh=${fresh}`, 14,
        [{ label: "time", value: time }, { label: "fresh", value: fresh }]))
    }

    steps.push(gstep(nodes, edges, [], visited, [], visited,
      "fresh=0. Return time=4 ✓", 23, [{ label: "result", value: 4 }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Course Schedule  (#153)
// ════════════════════════════════════════════════════════════════
const courseSchedule: GraphProblem = {
  id: 153,
  slug: "course-schedule",
  title: "Course Schedule",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Uber", "Atlassian", "Bloomberg"],
  tags: ["Graph", "Topological Sort", "DFS", "BFS"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  description:
    "There are numCourses courses labeled 0 to numCourses-1. You are given an array prerequisites where prerequisites[i] = [a, b] means you must take course b before a. Return true if you can finish all courses.",
  examples: [
    { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
    { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Cycle: 0→1→0." },
  ],
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"],
  hints: [
    "This is cycle detection in a directed graph.",
    "DFS: track 3 states per node: unvisited(0), in-progress(1), done(2).",
    "If you reach an in-progress node, you found a cycle → return false.",
  ],
  pitfalls: [
    "Using a boolean visited set — you need 3 states to distinguish 'in current path' from 'fully processed'.",
    "Forgetting to process all nodes — some may be disconnected from others.",
    "Treating the graph as undirected — edges are directed (b → a means 'do b first').",
  ],
  approaches: [
    { name: "DFS Cycle Detection", complexity: "O(V+E)", space: "O(V+E)", description: "3-state DFS: 0=unvisited, 1=in-path, 2=done. Cycle if you reach a state-1 node." },
    { name: "Topological Sort (Kahn's BFS)", complexity: "O(V+E)", space: "O(V+E)", description: "Compute in-degrees. Queue nodes with in-degree 0. If we process all V nodes, no cycle exists." },
  ],
  code: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) adj[b].push(a);

  const state = new Array(numCourses).fill(0);
  // 0 = unvisited, 1 = in-path, 2 = done

  function dfs(node) {
    if (state[node] === 1) return false; // cycle!
    if (state[node] === 2) return true;  // already processed

    state[node] = 1; // mark in-path
    for (const nei of adj[node]) {
      if (!dfs(nei)) return false;
    }
    state[node] = 2; // mark done
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }
  return true;
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "0", x: 140, y: 80 }, { id: "1", x: 300, y: 80 },
      { id: "2", x: 140, y: 240 }, { id: "3", x: 300, y: 240 },
    ])
    const edges = makeEdges([["0","1"],["1","2"],["0","3"]], true)
    const steps: GraphVisStep[] = []
    const done: string[] = []
    const inPath: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [],
      "Build adjacency list from prerequisites. Init state[]=0 (unvisited).", 2))

    const dfsPairs: [string, string, boolean][] = [
      ["0", "DFS(0): mark in-path (state=1)", false],
      ["1", "DFS(1): mark in-path (state=1)", false],
      ["2", "DFS(2): leaf, mark done (state=2)", true],
    ]

    for (const [id, msg, isDone] of dfsPairs) {
      if (!isDone) inPath.push(id)
      else done.push(id)
      steps.push(gstep(nodes, edges, isDone ? [] : [id], done, isDone ? [] : inPath, [],
        msg, isDone ? 14 : 8,
        [{ label: "state", value: `[${inPath.join(",")} in-path | ${done.join(",")} done]` }]))
    }

    inPath.pop() // 1 done
    done.push("1")
    steps.push(gstep(nodes, edges, [], done, inPath, [],
      "Back at 1: all neighbors done. Mark 1 done (state=2).", 14))

    done.push("3")
    steps.push(gstep(nodes, edges, ["3"], done, [], [],
      "DFS(3): leaf. Mark done.", 14))

    done.push("0")
    steps.push(gstep(nodes, edges, [], done, [], done,
      "All nodes processed, no cycle found → return true ✓", 18,
      [{ label: "result", value: "true (can finish all courses)" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Course Schedule II  (#154)
// ════════════════════════════════════════════════════════════════
const courseScheduleII: GraphProblem = {
  id: 154,
  slug: "course-schedule-ii",
  title: "Course Schedule II",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Nvidia", "Flipkart"],
  tags: ["Graph", "Topological Sort", "DFS", "BFS"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  description:
    "There are numCourses courses labeled 0 to numCourses-1. Given prerequisites array, return the ordering in which you should take courses to finish all of them. If impossible (cycle), return an empty array.",
  examples: [
    { input: "numCourses = 2, prerequisites = [[1,0]]", output: "[0,1]" },
    { input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", output: "[0,1,2,3] or [0,2,1,3]" },
  ],
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"],
  hints: [
    "Same cycle detection as Course Schedule I, but now collect the topological order.",
    "Postorder DFS: add node to result AFTER all its neighbors are processed.",
    "Kahn's algorithm (BFS): start from nodes with in-degree 0, decrement neighbors' in-degrees.",
  ],
  pitfalls: [
    "Adding node to result at entry (pre-order) instead of exit (post-order) — gives wrong order.",
    "Not reversing the result from DFS approach — postorder gives reverse topological order.",
    "Returning partial order when a cycle exists instead of empty array.",
  ],
  approaches: [
    { name: "DFS Postorder", complexity: "O(V+E)", space: "O(V+E)", description: "3-state DFS. Append node to result after recursing all neighbors. Reverse result at end." },
    { name: "Kahn's BFS (in-degree)", complexity: "O(V+E)", space: "O(V+E)", description: "Build in-degree array. Process 0-in-degree nodes. Decrement neighbors. If result length == V, no cycle." },
  ],
  code: `function findOrder(numCourses, prerequisites) {
  const adj = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) adj[b].push(a);

  const state = new Array(numCourses).fill(0);
  const result = [];

  function dfs(node) {
    if (state[node] === 1) return false; // cycle
    if (state[node] === 2) return true;

    state[node] = 1;
    for (const nei of adj[node]) {
      if (!dfs(nei)) return false;
    }
    state[node] = 2;
    result.push(node); // postorder
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return [];
  }
  return result.reverse();
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "0", x: 120, y: 80 }, { id: "1", x: 280, y: 80 },
      { id: "2", x: 440, y: 80 }, { id: "3", x: 280, y: 240 },
    ])
    const edges = makeEdges([["0","1"],["0","2"],["1","3"],["2","3"]], true)
    const steps: GraphVisStep[] = []
    const done: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [],
      "Build adjacency list. We need topological order — postorder DFS.", 2))

    const seq: [string, string][] = [
      ["3", "DFS(3): no outgoing edges. Postorder: push 3."],
      ["1", "DFS(1): neighbor 3 done. Postorder: push 1."],
      ["2", "DFS(2): neighbor 3 done. Postorder: push 2."],
      ["0", "DFS(0): neighbors 1,2 done. Postorder: push 0."],
    ]

    for (const [id, msg] of seq) {
      done.push(id)
      steps.push(gstep(nodes, edges, [id], [...done], [], [],
        msg, 16, [{ label: "result so far (reversed)", value: `[${[...done].reverse().join(",")}]` }]))
    }

    steps.push(gstep(nodes, edges, [], done, [], done,
      "Reverse postorder → [0,2,1,3] or [0,1,2,3]. Valid topological order ✓", 18,
      [{ label: "result", value: "[0,2,1,3]" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Number of Connected Components  (#157)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const connectedComponents: GraphProblem = {
  id: 157,
  slug: "number-of-connected-components-in-an-undirected-graph",
  title: "Number of Connected Components",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "LinkedIn", "Atlassian", "Nvidia", "Salesforce"],
  tags: ["Graph", "DFS", "BFS", "Union Find"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  description:
    "You have a graph of n nodes labeled 0 to n-1. Given an integer n and an array edges where edges[i] = [a, b] indicates there is an edge between nodes a and b, return the number of connected components in the graph.",
  examples: [
    { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" },
    { input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", output: "1" },
  ],
  constraints: ["1 ≤ n ≤ 2000", "1 ≤ edges.length ≤ 5000", "edges[i].length == 2", "No self-loops or repeated edges."],
  hints: [
    "DFS/BFS from each unvisited node. Each fresh start = a new component.",
    "Union-Find: union adjacent nodes. Number of distinct roots = components.",
    "Track visited globally across all DFS calls.",
  ],
  pitfalls: [
    "Resetting visited between DFS calls — you need one global visited set.",
    "Counting nodes instead of components (forgetting to increment only at DFS start).",
    "Not building the graph — using only the edge list directly is slow.",
  ],
  approaches: [
    { name: "DFS / BFS", complexity: "O(V+E)", space: "O(V+E)", description: "For each unvisited node, DFS marks its component. Count how many times you start a new DFS." },
    { name: "Union Find", complexity: "O(V + E·α(V))", space: "O(V)", description: "Union connected nodes. Count distinct roots (components) at the end." },
  ],
  code: `function countComponents(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const visited = new Set();
  let components = 0;

  function dfs(node) {
    visited.add(node);
    for (const nei of adj[node]) {
      if (!visited.has(nei)) dfs(nei);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      components++;
      dfs(i);
    }
  }

  return components;
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "0", x: 100, y: 100 }, { id: "1", x: 220, y: 100 },
      { id: "2", x: 220, y: 240 }, { id: "3", x: 380, y: 100 },
      { id: "4", x: 380, y: 240 },
    ])
    const edges = makeEdges([["0","1"],["1","2"],["3","4"]])
    const steps: GraphVisStep[] = []
    let components = 0
    const visited: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [], "Build adjacency list. Scan all nodes.", 2))

    // Component 1: 0,1,2
    components++
    steps.push(gstep(nodes, edges, ["0"], [], ["0"], [],
      `Node 0 unvisited → components++ = ${components}. Start DFS.`, 13,
      [{ label: "components", value: components }]))

    for (const id of ["0","1","2"]) {
      visited.push(id)
      steps.push(gstep(nodes, edges, [id], [...visited], [], [],
        `DFS visits ${id}. Mark visited.`, 10,
        [{ label: "visited", value: visited.join(",") }]))
    }

    // Component 2: 3,4
    components++
    steps.push(gstep(nodes, edges, ["3"], [...visited], ["3"], [],
      `Node 3 unvisited → components++ = ${components}. Start DFS.`, 13,
      [{ label: "components", value: components }]))

    for (const id of ["3","4"]) {
      visited.push(id)
      steps.push(gstep(nodes, edges, [id], [...visited], [], [],
        `DFS visits ${id}. Mark visited.`, 10))
    }

    steps.push(gstep(nodes, edges, [], [...visited], [], [...visited],
      `All nodes visited. Components = ${components} ✓`, 18,
      [{ label: "result", value: components }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Graph Valid Tree  (#155)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const graphValidTree: GraphProblem = {
  id: 155,
  slug: "graph-valid-tree",
  title: "Graph Valid Tree",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "LinkedIn", "Atlassian", "Oracle", "Flipkart"],
  tags: ["Graph", "DFS", "BFS", "Union Find"],
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  description:
    "You have a graph of n nodes labeled 0 to n-1. Given an integer n and a list edges, return true if these edges make up a valid tree. A valid tree has exactly n-1 edges and no cycles.",
  examples: [
    { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" },
    { input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false" },
  ],
  constraints: ["1 ≤ n ≤ 2000", "0 ≤ edges.length ≤ 5000"],
  hints: [
    "A valid tree has exactly n-1 edges AND is fully connected.",
    "Check edges.length == n-1 first (fast pre-check). Then check connectivity.",
    "Union-Find: union all edges, check for cycles. Then verify all nodes share one root.",
  ],
  pitfalls: [
    "Only checking edges count — a disconnected graph with n-1 edges isn't a tree.",
    "Only checking connectivity — a graph can be connected with a cycle and extra edge.",
    "Both conditions are necessary: n-1 edges AND connected (no cycle).",
  ],
  approaches: [
    { name: "DFS + edge count check", complexity: "O(V+E)", space: "O(V+E)", description: "Check edges.length == n-1. Then DFS to ensure all n nodes are reachable from node 0." },
    { name: "Union Find", complexity: "O(E·α(V))", space: "O(V)", description: "For each edge: if same component → cycle → false. Else union. If all unioned into one component → true." },
  ],
  code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;

  const adj = Array.from({length: n}, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b); adj[b].push(a);
  }

  const visited = new Set();
  function dfs(node) {
    visited.add(node);
    for (const nei of adj[node]) {
      if (!visited.has(nei)) dfs(nei);
    }
  }

  dfs(0);
  return visited.size === n; // all nodes reachable = no disconnected parts
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "0", x: 200, y: 80 }, { id: "1", x: 100, y: 200 },
      { id: "2", x: 300, y: 200 }, { id: "3", x: 80,  y: 330 },
      { id: "4", x: 200, y: 330 },
    ])
    const edges = makeEdges([["0","1"],["0","2"],["1","3"],["1","4"]])
    const steps: GraphVisStep[] = []
    const visited: string[] = []

    steps.push(gstep(nodes, edges, [], [], [], [],
      `n=5, edges.length=4. Check: 4 === n-1=4 ✓. Proceed to connectivity check.`, 2,
      [{ label: "edge check", value: "4 === 4 ✓" }]))

    for (const id of ["0","1","3","4","2"]) {
      visited.push(id)
      steps.push(gstep(nodes, edges, [id], [...visited], [], [],
        `DFS visits ${id}`, 9))
    }

    steps.push(gstep(nodes, edges, [], [...visited], [], [...visited],
      `visited.size=${visited.length} === n=5. Connected, no cycle → true ✓`, 13,
      [{ label: "result", value: "true" }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Redundant Connection  (#158)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const redundantConnection: GraphProblem = {
  id: 158,
  slug: "redundant-connection",
  title: "Redundant Connection",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "MorganStanley", "Bloomberg", "Adobe"],
  tags: ["Graph", "Union Find", "DFS"],
  timeComplexity: "O(n α(n))",
  spaceComplexity: "O(n)",
  description:
    "In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled 1 to n, with one additional edge added. Return the edge that, if removed, results in a tree. If there are multiple answers, return the answer that occurs last in the input.",
  examples: [
    { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]" },
    { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]" },
  ],
  constraints: ["n == edges.length", "3 ≤ n ≤ 1000", "edges[i].length == 2", "No repeated edges."],
  hints: [
    "Union-Find: process edges one by one. When you try to union two nodes already in the same set → that edge creates a cycle → it's the redundant one.",
    "Return the first such edge found (since we process in order, it's the last in input that causes a cycle).",
    "DFS also works: add edges one by one and check if the new edge creates a cycle.",
  ],
  pitfalls: [
    "Using BFS/DFS for every edge check: O(n²) instead of O(n·α(n)) with Union-Find.",
    "Returning the first edge of the cycle instead of the last (the actual redundant one).",
    "Not using path compression — Union-Find degrades without it.",
  ],
  approaches: [
    { name: "Union Find", complexity: "O(n α(n))", space: "O(n)", description: "Process edges in order. Use find(a) == find(b) to detect cycle. Return that edge. O(α(n)) ≈ O(1) per operation." },
    { name: "DFS", complexity: "O(n²)", space: "O(n)", description: "For each new edge, DFS to check if nodes are already connected. If yes → redundant. Slower but intuitive." },
  ],
  code: `function findRedundantConnection(edges) {
  const parent = Array.from({length: edges.length + 1}, (_, i) => i);
  const rank   = new Array(edges.length + 1).fill(0);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false; // same set → cycle!
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  }

  for (const [a, b] of edges) {
    if (!union(a, b)) return [a, b]; // redundant edge
  }
}`,
  generateSteps() {
    const nodes = makeNodes([
      { id: "1", x: 200, y: 80 }, { id: "2", x: 100, y: 220 },
      { id: "3", x: 300, y: 220 },
    ])
    const steps: GraphVisStep[] = []
    const visited: string[] = []

    steps.push(gstep(nodes, [], [], [], [], [],
      "Init parent=[0,1,2,3]. Process edges one by one.", 2))

    const edgeSeq: [string, string, boolean, string][] = [
      ["1","2", false, "union(1,2): find(1)=1, find(2)=2. Different → union. OK."],
      ["1","3", false, "union(1,3): find(1)=1, find(3)=3. Different → union. OK."],
      ["2","3", true,  "union(2,3): find(2)=1, find(3)=1. SAME! Cycle → return [2,3]."],
    ]

    const edgeObjs: GraphVisEdge[] = []
    for (const [f, t, isCycle, msg] of edgeSeq) {
      if (!isCycle) { visited.push(f, t); edgeObjs.push({ id: `e${f}${t}`, from: f, to: t }) }
      steps.push(gstep(nodes, edgeObjs, isCycle ? [f, t] : [], [...new Set(visited)], [], isCycle ? [f,t] : [],
        msg, isCycle ? 19 : 18, [{ label: "action", value: isCycle ? "REDUNDANT EDGE!" : "union OK" }]))
    }
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Pacific Atlantic Water Flow  (#150)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const pacificAtlantic: GraphProblem = {
  id: 150,
  slug: "pacific-atlantic-water-flow",
  title: "Pacific Atlantic Water Flow",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Bloomberg", "GoldmanSachs", "Nvidia"],
  tags: ["Graph", "BFS", "DFS", "Matrix"],
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  description:
    "There is an m×n rectangular island. The Pacific Ocean borders the top and left edges; the Atlantic borders the bottom and right. Water flows from higher or equal height cells to lower/equal adjacent cells. Return coordinates of cells where water can flow to both oceans.",
  examples: [
    { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
  ],
  constraints: ["m == heights.length", "n == heights[i].length", "1 ≤ m, n ≤ 200"],
  hints: [
    "Reverse thinking: instead of flowing water down, BFS/DFS uphill from each ocean.",
    "Pacific BFS starts from top row + left column. Atlantic from bottom row + right column.",
    "Cells reachable from BOTH BFS runs → answer.",
  ],
  pitfalls: [
    "Starting from all interior cells and trying to reach both oceans — too complex.",
    "Flowing downhill from ocean borders — the reverse (uphill from borders) is simpler.",
    "Not marking visited during BFS — repeated processing.",
  ],
  approaches: [
    { name: "Reverse BFS from borders", complexity: "O(m×n)", space: "O(m×n)", description: "BFS uphill from Pacific borders, then from Atlantic borders. Intersect both reachable sets." },
    { name: "Reverse DFS from borders", complexity: "O(m×n)", space: "O(m×n)", description: "Same idea with DFS. Two DFS passes, then find intersection." },
  ],
  code: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pacVisited = Array.from({length:rows}, ()=>new Array(cols).fill(false));
  const atlVisited = Array.from({length:rows}, ()=>new Array(cols).fill(false));

  function bfs(queue, visited) {
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (queue.length) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
            && !visited[nr][nc]
            && heights[nr][nc] >= heights[r][c]) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }

  const pacQ = [], atlQ = [];
  for (let r = 0; r < rows; r++) {
    pacVisited[r][0] = atlVisited[r][cols-1] = true;
    pacQ.push([r, 0]); atlQ.push([r, cols-1]);
  }
  for (let c = 0; c < cols; c++) {
    pacVisited[0][c] = atlVisited[rows-1][c] = true;
    pacQ.push([0, c]); atlQ.push([rows-1, c]);
  }

  bfs(pacQ, pacVisited);
  bfs(atlQ, atlVisited);

  const result = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (pacVisited[r][c] && atlVisited[r][c])
        result.push([r, c]);
  return result;
}`,
  generateSteps() {
    // Simple 3x3 representation
    const nodes: GraphVisNode[] = []
    const edges: GraphVisEdge[] = []
    const h = [[1,2,3],[8,9,4],[7,6,5]]
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        nodes.push({ id: `${r},${c}`, label: String(h[r][c]), x: 100 + c * 120, y: 80 + r * 120 })
      }
    }

    const steps: GraphVisStep[] = []
    const pacReach = ["0,0","0,1","0,2","1,0","2,0"]
    const atlReach = ["2,2","2,1","2,0","1,2","0,2"]
    const both = pacReach.filter(id => atlReach.includes(id))

    steps.push(gstep(nodes, edges, [], [], [], [],
      "BFS uphill from Pacific borders (top + left).", 2))
    steps.push(gstep(nodes, edges, pacReach, pacReach, [], [],
      `Pacific reachable: ${pacReach.join(",")}`, 7, [{ label: "pacific BFS", value: "done" }]))
    steps.push(gstep(nodes, edges, atlReach, [...pacReach, ...atlReach.filter(a => !pacReach.includes(a))], [], [],
      `Atlantic reachable: ${atlReach.join(",")}`, 7, [{ label: "atlantic BFS", value: "done" }]))
    steps.push(gstep(nodes, edges, both, [...new Set([...pacReach,...atlReach])], [], both,
      `Intersection (both oceans): ${both.join(",")} ✓`, 30, [{ label: "result cells", value: both.length }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Word Ladder  (#162)  ← LOCKED
// ════════════════════════════════════════════════════════════════
const wordLadder: GraphProblem = {
  id: 162,
  slug: "word-ladder",
  title: "Word Ladder",
  difficulty: "Hard",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "MorganStanley", "GoldmanSachs"],
  tags: ["Graph", "BFS", "Hash Set", "String"],
  timeComplexity: "O(m² × n)",
  spaceComplexity: "O(m² × n)",
  description:
    "A transformation sequence from word beginWord to word endWord using dictionary wordList is a sequence beginWord → s1 → s2 → ... → sk such that every adjacent pair differs by exactly one letter, and every si is in wordList. Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
  examples: [
    { input: `beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]`, output: "5", explanation: "hit→hot→dot→dog→cog (length 5)." },
    { input: `beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]`, output: "0", explanation: "'cog' not in wordList." },
  ],
  constraints: ["1 ≤ beginWord.length ≤ 10", "endWord and beginWord have the same length.", "1 ≤ wordList.length ≤ 5000"],
  hints: [
    "Model as graph: words are nodes, edge if words differ by 1 letter.",
    "BFS gives the shortest path (minimum transformation steps).",
    "For each word in queue, try replacing each character with a-z and check if it's in the word set.",
  ],
  pitfalls: [
    "DFS — finds A path but not necessarily the SHORTEST.",
    "Comparing all word pairs to build edges: O(n²·m) — use character-by-character replacement instead.",
    "Not removing visited words from the set — causes revisiting and TLE.",
  ],
  approaches: [
    { name: "BFS with character replacement", complexity: "O(m²×n)", space: "O(m²×n)", description: "BFS from beginWord. At each step, try all 26·m single-char replacements. Add valid words to queue, remove from set." },
    { name: "Bidirectional BFS", complexity: "O(m²×n)", space: "O(m²×n)", description: "BFS from both ends simultaneously. Meets in the middle, reducing search space significantly." },
  ],
  code: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue = [[beginWord, 1]]; // [word, steps]
  wordSet.delete(beginWord);

  while (queue.length) {
    const [word, steps] = queue.shift();

    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) { // a-z
        const next = word.slice(0, i)
                   + String.fromCharCode(c)
                   + word.slice(i + 1);

        if (next === endWord) return steps + 1;

        if (wordSet.has(next)) {
          wordSet.delete(next);
          queue.push([next, steps + 1]);
        }
      }
    }
  }

  return 0;
}`,
  generateSteps() {
    // Visualize as graph nodes with word labels
    const wordNodes: [string, number, number][] = [
      ["hit", 80, 80],
      ["hot", 240, 80],
      ["dot", 200, 200], ["lot", 320, 200],
      ["dog", 160, 330], ["log", 340, 330],
      ["cog", 260, 460],
    ]
    const nodes = wordNodes.map(([label, x, y]) => ({ id: label, label, x, y }))
    const edges = makeEdges([
      ["hit","hot"],["hot","dot"],["hot","lot"],
      ["dot","dog"],["lot","log"],["dog","cog"],["log","cog"],
    ])
    const steps: GraphVisStep[] = []
    const visited: string[] = []

    steps.push(gstep(nodes, edges, ["hit"], [], ["hit"], [],
      "BFS from 'hit'. Try all 1-letter changes.", 4, [{ label: "steps", value: 1 }]))

    const bfsOrder: [string, string, number][] = [
      ["hit",  "hot", 2],
      ["hot",  "dot", 3],
      ["hot",  "lot", 3],
      ["dot",  "dog", 4],
      ["dog",  "cog", 5],
    ]

    for (const [from, to, steps_n] of bfsOrder) {
      visited.push(from)
      steps.push(gstep(nodes, edges, [to], [...visited], [to], [],
        `${from} → ${to} (1 char diff). Step ${steps_n}.`, 11,
        [{ label: "steps", value: steps_n }, { label: "current word", value: to }]))
      if (to === "cog") {
        steps.push(gstep(nodes, edges, [], [...visited, to], [], [...visited, to],
          `Reached endWord 'cog'! Return ${steps_n} ✓`, 13,
          [{ label: "result", value: steps_n }]))
        break
      }
    }

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT — 10 problems, last 5 locked
// ════════════════════════════════════════════════════════════════
export const GRAPH_PROBLEMS: GraphProblem[] = [
  numberOfIslands,      // #145 Medium — free
  cloneGraph,           // #147 Medium — free
  rottingOranges,       // #149 Medium — free
  courseSchedule,       // #153 Medium — free
  courseScheduleII,     // #154 Medium — free
  connectedComponents,  // #157 Medium — LOCKED
  graphValidTree,       // #155 Medium — LOCKED
  redundantConnection,  // #158 Medium — LOCKED
  pacificAtlantic,      // #150 Medium — LOCKED
  wordLadder,           // #162 Hard   — LOCKED
]