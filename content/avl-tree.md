# AVL Tree

An AVL tree is a self-balancing binary search tree in which the heights of the left and right subtrees differ by at most one at every node.

## Properties
- The height difference between the left and right subtrees of each node is at most 1
- Insertion, deletion, and search operations all run in O(log n) time
- Balance factor = height(left subtree) - height(right subtree)
- The balance factor must remain -1, 0, or 1 for every node

## Rotations
- Left rotation: used when the right subtree becomes too tall
- Right rotation: used when the left subtree becomes too tall
- Left-right rotation: used for more complex imbalance patterns
- Right-left rotation: used for more complex imbalance patterns

## Applications
- Databases with frequent insertions and deletions
- Memory management systems
- File systems that require balanced tree structures