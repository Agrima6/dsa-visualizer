// components/visualizer/recursion/recursion-problems-beginner.ts
// Beginner recursion problems (ids 4-9): the true "basics" tier — printing,
// summing, fibonacci, digit sum, and reversing a string/integer. Each
// generateSteps() runs a real recursive JS function mirroring `code`
// line-for-line, pushing one step(...) per meaningful line executed.

import { RecursionProblem, frame, step } from "./recursion-problem-types"

// ════════════════════════════════════════════════════════════════
// 4. Print Numbers 1 to N
// ════════════════════════════════════════════════════════════════
const printNumbers: RecursionProblem = {
  id: 4,
  slug: "print-numbers-1-to-n",
  title: "Print Numbers 1 to N",
  difficulty: "Easy",
  companies: ["Amazon", "Microsoft", "Adobe", "Intuit"],
  tags: ["Recursion", "Base Case"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given a positive integer n, print the numbers 1 through n in increasing order using recursion instead of a loop. This is the first recursion problem most people see: it exists purely to show what a base case is and how the call stack 'unwinds' back to the caller.",
  examples: [
    { input: "n = 4", output: "1 2 3 4" },
    { input: "n = 1", output: "1" },
  ],
  constraints: ["1 ≤ n ≤ 20"],
  hints: [
    "Recurse down to n-1 FIRST, and print AFTER the recursive call returns — that's what makes the numbers come out in increasing order on the way back up.",
    "The base case is n === 0: there's nothing left to print, so just return without printing or recursing further.",
    "Trace a small example (n=3) by hand: printNumbers(3) calls printNumbers(2) calls printNumbers(1) calls printNumbers(0) [base case, returns], THEN 1 prints, then 2, then 3.",
  ],
  pitfalls: [
    "Printing before the recursive call instead of after — that prints n, n-1, ..., 1 (decreasing), which is a different (also valid, but different) problem.",
    "Forgetting the base case n === 0 — the calls never stop and the stack overflows.",
    "Off-by-one: calling printNumbers(n) instead of printNumbers(n - 1) inside the function causes infinite recursion since n never shrinks.",
  ],
  approaches: [
    {
      name: "Recursive (print after the call)",
      complexity: "O(n)",
      space: "O(n) — one stack frame per number",
      description: "Recurse to n-1 first, then print n as each call returns, producing increasing order.",
    },
    {
      name: "Iterative",
      complexity: "O(n)",
      space: "O(1)",
      description: "A simple for loop from 1 to n — no call stack growth, the natural non-recursive solution.",
    },
  ],
  code: `function printNumbers(n) {
  if (n === 0) return;
  printNumbers(n - 1);
  console.log(n);
}`,
  generateSteps() {
    const n = 4
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const printed: string[] = []

    function run(k: number): void {
      const f = frame(`printNumbers(${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call printNumbers(${k}) — push a new frame.`, { result: [...printed] }))

      if (k === 0) {
        steps.push(step(2, stack, `Base case: n=0, nothing to print, return.`, { result: [...printed] }))
        stack.pop()
        return
      }

      steps.push(step(3, stack, `n=${k} ≠ 0 — recurse into printNumbers(${k - 1}) before printing.`, { result: [...printed] }))
      run(k - 1)

      printed.push(String(k))
      steps.push(step(4, stack, `printNumbers(${k - 1}) returned — now print ${k}.`, { result: [...printed] }))
      stack.pop()
    }

    run(n)
    steps.push(step(5, [], `All frames popped — printed 1 to ${n} in order.`, { result: [...printed] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Sum of First N Natural Numbers
// ════════════════════════════════════════════════════════════════
const sumOfN: RecursionProblem = {
  id: 5,
  slug: "sum-of-first-n-natural-numbers",
  title: "Sum of First N Natural Numbers",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "PayPal", "Zomato"],
  tags: ["Recursion", "Base Case", "Math"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given a non-negative integer n, compute the sum 1 + 2 + ... + n using recursion. Each call adds its own n to the sum of everything smaller than it, bottoming out at 0.",
  examples: [
    { input: "n = 5", output: "15", explanation: "1+2+3+4+5 = 15" },
    { input: "n = 0", output: "0" },
  ],
  constraints: ["0 ≤ n ≤ 10⁴"],
  hints: [
    "The base case is n === 0, which contributes nothing to the sum.",
    "Each call only needs to know sum(n-1) — it doesn't need to know how that smaller sum was computed.",
    "Compare this to factorial: same shape, just + instead of ×, and a base case of 0 instead of 1.",
  ],
  pitfalls: [
    "Using n <= 1 as the base case and returning 1 — that silently adds an extra 1 to the final answer.",
    "Forgetting to return the recursive call: `n + sum(n - 1);` without `return` produces NaN when added.",
    "Recursing with sum(n) instead of sum(n - 1), causing infinite recursion.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(n)",
      space: "O(n)",
      description: "Base case n=0 returns 0. Otherwise return n + sum(n - 1).",
    },
    {
      name: "Closed form (Gauss's formula)",
      complexity: "O(1)",
      space: "O(1)",
      description: "n(n+1)/2 computes the answer directly with no recursion or loop at all.",
    },
  ],
  code: `function sum(n) {
  if (n === 0) return 0;
  return n + sum(n - 1);
}`,
  generateSteps() {
    const n = 5
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(k: number): number {
      const f = frame(`sum(${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call sum(${k}) — push a new frame.`))

      if (k === 0) {
        steps.push(step(2, stack, `Base case: n=0, return 0.`))
        stack.pop()
        return 0
      }

      steps.push(step(3, stack, `n=${k} ≠ 0 — need sum(${k - 1}) before this call can finish.`))
      const sub = run(k - 1)
      const result = k + sub
      steps.push(step(3, stack, `sum(${k - 1}) returned ${sub}. Compute ${k} + ${sub} = ${result}.`))
      stack.pop()
      return result
    }

    const result = run(n)
    steps.push(step(3, [], `All frames popped — sum(1..${n}) = ${result}.`, { result: [`sum(1..${n}) = ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Fibonacci Number
// ════════════════════════════════════════════════════════════════
const fibonacci: RecursionProblem = {
  id: 6,
  slug: "fibonacci-number",
  title: "Fibonacci Number",
  difficulty: "Easy",
  companies: ["Amazon", "Microsoft", "Apple", "Meta", "Bloomberg"],
  tags: ["Recursion", "Base Case", "Dynamic Programming"],
  timeComplexity: "O(2ⁿ)",
  spaceComplexity: "O(n)",
  description:
    "Given an integer n, compute the n-th Fibonacci number, where fib(0) = 0, fib(1) = 1, and fib(n) = fib(n-1) + fib(n-2) for n > 1. This is the classic example of a recursive function that calls itself TWICE per call, which is what makes it a good introduction to exponential blow-up.",
  examples: [
    { input: "n = 5", output: "5", explanation: "0, 1, 1, 2, 3, 5 — fib(5) is the 6th term (0-indexed)." },
    { input: "n = 1", output: "1" },
  ],
  constraints: ["0 ≤ n ≤ 15 (naive recursion grows exponentially, so keep n small)"],
  hints: [
    "There are TWO base cases here: fib(0) = 0 and fib(1) = 1 — both must be handled, not just n === 0.",
    "Each call branches into two smaller calls, fib(n-1) and fib(n-2), so the call tree grows exponentially, not linearly like factorial or sum.",
    "Notice that fib(n-2) gets recomputed from scratch inside both the fib(n-1) branch and directly — that repeated work is exactly what memoization eliminates.",
  ],
  pitfalls: [
    "This naive version is O(2ⁿ) because it recomputes the same smaller fib(k) values over and over — fib(2) alone gets recomputed many times for larger n. Memoizing (caching) results by n fixes this to O(n).",
    "Only checking n === 0 and forgetting n === 1 as a separate base case — without it, fib(1) recurses into fib(0) + fib(-1), which never terminates correctly.",
    "Assuming call order (fib(n-1) before fib(n-2)) affects the final answer — it doesn't, but it does affect the order steps appear in a trace.",
  ],
  approaches: [
    {
      name: "Naive recursive",
      complexity: "O(2ⁿ)",
      space: "O(n) — max recursion depth",
      description: "Directly recurse with fib(n-1) + fib(n-2). Simple but recomputes the same subproblems repeatedly.",
    },
    {
      name: "Memoized recursive",
      complexity: "O(n)",
      space: "O(n)",
      description: "Cache each fib(k) the first time it's computed, so every subsequent call for the same k is O(1).",
    },
  ],
  code: `function fib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}`,
  generateSteps() {
    const n = 5
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(k: number): number {
      const f = frame(`fib(${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call fib(${k}) — push a new frame.`))

      if (k === 0) {
        steps.push(step(2, stack, `Base case: n=0, return 0.`))
        stack.pop()
        return 0
      }
      if (k === 1) {
        steps.push(step(3, stack, `Base case: n=1, return 1.`))
        stack.pop()
        return 1
      }

      steps.push(step(4, stack, `n=${k} — need fib(${k - 1}) and fib(${k - 2}).`))
      const left = run(k - 1)
      const right = run(k - 2)
      const result = left + right
      steps.push(step(4, stack, `fib(${k - 1})=${left}, fib(${k - 2})=${right} — fib(${k}) = ${left} + ${right} = ${result}.`))
      stack.pop()
      return result
    }

    const result = run(n)
    steps.push(step(4, [], `All frames popped — fib(${n}) = ${result}.`, { result: [`fib(${n}) = ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Digit Sum of a Number
// ════════════════════════════════════════════════════════════════
const digitSum: RecursionProblem = {
  id: 7,
  slug: "digit-sum-of-a-number",
  title: "Digit Sum of a Number",
  difficulty: "Easy",
  companies: ["Amazon", "Adobe", "Flipkart", "Swiggy"],
  tags: ["Recursion", "Base Case", "Math"],
  timeComplexity: "O(log₁₀ n)",
  spaceComplexity: "O(log₁₀ n)",
  description:
    "Given a non-negative integer n, compute the sum of its digits using recursion. Each call peels off the last digit with n % 10 and recurses on the rest of the number with Math.floor(n / 10).",
  examples: [
    { input: "n = 12345", output: "15", explanation: "1+2+3+4+5 = 15" },
    { input: "n = 0", output: "0" },
  ],
  constraints: ["0 ≤ n ≤ 10⁹"],
  hints: [
    "n % 10 always gives you the LAST digit of n; Math.floor(n / 10) gives you 'n with the last digit removed'.",
    "The base case is n === 0 — an empty number contributes nothing further to the sum.",
    "Each recursive call strictly shrinks n (it has one fewer digit), which guarantees termination.",
  ],
  pitfalls: [
    "Using n / 10 instead of Math.floor(n / 10) in JavaScript — regular division produces a decimal, not an integer, so the recursion never reaches n === 0.",
    "Forgetting Math.floor and getting an infinitely deep (non-terminating) recursion in practice.",
    "For negative numbers, n % 10 in JavaScript can be negative — this problem assumes non-negative input to sidestep that.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(log₁₀ n)",
      space: "O(log₁₀ n) — one frame per digit",
      description: "Base case n=0 returns 0. Otherwise return (n % 10) + digitSum(Math.floor(n / 10)).",
    },
    {
      name: "Iterative",
      complexity: "O(log₁₀ n)",
      space: "O(1)",
      description: "A while loop accumulating n % 10 into a running total while shrinking n each iteration.",
    },
  ],
  code: `function digitSum(n) {
  if (n === 0) return 0;
  return (n % 10) + digitSum(Math.floor(n / 10));
}`,
  generateSteps() {
    const n = 12345
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(k: number): number {
      const f = frame(`digitSum(${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call digitSum(${k}) — push a new frame.`))

      if (k === 0) {
        steps.push(step(2, stack, `Base case: n=0, return 0.`))
        stack.pop()
        return 0
      }

      const lastDigit = k % 10
      const rest = Math.floor(k / 10)
      steps.push(step(3, stack, `n=${k} — last digit is ${lastDigit}, recurse on the rest: ${rest}.`))
      const sub = run(rest)
      const result = lastDigit + sub
      steps.push(step(3, stack, `digitSum(${rest}) returned ${sub}. ${lastDigit} + ${sub} = ${result}.`))
      stack.pop()
      return result
    }

    const result = run(n)
    steps.push(step(3, [], `All frames popped — digitSum(${n}) = ${result}.`, { result: [`digitSum(${n}) = ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Reverse a String (Recursion)
// ════════════════════════════════════════════════════════════════
const reverseString: RecursionProblem = {
  id: 8,
  slug: "reverse-a-string-recursion",
  title: "Reverse a String (Recursion)",
  difficulty: "Easy",
  companies: ["Amazon", "Microsoft", "Apple", "Meesho"],
  tags: ["Recursion", "String", "Base Case"],
  timeComplexity: "O(n²) in JS (string concatenation copies)",
  spaceComplexity: "O(n)",
  description:
    "Given a string str, return it reversed using recursion. The base case is a string of length 0 or 1 (already its own reverse); otherwise, reverse everything after the first character and append the first character at the end.",
  examples: [
    { input: 'str = "abc"', output: '"cba"' },
    { input: 'str = "a"', output: '"a"' },
  ],
  constraints: ["0 ≤ str.length ≤ 1000"],
  hints: [
    "The base case is str.length <= 1 — a single character (or empty string) is trivially its own reverse.",
    "reverse(str) = reverse(str without its first character) + that first character, placed at the END.",
    "Think of it as peeling one character off the front on every call, and re-attaching it at the back once the smaller reverse comes back.",
  ],
  pitfalls: [
    "Appending the first character at the FRONT instead of the back — reverse(str.slice(1)) + str[0] is correct; str[0] + reverse(str.slice(1)) doesn't reverse anything.",
    "Forgetting the base case for the empty string, not just length 1 — str.length <= 1 covers both in one check.",
    "Using str.slice(1) is fine for clarity, but be aware repeated slicing/concatenation makes this O(n²) — an array-based two-pointer swap is the O(n) alternative.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(n²) due to string concatenation",
      space: "O(n)",
      description: "reverse(str) = reverse(str.slice(1)) + str[0], bottoming out at length ≤ 1.",
    },
    {
      name: "Iterative two-pointer",
      complexity: "O(n)",
      space: "O(n) for the output array",
      description: "Swap characters from both ends of a character array moving inward — no recursion needed.",
    },
  ],
  code: `function reverse(str) {
  if (str.length <= 1) return str;
  return reverse(str.slice(1)) + str[0];
}`,
  generateSteps() {
    const input = "abc"
    const chars = input.split("")
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(s: string, startIdx: number): string {
      const f = frame(`reverse("${s}")`, [["str", `"${s}"`]])
      stack.push(f)
      steps.push(
        step(1, stack, `Call reverse("${s}").`, {
          array: chars,
          highlighted: s.length > 0 ? [startIdx] : [],
        })
      )

      if (s.length <= 1) {
        steps.push(
          step(2, stack, `Base case: "${s}" has length ${s.length} ≤ 1, return "${s}" as-is.`, {
            array: chars,
            highlighted: s.length > 0 ? [startIdx] : [],
          })
        )
        stack.pop()
        return s
      }

      const rest = s.slice(1)
      const first = s[0]
      steps.push(
        step(3, stack, `Recurse on "${rest}" (everything after '${first}'), then append '${first}' at the end.`, {
          array: chars,
          highlighted: [startIdx],
        })
      )
      const sub = run(rest, startIdx + 1)
      const result = sub + first
      steps.push(
        step(3, stack, `reverse("${rest}") returned "${sub}" — append '${first}': "${sub}" + "${first}" = "${result}".`, {
          array: chars,
          highlighted: [startIdx],
        })
      )
      stack.pop()
      return result
    }

    const result = run(input, 0)
    steps.push(step(3, [], `All frames popped — reverse("${input}") = "${result}".`, { array: chars, result: [`"${result}"`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Reverse an Integer (Recursion)
// ════════════════════════════════════════════════════════════════
const reverseInteger: RecursionProblem = {
  id: 9,
  slug: "reverse-an-integer-recursion",
  title: "Reverse an Integer (Recursion)",
  difficulty: "Medium",
  companies: ["Amazon", "Microsoft", "Google", "Oracle", "PhonePe"],
  tags: ["Recursion", "Math", "Base Case"],
  timeComplexity: "O(log₁₀ n)",
  spaceComplexity: "O(log₁₀ n)",
  description:
    "Given a non-negative integer n, return the integer formed by reversing its digits, using recursion. A helper function peels off the last digit of the remaining number with n % 10 and folds it into an accumulated reversed value, one digit at a time, until nothing is left.",
  examples: [
    { input: "n = 123", output: "321" },
    { input: "n = 1200", output: "21", explanation: "Trailing zeros in the input become leading zeros in the reverse, which just disappear: 1200 → 21." },
  ],
  constraints: ["0 ≤ n ≤ 2³¹ - 1", "Result assumed to fit in a normal JS number (no overflow handling required)"],
  hints: [
    "Use an accumulator parameter (e.g. `rev`) that carries the reversed digits built so far through each recursive call — this is the same 'helper function with extra state' pattern used in tail-recursive style.",
    "At each step: peel the last digit off n with n % 10, shift the accumulator left by one decimal place (rev * 10), and add the peeled digit.",
    "The base case is when the remaining number reaches 0 — at that point the accumulator already holds the fully reversed value.",
  ],
  pitfalls: [
    "Trying to reverse the integer without an accumulator parameter — without somewhere to build up the answer as you go, you'd need to convert to a string anyway, defeating the point of doing it numerically.",
    "Forgetting that trailing zeros in the input vanish in the output (1200 → 21, not 0021) — this is correct integer behavior, not a bug.",
    "Using n / 10 instead of Math.floor(n / 10) in JavaScript, same trap as digit-sum problems — leaves a decimal and the recursion never terminates.",
  ],
  approaches: [
    {
      name: "Recursive with accumulator",
      complexity: "O(log₁₀ n)",
      space: "O(log₁₀ n) — one frame per digit",
      description: "reverseHelper(n, rev): base case n=0 returns rev; otherwise recurse with (floor(n/10), rev*10 + n%10).",
    },
    {
      name: "Iterative",
      complexity: "O(log₁₀ n)",
      space: "O(1)",
      description: "The identical digit-peeling logic in a while loop instead of recursive calls — no call stack growth.",
    },
  ],
  code: `function reverseInteger(n) {
  return reverseHelper(n, 0);
}

function reverseHelper(n, rev) {
  if (n === 0) return rev;
  const lastDigit = n % 10;
  return reverseHelper(Math.floor(n / 10), rev * 10 + lastDigit);
}`,
  generateSteps() {
    const n = 123
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    steps.push(step(2, stack, `Call reverseInteger(${n}) — delegates to reverseHelper(${n}, 0).`))

    function run(remaining: number, rev: number): number {
      const f = frame(`reverseHelper(${remaining}, ${rev})`, [
        ["n", remaining],
        ["rev", rev],
      ])
      stack.push(f)
      steps.push(step(5, stack, `Call reverseHelper(n=${remaining}, rev=${rev}) — push a new frame.`))

      if (remaining === 0) {
        steps.push(step(6, stack, `Base case: n=0, return accumulated rev=${rev}.`))
        stack.pop()
        return rev
      }

      const lastDigit = remaining % 10
      steps.push(step(7, stack, `n=${remaining} — last digit is ${lastDigit}.`))
      const nextN = Math.floor(remaining / 10)
      const nextRev = rev * 10 + lastDigit
      steps.push(
        step(
          8,
          stack,
          `Recurse: reverseHelper(floor(${remaining}/10)=${nextN}, ${rev}*10 + ${lastDigit}=${nextRev}).`
        )
      )
      const result = run(nextN, nextRev)
      stack.pop()
      return result
    }

    const result = run(n, 0)
    steps.push(step(8, [], `All frames popped — reverseInteger(${n}) = ${result}.`, { result: [`reverseInteger(${n}) = ${result}`] }))
    return steps
  },
}

export const RECURSION_BEGINNER_PROBLEMS: RecursionProblem[] = [
  printNumbers,
  sumOfN,
  fibonacci,
  digitSum,
  reverseString,
  reverseInteger,
]
