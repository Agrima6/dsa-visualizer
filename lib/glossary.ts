// Plain-language definitions for jargon a first-time learner will hit.
// Keys are matched case-insensitively as whole words/phrases.
export const GLOSSARY: Record<string, string> = {
  "big-o": "A way of describing how much slower something gets as the amount of data grows.",
  "time complexity": "How the running time of an algorithm grows as its input gets bigger.",
  "space complexity": "How much extra memory an algorithm needs as its input gets bigger.",
  index: "The position number of an item in a list. The first item is index 0.",
  element: "One item stored in a list or array.",
  node: "One box in a linked structure: it holds a value and links to other nodes.",
  pointer: "A reference that says where another piece of data lives — an arrow to the next node.",
  head: "The first node of a linked list. You always start here.",
  null: "\"Nothing\" — a pointer that points nowhere, marking the end of a chain.",
  root: "The single node at the very top of a tree.",
  leaf: "A tree node that has no children.",
  child: "A node directly below another node in a tree.",
  parent: "The node directly above another node in a tree.",
  subtree: "A node together with everything below it — a smaller tree inside the tree.",
  traversal: "Visiting every item in a structure, one at a time, in a defined order.",
  lifo: "Last In, First Out — the most recently added item is the first one removed, like a stack of plates.",
  fifo: "First In, First Out — the item that has waited longest leaves first, like a queue at a shop.",
  push: "Adding an item to the top of a stack.",
  pop: "Removing the top item from a stack.",
  enqueue: "Adding an item to the back of a queue.",
  dequeue: "Removing the item at the front of a queue.",
  heapify: "Moving a value up or down a heap until the heap's ordering rule holds again.",
  "priority queue": "A line where the most important item leaves first, regardless of arrival order.",
  "base case": "The simplest version of a problem that a recursive function answers directly, which stops the recursion.",
  "call stack": "The pile of function calls that have started but not yet finished.",
  recursion: "When a function solves a problem by calling itself on a smaller version of the same problem.",
  vertex: "A node in a graph — one thing in the network.",
  edge: "A connection between two nodes in a graph.",
  bfs: "Breadth-First Search — explore a graph level by level, all neighbours before going deeper.",
  dfs: "Depth-First Search — go as deep as possible down one path, then backtrack.",
  weight: "The cost attached to an edge, such as distance or time.",
  relaxation: "Updating a node's best-known distance because a cheaper route to it was found.",
  balanced: "A tree where the two sides of every node are close to the same height, keeping searches fast.",
  rotation: "A small rearrangement of tree nodes that restores balance without breaking the ordering.",
  "in-place": "Done using the original array, without needing a second copy of the data.",
  stable: "A sort that keeps items with equal values in their original relative order.",
  "memoization": "Saving the result of a calculation so it isn't repeated the next time it's needed.",
  "dynamic programming": "Solving a big problem by solving smaller overlapping pieces once and reusing their answers.",
  prefix: "The beginning part of a word. \"cat\" is a prefix of \"catalog\".",
  hash: "A function that turns a value into a number, used to jump straight to where it's stored.",
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Longest terms first so "time complexity" wins over any shorter overlap.
const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)
export const GLOSSARY_REGEX = new RegExp(`(?<![\\w-])(${TERMS.map(escape).join("|")})(?![\\w-])`, "gi")
