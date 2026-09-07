// lib/battle/judge.ts
//
// Runs a player's submitted code against a problem's hidden test cases.
//
// The original plan here was the public Piston API (piston.rs) — a free,
// unauthenticated code-execution service built for exactly this. As of
// Feb 2026 its /execute endpoint went whitelist-only (confirmed live:
// GET /runtimes still responds, POST /execute now returns "Public Piston
// API is now whitelist only"), and getting whitelisted isn't something
// that happens on demand. Self-hosting Piston (it's just a Docker image)
// is the "do this properly" fix but is real infrastructure to stand up,
// not a code change — worth doing before this ever goes further than an
// invite-only demo.
//
// For now this judges in a Node worker_thread instead: real thread
// isolation and a hard timeout via worker.terminate(), same shape as the
// browser Worker sandbox Code Playground already uses. Be honest about
// what this is NOT: worker_threads share the same Node process and still
// have `require`/filesystem access unless explicitly locked down further
// (e.g. Node's --experimental-permission flag, or a separate child
// process with OS-level sandboxing) — this stops runaway loops and
// crashes, it does not stop a determined attacker. That's an acceptable
// gap for a rate-limited, invite-only pre-launch feature; it is not
// acceptable to ship unchanged to the open internet.

import { Worker } from "node:worker_threads"
import type { BattleProblem, PlayerSubmission } from "./types"

const EXECUTION_TIMEOUT_MS = 5000
const MAX_CODE_LENGTH = 8000

interface JudgeResult {
  passed: boolean
  testsPassed: number
  testsTotal: number
  error: string | null
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function buildWorkerSource(userCode: string, testInputs: unknown[][]): string {
  return `
const { parentPort } = require("node:worker_threads");

// Same defense-in-depth stance as the browser sandbox: this worker only
// ever needs to compute a pure function's output, so strip the obvious
// escape hatches even though worker_threads isn't a hard boundary.
require.cache = Object.create(null);
globalThis.require = undefined;
globalThis.process = undefined;

${userCode}

const __testInputs = ${JSON.stringify(testInputs)};
const __results = [];
for (const args of __testInputs) {
  try {
    const out = solve(...args);
    __results.push({ ok: true, output: out });
  } catch (e) {
    __results.push({ ok: false, error: (e && e.message) ? e.message : String(e) });
  }
}
parentPort.postMessage({ ok: true, results: __results });
`
}

function runInWorker(source: string): Promise<{ ok: true; results: { ok: boolean; output?: unknown; error?: string }[] } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    let settled = false
    let worker: Worker
    try {
      worker = new Worker(source, { eval: true })
    } catch (err) {
      resolve({ ok: false, error: err instanceof Error ? err.message : "Failed to start judge worker." })
      return
    }

    const finish = (result: { ok: true; results: { ok: boolean; output?: unknown; error?: string }[] } | { ok: false; error: string }) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      worker.terminate()
      resolve(result)
    }

    const timeout = setTimeout(() => {
      finish({ ok: false, error: "Time limit exceeded — check for an infinite loop." })
    }, EXECUTION_TIMEOUT_MS)

    worker.once("message", (msg) => finish(msg))
    worker.once("error", (err) => finish({ ok: false, error: err.message || "Your code crashed." }))
  })
}

export async function judgeSubmission(problem: BattleProblem, code: string): Promise<JudgeResult> {
  const testsTotal = problem.testCases.length

  if (typeof code !== "string" || code.trim().length === 0) {
    return { passed: false, testsPassed: 0, testsTotal, error: "No code submitted." }
  }
  if (code.length > MAX_CODE_LENGTH) {
    return { passed: false, testsPassed: 0, testsTotal, error: `Keep it under ${MAX_CODE_LENGTH} characters.` }
  }
  if (!/function\s+solve\s*\(|const\s+solve\s*=|let\s+solve\s*=|var\s+solve\s*=/.test(code)) {
    return { passed: false, testsPassed: 0, testsTotal, error: "Define a function named `solve`." }
  }

  const testInputs = problem.testCases.map((t) => t.input)
  const source = buildWorkerSource(code, testInputs)
  const outcome = await runInWorker(source)

  if (!outcome.ok) {
    return { passed: false, testsPassed: 0, testsTotal, error: outcome.error }
  }

  let testsPassed = 0
  let firstError: string | null = null
  problem.testCases.forEach((tc, i) => {
    const r = outcome.results[i]
    if (r?.ok && deepEqual(r.output, tc.expected)) {
      testsPassed++
    } else if (!firstError) {
      firstError = r?.ok === false ? r.error ?? "Runtime error." : "Wrong answer on a test case."
    }
  })

  return {
    passed: testsPassed === testsTotal,
    testsPassed,
    testsTotal,
    error: testsPassed === testsTotal ? null : firstError,
  }
}

export function toSubmission(questionIndex: number, result: JudgeResult): PlayerSubmission {
  return {
    questionIndex,
    passed: result.passed,
    testsPassed: result.testsPassed,
    testsTotal: result.testsTotal,
    submittedAt: Date.now(),
    error: result.error,
  }
}
