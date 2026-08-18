import { ConceptId } from "./concepts-data"

export interface StackFrame {
  id: string
  label: string
  vars: { name: string; value: string }[]
  note?: string
}

export interface CallStep {
  codeLine: number
  stack: StackFrame[]
  message: string
  output?: string
}

export interface FunctionDemo {
  id: string
  label: string
  conceptId: ConceptId
  code: string
  run: () => CallStep[]
}

let uid = 0
function frameId() {
  return `frame-${uid++}`
}

/**
 * Every pushed CallStep must be a frozen snapshot in time. Frame objects
 * get mutated later (e.g. a "note" added when a recursive call returns),
 * so without cloning here, earlier steps that still hold a reference to
 * the same frame object would silently change too once mutated.
 */
function snapshot(frames: StackFrame[]): StackFrame[] {
  return frames.map((f) => ({ ...f, vars: f.vars.map((v) => ({ ...v })) }))
}

// ─────────────────────────────────────────────────────────────────
// Basic function call
// ─────────────────────────────────────────────────────────────────
const basicCall: FunctionDemo = {
  id: "basic-call",
  label: "Basic Call",
  conceptId: "params",
  code: `function algoMaitriAdd(a, b) {
  return a + b;
}

const result = algoMaitriAdd(3, 5);`,
  run() {
    const steps: CallStep[] = []
    const frame: StackFrame = {
      id: frameId(),
      label: "algoMaitriAdd(3, 5)",
      vars: [
        { name: "a", value: "3" },
        { name: "b", value: "5" },
      ],
    }
    steps.push({ codeLine: 1, stack: snapshot([frame]), message: "algoMaitriAdd(3, 5) called — a new stack frame is pushed, and a & b are bound to 3 and 5." })
    steps.push({ codeLine: 2, stack: snapshot([frame]), message: "Evaluate a + b = 8, and return it — this pops the frame and hands 8 back to the caller." })
    steps.push({ codeLine: 5, stack: [], message: "Frame popped. result now holds 8.", output: "result = 8" })
    return steps
  },
}

// ─────────────────────────────────────────────────────────────────
// Default parameters
// ─────────────────────────────────────────────────────────────────
const defaultParams: FunctionDemo = {
  id: "default-params",
  label: "Default Parameters",
  conceptId: "params",
  code: `function algoMaitriGreet(name, greeting = "Hello") {
  return \`\${greeting}, \${name}!\`;
}

algoMaitriGreet("Maya");
algoMaitriGreet("Sam", "Hey");`,
  run() {
    const steps: CallStep[] = []

    const f1: StackFrame = {
      id: frameId(),
      label: 'algoMaitriGreet("Maya")',
      vars: [
        { name: "name", value: '"Maya"' },
        { name: "greeting", value: '"Hello" (default)' },
      ],
    }
    steps.push({ codeLine: 1, stack: snapshot([f1]), message: 'algoMaitriGreet("Maya") called with only one argument — greeting falls back to its default, "Hello".' })
    steps.push({ codeLine: 2, stack: snapshot([f1]), message: 'Build the string "Hello, Maya!" and return it.' })
    steps.push({ codeLine: 5, stack: [], message: "Frame popped.", output: 'algoMaitriGreet("Maya") = "Hello, Maya!"' })

    const f2: StackFrame = {
      id: frameId(),
      label: 'algoMaitriGreet("Sam", "Hey")',
      vars: [
        { name: "name", value: '"Sam"' },
        { name: "greeting", value: '"Hey"' },
      ],
    }
    steps.push({ codeLine: 1, stack: snapshot([f2]), message: 'algoMaitriGreet("Sam", "Hey") called — this time greeting is explicitly passed, so the default is skipped entirely.' })
    steps.push({ codeLine: 2, stack: snapshot([f2]), message: 'Build the string "Hey, Sam!" and return it.' })
    steps.push({ codeLine: 6, stack: [], message: "Frame popped.", output: 'algoMaitriGreet("Sam", "Hey") = "Hey, Sam!"' })

    return steps
  },
}

// ─────────────────────────────────────────────────────────────────
// Recursion — factorial (real recursive execution, real call stack)
// ─────────────────────────────────────────────────────────────────
function makeFactorialDemo(n: number): FunctionDemo {
  return {
    id: "recursion",
    label: "Recursion",
    conceptId: "recursion",
    code: `function algoMaitriFactorial(n) {
  if (n <= 1) return 1;
  return n * algoMaitriFactorial(n - 1);
}`,
    run() {
      const steps: CallStep[] = []
      const stack: StackFrame[] = []

      function factorial(k: number): number {
        const frame: StackFrame = { id: frameId(), label: `algoMaitriFactorial(${k})`, vars: [{ name: "n", value: String(k) }] }
        stack.push(frame)
        steps.push({ codeLine: 1, stack: snapshot(stack), message: `Call algoMaitriFactorial(${k}) — push a new frame onto the call stack.` })

        if (k <= 1) {
          steps.push({ codeLine: 2, stack: snapshot(stack), message: `Base case: n=${k} ≤ 1, so return 1 without recursing further.` })
          stack.pop()
          return 1
        }

        steps.push({ codeLine: 3, stack: snapshot(stack), message: `n=${k} > 1 — must call algoMaitriFactorial(${k - 1}) before this call can finish. This frame stays on the stack, waiting.` })
        const sub = factorial(k - 1)
        const result = k * sub
        frame.note = `= ${k} × ${sub} = ${result}`
        steps.push({ codeLine: 3, stack: snapshot(stack), message: `algoMaitriFactorial(${k - 1}) returned ${sub}. Now compute ${k} × ${sub} = ${result} and pop this frame.` })
        stack.pop()
        return result
      }

      const result = factorial(n)
      steps.push({ codeLine: 4, stack: [], message: `All frames popped — algoMaitriFactorial(${n}) = ${result}.`, output: `algoMaitriFactorial(${n}) = ${result}` })
      return steps
    },
  }
}

