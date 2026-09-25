export interface BeginnerIntro {
  /** What this thing is, in one plain sentence with no jargon. */
  oneLine: string
  analogy: { title: string; text: string }
  keyTerms: { term: string; meaning: string }[]
  useWhen: string
  tryThis: string
}

// Keyed by the visualizer route slug. Topics that already ship their own
// interactive "Understand" tab (stack, queue, trie, avl-tree, dp, functions,
// time-complexity) are intentionally absent.
export const BEGINNER_INTROS: Record<string, BeginnerIntro> = {
  array: {
    oneLine: "An array is a row of boxes, side by side in memory, each holding one value and each numbered starting from 0.",
    analogy: {
      title: "A row of lockers",
      text: "Picture a hallway of lockers numbered 0, 1, 2, 3… If someone says \"open locker 4\", you walk straight to it — you don't check lockers one by one. That instant jump is what makes arrays fast to read. Adding a locker in the middle is the hard part: everyone after it has to shift down one spot.",
    },
    keyTerms: [
      { term: "Index", meaning: "The number of a box. The first box is index 0, not 1." },
      { term: "Element", meaning: "The value stored inside one box." },
      { term: "Insert / Delete", meaning: "Adding or removing a value. In the middle of an array, the values after it must shift over." },
    ],
    useWhen: "You have a list of similar things and need to grab any of them quickly by position — scores, prices, pixels, a playlist.",
    tryThis: "Insert a value in the middle and watch the boxes after it shift. Then insert at the end and compare — notice which one is cheaper.",
  },
  sorting: {
    oneLine: "Sorting means putting a list in order — smallest to largest, or A to Z — by comparing and moving items.",
    analogy: {
      title: "Arranging a hand of playing cards",
      text: "When you sort cards in your hand you pick one up, compare it to its neighbours, and slide it into place. Every sorting algorithm is just a different strategy for doing that: some sweep through repeatedly swapping neighbours, some pick the smallest each time, some split the pile in half and merge it back.",
    },
    keyTerms: [
      { term: "Comparison", meaning: "Checking which of two values is bigger. Most of the work in sorting is comparisons." },
      { term: "Swap", meaning: "Exchanging the positions of two values." },
      { term: "Stable", meaning: "A sort that keeps equal values in their original order." },
    ],
    useWhen: "Anything shows results in order (leaderboards, search results), or a faster lookup needs the data sorted first.",
    tryThis: "Run Bubble Sort, then Merge Sort on the same input and compare how many comparisons each one made.",
  },
  "linked-list": {
    oneLine: "A linked list is a chain of small boxes where each box holds a value and points to the next box.",
    analogy: {
      title: "A scavenger hunt",
      text: "Each clue tells you where the next clue is hidden. You can't jump to clue number 5 — you have to follow the clues from the start. But adding a new clue in the middle is easy: just change where one clue points. No shifting anything.",
    },
    keyTerms: [
      { term: "Node", meaning: "One box in the chain: a value plus a pointer to the next node." },
      { term: "Pointer (next)", meaning: "The arrow that says which node comes after this one." },
      { term: "Head", meaning: "The first node. You always start here." },
      { term: "Null", meaning: "\"Nothing.\" The last node points to null, meaning the chain ends." },
    ],
    useWhen: "You insert and remove things a lot, and rarely need to jump straight to position N — like an undo history or a music queue.",
    tryThis: "Insert a node in the middle and watch that only two arrows change. Then search for a value and see the pointer walk node by node.",
  },
  "binary-tree": {
    oneLine: "A binary tree is a structure that branches: each item has at most two children, a left one and a right one.",
    analogy: {
      title: "A family tree, or a company org chart",
      text: "One person at the top, and each person has up to two people directly below them. To find someone you start at the top and keep choosing a branch. A Binary Search Tree adds one rule — smaller goes left, bigger goes right — so every choice throws away half of what's left.",
    },
    keyTerms: [
      { term: "Root", meaning: "The node at the very top." },
      { term: "Child / Parent", meaning: "A node directly below / above another node." },
      { term: "Leaf", meaning: "A node with no children." },
      { term: "Traversal", meaning: "Visiting every node in some order (in-order, pre-order, post-order)." },
    ],
    useWhen: "Data has a natural hierarchy (folders, categories), or you need fast search on data that changes often.",
    tryThis: "Insert 50, 30, 70, 20, 40 into the BST and watch each value pick left or right. Then run a traversal and see the order it visits nodes.",
  },
  heap: {
    oneLine: "A heap is a tree where the biggest (or smallest) item is always sitting right at the top, ready to grab.",
    analogy: {
      title: "A hospital emergency room",
      text: "Patients don't get seen in arrival order — the most urgent one goes first. A new patient is placed in line and moves up if they're more urgent than those ahead. A heap does this efficiently: the top is always the most important, and fixing the order after an add or remove takes only a few swaps.",
    },
    keyTerms: [
      { term: "Max-heap / Min-heap", meaning: "The largest / smallest value is always at the top." },
      { term: "Heapify", meaning: "Swapping a value up or down until the heap rule holds again." },
      { term: "Priority queue", meaning: "A line where the most important item leaves first — usually built with a heap." },
    ],
    useWhen: "You repeatedly need \"the biggest\" or \"the smallest\" item — task schedulers, top-K problems, Dijkstra's shortest path.",
    tryThis: "Insert a few values into a max-heap and watch each one bubble up. Then extract the max and watch the heap repair itself.",
  },
  graph: {
    oneLine: "A graph is a set of things (nodes) connected by links (edges) — a map of relationships.",
    analogy: {
      title: "A map of cities and roads, or friends on social media",
      text: "Cities are nodes and roads are edges. Or people are nodes and friendships are edges. Unlike a tree, there's no single top, and you can loop back. Most graph problems ask: can I get from A to B, and what's the shortest way?",
    },
    keyTerms: [
      { term: "Node (vertex)", meaning: "One thing in the graph — a city, a person, a web page." },
      { term: "Edge", meaning: "A connection between two nodes." },
      { term: "BFS", meaning: "Explore level by level — all neighbours first, then their neighbours." },
      { term: "DFS", meaning: "Go as deep as possible down one path, then backtrack." },
    ],
    useWhen: "Anything is about connections: maps and routes, social networks, dependencies between tasks, the web.",
    tryThis: "Run BFS and DFS from the same starting node and compare the order they visit nodes.",
  },
  recursion: {
    oneLine: "Recursion is when a function solves a problem by calling itself on a smaller version of the same problem.",
    analogy: {
      title: "Russian nesting dolls",
      text: "To find the smallest doll you open the big one, and inside is a smaller doll — open that one and repeat. You keep going until you reach a doll that doesn't open (the stopping point), then you're done. Every recursive function needs that stopping point, or it never ends.",
    },
    keyTerms: [
      { term: "Base case", meaning: "The simplest version of the problem, solved directly. This is what stops the recursion." },
      { term: "Recursive case", meaning: "The part where the function calls itself on a smaller input." },
      { term: "Call stack", meaning: "The pile of unfinished function calls waiting for the smaller ones to return." },
    ],
    useWhen: "A problem breaks into smaller copies of itself — factorials, Fibonacci, walking a folder tree, and most tree and graph problems.",
    tryThis: "Step through factorial(4) and watch calls stack up going down, then resolve one by one coming back up.",
  },
  dijkstra: {
    oneLine: "Dijkstra's algorithm finds the shortest route from one starting point to every other point on a weighted map.",
    analogy: {
      title: "A GPS finding the fastest route",
      text: "Start at your location with distance 0. Look at every road out of it, and always expand the closest unvisited place next. Whenever you find a shorter way to reach somewhere, update it. When you've visited everything, each place holds its shortest distance from the start.",
    },
    keyTerms: [
      { term: "Weight", meaning: "The cost of an edge — distance, time, price." },
      { term: "Relaxation", meaning: "Updating a node's distance because you found a cheaper way to reach it." },
      { term: "Visited", meaning: "A node whose shortest distance is now final." },
    ],
    useWhen: "You need the cheapest or fastest path — navigation apps, network routing, game pathfinding. It needs non-negative weights.",
    tryThis: "Run it from one node and watch the distances update each time a shorter path is found.",
  },
  huffman: {
    oneLine: "Huffman coding shrinks text by giving common letters short codes and rare letters long codes.",
    analogy: {
      title: "Texting shorthand",
      text: "You type \"lol\" and \"brb\" instead of full phrases because you use them constantly. Huffman coding does the same: the letter that appears most gets the shortest bit code, so the whole message takes fewer bits.",
    },
    keyTerms: [
      { term: "Frequency", meaning: "How many times a character appears." },
      { term: "Prefix code", meaning: "No code is the start of another, so the message can be decoded without confusion." },
      { term: "Encoding / Decoding", meaning: "Turning text into bits / bits back into text." },
    ],
    useWhen: "You want lossless compression — it's the idea behind formats like ZIP and JPEG.",
    tryThis: "Enter a word with a repeated letter and watch that letter end up with the shortest code.",
  },
}
