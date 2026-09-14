import { instrumentStackQueueCode } from "./instrument-stack-queue"

export interface StackQueueSnapshotItem {
  id: string
  value: string | number
}

export interface StackQueueStep {
  kind: "stack" | "queue"
  items: StackQueueSnapshotItem[]
  highlightedIds: string[]
  message: string
}

export interface StackQueueRunResult {
  steps: StackQueueStep[]
  operations: number
  returnValue: string
}

const MAX_SOURCE_LENGTH = 8000
const TIMEOUT_MS = 4000

// Single-call model, unlike the per-value-looped Tree/LinkedList runners:
// classic stack/queue problems (Valid Parentheses, Next Greater Element,
// Generate Binary Numbers) take one meaningful input and are called once,
// not fed a sequence of values to insert one at a time.
const RUNTIME_PREAMBLE = `
"use strict";
var __trace = [];
var __steps = 0;
var __MAX_STEPS = 200000;
var __itemCounter = 0;
// A shadow array of ids, kept in lockstep with the tracked array's own
// push/pop/shift/unshift calls, so each logical element keeps the same id
// across every snapshot — needed for the display to animate elements
// smoothly rather than re-mounting them on every step (assigning a fresh
// id per snapshot, keyed only by value, would also collide whenever two
// equal values are on the structure at once, e.g. two "(" characters).
var __shadowIds = [];

function __snapshot(arr) {
  return arr.map(function (v, i) { return { id: __shadowIds[i], value: v }; });
}

// Wraps every push/pop/shift/unshift call on the tracked array. Performs
// the real operation itself, exactly once — arguments are evaluated by
// normal JS call semantics before this ever runs, so a side-effecting
// argument (e.g. a variable being incremented inline) can't be
// double-evaluated the way a naive clone-and-reinsert approach could.
function __stackOp(arr, method, arg) {
  var result;
  if (method === "push") {
    __itemCounter += 1;
    __shadowIds.push("i" + __itemCounter);
    result = arr.push(arg);
  } else if (method === "pop") {
    __shadowIds.pop();
    result = arr.pop();
  } else if (method === "shift") {
    __shadowIds.shift();
    result = arr.shift();
  } else if (method === "unshift") {
    __itemCounter += 1;
    __shadowIds.unshift("i" + __itemCounter);
    result = arr.unshift(arg);
  }
  __trace.push({ type: "op", method: method, arg: arg, items: __snapshot(arr) });
  return result;
}

self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
`

export type StackQueueInputType = "string" | "numberArray" | "number"

export async function runUserStackQueueCode(
  source: string,
  input: string | number[] | number,
  displayKind: "stack" | "queue"
): Promise<StackQueueRunResult> {
  if (source.length > MAX_SOURCE_LENGTH) {
    throw new Error(`Keep it under ${MAX_SOURCE_LENGTH} characters.`)
  }

  const instrumented = await instrumentStackQueueCode(source)
  if (instrumented.error || !instrumented.functionName) {
    throw new Error(instrumented.error || "Could not find a function to run.")
  }

  return new Promise((resolve, reject) => {
    const workerSource = `
      ${RUNTIME_PREAMBLE}
      ${instrumented.code}
      self.onmessage = function (e) {
        try {
          var __result = ${instrumented.functionName}(e.data.input);
          self.postMessage({ ok: true, trace: __trace, returnValue: JSON.stringify(__result) });
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
      reject(new Error("Execution timed out — check for an infinite loop or unbounded recursion."))
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

      resolve(traceToStackQueueSteps(data.trace, data.returnValue, displayKind))
    }

    worker.onerror = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      cleanup()
      reject(new Error(e.message || "Worker error."))
    }

    worker.postMessage({ input })
  })
}

interface RawTraceEvent {
  type: "op"
  method: "push" | "pop" | "shift" | "unshift"
  arg?: unknown
  items: StackQueueSnapshotItem[]
}

function traceToStackQueueSteps(
  trace: RawTraceEvent[],
  returnValueJson: string,
  kind: "stack" | "queue"
): StackQueueRunResult {
  const steps: StackQueueStep[] = [{ kind, items: [], highlightedIds: [], message: "Starting your code..." }]

  for (const event of trace) {
    const last = event.items[event.items.length - 1]
    const first = event.items[0]
    let message = ""
    let highlightedIds: string[] = []

    if (event.method === "push") {
      message = `push(${JSON.stringify(event.arg)})`
      highlightedIds = last ? [last.id] : []
    } else if (event.method === "unshift") {
      message = `unshift(${JSON.stringify(event.arg)})`
      highlightedIds = first ? [first.id] : []
    } else if (event.method === "pop") {
      message = "pop()"
    } else {
      message = "shift()"
    }

    steps.push({ kind, items: event.items, highlightedIds, message })
  }

  let returnValue = returnValueJson
  try {
    returnValue = JSON.stringify(JSON.parse(returnValueJson))
  } catch {
    // leave as-is
  }

  steps.push({ kind, items: steps[steps.length - 1].items, highlightedIds: [], message: `Returned: ${returnValue}` })

  return { steps, operations: trace.length, returnValue }
}
