"use client";
import { trackActivity } from "@/components/activity-tracker";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Code2,
  Keyboard,
  Layers3,
  Zap,
  Target,
  ArrowRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import Link from "next/link";

const features = [
  {
    title: "Arrays",
    description:
      "Explore indexed access, insertion, deletion, and traversal on the most fundamental data structure.",
    image: "/ds-array.png",
    url: "/visualizer/array",
    overview:
      "An array stores elements in contiguous memory locations, allowing O(1) indexed access. It is the foundation of almost every algorithm and data structure you will encounter in competitive programming and system design.",
    learnPoints: [
      "Understand O(1) access by index",
      "Visualize insertion and deletion element shifts",
      "Build intuition for sliding window and two-pointer patterns",
    ],
    useCases: ["Caching", "Lookup tables", "Algorithm foundations"],
    previewType: "array",
  },

  {

    title: "Sorting",
    description:
      "Watch values reorder step by step with clean animated comparisons.",
    image: "/ds-st.png",
    url: "/visualizer/sorting",
    overview:
      "Sorting arranges data into a meaningful sequence such as ascending or descending order. It is one of the most important foundations in problem solving because it improves searching, comparison, and downstream processing.",
    learnPoints: [
      "Understand swaps and comparisons visually",
      "Compare sorting behavior side by side",
      "Build intuition for time complexity",
    ],
    useCases: ["Search optimization", "Leaderboards", "Data processing"],
    previewType: "sorting",
  },
  {
    title: "Stacks",
    description: "Learn LIFO behavior with push, pop, and peek operations.",
    image: "/ds-st.png",
    url: "/visualizer/stack",
    overview:
      "A stack follows Last In, First Out. The most recently added item is the first one to be removed, which makes it perfect for nested logic and reversible operations.",
    learnPoints: [
      "Understand push, pop, and peek",
      "See LIFO order in action",
      "Connect stacks to coding patterns",
    ],
    useCases: ["Undo feature", "Function calls", "Expression evaluation"],
    previewType: "stack",
  },
  {
    title: "Queues",
    description: "Understand FIFO flow using enqueue and dequeue operations.",
    image: "/ds-q.png",
    url: "/visualizer/queue",
    overview:
      "A queue follows First In, First Out. The earliest inserted item leaves first, which makes queues useful for scheduling, buffering, and ordered processing.",
    learnPoints: [
      "Visualize enqueue and dequeue",
      "Learn front and rear behavior",
      "Connect FIFO with real systems",
    ],
    useCases: ["Task scheduling", "Ticket systems", "Buffer handling"],
    previewType: "queue",
  },
  {
    title: "Linked Lists",
    description:
      "See nodes, pointers, and traversal in a more intuitive way.",
    image: "/ds-ll.png",
    url: "/visualizer/linked-list",
    overview:
      "A linked list stores data inside connected nodes. Each node points to the next one, helping you understand dynamic structures and pointer-like thinking.",
    learnPoints: [
      "See node connections clearly",
      "Understand insertion and deletion flow",
      "Build pointer intuition visually",
    ],
    useCases: ["Playlists", "Browser history", "Dynamic memory structures"],
    previewType: "linked-list",
  },
  {
    title: "Binary Search Trees",
    description:
      "Understand ordered insertion, search paths, and traversals.",
    image: "/ds-bst.png",
    url: "/visualizer/binary-tree",
    overview:
      "A binary search tree stores values so that smaller elements stay on the left and larger elements stay on the right. This structure enables more efficient searching than linear layouts.",
    learnPoints: [
      "Watch insertions build the tree",
      "See search path decisions",
      "Learn inorder, preorder, and postorder",
    ],
    useCases: ["Fast lookup", "Ordered storage", "Hierarchical data"],
    previewType: "bst",
  },
  {
    title: "AVL Trees",
    description: "Explore balancing rotations in a self-balancing BST.",
    image: "/ds-avl.png",
    url: "/visualizer/avl-tree",
    overview:
      "AVL trees are self-balancing binary search trees. They rotate nodes whenever the structure becomes too unbalanced, keeping operations efficient.",
    learnPoints: [
      "Understand balance factors",
      "Learn left and right rotations",
      "See why balancing improves performance",
    ],
    useCases: ["Database indexing", "Fast updates", "Balanced search"],
    previewType: "avl",
  },
  {
    title: "Heaps",
    description: "Visualize heap shape and priority-based ordering.",
    image: "/ds-heap.png",
    url: "/visualizer/heap",
    overview:
      "A heap is a special tree-based structure where parent-child order follows a strict rule. It is widely used to implement priority queues.",
    learnPoints: [
      "Understand min-heap and max-heap",
      "See insert and remove visually",
      "Connect heaps with priority queues",
    ],
    useCases: ["Scheduling", "Priority queues", "Top-k problems"],
    previewType: "heap",
  },
  {
    title: "Infix to Postfix Conversion",
    description:
      "Convert expressions visually using precedence and stacks.",
    image: "/ds-infix-to-postfix.png",
    url: "/visualizer/stack-applications",
    overview:
      "This topic shows how an infix expression is converted into postfix notation so it becomes easier for systems to evaluate using stack logic.",
    learnPoints: [
      "Understand operator precedence",
      "See stack usage in parsing",
      "Build confidence with symbolic flow",
    ],
    useCases: ["Compilers", "Expression parsing", "Calculator engines"],
    previewType: "expression",
  },
  {
    title: "Message Queue System",
    description:
      "Visualize producer-consumer flow with queue-backed messaging.",
    image: "/ds-mq.png",
    url: "/visualizer/queue-applications",
    overview:
      "A message queue allows producers and consumers to work independently while preserving ordered delivery of messages or jobs.",
    learnPoints: [
      "Understand producer-consumer logic",
      "See queue-backed communication",
      "Connect DSA with backend systems",
    ],
    useCases: ["Async processing", "Order pipelines", "Backend systems"],
    previewType: "message-queue",
  },
  {
    title: "Polynomial Multiplication",
    description:
      "Follow symbolic multiplication through structured term flow.",
    image: "/ds-polynomial-multiplication.png",
    url: "/visualizer/polynomial",
    overview:
      "This topic demonstrates how polynomial terms can be represented and multiplied step by step using structured logic and linked representation.",
    learnPoints: [
      "Understand term-by-term multiplication",
      "See symbolic flow clearly",
      "Learn how results combine progressively",
    ],
    useCases: ["Math engines", "Symbolic computation", "Expression systems"],
    previewType: "polynomial",
  },
  {
    title: "Huffman Coding",
    description:
      "Explore compression logic using frequencies and binary trees.",
    image: "/ds-huffman.png",
    url: "/visualizer/huffman",
    overview:
      "Huffman coding compresses data by assigning shorter codes to frequent characters and longer codes to rare ones using a binary tree strategy.",
    learnPoints: [
      "See how frequencies shape the tree",
      "Understand prefix codes visually",
      "Connect trees with compression",
    ],
    useCases: ["File compression", "Transmission", "Storage optimization"],
    previewType: "huffman",
  },
  {
    title: "Dijkstra's Algorithm",
    description:
      "Understand shortest paths with weighted graph decisions.",
    image: "/ds-dijkstra.png",
    url: "/visualizer/dijkstra",
    overview:
      "Dijkstra's algorithm finds the shortest path from one source node to all reachable nodes in a weighted graph.",
    learnPoints: [
      "Visualize path relaxation",
      "Understand how distances update",
      "Connect graphs with route planning",
    ],
    useCases: ["Maps", "Network routing", "Path planning"],
    previewType: "graph",
  },
  {
    title: "Graphs",
    description:
      "Build graphs, run BFS and DFS animations, and solve real interview problems step by step.",
    image: "/ds-graph.png",
    url: "/visualizer/graph",
    overview:
      "A graph is a collection of nodes (vertices) connected by edges. Graphs model real-world relationships — social networks, maps, dependency trees, and more. BFS finds shortest paths; DFS explores all reachable nodes.",
    learnPoints: [
      "Understand BFS and DFS traversal order",
      "Detect cycles and connected components visually",
      "Apply graph algorithms to real interview problems",
    ],
    useCases: ["Maps & routing", "Social networks", "Dependency resolution"],
    previewType: "graph",
  },
] as const;

