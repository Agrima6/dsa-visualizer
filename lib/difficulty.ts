export type DifficultyLevel = "Easy" | "Medium" | "Hard"

export const DIFFICULTY_RANK: Record<DifficultyLevel, number> = { Easy: 0, Medium: 1, Hard: 2 }

/** Stable comparator: Easy first, then Medium, then Hard, keeping the original order within a level. */
export function byDifficulty(a: { difficulty: DifficultyLevel }, b: { difficulty: DifficultyLevel }): number {
  return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]
}
