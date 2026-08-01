# Queue Data Structure

A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added at the rear through enqueue operations and removed from the front through dequeue operations.

## Operations

### Enqueue (O(1))
- Adds an element to the rear of the queue
- If the queue is full, it results in queue overflow

### Dequeue (O(1))
- Removes and returns the element from the front
- If the queue is empty, it results in queue underflow

### Front/Peek (O(1))
- Returns the front element without removing it
- Does not modify the queue

## Properties
- Fixed size in array-based implementations
- Elements are ordered by arrival time
- Only the front element is accessible for removal
- Follows the FIFO principle
- Maintains two pointers: front and rear

## Applications
- Process scheduling in operating systems
- Print job scheduling
- Breadth-first search in graphs
- Request handling in web servers
- Message queues in system design
- Buffering in data streams

## Implementation Approaches
1. Array-based implementation
   - Simple and efficient, but fixed in size
   - Circular arrays improve space utilization

2. Linked list implementation
   - Supports dynamic growth
   - Adds more memory overhead per element

3. Priority queue variant
   - Elements carry priorities
   - Dequeue order is determined by priority rather than arrival time