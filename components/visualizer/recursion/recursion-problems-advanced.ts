// components/visualizer/recursion/recursion-problems-advanced.ts
// Advanced recursion / backtracking problems 16-20: Combination Sum,
// Path Sum, Rat in a Maze, N-Queens, Tower of Hanoi. Each generateSteps()
// actually executes a real recursive trace mirroring `code` line-for-line,
// following the pattern established in recursion-problems-core.ts.

import { RecursionProblem, frame, step } from "./recursion-problem-types"

// ════════════════════════════════════════════════════════════════
// 16. Combination Sum
// ════════════════════════════════════════════════════════════════
const combinationSum: RecursionProblem = {
  id: 16,
  slug: "combination-sum",
  title: "Combination Sum",
  difficulty: "Medium",
  companies: ["Amazon", "Meta", "Google", "Uber", "Airbnb"],
  tags: ["Recursion", "Backtracking", "Array"],
  timeComplexity: "O(2^target) worst case",
  spaceComplexity: "O(target) recursion depth",
  description:
    "Given an array of distinct positive integers and a target, find all unique combinations that sum to target, where the same number can be reused an unlimited number of times. This is backtracking with a start-index that does NOT advance when a number is reused.",
  examples: [
    { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
    { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
  ],
  constraints: ["1 ≤ candidates.length ≤ 30", "All candidates are distinct positive integers", "1 ≤ target ≤ 40"],
  hints: [
    "Pass a start index so you never revisit candidates before it — that's what guarantees combinations are unique regardless of order.",
    "To allow reusing the same number, recurse with the SAME start index (not start+1) when you include candidates[i].",
    "Prune early: once the running remainder goes negative, stop — don't keep exploring that branch.",
  ],
  pitfalls: [
    "Recursing with i+1 instead of i when reusing a number — this silently turns it into the 'each number used once' variant and misses valid combinations like [2,2,3].",
    "Not pruning when remain < 0 — the recursion still terminates eventually but explores far more branches than necessary.",
    "Pushing `path` directly into `result` instead of a copy [...path] — every recorded combination ends up aliasing the same mutating array.",
  ],
  approaches: [
    {
      name: "Backtracking with same-index reuse",
      complexity: "O(2^target)",
      space: "O(target)",
      description: "At each index, either take candidates[i] again (recurse with the same i) or move on to i+1. Base case: remain === 0 records a combination; remain < 0 prunes.",
    },
  ],
  code: `function combinationSum(candidates, target) {
  const result = [];
  const path = [];

  function backtrack(start, remain) {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, remain - candidates[i]);
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}`,
  generateSteps() {
    const candidates = [2, 3, 6, 7]
    const target = 7
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const path: number[] = []
    const result: number[][] = []

    const fmt = () => result.map((r) => `[${r.join(",")}]`)

    function backtrack(start: number, remain: number) {
      const f = frame(`backtrack(start=${start}, remain=${remain})`, [
        ["start", start],
        ["remain", remain],
      ])
      stack.push(f)
      steps.push(step(5, stack, `Call backtrack(start=${start}, remain=${remain}).`, { array: candidates, result: fmt() }))

      if (remain === 0) {
        steps.push(step(6, stack, `remain=0 — combination found.`, { array: candidates, result: fmt() }))
        const snapshot = [...path]
        result.push(snapshot)
        steps.push(step(7, stack, `Record combination [${snapshot.join(",")}].`, { array: candidates, result: fmt() }))
        stack.pop()
        return
      }

      if (remain < 0) {
        steps.push(step(10, stack, `remain=${remain} < 0 — over target, prune this branch.`, { array: candidates, result: fmt() }))
        stack.pop()
        return
      }

      for (let i = start; i < candidates.length; i++) {
        path.push(candidates[i])
        steps.push(step(12, stack, `Choose candidates[${i}]=${candidates[i]} → path=[${path.join(",")}].`, {
          array: candidates,
          highlighted: [i],
          result: fmt(),
        }))

        backtrack(i, remain - candidates[i])

        path.pop()
        steps.push(step(14, stack, `Backtrack: remove ${candidates[i]} → path=[${path.join(",")}].`, {
          array: candidates,
          highlighted: [i],
          result: fmt(),
        }))
      }

      stack.pop()
    }

    backtrack(0, target)
    steps.push(step(20, [], `All ${result.length} combinations found.`, { array: candidates, result: fmt() }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 17. Path Sum (Root to Leaf, Tree Recursion)
// ════════════════════════════════════════════════════════════════
interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

const pathSum: RecursionProblem = {
  id: 17,
  slug: "path-sum-root-to-leaf",
  title: "Path Sum (Root to Leaf)",
  difficulty: "Medium",
  companies: ["Meta", "Amazon", "Microsoft", "LinkedIn"],
  tags: ["Recursion", "Tree", "DFS"],
  timeComplexity: "O(n) — visits each node at most once",
  spaceComplexity: "O(h) — h is the tree height",
  description:
    "Given the root of a binary tree and an integer targetSum, determine whether the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum. Classic tree recursion: subtract the current node's value from the remaining target as you descend, and check the remainder only at leaves.",
  examples: [
    { input: "tree with root 5, targetSum = 22", output: "true", explanation: "Path 5 → 4 → 11 → 2 sums to 22." },
    { input: "tree with root 5, targetSum = 100", output: "false" },
  ],
  constraints: ["The number of nodes is in the range [0, 5000]", "-1000 ≤ Node.val ≤ 1000", "-1000 ≤ targetSum ≤ 1000"],
  hints: [
    "Carry the REMAINING sum down the recursion (targetSum minus every node.val seen so far) instead of an accumulating total — the base case check becomes a simple equality against 0.",
    "A path is only valid if it ends at a LEAF — a node with no children. Don't return true just because some internal node's remainder hits 0.",
    "For a leaf, if node.left and node.right are both null, check remaining === 0 right there instead of recursing further.",
  ],
  pitfalls: [
    "Checking remaining === 0 at any node instead of only at leaves — an internal node hitting 0 doesn't mean a valid root-to-leaf path exists below it.",
    "Forgetting that a node with only ONE child is not a leaf — recursing into the missing null child and treating null as a valid leaf gives wrong answers.",
    "Using `||` short-circuit correctly but forgetting it means only ONE side needs to succeed — writing `&&` by mistake would require both children to match, which is wrong.",
  ],
  approaches: [
    {
      name: "DFS with remaining sum",
      complexity: "O(n)",
      space: "O(h)",
      description: "Recurse left and right, passing targetSum - node.val down. At a leaf, the path is valid iff the remaining sum equals 0.",
    },
  ],
  code: `function hasPathSum(node, targetSum) {
  if (!node) return false;
  const remaining = targetSum - node.val;
  if (!node.left && !node.right) {
    return remaining === 0;
  }
  return hasPathSum(node.left, remaining) || hasPathSum(node.right, remaining);
}`,
  generateSteps() {
    // Fixed tree:
    //              5
    //            /   \
    //           4      8
    //          /      /  \
    //        11      13   4
    //       /  \             \
    //      7    2             1
    const tree: TreeNode = {
      val: 5,
      left: {
        val: 4,
        left: {
          val: 11,
          left: { val: 7, left: null, right: null },
          right: { val: 2, left: null, right: null },
        },
        right: null,
      },
      right: {
        val: 8,
        left: { val: 13, left: null, right: null },
        right: { val: 4, left: null, right: { val: 1, left: null, right: null } },
      },
    }
    const targetSum = 22
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(node: TreeNode | null, remaining: number, path: number[]): number[] | null {
      const f = frame(`hasPathSum(node=${node ? node.val : "null"})`, [
        ["node", node ? node.val : "null"],
        ["remaining", remaining],
      ])
      stack.push(f)
      steps.push(step(1, stack, `Call hasPathSum on node=${node ? node.val : "null"}, remaining=${remaining}.`))

      if (!node) {
        steps.push(step(2, stack, `node is null — no path here, return false.`))
        stack.pop()
        return null
      }

      const newRemaining = remaining - node.val
      steps.push(step(3, stack, `remaining = ${remaining} - ${node.val} = ${newRemaining}.`))

      if (!node.left && !node.right) {
        const isPath = newRemaining === 0
        steps.push(step(5, stack, `Leaf node ${node.val}: remaining=${newRemaining} ${isPath ? "== 0, path found!" : "!= 0, no match."}`))
        stack.pop()
        return isPath ? [...path, node.val] : null
      }

      steps.push(step(7, stack, `Node ${node.val} has children — recurse left then right.`))
      const left = run(node.left, newRemaining, [...path, node.val])
      const found = left ?? run(node.right, newRemaining, [...path, node.val])
      stack.pop()
      return found
    }

    const found = run(tree, targetSum, [])
    steps.push(
      step(
        8,
        [],
        found ? `Path found summing to ${targetSum}: ${found.join(" → ")}.` : `No root-to-leaf path sums to ${targetSum}.`,
        { result: found ? [found.join(" → ")] : ["No path found"] }
      )
    )
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 18. Rat in a Maze (Backtracking on a Grid)
// ════════════════════════════════════════════════════════════════
const ratInMaze: RecursionProblem = {
  id: 18,
  slug: "rat-in-a-maze",
  title: "Rat in a Maze",
  difficulty: "Hard",
  companies: ["Amazon", "Microsoft", "Flipkart", "Zomato"],
  tags: ["Recursion", "Backtracking", "Grid", "DFS"],
  timeComplexity: "O(2^(n²)) worst case",
  spaceComplexity: "O(n²) for the visited grid and recursion depth",
  description:
    "Given an n×n binary grid where 1 means open and 0 means blocked, find a path for a rat from the top-left cell to the bottom-right cell. This version restricts movement to RIGHT and DOWN only (the simpler classic variant — a 4-directional variant also exists but needs a visited set to avoid cycles, which this variant gets almost for free).",
  examples: [
    {
      input: "grid = [[1,0,0,0],[1,1,0,1],[0,1,0,0],[0,1,1,1]]",
      output: "[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2],[3,3]]",
      explanation: "Down, down, down, right, right, right reaches (3,3).",
    },
    { input: "grid = [[1,0],[0,1]]", output: "no path", explanation: "The only right/down route is blocked by the 0 at (0,1) and (1,0)." },
  ],
  constraints: ["1 ≤ n ≤ 8", "grid[i][j] is 0 or 1", "grid[0][0] and grid[n-1][n-1] are typically 1"],
  hints: [
    "At each cell, try moving DOWN first, then RIGHT — if either leads to the destination, the whole call succeeds.",
    "Mark a cell visited before recursing into its neighbors, and un-mark it (backtrack) if neither direction pans out — otherwise you'll wrongly avoid revisiting cells on other explored paths.",
    "The base/destination check (r === n-1 && c === n-1) must happen AFTER marking the cell as part of the path, not before.",
  ],
  pitfalls: [
    "Forgetting to un-mark `visited[r][c]` on backtrack — this can wrongly block a valid path through that cell that would have been reachable via a different route.",
    "Checking bounds and grid[r][c]===0 after moving instead of before recursing — causes array-index-out-of-bounds errors at the grid edges.",
    "Popping from the path array unconditionally instead of only when the branch fails — this drops cells that are actually part of the successful path.",
  ],
  approaches: [
    {
      name: "Backtracking (right/down only)",
      complexity: "O(2^(n²))",
      space: "O(n²)",
      description: "From each cell, try DOWN then RIGHT, recursing until the destination is hit or both directions dead-end, undoing the mark on failure.",
    },
  ],
  code: `function solveMaze(grid, r, c, path, visited) {
  const n = grid.length;
  if (r >= n || c >= n || grid[r][c] === 0 || visited[r][c]) return false;
  visited[r][c] = true;
  path.push([r, c]);
  if (r === n - 1 && c === n - 1) return true;
  if (solveMaze(grid, r + 1, c, path, visited)) return true;
  if (solveMaze(grid, r, c + 1, path, visited)) return true;
  path.pop();
  visited[r][c] = false;
  return false;
}`,
  generateSteps() {
    // Grid flattened row-major: index = row * 4 + col.
    const grid = [
      [1, 0, 0, 0],
      [1, 1, 0, 1],
      [0, 1, 0, 0],
      [0, 1, 1, 1],
    ]
    const n = grid.length
    const flat: number[] = grid.flat()
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const path: [number, number][] = []
    const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false))

    const pathIdx = () => path.map(([r, c]) => r * n + c)
    const pathStr = () => path.map(([r, c]) => `(${r},${c})`)

    function run(r: number, c: number): boolean {
      const f = frame(`solveMaze(r=${r}, c=${c})`, [
        ["r", r],
        ["c", c],
      ])
      stack.push(f)
      steps.push(step(1, stack, `Call solveMaze(r=${r}, c=${c}).`, { array: flat, highlighted: r >= 0 && r < n && c >= 0 && c < n ? [r * n + c] : [] }))

      if (r >= n || c >= n || grid[r][c] === 0 || visited[r][c]) {
        steps.push(step(3, stack, `Cell (${r},${c}) is out of bounds, blocked, or visited — return false.`, { array: flat }))
        stack.pop()
        return false
      }

      visited[r][c] = true
      path.push([r, c])
      steps.push(step(5, stack, `Mark (${r},${c}) visited, add to path. Path so far: ${pathStr().join(" → ")}.`, {
        array: flat,
        highlighted: pathIdx(),
        result: pathStr(),
      }))

      if (r === n - 1 && c === n - 1) {
        steps.push(step(6, stack, `Reached destination (${n - 1},${n - 1})!`, { array: flat, highlighted: pathIdx(), result: pathStr() }))
        stack.pop()
        return true
      }

      steps.push(step(7, stack, `Try moving DOWN from (${r},${c}).`, { array: flat, highlighted: pathIdx() }))
      if (run(r + 1, c)) {
        stack.pop()
        return true
      }

      steps.push(step(8, stack, `Try moving RIGHT from (${r},${c}).`, { array: flat, highlighted: pathIdx() }))
      if (run(r, c + 1)) {
        stack.pop()
        return true
      }

      path.pop()
      visited[r][c] = false
      steps.push(step(10, stack, `Dead end at (${r},${c}) — backtrack: unmark and remove from path.`, {
        array: flat,
        highlighted: pathIdx(),
        result: pathStr(),
      }))
      stack.pop()
      return false
    }

    const found = run(0, 0)
    steps.push(
      step(12, [], found ? `Path found: ${pathStr().join(" → ")}.` : `No path from (0,0) to (${n - 1},${n - 1}).`, {
        array: flat,
        highlighted: pathIdx(),
        result: found ? pathStr() : ["No path found"],
      })
    )
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 19. N-Queens
// ════════════════════════════════════════════════════════════════
const nQueens: RecursionProblem = {
  id: 19,
  slug: "n-queens",
  title: "N-Queens",
  difficulty: "Hard",
  companies: ["Google", "Amazon", "Microsoft", "Apple", "Bloomberg"],
  tags: ["Recursion", "Backtracking", "Matrix"],
  timeComplexity: "O(n!) worst case",
  spaceComplexity: "O(n) for the column-placement array and recursion depth",
  description:
    "Place n queens on an n×n chessboard so that no two queens attack each other. Because each row can only ever hold one queen, the row is handled implicitly by construction — the recursion only has to check column and both diagonal conflicts against queens already placed in earlier rows.",
  examples: [
    { input: "n = 4", output: "[[1,3,0,2],[2,0,3,1]]", explanation: "2 solutions, each listing the queen's column index per row." },
    { input: "n = 1", output: "[[0]]" },
  ],
  constraints: ["1 ≤ n ≤ 9"],
  hints: [
    "Represent a placement as one number per row (the column that row's queen sits in) — this makes the 'one queen per row' constraint automatic and turns the board into a simple array.",
    "Two queens are on the same diagonal exactly when the absolute difference in their rows equals the absolute difference in their columns.",
    "Only compare the new placement against queens placed in EARLIER rows — later rows haven't been decided yet, so there's nothing to check against them.",
  ],
  pitfalls: [
    "Checking only column conflicts and forgetting the two diagonals — produces boards where queens attack each other diagonally.",
    "Recomputing safety with a full board scan every time instead of a simple abs-difference check — works, but is much slower and easy to get wrong with row/col mixups.",
    "Forgetting to pop the column choice (`cols.pop()`) after a recursive branch — corrupts every subsequent sibling attempt in the same row's loop.",
  ],
  approaches: [
    {
      name: "Backtracking, row by row",
      complexity: "O(n!)",
      space: "O(n)",
      description: "At each row, try every column; if it's safe against all previously placed queens, place it and recurse to the next row, undoing the placement afterward.",
    },
  ],
  code: `function solveNQueens(n) {
  const solutions = [];
  const cols = [];

  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      const c = cols[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      solutions.push([...cols]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        cols.push(col);
        backtrack(row + 1);
        cols.pop();
      }
    }
  }

  backtrack(0);
  return solutions;
}`,
  generateSteps() {
    const n = 4
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const cols: number[] = []
    const solutions: number[][] = []

    const fmt = () => solutions.map((s) => `[${s.join(",")}]`)

    function isSafe(row: number, col: number): boolean {
      for (let r = 0; r < row; r++) {
        const c = cols[r]
        if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false
      }
      return true
    }

    function backtrack(row: number) {
      const f = frame(`backtrack(row=${row})`, [["row", row], ["cols", `[${cols.join(",")}]`]])
      stack.push(f)
      steps.push(step(13, stack, `Call backtrack(row=${row}) with cols so far = [${cols.join(",")}].`, { result: fmt() }))

      if (row === n) {
        const snapshot = [...cols]
        solutions.push(snapshot)
        steps.push(step(15, stack, `row=${n} — all queens placed. Solution: [${snapshot.join(",")}].`, { result: fmt() }))
        stack.pop()
        return
      }

      for (let col = 0; col < n; col++) {
        const safe = isSafe(row, col)
        steps.push(step(19, stack, `Row ${row}, try col ${col} — ${safe ? "safe" : "conflict (column or diagonal)"}.`, { result: fmt() }))
        if (safe) {
          cols.push(col)
          steps.push(step(20, stack, `Place queen at (row=${row}, col=${col}). cols=[${cols.join(",")}].`, { result: fmt() }))
          backtrack(row + 1)
          cols.pop()
          steps.push(step(22, stack, `Backtrack from row ${row}, col ${col}. cols=[${cols.join(",")}].`, { result: fmt() }))
        }
      }

      stack.pop()
    }

    backtrack(0)
    steps.push(step(29, [], `All ${solutions.length} solutions found for n=${n}.`, { result: fmt() }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 20. Tower of Hanoi
// ════════════════════════════════════════════════════════════════
const towerOfHanoi: RecursionProblem = {
  id: 20,
  slug: "tower-of-hanoi",
  title: "Tower of Hanoi",
  difficulty: "Hard",
  companies: ["Amazon", "Microsoft", "Adobe", "Oracle"],
  tags: ["Recursion", "Divide & Conquer"],
  timeComplexity: "O(2^n)",
  spaceComplexity: "O(n) recursion depth",
  description:
    "Move n disks from a source peg to a destination peg, using an auxiliary peg, moving exactly one disk at a time and never placing a larger disk on top of a smaller one. The classic 3-peg recursive puzzle: move n-1 disks out of the way, move the largest disk, then move the n-1 disks onto it.",
  examples: [
    { input: "n = 2, source=A, destination=C, auxiliary=B", output: "3 moves: A→B, A→C, B→C" },
    { input: "n = 3, source=A, destination=C, auxiliary=B", output: "7 moves" },
  ],
  constraints: ["1 ≤ n ≤ 10 (move count grows as 2^n - 1)"],
  hints: [
    "Think of it as three steps: move the top n-1 disks out of the way (onto the auxiliary peg), move the single largest disk directly, then move the n-1 disks from auxiliary onto the destination.",
    "The 'auxiliary' and 'destination' pegs SWAP ROLES between the two recursive calls — that's the key insight that makes the recursion work.",
    "The base case is n === 0 (nothing to move) — do not write a check for n === 1 as a special case, it isn't needed.",
  ],
  pitfalls: [
    "Swapping the auxiliary/destination arguments incorrectly in the recursive calls — the first recursive call must free up `source` using `destination` as the temporary peg, and the second must move disks from `auxiliary` to `destination` using `source` as the temporary peg.",
    "Logging the move BEFORE the first recursive call returns — the largest disk must move only after all smaller disks are clear of the source peg.",
    "Assuming move count is n² or 2n instead of 2^n - 1 — for n=3 that's 7 moves, not 6.",
  ],
  approaches: [
    {
      name: "Recursive divide and conquer",
      complexity: "O(2^n)",
      space: "O(n)",
      description: "hanoi(n-1, source, destination, auxiliary) clears the way, then the nth disk moves directly, then hanoi(n-1, auxiliary, source, destination) finishes the job.",
    },
  ],
  code: `function hanoi(n, source, auxiliary, destination, moves) {
  if (n === 0) return;
  hanoi(n - 1, source, destination, auxiliary, moves);
  moves.push("Move disk " + n + " from " + source + " to " + destination);
  hanoi(n - 1, auxiliary, source, destination, moves);
}`,
  generateSteps() {
    const n = 3
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const moves: string[] = []

    function run(k: number, source: string, auxiliary: string, destination: string) {
      const f = frame(`hanoi(${k}, ${source}→${destination})`, [
        ["n", k],
        ["source", source],
        ["auxiliary", auxiliary],
        ["destination", destination],
      ])
      stack.push(f)
      steps.push(step(1, stack, `Call hanoi(n=${k}, source=${source}, auxiliary=${auxiliary}, destination=${destination}).`, { result: [...moves] }))

      if (k === 0) {
        steps.push(step(2, stack, `n=0 — nothing to move, return.`, { result: [...moves] }))
        stack.pop()
        return
      }

      steps.push(step(3, stack, `Move ${k - 1} disks from ${source} to ${auxiliary} (using ${destination} as spare) first.`, { result: [...moves] }))
      run(k - 1, source, destination, auxiliary)

      const move = `Move disk ${k} from ${source} to ${destination}`
      moves.push(move)
      steps.push(step(4, stack, move + ".", { result: [...moves] }))

      steps.push(step(5, stack, `Move ${k - 1} disks from ${auxiliary} to ${destination} (using ${source} as spare).`, { result: [...moves] }))
      run(k - 1, auxiliary, source, destination)

      stack.pop()
    }

    run(n, "A", "B", "C")
    steps.push(step(6, [], `All ${moves.length} moves complete — ${n} disks moved from A to C.`, { result: [...moves] }))
    return steps
  },
}

export const RECURSION_ADVANCED_PROBLEMS: RecursionProblem[] = [combinationSum, pathSum, ratInMaze, nQueens, towerOfHanoi]
