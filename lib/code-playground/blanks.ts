/** Guided starters mark the parts a learner must write as `___`. */
export function hasBlanks(code: string): boolean {
  return /___/.test(code)
}

export const BLANKS_MESSAGE =
  "Replace every ___ with your answer before running. Stuck? Open Hints below the editor."
