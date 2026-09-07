// lib/battle/replay-runner.ts
//
// Runs one player's final Code Battle solution against a sample input, in
// a sandboxed browser Worker — same sandboxing stance as Code Playground's
// runner.ts (network stripped, hard timeout), because this may be running
// a *stranger's* code: the "Compare Approaches" panel lets you replay your
// opponent's solution too, not just your own.

import { instrumentForReplay } from "./replay-instrument"

export interface OpCounts {
  comparisons: number
  loopIterations: number
  calls: number
}

export interface ReplayResult {
  output: string | null // JSON.stringify'd, since the raw value could be anything
  ops: OpCounts
  error: string | null
}

const TIMEOUT_MS = 4000
const MAX_CODE_LENGTH = 8000

export async function runReplay(source: string, args: unknown[]): Promise<ReplayResult> {
  if (source.length > MAX_CODE_LENGTH) {
    return { output: null, ops: { comparisons: 0, loopIterations: 0, calls: 0 }, error: "Solution too long to replay." }
  }

  const instrumented = await instrumentForReplay(source)
  if (instrumented.error) {
    return { output: null, ops: { comparisons: 0, loopIterations: 0, calls: 0 }, error: instrumented.error }
  }

  return new Promise((resolve) => {
    const workerSource = `
"use strict";
var __ops = { comparisons: 0, loopIterations: 0, calls: 0 };
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;

${instrumented.code}

self.onmessage = function (e) {
  try {
    var result = solve.apply(null, e.data);
    self.postMessage({ ok: true, output: JSON.stringify(result), ops: __ops });
  } catch (err) {
    self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err), ops: __ops });
  }
};
`

    let settled = false
    const blob = new Blob([workerSource], { type: "application/javascript" })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    const finish = (result: ReplayResult) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(result)
    }

    const timeout = setTimeout(() => {
      finish({ output: null, ops: { comparisons: 0, loopIterations: 0, calls: 0 }, error: "Replay timed out." })
    }, TIMEOUT_MS)

    worker.onmessage = (e) => {
      const data = e.data
      finish({
        output: data.ok ? data.output : null,
        ops: data.ops ?? { comparisons: 0, loopIterations: 0, calls: 0 },
        error: data.ok ? null : data.error,
      })
    }

    worker.onerror = (e) => {
      finish({ output: null, ops: { comparisons: 0, loopIterations: 0, calls: 0 }, error: e.message || "Worker error." })
    }

    worker.postMessage(args)
  })
}
