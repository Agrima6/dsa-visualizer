// Regression coverage for the Debug Mode false-positive bug found this
// session: a mutating-but-non-sorting function (reverse, dedupe) used to
// get accused of "isn't fully sorted" because the message logic didn't
// distinguish "this code moved the array" from "this code is trying to
// sort it".
import { describe, expect, it } from "vitest"
import { traceToSteps } from "@/lib/code-playground/trace-to-steps"

describe("traceToSteps", () => {
  it("reports success plainly for a mutating function that isn't trying to sort", () => {
    const steps = traceToSteps([1, 2, 3], [], [3, 2, 1], /* mutated */ true, /* expectSorted */ false)
    const last = steps[steps.length - 1]
    expect(last.message).toBe("Your function finished.")
    expect(last.sorted).toEqual([])
  })

  it("celebrates a correct sort when the function is expected to sort", () => {
    const steps = traceToSteps([3, 1, 2], [], [1, 2, 3], true, true)
    const last = steps[steps.length - 1]
    expect(last.message).toBe("Done — the array is sorted!")
    expect(last.sorted).toEqual([0, 1, 2])
  })

  it("flags a genuinely buggy sort when the function is expected to sort", () => {
    const steps = traceToSteps([3, 1, 2], [], [2, 1, 3], true, true)
    const last = steps[steps.length - 1]
    expect(last.message).toBe("Your function finished, but the array isn't fully sorted.")
    expect(last.sorted).toEqual([])
  })

  it("never claims a search/read-only function (no mutation at all) isn't sorted", () => {
    const steps = traceToSteps([5, 1, 3], [], [5, 1, 3], /* mutated */ false, /* expectSorted */ true)
    const last = steps[steps.length - 1]
    expect(last.message).toBe("Your function finished.")
  })

  it("converts compare/swap/write trace events into the matching step shape", () => {
    const steps = traceToSteps(
      [2, 1],
      [
        { type: "compare", i: 0, j: 1, array: [2, 1] },
        { type: "swap", i: 0, j: 1, array: [1, 2] },
      ],
      [1, 2],
      true,
      true
    )
    expect(steps[1]).toMatchObject({ compared: [0, 1], swapped: [], array: [2, 1] })
    expect(steps[2]).toMatchObject({ compared: [], swapped: [0, 1], array: [1, 2] })
  })
})
