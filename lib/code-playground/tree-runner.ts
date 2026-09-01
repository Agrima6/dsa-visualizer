import { instrumentTreeCode } from "./instrument-tree"

export interface TreeSnapshot {
  id: string
  value: number
  left: TreeSnapshot | null
  right: TreeSnapshot | null
}

export interface TreeStep {
  tree: TreeSnapshot | null
  highlightedNodes: string[]
  message: string
}

export interface TreeRunResult {
  steps: TreeStep[]
  comparisons: number
}

const MAX_SOURCE_LENGTH = 8000
const TIMEOUT_MS = 4000

// Mirrors runner.ts's sandbox: a dedicated Worker with network access
// stripped and a hard timeout, plus the loop-iteration guard the
// instrumenter injects. makeNode() is the one API contract the user's
// code must use to create nodes — that's what gives every node a stable
// id to key React (and this trace) off of, without needing to infer
// identity from arbitrary object literals.
const RUNTIME_PREAMBLE = `
"use strict";
var __trace = [];
var __steps = 0;
var __MAX_STEPS = 200000;
var __nodeCounter = 0;
var __root = null;

function makeNode(value) {
  __nodeCounter += 1;
  return { id: "n" + __nodeCounter, value: value, left: null, right: null };
}

function __snapshot(node) {
  if (!node) return null;
  return { id: node.id, value: node.value, left: __snapshot(node.left), right: __snapshot(node.right) };
}

function __nodeCmp(leftNode, rightNode, leftVal, rightVal, op) {
  var ids = [];
  if (leftNode && leftNode.id) ids.push(leftNode.id);
  if (rightNode && rightNode.id) ids.push(rightNode.id);
  if (ids.length > 0) {
    __trace.push({ type: "compare", ids: ids, tree: __snapshot(__root) });
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

self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
`

export async function runUserTreeCode(source: string, values: number[]): Promise<TreeRunResult> {
  if (source.length > MAX_SOURCE_LENGTH) {
    throw new Error(`Keep it under ${MAX_SOURCE_LENGTH} characters.`)
  }

  const instrumented = await instrumentTreeCode(source)
  if (instrumented.error || !instrumented.functionName) {
    throw new Error(instrumented.error || "Could not find a function to run.")
  }

  return new Promise((resolve, reject) => {
    const workerSource = `
      ${RUNTIME_PREAMBLE}
      ${instrumented.code}
      self.onmessage = function (e) {
        try {
          var values = e.data;
          for (var i = 0; i < values.length; i++) {
            __trace.push({ type: "start", value: values[i], tree: __snapshot(__root) });
            __root = ${instrumented.functionName}(__root, values[i]);
            __trace.push({ type: "end", value: values[i], tree: __snapshot(__root) });
          }
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

      resolve(traceToTreeSteps(data.trace))
    }

    worker.onerror = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      cleanup()
      reject(new Error(e.message || "Worker error."))
    }

    worker.postMessage(values)
  })
}

interface RawTraceEvent {
  type: "start" | "end" | "compare"
  value?: number
  ids?: string[]
  tree: TreeSnapshot | null
}

function traceToTreeSteps(trace: RawTraceEvent[]): TreeRunResult {
  const steps: TreeStep[] = [{ tree: null, highlightedNodes: [], message: "Starting your code..." }]
  let comparisons = 0

  for (const event of trace) {
    if (event.type === "start") {
      steps.push({ tree: event.tree, highlightedNodes: [], message: `Inserting ${event.value}...` })
    } else if (event.type === "compare") {
      comparisons += 1
      steps.push({ tree: event.tree, highlightedNodes: event.ids ?? [], message: "Comparing values..." })
    } else {
      steps.push({ tree: event.tree, highlightedNodes: [], message: `${event.value} inserted.` })
    }
  }

  return { steps, comparisons }
}
