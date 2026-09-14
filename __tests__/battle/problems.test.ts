import { describe, expect, it } from "vitest"
import { BATTLE_PROBLEMS, getBattleProblem, pickBattleQuestions } from "@/lib/battle/problems"

describe("battle problem bank", () => {
  it("every problem has at least one test case with matching input/expected shape", () => {
    for (const p of BATTLE_PROBLEMS) {
      expect(p.testCases.length).toBeGreaterThan(0)
      for (const tc of p.testCases) {
        expect(Array.isArray(tc.input)).toBe(true)
      }
    }
  })

  it("getBattleProblem finds a real problem and returns undefined for a fake one", () => {
    expect(getBattleProblem(BATTLE_PROBLEMS[0].slug)?.slug).toBe(BATTLE_PROBLEMS[0].slug)
    expect(getBattleProblem("not-a-real-slug")).toBeUndefined()
  })

  it("pickBattleQuestions only returns problems matching the requested difficulty", () => {
    const slugs = pickBattleQuestions({ difficulty: "Easy", topics: [] }, 5)
    for (const slug of slugs) {
      expect(getBattleProblem(slug)?.difficulty).toBe("Easy")
    }
  })

  it("pickBattleQuestions returns exactly the requested count, wrapping if needed", () => {
    const slugs = pickBattleQuestions({ difficulty: "Easy", topics: [] }, 10)
    expect(slugs.length).toBe(10)
  })

  it("pickBattleQuestions falls back to the full bank when filters match nothing", () => {
    const slugs = pickBattleQuestions({ difficulty: "Easy", topics: ["Not A Real Topic"] }, 3)
    expect(slugs.length).toBe(3)
    for (const slug of slugs) {
      expect(getBattleProblem(slug)).toBeDefined()
    }
  })
})
