import {
  Gauge, Parentheses, Rows3, ArrowUpDown, List, SquareStack, ArrowLeftRight,
  Binary, Scale, Box, Repeat, Share2, Calculator, TreePine,
  Equal, MessageSquare, X, Hash, ArrowRightLeft,
  type LucideIcon,
} from "lucide-react"

export type TopicCategory = "concepts" | "dataStructures" | "applications"

export interface Topic {
  /** Stable identifier, also used to derive the default href as /visualizer/{slug} */
  slug: string
  name: string
  href: string
  icon: LucideIcon
  category: TopicCategory
  /** Position in the navbar's numbered learning roadmap. */
  order: number
  /** Long-form description for sidebar entries and homepage topic cards. */
  description: string
  /** Short (~35 char) description for the narrow, 1-line-clamped navbar dropdown. */
  shortDescription: string
}

// Single source of truth for every visualizer topic — sidebar, navbar roadmap,
// and the homepage all derive their lists from this array instead of keeping
// three hand-maintained copies in sync.
export const TOPICS: Topic[] = [
  {
    slug: "time-complexity",
    name: "Time Complexity",
    href: "/visualizer/time-complexity",
    icon: Gauge,
    category: "concepts",
    order: 1,
    description: "Learn Big-O by experimenting — live growth graphs, real code execution, and instant-feedback quizzes.",
    shortDescription: "Big-O through live graphs and quizzes.",
  },
  {
    slug: "functions",
    name: "Functions",
    href: "/visualizer/functions",
    icon: Parentheses,
    category: "concepts",
    order: 2,
    description: "Learn functions by watching real call stacks push and pop, with closures, recursion, and instant-feedback quizzes.",
    shortDescription: "Real call stacks, closures, recursion.",
  },
  {
    slug: "array",
    name: "Array",
    href: "/visualizer/array",
    icon: Rows3,
    category: "dataStructures",
    order: 3,
    description: "Interactive array visualizations — indexing, insertion, deletion, and linear and binary search, step by step.",
    shortDescription: "Interactive array visualizations.",
  },
  {
    slug: "sorting",
    name: "Sorting",
    href: "/visualizer/sorting",
    icon: ArrowUpDown,
    category: "dataStructures",
    order: 4,
    description: "Watch sorting algorithms run step by step — bubble, merge, quick, insertion, and more.",
    shortDescription: "Watch sorting algorithms run live.",
  },
  {
    slug: "recursion",
    name: "Recursion",
    href: "/visualizer/recursion",
    icon: Repeat,
    category: "dataStructures",
    order: 5,
    description: "20 interview questions from base cases to backtracking, with a real call-stack visualization.",
    shortDescription: "Real call-stack visualizations.",
  },
  {
    slug: "stack",
    name: "Stack",
    href: "/visualizer/stack",
    icon: SquareStack,
    category: "dataStructures",
    order: 6,
    description: "LIFO data structure supporting push and pop operations. Visualize stack operations and state.",
    shortDescription: "LIFO, animated push and pop.",
  },
  {
    slug: "queue",
    name: "Queue",
    href: "/visualizer/queue",
    icon: ArrowLeftRight,
    category: "dataStructures",
    order: 7,
    description: "Simple, Circular, Priority, and Deque — all four types side by side.",
    shortDescription: "Simple, Circular, Priority, and Deque.",
  },
  {
    slug: "linked-list",
    name: "Linked List",
    href: "/visualizer/linked-list",
    icon: List,
    category: "dataStructures",
    order: 8,
    description: "Dynamic data structure with nodes connected through references. Explore different types of linked lists.",
    shortDescription: "Node-based structures, step by step.",
  },
  {
    slug: "binary-tree",
    name: "Binary Tree",
    href: "/visualizer/binary-tree",
    icon: Binary,
    category: "dataStructures",
    order: 9,
    description: "Plain Binary Tree, BST, and Heap in one place — see exactly how each constrains node placement.",
    shortDescription: "Plain tree, BST, and Heap — compared.",
  },
  {
    slug: "avl-tree",
    name: "AVL Tree",
    href: "/visualizer/avl-tree",
    icon: Scale,
    category: "dataStructures",
    order: 10,
    description: "A self-balancing BST — watch live balance factors and LL/RR/LR/RL rotations fire on every insert.",
    shortDescription: "Self-balancing — rotations, live.",
  },
  {
    slug: "heap",
    name: "Heap",
    href: "/visualizer/heap",
    icon: Box,
    category: "dataStructures",
    order: 11,
    description: "Complete binary tree with heap property. Switch between min and max heaps.",
    shortDescription: "Heap operations and ordering.",
  },
  {
    slug: "graph",
    name: "Graph",
    href: "/visualizer/graph",
    icon: Share2,
    category: "dataStructures",
    order: 12,
    description: "Build graphs interactively and watch BFS and DFS traverse nodes and edges step by step.",
    shortDescription: "Build graphs, animate BFS and DFS.",
  },
  {
    slug: "dp",
    name: "Dynamic Programming",
    href: "/visualizer/dp",
    icon: Calculator,
    category: "dataStructures",
    order: 13,
    description: "Watch a DP table fill cell by cell for 0/1 Knapsack and Longest Common Subsequence.",
    shortDescription: "Knapsack and LCS, cell by cell.",
  },
  {
    slug: "trie",
    name: "Trie",
    href: "/visualizer/trie",
    icon: TreePine,
    category: "dataStructures",
    order: 14,
    description: "Insert, search, and prefix-search words in a live prefix tree — the structure behind autocomplete.",
    shortDescription: "Prefix trees — insert, search, autocomplete.",
  },
  {
    slug: "stack-applications",
    name: "Infix to Postfix",
    href: "/visualizer/stack-applications",
    icon: Equal,
    category: "applications",
    order: 15,
    description: "Convert infix expressions to postfix notation using stacks. Step through the conversion process.",
    shortDescription: "Expression conversion with a stack.",
  },
  {
    slug: "queue-applications",
    name: "Message Queue",
    href: "/visualizer/queue-applications",
    icon: MessageSquare,
    category: "applications",
    order: 16,
    description: "Simulate message queuing systems with producers and consumers. Visualize message flow.",
    shortDescription: "Producer-consumer queue systems.",
  },
  {
    slug: "polynomial",
    name: "Polynomial Multiplication",
    href: "/visualizer/polynomial",
    icon: X,
    category: "applications",
    order: 17,
    description: "Visualize polynomial multiplication using linked lists. See term-by-term multiplication steps.",
    shortDescription: "Polynomial operations, visualized.",
  },
  {
    slug: "huffman",
    name: "Huffman Coding",
    href: "/visualizer/huffman",
    icon: Hash,
    category: "applications",
    order: 18,
    description: "A popular data compression technique that creates variable-length prefix codes based on character frequency.",
    shortDescription: "Tree-based compression, encode/decode.",
  },
  {
    slug: "dijkstra",
    name: "Dijkstra's Algorithm",
    href: "/visualizer/dijkstra",
    icon: ArrowRightLeft,
    category: "applications",
    order: 19,
    description: "Visualize Dijkstra's algorithm to find the shortest path in a graph.",
    shortDescription: "Shortest paths through a graph.",
  },
]

export function topicsByCategory(category: TopicCategory): Topic[] {
  return TOPICS.filter((t) => t.category === category)
}

export function roadmapTopics(): Topic[] {
  return [...TOPICS].sort((a, b) => a.order - b.order)
}
