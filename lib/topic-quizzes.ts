export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

// Keyed by visualizer route slug. Topics with their own bespoke quiz
// (functions, time-complexity) are intentionally absent.
export const TOPIC_QUIZZES: Record<string, QuizQuestion[]> = {
  array: [
    {
      question: "An array has 5 elements. What is the index of the last one?",
      options: ["5", "4", "6", "1"],
      answerIndex: 1,
      explanation: "Indexes start at 0, so five elements are numbered 0, 1, 2, 3, 4.",
    },
    {
      question: "Why is inserting a value at the start of an array slow?",
      options: ["Arrays can't be changed", "Every other element has to shift over by one", "The computer has to sort it first", "It needs a new array of a different type"],
      answerIndex: 1,
      explanation: "Elements sit side by side, so making room at the front means moving all the others one place to the right.",
    },
    {
      question: "You need to read the item at position 250 of an array. How much work is that?",
      options: ["Check the first 249 items", "One step — jump straight to the index", "Half the array", "It depends on the values"],
      answerIndex: 1,
      explanation: "Arrays support direct access by index, so reading any position takes the same tiny effort. That's O(1).",
    },
  ],
  sorting: [
    {
      question: "What does a \"swap\" do in a sorting algorithm?",
      options: ["Deletes a value", "Exchanges the positions of two values", "Copies the array", "Reverses the whole list"],
      answerIndex: 1,
      explanation: "A swap trades two items' places. Many sorts are just repeated compare-then-swap.",
    },
    {
      question: "A sort is called \"stable\" when it…",
      options: ["Never crashes", "Keeps equal values in their original order", "Runs in constant time", "Uses no extra memory"],
      answerIndex: 1,
      explanation: "If two items compare as equal, a stable sort leaves the one that came first still first.",
    },
    {
      question: "Which is generally faster on a large list?",
      options: ["Bubble Sort, O(n²)", "Merge Sort, O(n log n)", "They're always equal", "Neither can sort large lists"],
      answerIndex: 1,
      explanation: "n log n grows far more slowly than n². On a million items that's the difference between seconds and hours.",
    },
  ],
  recursion: [
    {
      question: "What does the base case do?",
      options: ["Starts the recursion", "Stops the recursion by answering the simplest case directly", "Makes the function faster", "Stores the results"],
      answerIndex: 1,
      explanation: "Without a base case the function calls itself forever. The base case is the point where it finally just returns an answer.",
    },
    {
      question: "What happens if a recursive function has no base case?",
      options: ["It returns 0", "It calls itself until the program runs out of memory (stack overflow)", "It runs once", "Nothing"],
      answerIndex: 1,
      explanation: "Each call waits on the call stack. With nothing to stop it, the stack fills up and the program crashes.",
    },
    {
      question: "In factorial(4) = 4 × factorial(3), what is factorial(3)?",
      options: ["A smaller version of the same problem", "The base case", "An error", "A loop"],
      answerIndex: 0,
      explanation: "Recursion solves a problem by handing a smaller copy of itself to another call, until the base case is reached.",
    },
  ],
  stack: [
    {
      question: "You push 1, 2, 3 onto a stack, then pop once. Which value comes out?",
      options: ["1", "2", "3", "It's random"],
      answerIndex: 2,
      explanation: "A stack is Last In, First Out. 3 went in last, so it comes out first.",
    },
    {
      question: "Which everyday thing behaves like a stack?",
      options: ["A queue at a cinema", "The browser Back button", "A sorted contact list", "A family tree"],
      answerIndex: 1,
      explanation: "Each page you visit is pushed on top, and Back pops the most recent one.",
    },
    {
      question: "What does \"peek\" do on a stack?",
      options: ["Removes the top item", "Looks at the top item without removing it", "Empties the stack", "Adds an item"],
      answerIndex: 1,
      explanation: "Peek reads the top value and leaves the stack unchanged.",
    },
  ],
  queue: [
    {
      question: "You enqueue A, B, C, then dequeue once. What comes out?",
      options: ["A", "B", "C", "All of them"],
      answerIndex: 0,
      explanation: "A queue is First In, First Out. A joined first, so A leaves first.",
    },
    {
      question: "Which is a real queue?",
      options: ["Undo history", "Print jobs waiting for a printer", "Browser Back button", "A stack of plates"],
      answerIndex: 1,
      explanation: "Print jobs are handled in the order they arrived — first come, first served.",
    },
    {
      question: "How does a priority queue differ from a normal queue?",
      options: ["It's faster", "The most important item leaves first, not the oldest", "It holds fewer items", "It can't be empty"],
      answerIndex: 1,
      explanation: "In a priority queue, each item has a priority and the highest one is served next regardless of arrival order.",
    },
  ],
  "linked-list": [
    {
      question: "What does each node in a linked list contain?",
      options: ["Only a value", "A value and a pointer to the next node", "An index number", "The whole list"],
      answerIndex: 1,
      explanation: "The pointer is what chains the nodes together.",
    },
    {
      question: "Why is inserting in the middle of a linked list cheap (once you're there)?",
      options: ["Nothing else needs to move — only a couple of pointers change", "It's sorted already", "Nodes are stored in order", "It isn't cheap"],
      answerIndex: 0,
      explanation: "Unlike an array, no elements shift. You just re-point the previous node and the new node.",
    },
    {
      question: "To reach the 10th node in a singly linked list, you must…",
      options: ["Jump to it directly", "Follow the pointers from the head, node by node", "Binary search", "Start from the tail"],
      answerIndex: 1,
      explanation: "There's no index. You always start at the head and walk along the chain, which is O(n).",
    },
  ],
  "binary-tree": [
    {
      question: "How many children can a binary tree node have at most?",
      options: ["1", "2", "3", "As many as you like"],
      answerIndex: 1,
      explanation: "\"Binary\" means two: a left child and a right child.",
    },
    {
      question: "In a Binary Search Tree, where does a value smaller than the current node go?",
      options: ["Left", "Right", "Back to the root", "It replaces the node"],
      answerIndex: 0,
      explanation: "Smaller goes left, bigger goes right. That rule lets each comparison discard half of the remaining tree.",
    },
    {
      question: "What is a leaf?",
      options: ["The root", "A node with no children", "The tallest node", "A node with two children"],
      answerIndex: 1,
      explanation: "Leaves are the ends of the branches — nothing hangs below them.",
    },
  ],
  "avl-tree": [
    {
      question: "What problem does an AVL tree solve?",
      options: ["Sorting arrays", "A BST becoming lopsided and slow", "Storing text", "Finding shortest paths"],
      answerIndex: 1,
      explanation: "Inserting sorted data into a plain BST makes a long chain. AVL trees rebalance so searches stay fast.",
    },
    {
      question: "What restores balance in an AVL tree?",
      options: ["Deleting nodes", "Rotations", "Sorting", "Recursion depth limits"],
      answerIndex: 1,
      explanation: "A rotation rearranges a few nodes to even out the heights without breaking the left-smaller/right-bigger rule.",
    },
    {
      question: "A balanced tree with n nodes has a height of roughly…",
      options: ["n", "n²", "log n", "1"],
      answerIndex: 2,
      explanation: "Each level roughly doubles the node count, so the height grows like log n.",
    },
  ],
  heap: [
    {
      question: "In a max-heap, where is the largest value?",
      options: ["At the top (root)", "At the bottom", "In the middle", "Anywhere"],
      answerIndex: 0,
      explanation: "The heap rule guarantees every parent is at least as big as its children, so the biggest sits at the root.",
    },
    {
      question: "After inserting a value at the bottom of a heap, what happens?",
      options: ["Nothing", "It swaps upward while it's bigger than its parent (max-heap)", "The whole heap is re-sorted", "It's removed"],
      answerIndex: 1,
      explanation: "The new value \"bubbles up\" until the heap rule holds again. That takes at most log n swaps.",
    },
    {
      question: "Which problem is a heap especially good at?",
      options: ["Finding the largest few items repeatedly", "Reversing a string", "Storing a family tree", "Searching text"],
      answerIndex: 0,
      explanation: "Reading the top is instant, so heaps power priority queues and top-K problems.",
    },
  ],
  graph: [
    {
      question: "In a graph, what is an edge?",
      options: ["A thing in the network", "A connection between two nodes", "The starting node", "The total cost"],
      answerIndex: 1,
      explanation: "Nodes are the things; edges are the links between them.",
    },
    {
      question: "BFS explores a graph…",
      options: ["Level by level, nearest neighbours first", "As deep as possible first", "Randomly", "Only along the shortest edge"],
      answerIndex: 0,
      explanation: "BFS uses a queue so it visits all neighbours before going further out. It finds the fewest-hops path.",
    },
    {
      question: "How is a graph different from a tree?",
      options: ["It has no nodes", "It can have cycles and no single root", "It's always smaller", "It's always sorted"],
      answerIndex: 1,
      explanation: "A tree is a special, loop-free graph with one root. General graphs can loop back on themselves.",
    },
  ],
  dijkstra: [
    {
      question: "What does Dijkstra's algorithm compute?",
      options: ["The tallest path", "The shortest distance from a start node to every other node", "A sorted list", "The number of edges"],
      answerIndex: 1,
      explanation: "It finds the cheapest route from one source to all the other nodes in a weighted graph.",
    },
    {
      question: "Which node does it expand next?",
      options: ["A random one", "The unvisited node with the smallest known distance", "The one with most edges", "The last one found"],
      answerIndex: 1,
      explanation: "Always taking the closest unvisited node guarantees that node's distance is final.",
    },
    {
      question: "Dijkstra's algorithm doesn't work correctly if…",
      options: ["The graph is large", "Some edge weights are negative", "There are cycles", "The graph is connected"],
      answerIndex: 1,
      explanation: "A negative edge could make an already-\"finished\" path cheaper later, which breaks its core assumption.",
    },
  ],
  trie: [
    {
      question: "What is a trie mainly used for?",
      options: ["Sorting numbers", "Fast lookups of words by their prefix", "Shortest paths", "Storing images"],
      answerIndex: 1,
      explanation: "Words sharing a prefix share a path, so autocomplete and prefix search are quick.",
    },
    {
      question: "In a trie, what does each edge from a node usually represent?",
      options: ["A number", "A single character", "A whole word", "A weight"],
      answerIndex: 1,
      explanation: "Following characters from the root spells out a word.",
    },
    {
      question: "The words \"car\" and \"cat\" in a trie share…",
      options: ["Nothing", "The path for \"ca\"", "The whole word", "Only the last letter"],
      answerIndex: 1,
      explanation: "They branch apart only after the shared prefix \"ca\", saving space and time.",
    },
  ],
  dp: [
    {
      question: "The core idea of dynamic programming is…",
      options: ["Solve each subproblem once and reuse the answer", "Always use recursion", "Sort the input first", "Use more loops"],
      answerIndex: 0,
      explanation: "Overlapping subproblems are solved a single time and stored, instead of being recomputed over and over.",
    },
    {
      question: "What is memoization?",
      options: ["Deleting old data", "Saving computed results so they aren't recalculated", "A sorting method", "Printing a table"],
      answerIndex: 1,
      explanation: "It's a cache: check whether you've already solved this input before doing the work again.",
    },
    {
      question: "Naive recursive Fibonacci is slow because…",
      options: ["Fibonacci is hard", "It recomputes the same values many times", "It uses a stack", "Numbers get large"],
      answerIndex: 1,
      explanation: "fib(3) gets recalculated in many branches. Storing each result turns exponential time into linear.",
    },
  ],
  huffman: [
    {
      question: "In Huffman coding, which characters get the shortest codes?",
      options: ["The rarest", "The most frequent", "The first alphabetically", "Vowels"],
      answerIndex: 1,
      explanation: "Giving common characters short codes shrinks the total message size.",
    },
    {
      question: "Why must no code be the beginning of another code?",
      options: ["To save memory", "So the bit stream can be decoded without ambiguity", "It's a coincidence", "For sorting"],
      answerIndex: 1,
      explanation: "If \"0\" and \"01\" were both codes, you couldn't tell where one letter ends. Prefix-free codes avoid that.",
    },
    {
      question: "Huffman coding is a kind of…",
      options: ["Lossless compression", "Encryption", "Sorting", "Graph search"],
      answerIndex: 0,
      explanation: "The original text can be recovered exactly — nothing is lost, it's just stored in fewer bits.",
    },
  ],
}
