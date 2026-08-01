# Polynomial Multiplication Using Linked Lists

A polynomial is an expression made up of variables and coefficients. For example: $2x^2 + 3x + 1$

When multiplying two polynomials, the process is:
1. Multiply each term from the first polynomial with each term from the second
2. Combine terms that share the same exponent
3. Arrange the result in descending order of powers

## Implementation Using Linked Lists

Each node in the linked list represents a single term in the polynomial and stores:
- Coefficient: the numeric multiplier
- Exponent: the power of $x$

For example, for $2x^2 + 3x + 1$:
- First node: {coefficient: 2, exponent: 2}
- Second node: {coefficient: 3, exponent: 1}
- Third node: {coefficient: 1, exponent: 0}