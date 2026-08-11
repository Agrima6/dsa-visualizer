// components/visualizer/recursion/recursion-problems-data.ts
// Combines the four content files (core reference examples + beginner/
// intermediate/advanced batches) into the single ordered list the code
// view renders. Re-exports the shared types so consumers only need to
// import from this one file.

import { RECURSION_CORE_PROBLEMS } from "./recursion-problems-core"
import { RECURSION_BEGINNER_PROBLEMS } from "./recursion-problems-beginner"
import { RECURSION_INTERMEDIATE_PROBLEMS } from "./recursion-problems-intermediate"
import { RECURSION_ADVANCED_PROBLEMS } from "./recursion-problems-advanced"

export type {
  Difficulty,
  Company,
  Approach,
  StackFrame,
  RecursionVisStep,
  RecursionProblem,
} from "./recursion-problem-types"

export const RECURSION_PROBLEMS = [
  ...RECURSION_CORE_PROBLEMS,
  ...RECURSION_BEGINNER_PROBLEMS,
  ...RECURSION_INTERMEDIATE_PROBLEMS,
  ...RECURSION_ADVANCED_PROBLEMS,
].sort((a, b) => a.id - b.id)
