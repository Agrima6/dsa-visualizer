export type ConceptId = "params" | "return" | "scope" | "recursion" | "higherorder" | "closure"

export interface ConceptInfo {
  id: ConceptId
  label: string
  color: string
  analogy: {
    title: string
    text: string
  }
  blurb: string
}

export const CONCEPTS: ConceptInfo[] = [
  {
    id: "params",
    label: "Parameters & Arguments",
    color: "#22c55e",
    analogy: {
      title: "Blanks on an order form",
      text: "Parameters are the blank fields on a form (name, size, quantity). Arguments are what you actually write in those blanks when you place a real order.",
    },
    blurb: "Parameters are placeholders in the function's definition; arguments are the real values you hand it when calling.",
  },
  {
    id: "return",
    label: "Return Values",
    color: "#3b82f6",
    analogy: {
      title: "A vending machine",
      text: "You put money in (arguments), the machine does its thing, and a snack comes out the slot (the return value). If nothing's returned, you get an empty slot — undefined.",
    },
    blurb: "A function hands a value back to wherever it was called from — that's its return value, and execution stops the moment `return` runs.",
  },
  {
    id: "scope",
    label: "Scope",
    color: "#eab308",
    analogy: {
      title: "Rooms in a house",
      text: "Variables declared inside a function are like items left in a room — visible to whoever's in that room (and any room nested inside it), but invisible from the hallway outside.",
    },
    blurb: "Scope decides where a variable can be seen and used — variables created inside a function normally can't be reached from outside it.",
  },
  {
    id: "recursion",
    label: "Recursion",
    color: "#f97316",
    analogy: {
      title: "Russian nesting dolls",
      text: "Each doll opens to reveal a smaller version of itself, until you hit the smallest solid doll (the base case) — then you close them back up one by one.",
    },
    blurb: "A function that calls itself with a smaller version of the problem, until a base case stops the chain — each call gets its own stack frame.",
  },
  {
    id: "higherorder",
    label: "Higher-Order Functions",
    color: "#a855f7",
    analogy: {
      title: "A manager delegating work",
      text: "Instead of doing the task itself, a higher-order function is handed another function (like a manager handed a worker) and calls it when needed.",
    },
    blurb: "A function that takes another function as an argument, returns one, or both — it's what makes `.map()`, `.filter()`, and callbacks possible.",
  },
  {
    id: "closure",
    label: "Closures",
    color: "#ef4444",
    analogy: {
      title: "A backpack of remembered variables",
      text: "When a function is created, it packs a backpack with the variables around it at that moment. Even after it travels somewhere else and runs later, it can still reach into that backpack.",
    },
    blurb: "An inner function keeps access to its outer function's variables even after the outer function has already finished running.",
  },
]

export function getConcept(id: ConceptId): ConceptInfo {
  return CONCEPTS.find((c) => c.id === id)!
}
