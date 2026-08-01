import { Lightbulb, ScanEye, Target } from "lucide-react"

type Guide = { simple: string; steps: string[]; tryIt: string; watch: string }

const guides: Record<string, Guide> = {
  array: { simple: "An array is a structured sequence of values stored in indexed positions, making it easy to access, update, and rearrange items efficiently.", steps: ["Choose a set of values and place them in order.", "Use the index to read, update, insert, or remove an item.", "Observe how inserting in the middle forces the following values to shift."] , tryIt: "Try inserting a value near the beginning and compare that behavior with adding one at the end.", watch: "The index labels, highlighted cells, and the movement of values as the array changes." },
  stack: { simple: "A stack is a last-in, first-out structure: the most recently added item is the first one to be removed, much like a stack of plates.", steps: ["Push places a new value on top.", "Pop removes the current top value.", "Peek reveals the top item without removing it."], tryIt: "Push three values, then remove them one by one to see the reversal in order.", watch: "The top marker and the way the sequence flips as items leave the structure." },
  queue: { simple: "A queue follows a first-in, first-out flow, where the earliest item is processed first, much like people waiting in line.", steps: ["Enqueue adds a value to the rear.", "Dequeue removes the value at the front.", "The front and rear pointers keep the order easy to track."], tryIt: "Add several values, then remove them in sequence to see the order preserved.", watch: "The front and rear markers, along with the order in which values leave the queue." },
  "linked-list": { simple: "A linked list stores each value in its own node, and each node points to the next one, allowing the structure to grow dynamically without a single continuous block of memory.", steps: ["Create a node with a value and a link to the next one.", "Reconnect the pointers when inserting or deleting.", "Traverse the list by following the next references from the head."], tryIt: "Insert a value in the middle and then remove it to see the links update in real time.", watch: "The head, tail, and the arrows that are rewired during each operation." },
  "binary-tree": { simple: "A binary tree is a hierarchical structure in which each node can have up to two children, creating a branching path for organizing and searching values.", steps: ["Start at the root.", "Compare the new value with the current node.", "Move left or right until an empty position is found."], tryIt: "Insert values that create both left and right branches so the traversal becomes more visible.", watch: "Each comparison and the route taken from the root as the tree grows." },
  sorting: { simple: "Sorting transforms a collection into a predictable order, making it easier to scan, compare, and search. Different algorithms achieve this in different ways.", steps: ["Compare the highlighted values.", "Swap or copy them when the order is incorrect.", "Repeat until every item is in its final position."], tryIt: "Run the same small list with multiple algorithms and compare how each one approaches the problem.", watch: "The comparisons, swaps, and the portion of the list that becomes visibly sorted." },
  graph: { simple: "A graph models relationships between entities through nodes and edges, and traversal algorithms explore those connections in structured ways.", steps: ["Choose a starting node.", "BFS explores neighbors layer by layer.", "DFS follows one branch deeply before backtracking."], tryIt: "Run BFS and DFS from the same node to compare how each path unfolds.", watch: "The visited nodes, the traversal queue or path, and the final order of exploration." },
  heap: { simple: "A heap is a tree-based structure that keeps a priority value at the top, allowing fast access to the smallest or largest item depending on the variant.", steps: ["Add a value in the next available position.", "Bubble it upward until the heap property is restored.", "After removing the root, move the last value into place."], tryIt: "Insert a small value and then a much larger one to see how the heap reorders itself.", watch: "The parent-child comparisons and the values moving up or down as the heap adjusts." },
  "infix-postfix": { simple: "Infix notation is the familiar mathematical style people write by hand, while postfix notation places the operator after its operands, which makes evaluation more systematic.", steps: ["Read the tokens from left to right.", "Send operands to the output immediately.", "Use the stack to hold operators until precedence allows them to be output."], tryIt: "Convert an expression like A+B*C and observe why multiplication is handled first.", watch: "The operator stack, the postfix output, and the precedence decisions as they occur." },
  polynomial: { simple: "A polynomial is a symbolic expression made up of terms, and multiplication combines each term from one polynomial with each term from another before like powers are merged.", steps: ["Select one term from each polynomial.", "Multiply the coefficients and add the exponents.", "Combine terms that share the same power."], tryIt: "Use (x + 1) and (x + 2) and follow each term pair through the multiplication process.", watch: "The selected terms and the result list as matching powers are combined." },
  huffman: { simple: "Huffman coding compresses data by assigning shorter binary codes to frequent characters and longer codes to rarer ones, reducing the overall size of the message.", steps: ["Count the frequency of each character.", "Repeatedly join the two least frequent nodes.", "Use left as 0 and right as 1 to build the final code tree."], tryIt: "Encode a simple repeated phrase such as BANANA to see how the tree evolves.", watch: "The priority queue, the merged nodes, and the final character codes." },
  dijkstra: { simple: "Dijkstra's algorithm finds the shortest path from a starting node by repeatedly selecting the most promising unvisited option and relaxing its outgoing edges.", steps: ["Set the start distance to zero and all others to infinity.", "Visit the unvisited node with the smallest known distance.", "Relax its edges and update any shorter paths you discover."], tryIt: "Load an example graph and change the start and end nodes to see how the shortest path updates.", watch: "The tentative distances, visited nodes, and the path that eventually becomes final." },
  "message-queue": { simple: "A message queue decouples producers from consumers by buffering work until it can be processed, allowing systems to handle traffic more smoothly.", steps: ["A producer publishes a message.", "The queue stores it safely until processing begins.", "A consumer retrieves and processes the message."], tryIt: "Send several messages before starting the consumer to see how the queue fills and drains.", watch: "The message state as it moves from producer, through the queue, and into the consumer." },
}

export function TopicExplanation({ topic }: { topic: string }) {
  const guide = guides[topic]
  if (!guide) return null

  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.09] via-white/80 to-sky-500/[0.08] p-6 shadow-[0_12px_40px_rgba(139,92,246,0.08)] backdrop-blur-xl dark:from-violet-500/[0.14] dark:via-slate-950/60 dark:to-sky-500/[0.1]">
      <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-8 left-0 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
        <div>
          <h2 className="font-semibold text-foreground">Start here: the plain-English version</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{guide.simple}</p>
        </div>
      </div>

      <div className="relative mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-violet-500/10 bg-white/70 p-4 dark:bg-slate-900/40">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ScanEye className="h-4 w-4 text-violet-500" />
            How to follow the animation
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-violet-500/10 bg-white/70 p-4 dark:bg-slate-900/40">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Target className="h-4 w-4 text-violet-500" />
              Try this
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{guide.tryIt}</p>
          </div>
          <div className="rounded-2xl border border-violet-500/10 bg-white/70 p-4 dark:bg-slate-900/40">
            <h3 className="text-sm font-semibold text-foreground">What to watch</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{guide.watch}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