type SelectedFeature = (typeof features)[number];
type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

const quizMap: Record<SelectedFeature["previewType"], QuizQuestion[]> = {
   array: [
    {
      question: "What is the time complexity of accessing an element by index in an array?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      answer: "O(1)",
    },
    {
      question: "What happens to elements when you insert at the middle of an array?",
      options: [
        "They shift right to make space",
        "They are deleted",
        "They stay in place",
        "They move to a new array",
      ],
      answer: "They shift right to make space",
    },
    {
      question: "What is the time complexity of searching for a value in an unsorted array?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: "O(n)",
    },
    {
      question: "Which data structure allows O(1) random access by index?",
      options: ["Linked list", "Array", "Tree", "Stack"],
      answer: "Array",
    },
    {
      question: "Arrays store elements in:",
      options: [
        "Contiguous memory locations",
        "Random memory locations",
        "Linked nodes",
        "Hash buckets",
      ],
      answer: "Contiguous memory locations",
    },
    {
      question: "What is a common technique for finding pairs in an array?",
      options: ["Two pointers", "Tree rotation", "Heapify", "DFS only"],
      answer: "Two pointers",
    },
    {
      question: "The sliding window technique is mainly used for:",
      options: [
        "Subarray/substring problems",
        "Only sorting",
        "Only tree traversal",
        "Only graph problems",
      ],
      answer: "Subarray/substring problems",
    },
    {
      question: "When deleting from the middle of an array, elements must:",
      options: [
        "Shift left to fill the gap",
        "Stay in place",
        "Be rehashed",
        "Be sorted first",
      ],
      answer: "Shift left to fill the gap",
    },
    {
      question: "Which is a real-world use case of arrays?",
      options: ["Lookup tables", "Only undo history", "Only graph routing", "Only compression"],
      answer: "Lookup tables",
    },
    {
      question: "Prefix sum arrays help solve:",
      options: [
        "Range sum queries in O(1)",
        "Only sorting problems",
        "Only graph problems",
        "Only tree problems",
      ],
      answer: "Range sum queries in O(1)",
    },
  ],
  sorting: [
    {
      question: "What is the main goal of sorting?",
      options: [
        "To remove duplicate elements",
        "To arrange data in a meaningful order",
        "To reverse an array",
        "To encrypt values",
      ],
      answer: "To arrange data in a meaningful order",
    },
    {
      question: "Which order is commonly used in sorting?",
      options: [
        "Ascending or descending",
        "Random or cyclic",
        "Encrypted or decrypted",
        "Static or dynamic",
      ],
      answer: "Ascending or descending",
    },
    {
      question: "Why is sorting useful before searching?",
      options: [
        "It makes data colorful",
        "It can improve search efficiency",
        "It deletes unwanted data",
        "It changes data type",
      ],
      answer: "It can improve search efficiency",
    },
    {
      question: "What do many sorting algorithms repeatedly perform?",
      options: [
        "Push and pop",
        "Compare and swap",
        "Insert and dequeue",
        "Hash and map",
      ],
      answer: "Compare and swap",
    },
    {
      question: "Which of these is a real use case of sorting?",
      options: [
        "Leaderboards",
        "Password hashing",
        "Audio compression only",
        "Packet encryption only",
      ],
      answer: "Leaderboards",
    },
    {
      question: "In ascending sorting, which value comes first?",
      options: ["Largest", "Middle", "Smallest", "Last inserted"],
      answer: "Smallest",
    },
    {
      question: "What helps students most in visual sorting demos?",
      options: [
        "Seeing swaps step by step",
        "Memorizing syntax only",
        "Ignoring comparisons",
        "Skipping array states",
      ],
      answer: "Seeing swaps step by step",
    },
    {
      question: "Sorting is mainly applied on:",
      options: ["Unordered data", "Only trees", "Only graphs", "Only strings"],
      answer: "Unordered data",
    },
    {
      question: "Which factor is often compared between sorting algorithms?",
      options: [
        "Font size",
        "Time complexity",
        "Screen brightness",
        "Language accent",
      ],
      answer: "Time complexity",
    },
    {
      question: "Sorting improves downstream processing because data becomes:",
      options: [
        "More structured",
        "Invisible",
        "Encrypted",
        "Disconnected",
      ],
      answer: "More structured",
    },
  ],
  stack: [
    {
      question: "A stack follows which rule?",
      options: ["FIFO", "LIFO", "Random", "Circular only"],
      answer: "LIFO",
    },
    {
      question: "Which operation adds an item to a stack?",
      options: ["Pop", "Peek", "Push", "Shift"],
      answer: "Push",
    },
    {
      question: "Which operation removes the top item?",
      options: ["Push", "Peek", "Pop", "Insert"],
      answer: "Pop",
    },
    {
      question: "What does peek do in a stack?",
      options: [
        "Deletes all items",
        "Views the top item",
        "Sorts the stack",
        "Moves bottom to top",
      ],
      answer: "Views the top item",
    },
    {
      question: "Which of these commonly uses a stack?",
      options: ["Undo feature", "Ticket queue", "CPU cooling", "Wi-Fi speed"],
      answer: "Undo feature",
    },
    {
      question: "In a stack, the most recently added item is removed:",
      options: ["Last", "First", "Randomly", "Never"],
      answer: "First",
    },
    {
      question: "Function call handling often uses:",
      options: ["Queue", "Stack", "Heap sort", "Graph matrix"],
      answer: "Stack",
    },
    {
      question: "A stack is best for:",
      options: [
        "Reversible operations",
        "Maintaining FIFO flow",
        "Sorting only",
        "Binary search only",
      ],
      answer: "Reversible operations",
    },
    {
      question: "What is the accessible end of a stack called?",
      options: ["Rear", "Front", "Top", "Tail"],
      answer: "Top",
    },
    {
      question: "Which statement is true about stacks?",
      options: [
        "Insertion and deletion happen at one end",
        "Items leave in entered order",
        "They always stay sorted",
        "They cannot store numbers",
      ],
      answer: "Insertion and deletion happen at one end",
    },
  ],
  queue: [
    {
      question: "A queue follows which rule?",
      options: ["LIFO", "FIFO", "Random", "Recursive"],
      answer: "FIFO",
    },
    {
      question: "Which operation adds an item to a queue?",
      options: ["Pop", "Peek", "Enqueue", "Traverse"],
      answer: "Enqueue",
    },
    {
      question: "Which operation removes an item from a queue?",
      options: ["Enqueue", "Push", "Dequeue", "Append"],
      answer: "Dequeue",
    },
    {
      question: "In a queue, which item leaves first?",
      options: [
        "Latest inserted",
        "Earliest inserted",
        "Largest item",
        "Smallest item",
      ],
      answer: "Earliest inserted",
    },
    {
      question: "Which is a common use of queues?",
      options: [
        "Task scheduling",
        "Undo operation",
        "Tree balancing",
        "Array reversal",
      ],
      answer: "Task scheduling",
    },
    {
      question: "The front of a queue refers to:",
      options: [
        "Where item is removed",
        "Where item is always inserted",
        "Middle item",
        "Largest item",
      ],
      answer: "Where item is removed",
    },
    {
      question: "Queues are useful for:",
      options: [
        "Ordered processing",
        "Backtracking",
        "Priority inversion only",
        "Tree rotation only",
      ],
      answer: "Ordered processing",
    },
    {
      question: "Ticket systems often model which data structure?",
      options: ["Stack", "Queue", "Heap", "BST"],
      answer: "Queue",
    },
    {
      question: "Buffer handling often uses queues because they preserve:",
      options: ["Recursion", "Order", "Balance factor", "Compression"],
      answer: "Order",
    },
    {
      question: "FIFO stands for:",
      options: [
        "First In, First Out",
        "Fast In, Fast Out",
        "Front In, Front Out",
        "Fixed Input, Fixed Output",
      ],
      answer: "First In, First Out",
    },
  ],
  "linked-list": [
    {
      question: "What does a linked list store data in?",
      options: ["Tables", "Connected nodes", "Only arrays", "Stacks only"],
      answer: "Connected nodes",
    },
    {
      question: "Each node in a singly linked list usually points to:",
      options: ["Its parent", "The next node", "All nodes", "The root"],
      answer: "The next node",
    },
    {
      question: "Linked lists are useful for:",
      options: [
        "Dynamic structures",
        "Only fixed-size memory",
        "Only sorting",
        "Only hashing",
      ],
      answer: "Dynamic structures",
    },
    {
      question: "Which operation becomes intuitive in a linked list visualization?",
      options: [
        "Insertion and deletion flow",
        "GPU rendering",
        "Packet encryption",
        "Image cropping",
      ],
      answer: "Insertion and deletion flow",
    },
    {
      question: "What helps traversal in a linked list?",
      options: ["Indexes only", "Pointers/links", "Colors", "Sorting only"],
      answer: "Pointers/links",
    },
    {
      question: "Browser history can be related to:",
      options: ["Linked list", "Heap sort", "Graph coloring", "Hashing only"],
      answer: "Linked list",
    },
    {
      question: "A linked list is different from an array because it:",
      options: [
        "Uses connected nodes",
        "Always stays sorted",
        "Cannot store strings",
        "Has no order",
      ],
      answer: "Uses connected nodes",
    },
    {
      question: "Which idea is central to linked lists?",
      options: ["Node connection", "Balance factor", "Operator precedence", "Frequency code"],
      answer: "Node connection",
    },
    {
      question: "What is built through linked-list visuals?",
      options: [
        "Pointer intuition",
        "Only arithmetic speed",
        "Only queue order",
        "Only graph weights",
      ],
      answer: "Pointer intuition",
    },
    {
      question: "Playlists can be modeled using:",
      options: ["Linked list", "AVL rotation", "Heapify only", "Binary compression"],
      answer: "Linked list",
    },
  ],
  bst: [
    {
      question: "In a BST, smaller values go to the:",
      options: ["Right", "Left", "Top", "Bottom"],
      answer: "Left",
    },
    {
      question: "In a BST, larger values go to the:",
      options: ["Left", "Right", "Middle", "Root only"],
      answer: "Right",
    },
    {
      question: "BST stands for:",
      options: [
        "Binary Search Tree",
        "Balanced Storage Table",
        "Basic Sorting Tree",
        "Binary Stack Type",
      ],
      answer: "Binary Search Tree",
    },
    {
      question: "BST helps enable:",
      options: [
        "Efficient searching",
        "Only array reversal",
        "Only compression",
        "Only matrix multiplication",
      ],
      answer: "Efficient searching",
    },
    {
      question: "Which of these is commonly studied in BSTs?",
      options: [
        "Traversals",
        "Only enqueue",
        "Only push/pop",
        "Only tokenization",
      ],
      answer: "Traversals",
    },
    {
      question: "What does a BST organize well?",
      options: ["Ordered storage", "Random storage only", "Only images", "Only packets"],
      answer: "Ordered storage",
    },
    {
      question: "Insertion in a BST depends on:",
      options: ["Value comparison", "Color", "Memory size only", "Screen width"],
      answer: "Value comparison",
    },
    {
      question: "Which traversal of BST gives sorted order?",
      options: ["Inorder", "Preorder", "Postorder", "Level without comparison"],
      answer: "Inorder",
    },
    {
      question: "BST search path is decided by:",
      options: ["Left/right comparisons", "Hashing", "Queue order", "Stack height only"],
      answer: "Left/right comparisons",
    },
    {
      question: "BST is useful for:",
      options: ["Fast lookup", "Only undo", "Only buffering", "Only encryption"],
      answer: "Fast lookup",
    },
  ],
  avl: [
    {
      question: "AVL tree is a:",
      options: [
        "Self-balancing BST",
        "Queue structure",
        "Linear array",
        "Compression table",
      ],
      answer: "Self-balancing BST",
    },
    {
      question: "AVL trees maintain efficiency by using:",
      options: ["Rotations", "Compression", "Hashing", "Scanning only"],
      answer: "Rotations",
    },
    {
      question: "When does an AVL tree rebalance?",
      options: [
        "When it becomes unbalanced",
        "Every second",
        "After every search only",
        "Never",
      ],
      answer: "When it becomes unbalanced",
    },
    {
      question: "What is commonly checked in AVL trees?",
      options: ["Balance factor", "Frequency table", "Postfix output", "Queue length only"],
      answer: "Balance factor",
    },
    {
      question: "Which rotation may happen in AVL trees?",
      options: ["Left rotation", "Color rotation", "Text rotation", "Scan rotation"],
      answer: "Left rotation",
    },
    {
      question: "AVL trees are useful where:",
      options: [
        "Balanced search is important",
        "Only stack pop is needed",
        "Only postfix conversion is needed",
        "Only compression is needed",
      ],
      answer: "Balanced search is important",
    },
    {
      question: "AVL is based on which base structure?",
      options: ["BST", "Queue", "Array only", "Hash table only"],
      answer: "BST",
    },
    {
      question: "Why are AVL trees preferred over skewed BSTs?",
      options: [
        "They keep operations efficient",
        "They use less color",
        "They avoid all comparisons",
        "They never insert nodes",
      ],
      answer: "They keep operations efficient",
    },
    {
      question: "Which operation improves AVL performance?",
      options: ["Rebalancing", "Random deletion", "Encryption", "Tokenization"],
      answer: "Rebalancing",
    },
    {
      question: "AVL trees are often used in:",
      options: ["Database indexing", "Undo history", "Ticket lines", "Audio mixing"],
      answer: "Database indexing",
    },
  ],
  heap: [
    {
      question: "A heap is commonly used to implement:",
      options: ["Priority queue", "Linked list", "Hash table", "Only stack"],
      answer: "Priority queue",
    },
    {
      question: "In a max-heap, the highest value stays:",
      options: ["At the top", "At the bottom", "In the middle", "On the left only"],
      answer: "At the top",
    },
    {
      question: "Heap is a:",
      options: [
        "Tree-based structure",
        "Linear-only structure",
        "Graph-only structure",
        "Table-only structure",
      ],
      answer: "Tree-based structure",
    },
    {
      question: "Which two common forms exist?",
      options: [
        "Min-heap and max-heap",
        "Push-heap and pop-heap",
        "Front-heap and rear-heap",
        "Light-heap and dark-heap",
      ],
      answer: "Min-heap and max-heap",
    },
    {
      question: "Heaps are useful for:",
      options: ["Scheduling", "Only browser history", "Only postfix conversion", "Only compression"],
      answer: "Scheduling",
    },
    {
      question: "What kind of ordering does a heap maintain?",
      options: [
        "Parent-child order",
        "Strict sorted order everywhere",
        "Random order",
        "Alphabetical order only",
      ],
      answer: "Parent-child order",
    },
    {
      question: "Top-k problems often use:",
      options: ["Heap", "Queue only", "Linked list only", "Trie only"],
      answer: "Heap",
    },
    {
      question: "Removing the root from a heap usually removes:",
      options: ["Highest or lowest priority item", "Middle item", "Oldest item", "Newest item"],
      answer: "Highest or lowest priority item",
    },
    {
      question: "Heap visuals help understand:",
      options: [
        "Insert and remove operations",
        "Only graph paths",
        "Only recursion depth",
        "Only string parsing",
      ],
      answer: "Insert and remove operations",
    },
    {
      question: "A heap does not primarily aim for:",
      options: [
        "Full sorted sequence in-place",
        "Priority access",
        "Efficient root retrieval",
        "Tree representation",
      ],
      answer: "Full sorted sequence in-place",
    },
  ],
  expression: [
    {
      question: "Infix to postfix conversion often uses which data structure?",
      options: ["Stack", "Queue", "Heap", "BST"],
      answer: "Stack",
    },
    {
      question: "Why convert infix to postfix?",
      options: [
        "To make evaluation easier for systems",
        "To randomize expressions",
        "To color operators",
        "To remove variables",
      ],
      answer: "To make evaluation easier for systems",
    },
    {
      question: "Which concept is essential in conversion?",
      options: [
        "Operator precedence",
        "Tree height only",
        "Queue front only",
        "Heap root only",
      ],
      answer: "Operator precedence",
    },
    {
      question: "Which notation is considered the original readable form?",
      options: ["Infix", "Postfix", "Prefix", "Binary"],
      answer: "Infix",
    },
    {
      question: "What does the stack temporarily hold during conversion?",
      options: ["Operators", "Only operands", "Only answers", "Only spaces"],
      answer: "Operators",
    },
    {
      question: "Compilers use expression conversion in:",
      options: ["Parsing", "File compression", "Route finding", "Task buffering"],
      answer: "Parsing",
    },
    {
      question: "The expression A+B is an example of:",
      options: ["Infix", "Postfix", "Queue form", "Heap form"],
      answer: "Infix",
    },
    {
      question: "The output AB+ is an example of:",
      options: ["Postfix", "Infix", "Linked form", "Tree form"],
      answer: "Postfix",
    },
    {
      question: "Why are visuals useful here?",
      options: [
        "They show symbol flow step by step",
        "They remove the need for operators",
        "They make all expressions equal",
        "They avoid precedence rules",
      ],
      answer: "They show symbol flow step by step",
    },
    {
      question: "Calculator engines may rely on:",
      options: ["Expression parsing", "Queue balancing", "Heap rotations", "Graph coding"],
      answer: "Expression parsing",
    },
  ],
  "message-queue": [
    {
      question: "A message queue helps connect:",
      options: [
        "Producers and consumers",
        "Only stacks and heaps",
        "Only trees and graphs",
        "Only users and screens",
      ],
      answer: "Producers and consumers",
    },
    {
      question: "Why are message queues useful?",
      options: [
        "They allow independent processing",
        "They sort all data automatically",
        "They remove all delays",
        "They replace databases",
      ],
      answer: "They allow independent processing",
    },
    {
      question: "A message queue preserves:",
      options: ["Ordered delivery", "Tree height", "Prefix codes", "AVL rotations"],
      answer: "Ordered delivery",
    },
    {
      question: "Which real-world area uses message queues?",
      options: ["Backend systems", "Only image editing", "Only CSS rendering", "Only PDFs"],
      answer: "Backend systems",
    },
    {
      question: "Async processing often uses:",
      options: ["Message queues", "Only linked lists", "Only BSTs", "Only Huffman trees"],
      answer: "Message queues",
    },
    {
      question: "Queue-backed messaging helps when systems need to:",
      options: [
        "Communicate reliably in order",
        "Rotate trees",
        "Sort bars visually",
        "Compress characters only",
      ],
      answer: "Communicate reliably in order",
    },
    {
      question: "In producer-consumer systems, producers usually:",
      options: [
        "Send jobs/messages",
        "Always consume jobs",
        "Rotate heaps",
        "Parse expressions",
      ],
      answer: "Send jobs/messages",
    },
    {
      question: "Consumers in a message queue usually:",
      options: [
        "Process queued jobs",
        "Create new tree nodes only",
        "Sort all arrays",
        "Change operator precedence",
      ],
      answer: "Process queued jobs",
    },
    {
      question: "Order pipelines can be modeled with:",
      options: ["Message queues", "AVL trees", "Huffman coding", "Inorder traversal"],
      answer: "Message queues",
    },
    {
      question: "Which property is most important here?",
      options: ["Decoupled communication", "Node rotation", "Prefix property", "Recursive height"],
      answer: "Decoupled communication",
    },
  ],
  polynomial: [
    {
      question: "Polynomial multiplication works by:",
      options: [
        "Term-by-term multiplication",
        "Only sorting coefficients",
        "Only compressing symbols",
        "Only queueing variables",
      ],
      answer: "Term-by-term multiplication",
    },
    {
      question: "What is combined progressively in polynomial multiplication?",
      options: ["Results of multiplied terms", "Only node pointers", "Only stack frames", "Only path costs"],
      answer: "Results of multiplied terms",
    },
    {
      question: "This topic helps visualize:",
      options: [
        "Symbolic flow",
        "Only graph weights",
        "Only FIFO order",
        "Only LIFO order",
      ],
      answer: "Symbolic flow",
    },
    {
      question: "Polynomial terms may be represented using:",
      options: [
        "Structured logic and linked representation",
        "Only bitmap images",
        "Only binary trees",
        "Only network packets",
      ],
      answer: "Structured logic and linked representation",
    },
    {
      question: "Which is an example of a polynomial term?",
      options: ["2x²", "enqueue()", "peek()", "node->next"],
      answer: "2x²",
    },
    {
      question: "Math engines may use polynomial multiplication for:",
      options: [
        "Symbolic computation",
        "Only ticket handling",
        "Only undo systems",
        "Only routing maps",
      ],
      answer: "Symbolic computation",
    },
    {
      question: "When multiplying 2x² by x, the result is:",
      options: ["2x³", "2x²", "3x²", "x³"],
      answer: "2x³",
    },
    {
      question: "Why is visual term flow helpful?",
      options: [
        "It clarifies how terms combine",
        "It removes variables",
        "It avoids multiplication",
        "It sorts automatically",
      ],
      answer: "It clarifies how terms combine",
    },
    {
      question: "Polynomial multiplication mainly belongs to:",
      options: ["Symbolic computation", "Queue scheduling", "Graph traversal", "Compression coding"],
      answer: "Symbolic computation",
    },
    {
      question: "The final result is built by:",
      options: [
        "Combining partial products",
        "Deleting terms",
        "Ignoring exponents",
        "Reversing coefficients only",
      ],
      answer: "Combining partial products",
    },
  ],
  huffman: [
    {
      question: "Huffman coding is mainly used for:",
      options: ["Compression", "Sorting", "Balancing", "Searching only"],
      answer: "Compression",
    },
    {
      question: "Frequent characters usually get:",
      options: [
        "Shorter codes",
        "Longer codes",
        "No codes",
        "Equal-length codes always",
      ],
      answer: "Shorter codes",
    },
    {
      question: "Rare characters usually get:",
      options: ["Longer codes", "No codes", "Only one-bit codes", "Smaller frequency"],
      answer: "Longer codes",
    },
    {
      question: "Huffman coding uses which structure?",
      options: ["Binary tree", "Queue only", "Linked list only", "Array only"],
      answer: "Binary tree",
    },
    {
      question: "What shapes the Huffman tree?",
      options: ["Frequencies", "Colors", "Indexes", "Stack size"],
      answer: "Frequencies",
    },
    {
      question: "Huffman codes are typically:",
      options: ["Prefix codes", "Postfix codes", "Sorted codes", "Circular codes"],
      answer: "Prefix codes",
    },
    {
      question: "Where is Huffman coding useful?",
      options: ["File compression", "Tree balancing", "Undo history", "Queue buffering"],
      answer: "File compression",
    },
    {
      question: "Why is Huffman efficient?",
      options: [
        "Common symbols cost fewer bits",
        "All symbols use same bits",
        "It sorts faster",
        "It avoids trees",
      ],
      answer: "Common symbols cost fewer bits",
    },
    {
      question: "Transmission efficiency improves because data becomes:",
      options: ["More compact", "Unordered", "Balanced only", "Graph-shaped"],
      answer: "More compact",
    },
    {
      question: "Which pair is central in Huffman coding?",
      options: [
        "Frequency and code length",
        "Push and pop",
        "Front and rear",
        "Left and right rotation",
      ],
      answer: "Frequency and code length",
    },
  ],
  graph: [
    {
      question: "What does BFS stand for?",
      options: ["Breadth First Search", "Best First Search", "Binary First Search", "Back First Search"],
      answer: "Breadth First Search",
    },
    {
      question: "Which data structure does BFS use internally?",
      options: ["Stack", "Queue", "Heap", "Tree"],
      answer: "Queue",
    },
    {
      question: "Which data structure does DFS use internally (or implicitly)?",
      options: ["Queue", "Stack (or recursion call stack)", "Heap", "HashMap"],
      answer: "Stack (or recursion call stack)",
    },
    {
      question: "BFS is optimal for finding:",
      options: ["Shortest path in unweighted graph", "Minimum spanning tree", "Longest path", "Cycle detection only"],
      answer: "Shortest path in unweighted graph",
    },
    {
      question: "Number of Islands is best solved with:",
      options: ["DFS / BFS flood fill", "Binary search", "Sorting only", "Stack only"],
      answer: "DFS / BFS flood fill",
    },
    {
      question: "Cycle detection in a directed graph uses:",
      options: ["3-state DFS (unvisited, in-path, done)", "2-state DFS only", "BFS only", "Sorting"],
      answer: "3-state DFS (unvisited, in-path, done)",
    },
    {
      question: "Topological sort is only valid for:",
      options: ["Directed Acyclic Graphs (DAGs)", "Undirected graphs", "Weighted graphs", "Any graph"],
      answer: "Directed Acyclic Graphs (DAGs)",
    },
    {
      question: "Which algorithm efficiently detects cycles and finds connected components?",
      options: ["Union Find", "Binary Search", "Bubble Sort", "Sliding Window"],
      answer: "Union Find",
    },
    {
      question: "In graph terminology, V refers to vertices and E refers to:",
      options: ["Edges", "Elements", "Endpoints", "Entries"],
      answer: "Edges",
    },
    {
      question: "Multi-source BFS (e.g., Rotting Oranges) starts BFS from:",
      options: ["All source nodes simultaneously", "One random node", "The largest node only", "Leaf nodes only"],
      answer: "All source nodes simultaneously",
    },
  ],

};

