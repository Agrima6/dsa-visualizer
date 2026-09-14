import { instrumentLinkedListCode } from "./instrument-linked-list"

export interface LinkedListNodeSnapshot {
  id: string
  value: number
}

export interface LinkedListStep {
  list: LinkedListNodeSnapshot[]
  highlightedNodes: string[]
  message: string
}

export interface LinkedListRunResult {
  steps: LinkedListStep[]
  comparisons: number
}

const MAX_SOURCE_LENGTH = 8000
const TIMEOUT_MS = 4000

// Mirrors tree-runner.ts: a dedicated Worker, network stripped, hard
// timeout, plus the loop-iteration guard the instrumenter injects.
// makeNode() gives every node a stable id the same way the tree
// playground's does.
//
// Known scope boundary, disclosed rather than hidden: __head is tracked
// by *this harness*, not the user's code — set once before each call and
// only reassigned to whatever the function returns, once it returns.
// Operations that read/mutate the list without changing which node is the
// head (append, search, delete-from-middle) animate cleanly step by step.
// An operation that changes the head *during* its own execution (reversing
// a list, for instance) still runs and returns the fully correct result —
// but any intermediate snapshot taken mid-function is walked from the
// *old* head, since that's the only reference this harness has until the
// function returns, so a reversal's in-progress frames may look partial
// rather than a clean pointer-by-pointer animation. The start/end frames
// (before the call and after it returns) are always fully correct.
const RUNTIME_PREAMBLE = `
"use strict";
var __trace = [];
var __steps = 0;
var __MAX_STEPS = 200000;
var __nodeCounter = 0;
var __head = null;

function makeNode(value) {
  __nodeCounter += 1;
  return { id: "n" + __nodeCounter, value: value, next: null };
}

function __snapshotList(head) {
  var nodes = [];
  var cur = head;
  var guard = 0;
  while (cur && guard++ < 2000) {
    nodes.push({ id: cur.id, value: cur.value });
    cur = cur.next;
  }
  return nodes;
}

function __nodeCmp(leftNode, rightNode, leftVal, rightVal, op) {
  var ids = [];
  if (leftNode && leftNode.id) ids.push(leftNode.id);
  if (rightNode && rightNode.id) ids.push(rightNode.id);
  if (ids.length > 0) {
    __trace.push({ type: "compare", ids: ids, list: __snapshotList(__head) });
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

function __traverse(node) {
  var id = node && node.id ? node.id : null;
  __trace.push({ type: "traverse", id: id, list: __snapshotList(__head) });
}

function __afterLink() {
  __trace.push({ type: "link", list: __snapshotList(__head) });
}

// Builds the *starting* list directly, bypassing the user's own code
// entirely — needed for "query" mode (see runUserLinkedListCode below): a
// search/contains-style function returns a boolean, not a head, so
// nothing about its return value can be chained the way insert-style
// operations are. The list it searches has to already exist before it's
// ever called.
function __buildInitialList(values) {
  var head = null;
  var tail = null;
  for (var i = 0; i < values.length; i++) {
    var node = makeNode(values[i]);
    if (head === null) { head = node; } else { tail.next = node; }
    tail = node;
  }
  return head;
}

self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
`

export type LinkedListRunMode = "build" | "query"

export async function runUserLinkedListCode(
  source: string,
  values: number[],
  mode: LinkedListRunMode = "build",
  queryTarget?: number
): Promise<LinkedListRunResult> {
  if (source.length > MAX_SOURCE_LENGTH) {
    throw new Error(`Keep it under ${MAX_SOURCE_LENGTH} characters.`)
  }

  const instrumented = await instrumentLinkedListCode(source)
  if (instrumented.error || !instrumented.functionName) {
    throw new Error(instrumented.error || "Could not find a function to run.")
  }

  const workerBody =
    mode === "build"
      ? `
          var values = e.data.values;
          for (var i = 0; i < values.length; i++) {
            __trace.push({ type: "start", value: values[i], list: __snapshotList(__head) });
            __head = ${instrumented.functionName}(__head, values[i]);
            __trace.push({ type: "end", value: values[i], list: __snapshotList(__head) });
          }
        `
      : `
          // Query mode: build the list first with a known-correct internal
          // routine (never the user's own code — there's nothing to
          // "insert" here), then call the user's function once against it.
          // __head is never reassigned from its return value, since a
          // search-style function returns a found/not-found result, not a
          // node — the list itself never changes.
          __head = __buildInitialList(e.data.values);
          __trace.push({ type: "start", value: e.data.queryTarget, list: __snapshotList(__head) });
          var found = ${instrumented.functionName}(__head, e.data.queryTarget);
          __trace.push({ type: "end", value: e.data.queryTarget, list: __snapshotList(__head), returnValue: JSON.stringify(found) });
        `

  return new Promise((resolve, reject) => {
    const workerSource = `
      ${RUNTIME_PREAMBLE}
      ${instrumented.code}
      self.onmessage = function (e) {
        try {
          ${workerBody}
          self.postMessage({ ok: true, trace: __trace });
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

      resolve(traceToLinkedListSteps(data.trace))
    }

    worker.onerror = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      cleanup()
      reject(new Error(e.message || "Worker error."))
    }

    worker.postMessage({ values, queryTarget })
  })
}

interface RawTraceEvent {
  type: "start" | "end" | "compare" | "traverse" | "link"
  value?: number
  ids?: string[]
  id?: string | null
  list: LinkedListNodeSnapshot[]
  returnValue?: string
}

function traceToLinkedListSteps(trace: RawTraceEvent[]): LinkedListRunResult {
  const steps: LinkedListStep[] = [{ list: [], highlightedNodes: [], message: "Starting your code..." }]
  let comparisons = 0

  for (const event of trace) {
    if (event.type === "start") {
      steps.push({ list: event.list, highlightedNodes: [], message: `Calling with ${event.value}...` })
    } else if (event.type === "compare") {
      comparisons += 1
      steps.push({ list: event.list, highlightedNodes: event.ids ?? [], message: "Comparing values..." })
    } else if (event.type === "traverse") {
      steps.push({ list: event.list, highlightedNodes: event.id ? [event.id] : [], message: "Moving to the next node..." })
    } else if (event.type === "link") {
      steps.push({ list: event.list, highlightedNodes: [], message: "Relinking a pointer..." })
    } else {
      const message = event.returnValue !== undefined ? `Returned: ${event.returnValue}` : `Done with ${event.value}.`
      steps.push({ list: event.list, highlightedNodes: [], message })
    }
  }

  return { steps, comparisons }
}
