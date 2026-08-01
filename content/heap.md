# Binary Heap

A binary heap is a complete binary tree that satisfies the heap property. In a max heap, each parent node has a value greater than or equal to its children; in a min heap, each parent node has a value less than or equal to its children.

## Properties

- Complete binary tree: all levels are filled except possibly the last, which is filled from left to right
- Heap property: parent-child relationships follow either the max-heap or min-heap rule
- Array representation: it can be stored efficiently in an array where:
  - For a node at index i:
  - Left child: 2i + 1
  - Right child: 2i + 2
  - Parent: floor((i - 1) / 2)

## Operations

### Insertion (O(log n))
1. Add the element at the next available position
2. Compare it with its parent and swap if the heap property is violated
3. Continue until the heap property is restored (heapify-up)

### Deletion (O(log n))
1. Remove the root element
2. Replace it with the last element
3. Compare the new root with its children and swap with the appropriate child
4. Continue until the heap property is restored (heapify-down)

## Applications

- Priority queues
- Heap sort
- Graph algorithms such as Dijkstra's and Prim's
- Memory management
- Event-driven simulation