// ─────────────────────────────────────────────────────────────────
// Higher-order function
// ─────────────────────────────────────────────────────────────────
const higherOrder: FunctionDemo = {
  id: "higher-order",
  label: "Higher-Order Function",
  conceptId: "higherorder",
  code: `function algoMaitriApplyTwice(fn, x) {
  return fn(fn(x));
}

function algoMaitriDouble(n) {
  return n * 2;
}

algoMaitriApplyTwice(algoMaitriDouble, 3);`,
  run() {
    const steps: CallStep[] = []
    const outer: StackFrame = {
      id: frameId(),
      label: "algoMaitriApplyTwice(algoMaitriDouble, 3)",
      vars: [
        { name: "fn", value: "algoMaitriDouble" },
        { name: "x", value: "3" },
      ],
    }
    steps.push({ codeLine: 1, stack: snapshot([outer]), message: "algoMaitriApplyTwice(algoMaitriDouble, 3) called — fn is bound to the algoMaitriDouble function ITSELF, not its result." })

    const inner1: StackFrame = { id: frameId(), label: "algoMaitriDouble(3)", vars: [{ name: "n", value: "3" }] }
    steps.push({ codeLine: 2, stack: snapshot([outer, inner1]), message: "First evaluate the innermost call: fn(x) → algoMaitriDouble(3)." })
    steps.push({ codeLine: 6, stack: snapshot([outer, inner1]), message: "algoMaitriDouble(3) returns 6." })
    steps.push({ codeLine: 2, stack: snapshot([outer]), message: "algoMaitriDouble(3) frame popped — its result, 6, becomes the argument to the outer fn(...) call." })

    const inner2: StackFrame = { id: frameId(), label: "algoMaitriDouble(6)", vars: [{ name: "n", value: "6" }] }
    steps.push({ codeLine: 2, stack: snapshot([outer, inner2]), message: "Now call fn(6) → algoMaitriDouble(6), using the result of the first call." })
    steps.push({ codeLine: 6, stack: snapshot([outer, inner2]), message: "algoMaitriDouble(6) returns 12." })
    steps.push({ codeLine: 2, stack: snapshot([outer]), message: "algoMaitriDouble(6) frame popped — algoMaitriApplyTwice can now return 12." })
    steps.push({ codeLine: 9, stack: [], message: "algoMaitriApplyTwice frame popped.", output: "algoMaitriApplyTwice(algoMaitriDouble, 3) = 12" })

    return steps
  },
}

// ─────────────────────────────────────────────────────────────────
// Closures
// ─────────────────────────────────────────────────────────────────
const closure: FunctionDemo = {
  id: "closure",
  label: "Closures",
  conceptId: "closure",
  code: `function algoMaitriMakeCounter() {
  let count = 0;
  return function increment() {
    count++;
    return count;
  };
}

const counter = algoMaitriMakeCounter();
counter();
counter();
counter();`,
  run() {
    const steps: CallStep[] = []

    const makerFrame: StackFrame = { id: frameId(), label: "algoMaitriMakeCounter()", vars: [] }
    steps.push({ codeLine: 1, stack: snapshot([makerFrame]), message: "algoMaitriMakeCounter() called." })
    makerFrame.vars = [{ name: "count", value: "0" }]
    steps.push({ codeLine: 2, stack: snapshot([makerFrame]), message: "count is initialized to 0, living inside algoMaitriMakeCounter's private scope." })
    steps.push({ codeLine: 3, stack: snapshot([makerFrame]), message: "Return the inner `increment` function — but it keeps a hidden link back to this scope. That link is the closure." })
    steps.push({ codeLine: 9, stack: [], message: "algoMaitriMakeCounter's frame is popped, but count=0 stays alive because increment still references it.", output: "counter = increment (with count=0 in its closure)" })

    let count = 0
    for (const line of [10, 11, 12]) {
      count++
      const callFrame: StackFrame = {
        id: frameId(),
        label: "increment()",
        vars: [],
        note: `closure remembers count = ${count - 1}`,
      }
      steps.push({ codeLine: 3, stack: snapshot([callFrame]), message: `counter() called — it reaches into its closure and finds count=${count - 1} still there.` })
      steps.push({ codeLine: 4, stack: snapshot([callFrame]), message: `count++ → count becomes ${count} inside the closure (not a fresh 0!).` })
      steps.push({ codeLine: 5, stack: snapshot([callFrame]), message: `Return ${count}.` })
      steps.push({ codeLine: line, stack: [], message: "Frame popped — the closure's count persists for the next call.", output: `counter() → ${count}` })
    }

    steps.push({ codeLine: 7, stack: [], message: "Even though algoMaitriMakeCounter finished long ago, its local count kept living inside the closure — that's the whole trick." })

    return steps
  },
}

export const FUNCTION_DEMOS: FunctionDemo[] = [basicCall, defaultParams, makeFactorialDemo(4), higherOrder, closure]

export function getRecursionDemo(n: number): FunctionDemo {
  return makeFactorialDemo(n)
}
