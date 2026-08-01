# Stack Data Structure

A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Items are added and removed from the same end, known as the top of the stack.

## Operations

### Push (O(1))
- Adds an element to the top of the stack
- If the stack is full, it results in stack overflow

### Pop (O(1))
- Removes and returns the top element
- If the stack is empty, it results in stack underflow

### Peek/Top (O(1))
- Returns the top element without removing it
- Does not modify the stack

## Properties
- Fixed size in array-based implementations
- Elements preserve insertion order
- Only the top element is directly accessible
- Follows the LIFO principle

## Applications
- Function call stack in programming languages
- Expression evaluation and syntax parsing
- Undo operations in text editors
- Browser history navigation
- Backtracking algorithms