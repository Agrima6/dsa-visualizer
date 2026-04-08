export type SortAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  | "shell"

export interface SortStep {
  array: number[]
  compared: number[]
  swapped: number[]
  sorted: number[]
  message: string
}