function getExplanation(
  feature: SelectedFeature,
  question: QuizQuestion,
  index: number
) {
  if (question.explanation) return question.explanation;
  const point =
    feature.learnPoints[index % feature.learnPoints.length] ??
    feature.learnPoints[0];
  return `${feature.title}: ${point}. Correct answer: ${question.answer}.`;
}

// ─── FLASHCARD PANEL ────────────────────────────────────────────────────────

function FlashcardPanel({
  feature,
  onBack,
}: {
  feature: SelectedFeature;
  onBack: () => void;
}) {
  const questions = quizMap[feature.previewType] ?? [];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [marked, setMarked] = useState<Record<number, "known" | "review">>({});
  const [showSummary, setShowSummary] = useState(false);
  const [animating, setAnimating] = useState(false);

  const current = questions[currentIndex];
  const knownCount = Object.values(marked).filter((v) => v === "known").length;
  const reviewCount = Object.values(marked).filter((v) => v === "review").length;
  const unmarkedCount = total - Object.keys(marked).length;

  const goTo = (dir: "left" | "right") => {
    if (animating) return;
    setAnimating(true);
    setIsFlipped(false);
    setTimeout(() => {
      if (dir === "right") {
        setCurrentIndex((i) => Math.min(i + 1, total - 1));
      } else {
        setCurrentIndex((i) => Math.max(i - 1, 0));
      }
      setAnimating(false);
    }, 200);
  };

  const markCard = (status: "known" | "review") => {
    setMarked((prev) => ({ ...prev, [currentIndex]: status }));
    if (currentIndex < total - 1) {
      goTo("right");
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMarked({});
    setShowSummary(false);
    setAnimating(false);
  };

  const progressPct = ((currentIndex + 1) / total) * 100;

  if (!current && !showSummary) return null;

  return (
    <div className="mt-7 rounded-[28px] border border-violet-500/15 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10 p-5 md:p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)]">
      {!showSummary ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                <BookOpen className="h-3.5 w-3.5" />
                Flashcards
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {feature.title}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onBack}>
              Back
            </Button>
          </div>

          {/* Progress bar + counter */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 rounded-full bg-violet-500/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Status pills */}
          <div className="flex gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> {knownCount} Known
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <RotateCcw className="h-3 w-3" /> {reviewCount} Review
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
              {unmarkedCount} Left
            </span>
          </div>

          {/* ── FLASHCARD ── */}
          <div
            className="relative w-full cursor-pointer select-none"
            style={{ perspective: "1200px" }}
            onClick={() => !animating && setIsFlipped((f) => !f)}
          >
            <div
              className="relative w-full"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: animating
                  ? "none"
                  : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* ── FRONT (Question) ── */}
              <div
                className="w-full rounded-3xl border border-violet-500/15 bg-background/90 shadow-[0_8px_32px_rgba(139,92,246,0.10)]"
                style={{
  backfaceVisibility: "hidden",
  minHeight: "160px",
}}
              >
                <div className="flex flex-col items-center justify-center gap-4 p-7 md:p-9 text-center min-h-[160px]">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/10 bg-violet-500/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-violet-500">
                    Question {currentIndex + 1}
                  </div>
                  <p className="text-lg md:text-xl font-semibold leading-relaxed max-w-lg">
                    {current.question}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tap to reveal answer
                  </p>
                </div>
              </div>

              {/* ── BACK (Answer) ── */}
              <div
                className="absolute inset-0 w-full rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10 shadow-[0_8px_32px_rgba(16,185,129,0.10)]"
style={{
  backfaceVisibility: "hidden",
  transform: "rotateY(180deg)",
  minHeight: "160px",
}}
              >
                <div className="flex flex-col items-start gap-3 p-6 md:p-8">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
                    Answer
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-300 leading-snug">
                    {current.answer}
                  </p>
                  <div className="rounded-2xl border border-violet-500/10 bg-background/60 p-4 w-full">
                    <p className="text-sm text-muted-foreground leading-6">
                      {getExplanation(feature, current, currentIndex)}
                    </p>
                  </div>

                  {/* All options */}
                  
                </div>
              </div>
            </div>
          </div>

          {/* ── MARK BUTTONS — rendered BELOW the card, outside the flip container ── */}
          {isFlipped && (
  <div className="mt-4 flex flex-col gap-3">
    {/* Options grid */}
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
      {current.options.map((opt) => (
        <div
          key={opt}
          className={`rounded-xl border px-3 py-2 text-sm font-medium ${
            opt === current.answer
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-violet-500/10 text-muted-foreground"
          }`}
        >
          {opt === current.answer && (
            <CheckCircle2 className="inline h-3.5 w-3.5 mr-1.5 mb-0.5" />
          )}
          {opt}
        </div>
      ))}
    </div>

    {/* Mark buttons */}
    <div className="flex gap-3">
      <button
        onClick={() => markCard("review")}
        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-400/20 transition-all duration-200"
      >
        <RotateCcw className="h-4 w-4" />
        Still Learning
      </button>
      <button
        onClick={() => markCard("known")}
        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-200"
      >
        <CheckCircle2 className="h-4 w-4" />
        Got It!
      </button>
    </div>
  </div>
)}

          {/* ── NAV ROW ── */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goTo("left")}
              disabled={currentIndex === 0 || animating}
              className="rounded-xl gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 overflow-hidden max-w-[200px]">
              {questions.map((_, i) => {
                const status = marked[i];
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentIndex(i);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-5 h-2.5 bg-violet-600"
                        : status === "known"
                        ? "w-2.5 h-2.5 bg-emerald-500/60"
                        : status === "review"
                        ? "w-2.5 h-2.5 bg-amber-400/70"
                        : "w-2.5 h-2.5 bg-violet-500/20"
                    }`}
                  />
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentIndex === total - 1) setShowSummary(true);
                else goTo("right");
              }}
              disabled={animating}
              className="rounded-xl gap-1.5"
            >
              {currentIndex === total - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        /* ── SUMMARY SCREEN ── */
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Session Complete
            </div>
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          </div>

          <div className="flex flex-col items-center py-6">
            <div className="relative w-28 h-28 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-violet-500/10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(knownCount / total) * 251.2} 251.2`}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{knownCount}</span>
                <span className="text-xs text-muted-foreground">/ {total}</span>
              </div>
            </div>
            <p className="text-lg font-semibold">
              {knownCount === total
                ? "Perfect round! 🎉"
                : knownCount >= total * 0.7
                ? "Great progress!"
                : "Keep practicing!"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {knownCount} known · {reviewCount} need review · {unmarkedCount} skipped
            </p>
          </div>

          <div className="space-y-2.5 mt-2 max-h-60 overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const status = marked[i];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                    status === "known"
                      ? "border-emerald-500/15 bg-emerald-500/5"
                      : status === "review"
                      ? "border-amber-400/20 bg-amber-400/8"
                      : "border-violet-500/10 bg-background/50"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {status === "known" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : status === "review" ? (
                      <RotateCcw className="h-4 w-4 text-amber-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-violet-500/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-5 truncate">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            {reviewCount > 0 && (
              <Button variant="outline" onClick={handleRestart} className="rounded-xl gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry All
              </Button>
            )}
            <Button onClick={handleRestart} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white gap-2">
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PREVIEW SHELLS & CARDS (unchanged) ──────────────────────────────────────

const surfaceClass =
  "relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,243,255,0.98)_34%,rgba(255,248,235,0.96)_100%)] shadow-[0_10px_35px_rgba(91,33,182,0.06)] dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]";

function PreviewShell({
  label,
  rightLabel,
  children,
  footer,
}: {
  label: string;
  rightLabel?: string;
  children: ReactNode;
  footer: string;
}) {
  return (
    <div
      className={`${surfaceClass} aspect-[16/10] p-4 sm:p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(109,40,217,0.15)]`}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_36%)]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex w-fit rounded-full border border-violet-400/15 bg-white/75 px-3 py-1 text-[11px] font-semibold tracking-wide text-violet-700 dark:bg-white/5 dark:text-violet-300">
            {label}
          </span>
          {rightLabel ? (
            <span className="text-[11px] font-medium text-muted-foreground">
              {rightLabel}
            </span>
          ) : null}
        </div>
        <div className="flex-1">{children}</div>
        <div className="pt-2 text-sm font-medium text-foreground/90">
          {footer}
        </div>
      </div>
    </div>
  );
}

function SortingPreview() {
  const bars = [30, 64, 42, 84, 58, 26, 72];
  return (
    <PreviewShell label="Animated Bars" rightLabel="Sorting Flow" footer="Compare, swap, and reorder visually">
      <div className="flex h-full items-end justify-center gap-2 pt-5 pb-3">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-5 rounded-t-[14px] bg-gradient-to-t ${i === 3 ? "from-amber-500 via-fuchsia-500 to-violet-600" : "from-violet-600 via-violet-500 to-blue-500"} transition-all duration-500 ${i % 2 === 0 ? "group-hover:-translate-y-2" : "group-hover:translate-y-1"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </PreviewShell>
  );
}

function StackPreview() {
  return (
    <PreviewShell label="LIFO" rightLabel="Push / Pop" footer="Last item enters and exits first">
      <div className="flex h-full items-center justify-center pt-3">
        <div className="relative flex w-24 flex-col-reverse gap-2 rounded-[20px] border border-violet-500/15 bg-white/40 p-2 dark:bg-white/[0.03]">
          {["10", "18", "27", "44"].map((item, i) => (
            <div
              key={item}
              className={`flex h-10 items-center justify-center rounded-xl border border-violet-500/15 text-sm font-semibold transition-all duration-500 ${i === 3 ? "bg-gradient-to-r from-amber-400/30 to-violet-500/20 group-hover:-translate-y-2" : "bg-gradient-to-r from-violet-500/15 to-blue-500/10"}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </PreviewShell>
  );
}

function QueuePreview({ message = false }: { message?: boolean }) {
  const items = message ? ["Msg A", "Msg B", "Msg C", "Msg D"] : ["12", "18", "24", "31"];
  return (
    <PreviewShell label="FIFO" rightLabel={message ? "Producer / Consumer" : "Queue Flow"} footer={message ? "Ordered delivery between system parts" : "First item exits first"}>
      <div className="flex h-full items-center pt-5">
        <div className="w-full rounded-[22px] border border-violet-500/15 bg-white/40 p-3 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 overflow-hidden">
            {items.map((item, i) => (
              <div
                key={item}
                className={`min-w-[68px] rounded-xl border px-3 py-4 text-center text-sm font-semibold transition-all duration-500 ${i === 0 ? "border-amber-400/25 bg-gradient-to-r from-amber-400/25 to-violet-500/10 group-hover:-translate-x-2" : i === items.length - 1 ? "border-violet-500/15 bg-gradient-to-r from-violet-500/15 to-blue-500/10 group-hover:translate-x-2" : "border-violet-500/15 bg-gradient-to-r from-violet-500/15 to-blue-500/10"}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function LinkedListPreview() {
  return (
    <PreviewShell label="Node Links" rightLabel="Pointer Chain" footer="Traverse node to node with links">
      <div className="flex h-full items-center justify-center pt-3">
        <div className="flex items-center gap-2">
          {["10", "22", "31", "47"].map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-amber-400/20 text-sm font-semibold">{node}</div>
              {i < 3 && (
                <div className="relative flex items-center">
                  <div className="h-[2px] w-7 bg-gradient-to-r from-violet-500 to-amber-500" />
                  <ArrowRight className="ml-1 h-3.5 w-3.5 text-violet-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PreviewShell>
  );
}

function BSTPreview() {
  return (
    <PreviewShell label="BST View" rightLabel="Ordered Search" footer="Left smaller, right larger">
      <div className="relative mx-auto h-full max-w-[220px] pt-2">
        <div className="absolute left-1/2 top-2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-semibold text-white">40</div>
        <div className="absolute left-[28%] top-14 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">22</div>
        <div className="absolute right-[28%] top-14 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/15 text-sm font-semibold">61</div>
        <div className="absolute left-[13%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">12</div>
        <div className="absolute left-[41%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">31</div>
        <div className="absolute right-[41%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">52</div>
        <div className="absolute right-[13%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/15 text-sm font-semibold">74</div>
        <div className="absolute left-1/2 top-12 h-[2px] w-16 -translate-x-[94%] rotate-[28deg] bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="absolute left-1/2 top-12 h-[2px] w-16 translate-x-[4%] -rotate-[28deg] bg-gradient-to-r from-violet-500 to-amber-500" />
        <div className="absolute left-[31%] top-[84px] h-[2px] w-11 -translate-x-[58%] rotate-[26deg] bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="absolute left-[31%] top-[84px] h-[2px] w-11 translate-x-[8%] -rotate-[26deg] bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="absolute right-[31%] top-[84px] h-[2px] w-11 -translate-x-[8%] rotate-[26deg] bg-gradient-to-r from-violet-500 to-amber-500" />
        <div className="absolute right-[31%] top-[84px] h-[2px] w-11 translate-x-[58%] -rotate-[26deg] bg-gradient-to-r from-violet-500 to-amber-500" />
      </div>
    </PreviewShell>
  );
}

function AVLPreview() {
  return (
    <PreviewShell label="Balanced Tree" rightLabel="AVL Rotations" footer="Rebalance with smart rotations">
      <div className="flex h-full items-center justify-center">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-2">
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center">
            <div className="text-xs font-medium text-muted-foreground">Before</div>
            <div className="mt-2 space-y-2 text-sm font-semibold">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">30</div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">20</div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/25">10</div>
            </div>
          </div>
          <div className="rounded-full border border-violet-500/15 bg-white/70 p-2 dark:bg-white/[0.05]">
            <ArrowRight className="h-5 w-5 text-violet-600 dark:text-violet-300" />
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center">
            <div className="text-xs font-medium text-muted-foreground">After</div>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">20</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">10</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/25">30</div>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function HeapPreview() {
  return (
    <PreviewShell label="Priority Heap" rightLabel="Max Heap" footer="Highest priority stays on top">
      <div className="relative mx-auto h-full max-w-[220px] pt-2">
        <div className="absolute left-1/2 top-2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-semibold text-white">90</div>
        <div className="absolute left-[30%] top-14 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">65</div>
        <div className="absolute right-[30%] top-14 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">52</div>
        <div className="absolute left-[14%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/15 text-sm font-semibold">31</div>
        <div className="absolute right-[14%] top-28 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/20 bg-white/75 text-sm font-semibold dark:bg-white/[0.06]">18</div>
        <div className="absolute left-1/2 top-12 h-[2px] w-16 -translate-x-[94%] rotate-[28deg] bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="absolute left-1/2 top-12 h-[2px] w-16 translate-x-[4%] -rotate-[28deg] bg-gradient-to-r from-violet-500 to-amber-500" />
        <div className="absolute left-[33%] top-[84px] h-[2px] w-12 -translate-x-[55%] rotate-[28deg] bg-gradient-to-r from-violet-500 to-amber-500" />
        <div className="absolute right-[33%] top-[84px] h-[2px] w-12 translate-x-[55%] -rotate-[28deg] bg-gradient-to-r from-violet-500 to-blue-500" />
      </div>
    </PreviewShell>
  );
}

function ExpressionPreview() {
  return (
    <PreviewShell label="Expression Flow" rightLabel="Stack Logic" footer="Convert symbols using precedence rules">
      <div className="flex h-full flex-col justify-center gap-3 pt-1">
        <div className="rounded-2xl border border-violet-500/15 bg-white/55 px-4 py-3 text-center text-sm font-semibold tracking-wide dark:bg-white/[0.03]">( A + B ) × C</div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-700 dark:text-violet-300">scan</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="rounded-full bg-amber-400/15 px-2 py-1 text-amber-700 dark:text-amber-300">stack</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-700 dark:text-blue-300">output</span>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center text-sm font-semibold">AB+C×</div>
      </div>
    </PreviewShell>
  );
}

function PolynomialPreview() {
  return (
    <PreviewShell label="Polynomial Terms" rightLabel="Term Multiplication" footer="Break larger expressions into term pairs">
      <div className="flex h-full flex-col justify-center gap-3 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-violet-500/15 bg-violet-500/10 px-3 py-3 text-center text-sm font-semibold">2x² + 3x</div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-3 text-center text-sm font-semibold">x + 4</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
          <div className="rounded-xl border border-violet-500/15 bg-white/60 px-2 py-2 text-center dark:bg-white/[0.03]">2x³</div>
          <div className="rounded-xl border border-violet-500/15 bg-white/60 px-2 py-2 text-center dark:bg-white/[0.03]">8x²</div>
          <div className="rounded-xl border border-violet-500/15 bg-white/60 px-2 py-2 text-center dark:bg-white/[0.03]">3x²</div>
        </div>
      </div>
    </PreviewShell>
  );
}

function HuffmanPreview() {
  return (
    <PreviewShell label="Encoding Tree" rightLabel="Compression" footer="Shorter codes for frequent symbols">
      <div className="flex h-full items-center justify-center pt-2">
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
          <div className="rounded-2xl border border-violet-500/15 bg-white/55 px-4 py-3 dark:bg-white/[0.03]">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Frequency</div>
            <div className="space-y-1"><div>A → 8</div><div>B → 3</div><div>C → 2</div></div>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Codes</div>
            <div className="space-y-1"><div>A → 0</div><div>B → 10</div><div>C → 11</div></div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function GraphPreview() {
  // Paste PreviewShell from your existing features.tsx context
  const nodes = [
    { x: "50%", y: "18%", label: "A", root: true },
    { x: "28%", y: "50%", label: "B" },
    { x: "72%", y: "50%", label: "C" },
    { x: "18%", y: "82%", label: "D" },
    { x: "42%", y: "82%", label: "E" },
  ]
  const edges = [
    ["50%","18%","28%","50%"], ["50%","18%","72%","50%"],
    ["28%","50%","18%","82%"], ["28%","50%","42%","82%"],
  ]
 
  return (
    <PreviewShell label="Graph Traversal" rightLabel="BFS / DFS" footer="Explore nodes and edges step by step">
      <div className="relative h-full w-full pt-2">
        <svg className="absolute inset-0 w-full h-full" style={{top:0,left:0}}>
          {edges.map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeLinecap="round"/>
          ))}
        </svg>
        {nodes.map((n,i)=>(
          <div key={i}
            className={[
              "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-bold font-mono transition-all duration-500",
              n.root
                ? "border-violet-500 bg-gradient-to-br from-violet-600/30 to-violet-500/10 text-violet-700 dark:text-violet-300 shadow-[0_0_14px_rgba(139,92,246,0.4)] group-hover:-translate-y-3"
                : i===1||i===2
                ? "border-amber-400/60 bg-amber-400/15 text-amber-700 dark:text-amber-300 group-hover:-translate-y-1"
                : "border-violet-500/20 bg-white/70 dark:bg-white/[0.06] text-foreground",
            ].join(" ")}
            style={{ left: n.x, top: n.y }}
          >
            {n.label}
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}
function ArrayPreview() {
  const cells = [3, 7, 1, 9, 4, 6, 2];
  return (
    <PreviewShell label="Array Cells" rightLabel="Index Access" footer="Access any element in O(1) by index">
      <div className="flex h-full items-center justify-center pt-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-end gap-1.5">
            {cells.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={[
                    "flex items-center justify-center rounded-xl border-2 font-mono font-semibold text-sm transition-all duration-500 w-11 h-11",
                    i === 3
                      ? "border-violet-500 bg-gradient-to-b from-violet-600/30 to-violet-500/10 text-violet-600 shadow-[0_0_14px_rgba(139,92,246,0.4)] group-hover:-translate-y-2"
                      : i === 0 || i === 6
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-600 group-hover:-translate-y-1"
                      : "border-violet-500/20 bg-white/70 text-foreground dark:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50">{i}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="rounded-full border border-violet-500/15 bg-violet-500/5 px-2 py-0.5 text-violet-600 dark:text-violet-300">arr[3] = 9</span>
            <span className="opacity-50">O(1)</span>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

const PreviewCard = ({ type }: { type: SelectedFeature["previewType"] }) => {
  switch (type) {
    case "graph": return <GraphPreview />;
    case "array" : return <ArrayPreview />;
    case "sorting": return <SortingPreview />;
    case "stack": return <StackPreview />;
    case "queue": return <QueuePreview />;
    case "linked-list": return <LinkedListPreview />;
    case "bst": return <BSTPreview />;
    case "avl": return <AVLPreview />;
    case "heap": return <HeapPreview />;
    case "expression": return <ExpressionPreview />;
    case "message-queue": return <QueuePreview message />;
    case "polynomial": return <PolynomialPreview />;
    case "huffman": return <HuffmanPreview />;
    case "graph": return <GraphPreview />;
    default: return <SortingPreview />;
  }
};

// ─── MAIN FEATURES SECTION ───────────────────────────────────────────────────

export const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <section id="features" className="relative w-full overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_36%,#fffdf8_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#0d0916_38%,#130e08_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_26%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_20%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_28%)]" />
      <div className="absolute left-[-8%] top-20 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-[-6%] top-32 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/5 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          <div className="relative overflow-hidden rounded-[34px] border border-violet-500/12 bg-white/70 px-5 py-8 shadow-[0_20px_70px_rgba(88,28,135,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_20px_80px_rgba(0,0,0,0.28)] md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.08),transparent_34%,rgba(245,158,11,0.06)_100%)]" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
            <div className="absolute -top-16 right-8 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative">
              <div className="flex gap-4 flex-col items-start">
                <div>
                  <Badge className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-violet-700 shadow-sm dark:text-violet-300">
                    Features
                  </Badge>
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                    Interactive Learning Tools
                  </h2>
                  <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                    Learn data structures and their applications through hands-on visualizations and real-world examples.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title + index}
                className="group relative cursor-pointer overflow-hidden rounded-[32px] border border-violet-500/10 bg-white/80 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/20 hover:shadow-[0_24px_60px_rgba(109,40,217,0.14)] dark:bg-white/[0.03]"
                onClick={() => setSelectedFeature(feature as SelectedFeature)}
              >
                <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(139,92,246,0.05),transparent_42%,rgba(245,158,11,0.05)_100%)]" />
                <div className="absolute -right-12 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition duration-300 group-hover:bg-violet-500/15" />
                <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-amber-400/8 blur-2xl transition duration-300 group-hover:bg-amber-400/12" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                <div className="relative">
                  <PreviewCard type={feature.previewType} />
                  <div className="mt-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                      <div className="rounded-full border border-violet-500/10 bg-violet-500/5 p-2 text-violet-600 shadow-sm dark:text-violet-300">
                        <Boxes className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground md:text-[15px]">{feature.description}</p>
                    <div className="flex items-center gap-2 pt-1 text-sm font-medium text-violet-700 dark:text-violet-300">
                      Open preview
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedFeature}
        onOpenChange={() => {
          setSelectedFeature(null);
          setShowQuiz(false);
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-violet-500/15 bg-background/95 backdrop-blur-2xl rounded-3xl p-0">
          {selectedFeature && (
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 left-10 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
              </div>

              <div className="relative p-6 md:p-8">
                <DialogHeader className="space-y-3 text-left">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Interactive Topic Preview
                  </div>
                  <DialogTitle className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                    {selectedFeature.title}
                  </DialogTitle>
                  <DialogDescription className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                    {selectedFeature.description}
                  </DialogDescription>
                </DialogHeader>

                {!showQuiz ? (
                  <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/10 via-background to-blue-500/10 p-5 md:p-6 shadow-[0_10px_40px_rgba(139,92,246,0.08)]">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                        <Layers3 className="h-4 w-4" />
                        What is {selectedFeature.title}?
                      </div>
                      <p className="text-sm md:text-base leading-7 text-muted-foreground">
                        {selectedFeature.overview}
                      </p>
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedFeature.learnPoints.map((point) => (
                          <div key={point} className="rounded-2xl border border-violet-500/10 bg-background/80 px-4 py-4 text-sm font-medium shadow-sm">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <div className="rounded-3xl border border-violet-500/15 bg-background/80 p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                          <Target className="h-4 w-4" />
                          Where is it used?
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedFeature.useCases.map((item) => (
                            <span key={item} className="rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-2 text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-blue-500/10 p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                          <Zap className="h-4 w-4" />
                          Why learn it visually?
                        </div>
                        <p className="text-sm md:text-base leading-7 text-muted-foreground">
                          Visual learning makes operations easier to understand. Instead of memorizing steps, you can watch each action, compare outcomes, and build stronger intuition.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FlashcardPanel
                    feature={selectedFeature}
                    onBack={() => setShowQuiz(false)}
                  />
                )}

                <DialogFooter className="mt-7 flex-col sm:flex-row sm:justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedFeature(null);
                      setShowQuiz(false);
                    }}
                    className="justify-center sm:justify-start"
                  >
                    {showQuiz ? "Close Flashcards" : "Close Preview"}
                  </Button>

                  {!showQuiz && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setShowQuiz(true)}
                        className="
                          relative overflow-hidden rounded-xl
                          bg-white text-black
                          border border-black/20
                          px-6 py-2
                          transition-all duration-300
                          hover:bg-white hover:text-black hover:border-transparent hover:scale-[1.02]
                          hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]
                          before:absolute before:inset-0 before:rounded-xl before:p-[3px]
                          before:bg-gradient-to-r before:from-purple-600 before:via-violet-500 before:to-fuchsia-500
                          before:opacity-0 before:transition-all before:duration-300
                          hover:before:opacity-100
                          before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                          before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                        "
                      >
                        Study Flashcards
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="
                          relative overflow-hidden rounded-xl
                          bg-white text-black
                          border border-black/20
                          px-6 py-2
                          transition-all duration-300
                          hover:bg-white hover:text-black hover:border-transparent hover:scale-[1.02]
                          hover:shadow-[0_0_20px_rgba(245,158,11,0.7)]
                          before:absolute before:inset-0 before:rounded-xl before:p-[3px]
                          before:bg-gradient-to-r before:from-yellow-500 before:via-amber-400 before:to-orange-400
                          before:opacity-0 before:transition-all before:duration-300
                          hover:before:opacity-100
                          before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                          before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                        "
                      > 
                       <Link href={`${selectedFeature.url}?mode=code`} className="flex items-center gap-2">
                          Try with Code <Code2 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-95 shadow-[0_10px_30px_rgba(139,92,246,0.22)]"
                      >
                        <Link href={`${selectedFeature.url}?mode=input`} className="gap-2">
                          Try with Input <Keyboard className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};