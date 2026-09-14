import { describe, expect, it } from "vitest"
import { instrumentStackQueueCode } from "@/lib/code-playground/instrument-stack-queue"

const RUNTIME_PREAMBLE = `
var __trace = [];
var __steps = 0;
var __MAX_STEPS = 200000;
function __stackOp(arr, method, arg) {
  var result;
  if (method === "push") { result = arr.push(arg); }
  else if (method === "pop") { result = arr.pop(); }
  else if (method === "shift") { result = arr.shift(); }
  else if (method === "unshift") { result = arr.unshift(arg); }
  __trace.push({ method: method, arg: arg, len: arr.length });
  return result;
}
`

async function run(source: string, input: unknown) {
  const instrumented = await instrumentStackQueueCode(source)
  if (instrumented.error) throw new Error(instrumented.error)
  const fn = new Function(
    "__input",
    `${RUNTIME_PREAMBLE}\n${instrumented.code}\nvar __result = ${instrumented.functionName}(__input);\nreturn { result: __result, trace: __trace };`
  )
  return { ...(fn(input) as { result: unknown; trace: unknown[] }), functionName: instrumented.functionName }
}

describe("instrumentStackQueueCode", () => {
  it("solves Valid Parentheses correctly and wraps every push/pop", async () => {
    const source = `function isValid(s) {
      const stack = [];
      const pairs = { ")": "(", "]": "[", "}": "{" };
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "(" || c === "[" || c === "{") {
          stack.push(c);
        } else {
          if (stack.length === 0 || stack.pop() !== pairs[c]) return false;
        }
      }
      return stack.length === 0;
    }`
    const ok = await run(source, "([{}])")
    expect(ok.result).toBe(true)
    expect(ok.trace.length).toBe(6)

    const bad = await run(source, "([)]")
    expect(bad.result).toBe(false)
  })

  it("solves Next Greater Element correctly", async () => {
    const source = `function nextGreaterElements(nums) {
      const result = new Array(nums.length).fill(-1);
      const stack = [];
      for (let i = 0; i < nums.length; i++) {
        while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
          const idx = stack.pop();
          result[idx] = nums[i];
        }
        stack.push(i);
      }
      return result;
    }`
    const { result } = await run(source, [4, 5, 2, 10, 8])
    expect(result).toEqual([5, 10, 10, -1, -1])
  })

  it("solves Generate Binary Numbers via a queue correctly", async () => {
    const source = `function generateBinaryNumbers(n) {
      const queue = [];
      const result = [];
      queue.push("1");
      for (let i = 0; i < n; i++) {
        const front = queue.shift();
        result.push(front);
        queue.push(front + "0");
        queue.push(front + "1");
      }
      return result;
    }`
    const { result } = await run(source, 5)
    expect(result).toEqual(["1", "10", "11", "100", "101"])
  })

  it("only tracks the first array touched by push/pop/shift/unshift, leaving others untouched", async () => {
    // `result` is pushed to first in source order in some formulations —
    // here `stack` is genuinely first, so it should be the tracked one and
    // `result`'s own pushes must still execute correctly even though they
    // aren't wrapped.
    const source = `function solve(nums) {
      const stack = [];
      const result = [];
      for (let i = 0; i < nums.length; i++) {
        stack.push(nums[i]);
        result.push(nums[i] * 2);
      }
      return result;
    }`
    const { result } = await run(source, [1, 2, 3])
    expect(result).toEqual([2, 4, 6])
  })

  it("does not double-evaluate a side-effecting push argument", async () => {
    const source = `function solve(seed) {
      const stack = [];
      let k = seed;
      stack.push(k++);
      stack.push(k++);
      return k;
    }`
    const { result } = await run(source, 0)
    // k must end up at exactly 2, not 4 — each push's argument (k++)
    // must be evaluated exactly once, same lesson as the array instrumenter.
    expect(result).toBe(2)
  })

  it("errors cleanly when no function takes at least one parameter", async () => {
    const instrumented = await instrumentStackQueueCode(`function solve() { return 42; }`)
    expect(instrumented.error).toBeTruthy()
    expect(instrumented.functionName).toBeNull()
  })

  it("injects the iteration guard into while loops", async () => {
    const instrumented = await instrumentStackQueueCode(`function solve(s) {
      const stack = [];
      let i = 0;
      while (true) { stack.push(i); i++; }
      return stack;
    }`)
    expect(instrumented.code).toContain("__MAX_STEPS")
    expect(instrumented.code).toContain("Too many iterations")
  })
})
