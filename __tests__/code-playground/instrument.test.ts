// Regression coverage for the entry-function-selection bug found this
// session: the instrumenter used to just grab the first top-level function
// matching "takes an array first" — which, for real quicksort/mergesort
// code split into a helper + an entry function, ran the *helper* alone
// with no bounds, producing wrong output with no error at all.
import { describe, expect, it } from "vitest"
import { instrumentUserCode } from "@/lib/code-playground/instrument"

// Mirrors runner.ts's RUNTIME_PREAMBLE (the __cmp/__afterSwap/__afterWrite
// tracer functions the instrumented code calls into) — kept minimal here
// since these tests only care about which function gets called and with
// what result, not the trace content itself.
const RUNTIME_PREAMBLE = `
var __trace = [];
function __cmp(arr, iIdx, jIdx, leftVal, rightVal, op) {
  switch (op) {
    case "<": return leftVal < rightVal;
    case ">": return leftVal > rightVal;
    case "<=": return leftVal <= rightVal;
    case ">=": return leftVal >= rightVal;
    case "===": return leftVal === rightVal;
    case "==": return leftVal == rightVal;
    case "!==": return leftVal !== rightVal;
    case "!=": return leftVal != rightVal;
    default: return false;
  }
}
function __afterSwap() {}
function __afterWrite() {}
`

async function run(source: string, input: number[]): Promise<unknown> {
  const instrumented = await instrumentUserCode(source)
  if (instrumented.error) throw new Error(instrumented.error)
  const fn = new Function(
    "__steps",
    "__MAX_STEPS",
    "input",
    `${RUNTIME_PREAMBLE}\n${instrumented.code}\nreturn ${instrumented.functionName}(input);`
  )
  return fn(0, 200_000, [...input])
}

describe("instrumentUserCode: entry-function selection", () => {
  it("picks the outer function over a helper it calls (quicksort + partition)", async () => {
    const source = `
      function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
      }
      function quickSort(arr, low = 0, high = arr.length - 1) {
        if (low < high) {
          let pi = partition(arr, low, high);
          quickSort(arr, low, pi - 1);
          quickSort(arr, pi + 1, high);
        }
        return arr;
      }
    `
    const result = await run(source, [38, 27, 43, 3, 9, 82, 10])
    expect(result).toEqual([3, 9, 10, 27, 38, 43, 82])
  })

  it("picks the outer function over a helper (mergesort + merge)", async () => {
    const source = `
      function merge(arr, l, m, r) {
        const left = arr.slice(l, m + 1);
        const right = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) arr[k++] = left[i++];
          else arr[k++] = right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
      }
      function mergeSort(arr, l = 0, r = arr.length - 1) {
        if (l < r) {
          const m = Math.floor((l + r) / 2);
          mergeSort(arr, l, m);
          mergeSort(arr, m + 1, r);
          merge(arr, l, m, r);
        }
        return arr;
      }
    `
    const result = await run(source, [5, 2, 9, 1, 5, 6])
    expect(result).toEqual([1, 2, 5, 5, 6, 9])
  })

  it("still works for a single plain function (the common case)", async () => {
    const source = `function solve(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
      return arr;
    }`
    const result = await run(source, [3, 1, 2])
    expect(result).toEqual([1, 2, 3])
  })

  it("errors cleanly when no function has a plain identifier first parameter", async () => {
    // A function with zero params (or a destructured first param) can't be
    // treated as "takes an array" — unlike function solve(n), which is a
    // valid *structural* match even though n turns out to be a number, not
    // an array (that ambiguity can't be resolved from syntax alone, and
    // isn't a bug — it just runs with zero trace events at runtime).
    const instrumented = await instrumentUserCode(`function solve() { return 42; }`)
    expect(instrumented.error).toBeTruthy()
    expect(instrumented.functionName).toBeNull()
  })
})
