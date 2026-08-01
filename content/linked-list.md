# Linked List Data Structures

A linked list is a linear data structure in which elements are stored as nodes, and each node references the next node in the sequence.

## Types of Linked Lists

### Singly Linked List (SLL)
- Each node contains data and a reference to the next node
- Traversal is possible only in the forward direction
- Memory-efficient and relatively simple to implement

### Doubly Linked List (DLL)
- Each node contains data and references to both the next and previous nodes
- Supports bidirectional traversal
- Uses more memory, but simplifies deletion and navigation

### Circular Singly Linked List (CSLL)
- The last node points back to the first node
- Eliminates null references in the traversal cycle
- Useful for circular queues and round-robin scheduling

### Circular Doubly Linked List (CDLL)
- Combines the features of DLL and CSLL
- Supports bidirectional circular traversal
- Offers the greatest flexibility, though with higher complexity and memory use

## Operations

### Insertion (O(1) at ends, O(n) at position)
- Insert at the front
- Insert at the back
- Insert at a specific position

### Deletion (O(1) at front, O(n) at back/position)
- Delete from the front
- Delete from the back
- Delete at a specific position

### Traversal (O(n))
- Forward traversal
- Backward traversal for DLL and CDLL
- Cycle detection

## Applications
- Implementing stacks and queues
- Music playlists with circular behavior
- Undo/redo systems
- Memory allocation
- Hash tables using chaining