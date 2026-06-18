// components/visualizer/array/types.ts

export type ArrayOperationType =
  | "insert"
  | "delete"
  | "search"
  | "reverse"
  | "rotate-left"
  | "rotate-right"
  | "update"
  | "set"

export interface ArrayOperation {
  type: ArrayOperationType
  value?: number
  index?: number
  timestamp: number
}

export interface ArrayStep {
  array: number[]
  highlighted: number[]  // amber — visiting/comparing
  swapped: number[]      // rose  — being moved/swapped
  sorted: number[]       // emerald — result/finalized
  pointer?: number       // special marker index
  message: string
}