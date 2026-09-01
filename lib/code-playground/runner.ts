import { instrumentUserCode } from "./instrument"
import { traceToSteps, type TraceEvent } from "./trace-to-steps"
import type { SortStep } from "@/components/visualizer/sorting/types"

export interface RunResult {
  steps: SortStep[]
  comparisons: number
  swaps: number
  writes: number
}

const MAX_SOURCE_LENGTH = 8000
const TIMEOUT_MS = 4000

// Defines the tracer runtime (__cmp/__afterSwap/__afterWrite, called by the
// instrumented code) plus the iteration guard the instrumenter injects into
// every loop. Runs inside a dedicated Worker — not the main thread — so a
// user's `while (true) {}` can be hard-terminated from outside instead of
// freezing the tab; the iteration counter below is a second, faster line
// of defense that turns most infinite loops into a clean thrown error
// before the wall-clock timeout even needs to fire.
const RUNTIME_PREAMBLE = `
"use strict";
var __trace = [];
var __steps = 0;
var __MAX_STEPS = 200000;

function __cmp(arr, iIdx, jIdx, leftVal, rightVal, op) {
  if (iIdx !== null || jIdx !== null) {
    __trace.push({ type: "compare", i: iIdx, j: jIdx, array: arr.slice() });
  }
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
function __afterSwap(arr, i, j) {
  __trace.push({ type: "swap", i: i, j: j, array: arr.slice() });
}
function __afterWrite(arr, i) {
  __trace.push({ type: "write", i: i, j: null, array: arr.slice() });
}

// Defense-in-depth: this code runs fully client-side in the visitor's own
// browser (same trust boundary as opening devtools), so there's no
// cross-user risk — but it may run code someone *shared* with the visitor
// ("try my sort!"), so network access is stripped rather than trusted.
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
`

export async function runUserSortCode(source: string, initialArray: number[]): Promise<RunResult> {
  if (source.length > MAX_SOURCE_LENGTH) {
    throw new Error(`Keep it under ${MAX_SOURCE_LENGTH} characters.`)
  }

  const instrumented = await instrumentUserCode(source)
  if (instrumented.error || !instrumented.functionName) {
    throw new Error(instrumented.error || "Could not find a function to run.")
  }

  return new Promise((resolve, reject) => {
    const workerSource = `
      ${RUNTIME_PREAMBLE}
      ${instrumented.code}
      self.onmessage = function (e) {
        try {
          var input = e.data.slice();
          var result = ${instrumented.functionName}(input);
          self.postMessage({ ok: true, trace: __trace, result: Array.isArray(result) ? result : input });
        } catch (err) {
          self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err) });
        }
      };
    `

    let settled = false
    const blob = new Blob([workerSource], { type: "application/javascript" })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    const cleanup = () => {
      worker.terminate()
      URL.revokeObjectURL(url)
    }

    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error("Execution timed out — check for an infinite loop."))
    }, TIMEOUT_MS)

    worker.onmessage = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      cleanup()

      const data = e.data
      if (!data.ok) {
        reject(new Error(data.error))
        return
      }

      const trace: TraceEvent[] = data.trace
      const steps = traceToSteps(initialArray, trace, data.result)
      resolve({
        steps,
        comparisons: trace.filter((t) => t.type === "compare").length,
        swaps: trace.filter((t) => t.type === "swap").length,
        writes: trace.filter((t) => t.type === "write").length,
      })
    }

    worker.onerror = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      cleanup()
      reject(new Error(e.message || "Worker error."))
    }

    worker.postMessage(initialArray)
  })
}
